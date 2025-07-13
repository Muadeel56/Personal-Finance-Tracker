import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ columns, data, onRowClick }) => (
  <div className="overflow-x-auto rounded-xl shadow bg-[var(--color-card)] border border-[var(--color-border)] transition-colors w-full">
    <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-4 py-2 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider bg-[var(--color-surface)] whitespace-nowrap"
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-[var(--color-card)] divide-y divide-[var(--color-border)]">
        {data.map((row, idx) => (
          <tr
            key={row.id || idx}
            className={onRowClick ? 'cursor-pointer hover:bg-[var(--color-bg)] transition-colors' : ''}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 whitespace-nowrap text-[var(--color-text)]">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClick: PropTypes.func,
};

export default Table; 