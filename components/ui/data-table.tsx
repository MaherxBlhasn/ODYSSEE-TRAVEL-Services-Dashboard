import React, { useState } from 'react';
import { Edit, Trash2, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T | 'actions';
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    hideOnMobile?: boolean;
  }>;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onSort,
  sortField,
  sortDirection,
  onEdit,
  onDelete,
  loading = false
}: DataTableProps<T>) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const SortButton = ({ field, children }: { field: string, children: React.ReactNode }) => (
    <button
      onClick={() => onSort?.(field)}
      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full hidden md:table">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-6 py-3 text-left">
                {column.sortable ? (
                  <SortButton field={String(column.key)}>{column.label}</SortButton>
                ) : (
                  <span className="font-medium text-gray-700">{column.label}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4">
                  {column.key === 'actions' ? (
                    <div className="flex items-center space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : column.render ? (
                    column.render(item)
                  ) : (
                    <div className="text-gray-900">{String(item[column.key as keyof T] || '-')}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                {columns.filter(c => !c.hideOnMobile).map((column) => (
                  column.key !== 'actions' && (
                    <div key={String(column.key)} className="mb-2 last:mb-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column.label}
                      </div>
                      <div className="text-gray-900">
                        {column.render ? column.render(item) : String(item[column.key as keyof T] || '-')}
                      </div>
                    </div>
                  )
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {expandedRow === item.id && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                {columns.filter(c => c.hideOnMobile).map((column) => (
                  <div key={String(column.key)} className="mb-2 last:mb-0">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.label}
                    </div>
                    <div className="text-gray-900">
                      {column.render ? column.render(item) : String(item[column.key as keyof T] || '-')}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end space-x-2 mt-3">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}