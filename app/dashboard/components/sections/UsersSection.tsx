'use client';

import { useState, useEffect } from 'react';
import { Plus, X, User, Mail, Phone, Lock, Save } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { SearchBar } from '@/components/ui/search-bar';
import { Pagination } from '@/components/ui/pagination';
import { UserDataFetch } from '@/lib/types/user.types';
import { userService } from '@/lib/services/user.service';
import { useRouter } from 'next/navigation'
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserSchema, userSchema } from '@/lib/validations/user.validations';

type UpdateUserFormData = z.infer<typeof updateUserSchema>;
type CreateUserFormData = z.infer<typeof userSchema>;
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
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDataFetch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  
  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSubmitting, setIsAddSubmitting] = useState(false);
  
  const router = useRouter();

  // Form handling for edit modal
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: '',
      Email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    }
  });

  // Form handling for add modal
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      Email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    }
  });
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
    hideOnMobile: true,
    render: (user: UserDataFetch) => <div className="text-gray-600">{user.Email}</div>
  },
  {
    key: 'phone' as const,
    label: 'Phone',
    hideOnMobile: true,
    render: (user: UserDataFetch) => <div className="text-gray-600">{user.phone || '-'}</div>
  },
  {
    key: 'createdAt' as const,
    label: 'Created At',
    sortable: true,
    hideOnMobile: true,
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
  const handleAddUser = () => {
    resetAdd();
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    resetAdd();
  };

  const handleAddFormSubmit = async (data: CreateUserFormData) => {
    setIsAddSubmitting(true);
    
    try {
      await userService.createUser(data);

      toast.success('User created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
        transition: Bounce,
      });

      handleCloseAddModal();
      fetchUsers(); // Refresh the list
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
        transition: Bounce,
      });
    } finally {
      setIsAddSubmitting(false);
    }
  };

  const handleEditUser = async (user: UserDataFetch) => {
    setSelectedUser(user);
    
    // Reset form with user data
    reset({
      username: user.username,
      Email: user.Email,
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
    });
    
    setIsPasswordEditable(false);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setIsPasswordEditable(false);
    reset();
  };

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    
    try {
      const payload: Partial<UpdateUserFormData> = {
        username: data.username,
        Email: data.Email,
        phone: data.phone,
      };

      if (isPasswordEditable) {
        payload.password = data.password;
        payload.confirmPassword = data.confirmPassword;
      }

      await userService.updateUser(selectedUser.id, payload);

      toast.success('User updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
        transition: Bounce,
      });

      handleCloseEditModal();
      fetchUsers(); // Refresh the list
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
        transition: Bounce,
      });
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Simple Edit User Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              {/* Simple background overlay */}
              <div 
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={handleCloseEditModal}
              ></div>

              {/* Clean Modal Panel */}
              <div className="relative inline-block w-full max-w-md transform transition-all bg-white rounded-lg shadow-xl">
                {/* Simple Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                    <button
                      onClick={handleCloseEditModal}
                      className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-4">
                  <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Username Field */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Username *
                      </label>
                      <input
                        id="username"
                        type="text"
                        {...register('username')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.username ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter username"
                        disabled={isSubmitting}
                      />
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600 text-left">{errors.username.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Email *
                      </label>
                      <input
                        id="Email"
                        type="email"
                        {...register('Email')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.Email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter email"
                        disabled={isSubmitting}
                      />
                      {errors.Email && (
                        <p className="mt-1 text-sm text-red-600 text-left">{errors.Email.message}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                        disabled={isSubmitting}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 text-left">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Password Section */}
                    <div className="pt-2">
                      <div className="flex items-center space-x-2 mb-4 justify-start">
                        <input
                          type="checkbox"
                          checked={isPasswordEditable}
                          onChange={(e) => setIsPasswordEditable(e.target.checked)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label className="block text-sm font-medium text-gray-700 text-left">
                          Update Password
                        </label>
                      </div>

                      {isPasswordEditable && (
                        <div className="space-y-4">
                          {/* Password Field */}
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                              New Password *
                            </label>
                            <input
                              id="password"
                              type="password"
                              {...register('password')}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                errors.password ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Enter new password"
                              disabled={isSubmitting}
                            />
                            {errors.password && (
                              <p className="mt-1 text-sm text-red-600 text-left">{errors.password.message}</p>
                            )}
                          </div>

                          {/* Confirm Password Field */}
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                              Confirm Password *
                            </label>
                            <input
                              id="confirmPassword"
                              type="password"
                              {...register('confirmPassword')}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Confirm new password"
                              disabled={isSubmitting}
                            />
                            {errors.confirmPassword && (
                              <p className="mt-1 text-sm text-red-600 text-left">{errors.confirmPassword.message}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit(handleFormSubmit)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple Add User Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              {/* Simple background overlay */}
              <div 
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={handleCloseAddModal}
              ></div>

              {/* Clean Modal Panel */}
              <div className="relative inline-block w-full max-w-md transform transition-all bg-white rounded-lg shadow-xl">
                {/* Simple Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                    <button
                      onClick={handleCloseAddModal}
                      className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-4">
                  <form onSubmit={handleSubmitAdd(handleAddFormSubmit)} className="space-y-4">
                    {/* Username Field */}
                    <div>
                      <label htmlFor="add-username" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Username *
                      </label>
                      <input
                        id="add-username"
                        type="text"
                        {...registerAdd('username')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errorsAdd.username ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter username"
                        disabled={isAddSubmitting}
                      />
                      {errorsAdd.username && (
                        <p className="mt-1 text-sm text-red-600 text-left">{errorsAdd.username.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Email *
                      </label>
                      <input
                        id="add-email"
                        type="email"
                        {...registerAdd('Email')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errorsAdd.Email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter email"
                        disabled={isAddSubmitting}
                      />
                      {errorsAdd.Email && (
                        <p className="mt-1 text-sm text-red-600 text-left">{errorsAdd.Email.message}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Phone
                      </label>
                      <input
                        id="add-phone"
                        type="tel"
                        {...registerAdd('phone')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errorsAdd.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                        disabled={isAddSubmitting}
                      />
                      {errorsAdd.phone && (
                        <p className="mt-1 text-sm text-red-600 text-left">{errorsAdd.phone.message}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="add-password" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Password *
                      </label>
                      <input
                        id="add-password"
                        type="password"
                        {...registerAdd('password')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errorsAdd.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter password"
                        disabled={isAddSubmitting}
                        />
                      {errorsAdd.password && (
                        <p className="mt-1 text-sm text-red-600 text-left">{errorsAdd.password.message}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label htmlFor="add-confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Confirm Password *
                      </label>
                      <input
                        id="add-confirmPassword"
                        type="password"
                        {...registerAdd('confirmPassword')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errorsAdd.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Confirm password"
                        disabled={isAddSubmitting}
                      />
                      {errorsAdd.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 text-left">{errorsAdd.confirmPassword.message}</p>
                      )}
                    </div>
                  </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    disabled={isAddSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmitAdd(handleAddFormSubmit)}
                    disabled={isAddSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 flex items-center"
                  >
                    {isAddSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}