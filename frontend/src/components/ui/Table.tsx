import React from 'react';

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({ children, className = '', ...props }) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full border-collapse text-left text-xs ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...props }) => (
  <thead className={`bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[9px] tracking-wider ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-slate-50 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className = '', ...props }) => (
  <tr className={`hover:bg-slate-50/50 transition-colors duration-150 ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => (
  <th className={`px-4 py-3 font-semibold ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = '', ...props }) => (
  <td className={`px-4 py-3 text-slate-700 align-middle ${className}`} {...props}>
    {children}
  </td>
);
