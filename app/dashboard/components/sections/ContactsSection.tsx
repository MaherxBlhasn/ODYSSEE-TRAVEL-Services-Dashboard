'use client';

import { useState, useEffect } from "react";
import { DataTable } from '@/components/ui/data-table';
import { SearchBar } from '@/components/ui/search-bar';
import { Pagination } from '@/components/ui/pagination';
import { ContactDataFetch } from '@/lib/types/contact.types';
import { contactService } from "@/lib/services/contact.service";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { MessageSquare, FileText, Users, Mail } from 'lucide-react';


export default function ContactsSection() {
  const [contacts, setContacts] = useState<ContactDataFetch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<'Email' | 'name' | 'familyName' | 'messageSentAt' | 'phone'>('messageSentAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Table columns configuration
  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      sortable: true,
      render: (contact: ContactDataFetch) => <div className="font-semibold text-gray-800">{contact.name}</div>
    },
    {
      key: 'familyName' as const,
      label: 'Family Name',
      render: (contact: ContactDataFetch) => <div className="text-gray-700 font-medium">{contact.familyName || '-'}</div>
    },
    {
      key: 'Email' as const,
      label: 'Email',
      sortable: true,
      render: (contact: ContactDataFetch) => <div className="text-blue-600 font-medium">{contact.Email}</div>
    },
    {
      key: 'phone' as const,
      label: 'Phone',
      render: (contact: ContactDataFetch) => <div className="text-gray-700 font-medium">{contact.phone || '-'}</div>
    },
    {
      key: 'message' as const,
      label: 'Message',
      render: (contact: ContactDataFetch) => <div className="text-gray-700 max-w-xs truncate">{contact.message || '-'}</div>
    },
    {
      key: 'messageSentAt' as const,
      label: 'Message Sent At',
      sortable: true,
      render: (contact: ContactDataFetch) => (
        <div className="text-gray-600 text-sm">{new Date(contact.messageSentAt).toLocaleString()}</div>
      )
    },
    {
      key: 'actions' as const,
      label: 'Actions'
    }
  ];

  // Fetch contacts from API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortField,
        sortOrder: sortDirection
      };

      const response = await contactService.getContacts(params);
      console.log('responce :', response)
      setContacts(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Error fetching contacts. Please try again.', {
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

  // Initial load and when dependencies change
  useEffect(() => {
    fetchContacts();
  }, [currentPage, sortField, sortDirection]);

  // Handlers
  const handleSearch = () => {
    setCurrentPage(1);
    fetchContacts();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as 'Email' | 'name' | 'familyName' | 'messageSentAt' | 'phone');
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteUser = async (contact: ContactDataFetch) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.deleteContact(contact.id);
        toast.success('Message deleted successfully!', {
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
        fetchContacts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Error deleting message. Please try again.', {
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
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Messages</h1>
              <p className="text-gray-600">Manage customer inquiries and contact form submissions</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm opacity-90">Total Messages</div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{currentPage}</div>
                  <div className="text-sm opacity-90">Current Page</div>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{totalPages}</div>
                  <div className="text-sm opacity-90">Total Pages</div>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{itemsPerPage}</div>
                  <div className="text-sm opacity-90">Per Page</div>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
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
          {/* Header with search and enhanced styling */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Message Inbox</h2>
                  <p className="text-gray-600 text-sm">View and manage customer messages</p>
                </div>
              </div>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search messages..."
              />
            </div>
          </div>

          {/* Table with enhanced styling and responsiveness */}
          <div className="overflow-x-auto">
            <DataTable
              data={contacts}
              columns={columns}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onDelete={handleDeleteUser}
              loading={loading}
            />
          </div>

          {/* Enhanced Pagination */}
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
    </div>
  );
}