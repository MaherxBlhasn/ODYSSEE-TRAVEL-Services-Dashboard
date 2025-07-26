'use client';

import { useState , useEffect } from "react";
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { SearchBar } from '@/components/ui/search-bar';
import { Pagination } from '@/components/ui/pagination';
import { ContactDataFetch} from '@/lib/types/contact.types';
import { contactService } from "@/lib/services/contact.service";
import { useRouter } from 'next/navigation'
import { Bounce, toast, ToastContainer } from 'react-toastify';


export default function ContactsSection() {
  const [contacts, setContacts] = useState<ContactDataFetch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<'Email' | 'name' | 'familyName'| 'messageSentAt' | 'phone'>('messageSentAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  // Table columns configuration
    const columns = [
      {
        key: 'name' as const,
        label: 'Name',
        sortable: true,
        render: (contact: ContactDataFetch) => <div className="font-medium text-gray-900">{contact.name}</div>
      },
      {
        key: 'familyName' as const,
        label: 'Family Name',
        render: (contact: ContactDataFetch) => <div className="text-gray-600">{contact.familyName || '-'}</div>
      },
      {
        key: 'Email' as const,
        label: 'Email',
        sortable: true,
        render: (contact: ContactDataFetch) => <div className="text-gray-600">{contact.Email}</div>
      },
      {
        key: 'phone' as const,
        label: 'Phone',
        render: (contact: ContactDataFetch) => <div className="text-gray-600">{contact.phone || '-'}</div>
      },
      {
        key: 'message' as const,
        label: 'Message',
        render: (contact: ContactDataFetch) => <div className="text-gray-600">{contact.message || '-'}</div>
      },
      {
        key: 'messageSentAt' as const,
        label: 'Message Sent At',
        sortable: true,
        render: (contact: ContactDataFetch) => (
          <div className="text-gray-600">{new Date(contact.messageSentAt).toLocaleString()}</div>
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
        console.log('responce :',response)
        setContacts(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        // TODO: Add error notification
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
      setSortField(field as 'Email' | 'name' | 'familyName'| 'messageSentAt' | 'phone');
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

    const handleDeleteUser = async (contact: ContactDataFetch) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
        try {
          await contactService.deleteContact(contact.id);
            toast.success('Contact deleted Successfully!', {
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
          // TODO: Add error notification
        }
      }
    };

  return (

    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Contacts Management</h1>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header with search and add button */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search users..."
              />
            </div>
          </div>

          {/* Table */}
          <DataTable
            data={contacts}
            columns={columns}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onDelete={handleDeleteUser}
            loading={loading}
          />

          {/* Pagination */}
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

  );
}