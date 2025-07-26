'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { SearchBar } from '@/components/ui/search-bar';
import { Pagination } from '@/components/ui/pagination';
import { UserDataFetch , UserData } from '@/lib/types/user.types';
import { userService } from '@/lib/services/user.service';
import { useRouter } from 'next/navigation'
import { Bounce, toast, ToastContainer } from 'react-toastify';
export default function UsersPage() {

  // State management
  const [users, setUsers] = useState<UserDataFetch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<'Email' | 'username' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  // Table columns configuration
  const columns = [
    {
      key: 'username' as const,
      label: 'Username',
      sortable: true,
      render: (user: UserDataFetch) => <div className="font-medium text-gray-900">{user.username}</div>
    },
    {
      key: 'Email' as const,
      label: 'Email',
      sortable: true,
      render: (user: UserDataFetch) => <div className="text-gray-600">{user.Email}</div>
    },
    {
      key: 'phone' as const,
      label: 'Phone',
      render: (user: UserDataFetch) => <div className="text-gray-600">{user.phone || '-'}</div>
    },
    {
      key: 'createdAt' as const,
      label: 'Created At',
      sortable: true,
      render: (user: UserDataFetch) => (
        <div className="text-gray-600">{new Date(user.createdAt).toLocaleString()}</div>
      )
    },
    {
      key: 'actions' as const,
      label: 'Actions'
    }
  ];

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortField,
        sortOrder: sortDirection
      };

      const response = await userService.getUsers(params);
      console.log('responce :',response)
      setUsers(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      // TODO: Add error notification
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortField, sortDirection]);

  // Handlers
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as 'Email' | 'username' | 'createdAt');
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // CRUD Operations
  const handleAddUser =  () => {
    router.push('/dashboard/users/create');
  };

  const handleEditUser = (user: UserDataFetch) => {
    router.push(`/dashboard/users/edit/${user.id}`);

  };


  const handleDeleteUser = async (user: UserDataFetch) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(user.id);
          toast.success('User deleted Successfully!', {
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
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        // TODO: Add error notification
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users Management</h1>
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
              <button
                onClick={handleAddUser}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <DataTable
            data={users}
            columns={columns}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onEdit={handleEditUser}
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