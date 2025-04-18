import React from 'react'

interface TableProps {
  items: Array<{
    item: string
    cost: number
  }>
}

export const Table: React.FC<TableProps> = ({ items }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Item
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cost
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.item}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${row.cost.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
