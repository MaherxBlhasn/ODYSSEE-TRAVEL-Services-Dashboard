'use client';

import { useState, useEffect } from "react";
import { SearchBar } from '@/components/ui/search-bar';
import { Pagination } from '@/components/ui/pagination';
import { Subscriber } from '@/lib/types/newspaper.types';
import { newspaperService } from "@/lib/services/newspaper.service";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Mail, Users, Send, Trash2, AlertTriangle } from 'lucide-react';
import DataTable from "@/components/ui/data-table";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import EmailModal from "@/components/ui/EmailModal";

export default function NewsPaperSection() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(6);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal states - Fixed the conflicting state management
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteSelectedModal, setShowDeleteSelectedModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false); // This controls the email modal
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<'email' | 'id'>('email');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Table columns configuration
  const columns = [
    {
      key: 'select',
      label: 'Select',
      hideOnMobile: false,
      hideOnTablet: false,
      hideOnDesktop: false,
      render: (subscriber: Subscriber) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(subscriber.id)}
            onChange={(e) => handleSelectSubscriber(subscriber.id, e.target.checked)}
            className="rounded border-gray-300 transition-all duration-200 hover:scale-110"
          />
        </div>
      )
    },
    {
      key: 'email' as const,
      label: 'Email Address',
      sortable: true,
      hideOnMobile: false,
      hideOnTablet: false,
      hideOnDesktop: false,
      render: (subscriber: Subscriber) => (
        <div className="text-blue-600 font-medium">{subscriber.email}</div>
      )
    },
    {
      key: 'id' as const,
      label: 'Subscriber ID',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktop: false,
      render: (subscriber: Subscriber) => (
        <div className="text-gray-500 text-sm font-mono">{subscriber.id.slice(0, 8)}...</div>
      )
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      hideOnMobile: false,
      hideOnTablet: false,
      hideOnDesktop: false,
      render: (subscriber: Subscriber) => (
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSingleSubscriber(subscriber);
            }}
            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
            title="Delete subscriber"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleSelectSubscriber = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  // Fetch subscribers from API
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortField,
        sortOrder: sortDirection
      };

      const response = await newspaperService.getAllSubscribers(params);
      if (response) {
        setSubscribers(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Error fetching subscribers. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update filtered subscribers when the main subscribers list changes
  useEffect(() => {
    setFilteredSubscribers(subscribers);
    console.log('isSending:', isSending);
  }, [subscribers]);

  // Initial load and when dependencies change
  useEffect(() => {
    fetchSubscribers();
  }, [currentPage, sortField, sortDirection, searchTerm]);

  // Handlers
  const handleSearch = () => {
    setCurrentPage(1);
    fetchSubscribers();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as 'email' | 'id');
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteSingleSubscriber = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subscriberToDelete) return;

    setIsDeleting(true);
    try {
      await newspaperService.deleteSubscriber(subscriberToDelete.id);
      toast.success('Subscriber deleted successfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      fetchSubscribers();
      setSelectedIds(prev => prev.filter(id => id !== subscriberToDelete.id));
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Error deleting subscriber. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSubscriberToDelete(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    setIsDeleting(true);
    try {
      // Delete selected subscribers one by one
      for (const id of selectedIds) {
        await newspaperService.deleteSubscriber(id);
      }

      toast.success(`${selectedIds.length} subscriber${selectedIds.length !== 1 ? 's' : ''} deleted successfully!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      fetchSubscribers();
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting selected subscribers:', error);
      toast.error('Error deleting selected subscribers. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteSelectedModal(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await newspaperService.deleteAllSubscribers();
      toast.success('All subscribers deleted successfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      fetchSubscribers();
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting all subscribers:', error);
      toast.error('Error deleting subscribers. Please try again.');
    } finally {
      setShowDeleteAllModal(false);
    }
  };

  const handleSendEmail = async (subject: string, content: string, isAll: boolean) => {
    setIsSending(true);
    try {
      let result;
      if (isAll) {
        result = await newspaperService.sendEmailToAll({ subject, text: content });
      } else {
        result = await newspaperService.sendEmail({ subject, text: content, subscriberIds: selectedIds });
      }

      if (result?.success) {
        toast.success(`Newsletter sent successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setShowEmailModal(false); // Close the modal after successful send

      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending newsletter. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Newsletter Subscribers</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your newsletter subscribers and send campaigns</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="text-xl sm:text-2xl font-bold">{totalItems}</div>
              <div className="text-xs sm:text-sm opacity-90">Total Subscribers</div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">{selectedIds.length}</div>
                  <div className="text-xs sm:text-sm opacity-90">Selected</div>
                </div>
                <div className="bg-blue-500 bg-opacity-20 p-2 sm:p-3 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">{currentPage}</div>
                  <div className="text-xs sm:text-sm opacity-90">Current Page</div>
                </div>
                <div className="bg-green-500 bg-opacity-20 p-2 sm:p-3 rounded-lg">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">{totalPages}</div>
                  <div className="text-xs sm:text-sm opacity-90">Total Pages</div>
                </div>
                <div className="bg-purple-500 bg-opacity-20 p-2 sm:p-3 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with actions */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Title section */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Subscriber Management</h2>
                  <p className="text-gray-600 text-xs sm:text-sm">Send newsletters and manage your subscriber list</p>
                </div>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 sm:items-center sm:justify-between">
                <div className="flex-1 max-w-md">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSearch={handleSearch}
                    placeholder="Search subscribers..."
                  />
                </div>

                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    disabled={isSending}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2.5 sm:p-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg disabled:opacity-50 transform hover:scale-105"
                    title="Send Newsletter"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {selectedIds.length > 0 && (
                    <button
                      onClick={() => setShowDeleteSelectedModal(true)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2.5 sm:p-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg transform hover:scale-105 relative"
                      title={`Delete ${selectedIds.length} selected`}
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold">
                        {selectedIds.length}
                      </span>
                    </button>
                  )}

                  {subscribers.length > 0 && (
                    <button
                      onClick={() => setShowDeleteAllModal(true)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2.5 sm:p-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                      title="Delete All Subscribers"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              </div>

              {selectedIds.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <p className="text-blue-800 text-sm">
                      {selectedIds.length} subscriber{selectedIds.length !== 1 ? 's' : ''} selected
                    </p>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="text-blue-600 hover:text-blue-800 text-sm underline transition-colors duration-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <DataTable
              data={filteredSubscribers}
              columns={columns}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onDelete={handleDeleteSingleSubscriber}
              loading={loading}
            />
          </div>

          {/* Pagination */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Delete Single Subscriber Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subscriber"
        message={
          <>
            Are you sure you want to delete the subscriber{' '}
            <span className="text-red-500 font-bold">
              {subscriberToDelete?.email}
            </span>
            ? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
      />

      {/* Delete Selected Subscribers Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteSelectedModal}
        onClose={() => setShowDeleteSelectedModal(false)}
        onConfirm={handleDeleteSelected}
        title="Delete Selected Subscribers"
        message={
          <span className="space-y-2 block">
            <span className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">Warning: This action cannot be undone!</span>
            </span>
            <span className="block">
              Are you sure you want to delete <span className="font-bold text-red-500">{selectedIds.length} selected subscriber{selectedIds.length !== 1 ? 's' : ''}</span>?
              This will permanently remove the selected subscriber data.
            </span>
          </span>
        }
        confirmText={`Delete ${selectedIds.length} Subscriber${selectedIds.length !== 1 ? 's' : ''}`}
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
      />

      {/* Delete All Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirm={handleDeleteAll}
        title="Delete All Subscribers"
        message={
          <span className="space-y-2 block">
            <span className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">WARNING: This action is irreversible!</span>
            </span>
            <span className="block">
              Are you sure you want to delete <span className="font-bold text-red-500">ALL {subscribers.length} subscribers</span>?
              This will permanently remove all subscriber data and cannot be undone.
            </span>
          </span>
        }
        confirmText="Delete All Subscribers"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={false}
      />

      {/* Email Modal - Fixed the prop management */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        subscribers={subscribers}
        selectedIds={selectedIds}
        onSend={handleSendEmail}
        isLoading={isSending}
      />
    </div>
  );
}