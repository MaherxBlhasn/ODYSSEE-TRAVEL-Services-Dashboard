import React, { useState, useEffect } from 'react';
import { Edit, Trash2, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T | 'actions';
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
    hideOnLarge?: boolean;
    priority?: 'high' | 'medium' | 'low'; // Priority for responsive hiding (can be used for future enhancements)
  }>;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
}

export default function DataTable<T extends { id: string }>({
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
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop' | 'large'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else if (width < 1440) {
        setScreenSize('desktop');
      } else {
        setScreenSize('large');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter columns based on screen size
  const getVisibleColumns = () => {
    return columns.filter(column => {
      switch (screenSize) {
        case 'mobile':
          return !column.hideOnMobile;
        case 'tablet':
          return !column.hideOnTablet;
        case 'desktop':
          return !column.hideOnDesktop;
        case 'large':
          return !column.hideOnLarge;
        default:
          return true;
      }
    });
  };

  // Get hidden columns for expanded view
  const getHiddenColumns = () => {
    return columns.filter(column => {
      switch (screenSize) {
        case 'mobile':
          return column.hideOnMobile;
        case 'tablet':
          return column.hideOnTablet;
        case 'desktop':
          return column.hideOnDesktop;
        case 'large':
          return column.hideOnLarge;
        default:
          return false;
      }
    });
  };

  const SortButton = ({ field, children }: { field: string, children: React.ReactNode }) => (
    <button
      onClick={() => onSort?.(field)}
      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900 transition-colors"
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

  const visibleColumns = getVisibleColumns();
  const hiddenColumns = getHiddenColumns();
  const showMobileLayout = screenSize === 'mobile';

  return (
    <div className="w-full">
      {!showMobileLayout ? (
        // Desktop/Tablet Table Layout
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {visibleColumns.map((column) => (
                  <th key={String(column.key)} className="px-4 py-3 text-left">
                    {column.sortable ? (
                      <SortButton field={String(column.key)}>{column.label}</SortButton>
                    ) : (
                      <span className="font-medium text-gray-700">{column.label}</span>
                    )}
                  </th>
                ))}
                {hiddenColumns.length > 0 && (
                  <th className="px-4 py-3 text-left">
                    <span className="font-medium text-gray-700">More</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    {visibleColumns.map((column) => (
                      <td key={String(column.key)} className="px-4 py-4">
                        {column.key === 'actions' ? (
                          <div className="flex items-center space-x-2">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(item)}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors rounded"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(item)}
                                className="p-1 text-red-600 hover:text-red-800 transition-colors rounded"
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
                    {hiddenColumns.length > 0 && (
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors rounded"
                          title="Show more details"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                  
                  {/* Expanded Row for Hidden Columns */}
                  {expandedRow === item.id && hiddenColumns.length > 0 && (
                    <tr className="bg-gray-50">
                      <td colSpan={visibleColumns.length + (hiddenColumns.length > 0 ? 1 : 0)} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {hiddenColumns.map((column) => (
                            column.key !== 'actions' && (
                              <div key={String(column.key)} className="flex flex-col">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                  {column.label}
                                </div>
                                <div className="text-gray-900">
                                  {column.render ? column.render(item) : String(item[column.key as keyof T] || '-')}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Mobile Card Layout
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {visibleColumns.filter(c => c.key !== 'actions').map((column) => (
                    <div key={String(column.key)} className="mb-3 last:mb-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        {column.label}
                      </div>
                      <div className="text-gray-900">
                        {column.render ? column.render(item) : String(item[column.key as keyof T] || '-')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col items-end space-y-2 ml-4">
                  {hiddenColumns.length > 0 && (
                    <button
                      onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                      title="Show more details"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  )}
                  
                  <div className="flex space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content for Mobile */}
              {expandedRow === item.id && hiddenColumns.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    {hiddenColumns.map((column) => (
                      column.key !== 'actions' && (
                        <div key={String(column.key)}>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            {column.label}
                          </div>
                          <div className="text-gray-900">
                            {column.render ? column.render(item) : String(item[column.key as keyof T] || '-')}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {data.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No data available</div>
          <div className="text-gray-400 text-sm">There are no items to display at the moment.</div>
        </div>
      )}
    </div>
  );
}