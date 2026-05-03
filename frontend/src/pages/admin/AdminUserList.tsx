import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';
import { useAuth } from '../../context/AuthContext';

const AdminUserList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Re-fetch users whenever the currentPage changes
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Pass pagination params directly via Axios
      const response = await apiClient.get('/admin/users', {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });

      // Extract data from Spring Boot's Page<T> structure
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: number) => {
    if (id === currentUser?.id) {
      alert('System Error: You cannot delete your own active administrative session.');
      return;
    }

    const isConfirmed = window.confirm(
      'Are you sure you want to permanently delete this user? This action cannot be undone.',
    );
    if (!isConfirmed) return;

    try {
      await apiClient.delete(`/admin/users/${id}`);
      // Refresh the current page to ensure pagination stays accurate after a deletion
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#002045]">User Management</h2>
          <p className="mt-1 text-sm font-medium text-[#74777f]">
            Audit and manage all registered accounts on the platform.
          </p>
        </div>
        <Link
          to="/admin/users/new"
          className="flex items-center gap-2 rounded-xl bg-[#002045] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#1a365d] active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Create User
        </Link>
      </div>

      {/* Directory Table */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        {isLoading ? (
          <div className="animate-pulse p-16 text-center font-bold text-[#43474e]">
            Querying user database...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[#f5faff] p-16 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-[#c4c6cf]">
              group_off
            </span>
            <p className="mb-1 text-lg font-bold text-[#002045]">No users found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#dee3e8] bg-[#eff4f9]">
                    <th className="w-16 px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      User Identity
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      System Role
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee3e8]">
                  {users.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-[#f5faff]">
                      <td className="px-6 py-5 text-xs font-bold text-[#74777f]">#{user.id}</td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d6e3ff] text-sm font-bold text-[#001b3c] shadow-sm">
                            {user.firstName.charAt(0).toUpperCase()}
                            {user.lastName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#002045]">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#74777f]">
                              <span className="material-symbols-outlined text-[14px]">mail</span>{' '}
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                            user.role === 'SUPER_ADMIN'
                              ? 'border-[#001b3c] bg-[#002045] text-[#85f6ad]'
                              : user.role === 'ORG_ADMIN'
                                ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]'
                                : 'border-[#dee3e8] bg-[#eff4f9] text-[#43474e]'
                          }`}
                        >
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/users/${user.id}/edit`}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9]"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                              user.id === currentUser?.id
                                ? 'cursor-not-allowed bg-[#e4e9ee] text-[#74777f] opacity-50'
                                : 'bg-[#ffdad6]/30 text-[#ba1a1a] hover:bg-[#ffdad6]/70'
                            }`}
                            disabled={user.id === currentUser?.id}
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>{' '}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-[#dee3e8] bg-[#f5faff] px-6 py-4">
              <span className="text-xs font-semibold text-[#74777f]">
                Showing page <span className="font-bold text-[#002045]">{currentPage + 1}</span> of{' '}
                <span className="font-bold text-[#002045]">{totalPages}</span> ({totalElements}{' '}
                total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">chevron_left</span> Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1 || totalPages === 0}
                  className="flex items-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;
