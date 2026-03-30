import React from "react";
import { Loader2 } from "lucide-react";

interface Column<T> {
  title: string;
  dataIndex?: keyof T;
  key: string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey: keyof T;
  loading?: boolean;
  className?: string;
  pagination?: { pageSize: number; className?: string };
}

export const Table = <T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  className = "",
  pagination,
}: TableProps<T>) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <Loader2 className="animate-spin inline-block text-brand-primary" size={24} />
              </td>
            </tr>
          ) : dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-text-tertiary">
                No data found
              </td>
            </tr>
          ) : (
            dataSource.slice(0, pagination?.pageSize || dataSource.length).map((record) => (
              <tr key={String(record[rowKey])} className="hover:bg-brand-primary/5 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render
                      ? col.render(col.dataIndex ? record[col.dataIndex] : undefined, record)
                      : col.dataIndex
                      ? String(record[col.dataIndex])
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && dataSource.length > pagination.pageSize && (
        <div className={`px-6 py-4 border-t border-gray-50 flex justify-between items-center ${pagination.className}`}>
          <span className="text-sm text-text-tertiary">
            Showing {Math.min(dataSource.length, pagination.pageSize)} of {dataSource.length} results
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
