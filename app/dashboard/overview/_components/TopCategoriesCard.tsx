import { ActionButtons } from './actions/action-buttons';

const TopCategoriesCard = () => {
  // Sample data from the PDF
  const categories = [
    { id: 'CAT010', name: 'Audio Equipment', spend: 10000.0 },
    { id: 'CAT011', name: 'Networking Devices', spend: 9000.0 },
    { id: 'CAT012', name: 'Robotics', spend: 8000.0 },
    { id: 'CAT013', name: 'Computers & Electronics', spend: 7000.0 },
    { id: 'CAT014', name: 'Navigation & Tracking', spend: 6000.0 }
  ];

  const totalSpend = categories.reduce((acc, cat) => acc + cat.spend, 0);

  return (
    <div className="rounded-lg border-solid bg-[#f9f4ff] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">Top 5 Categories</h2>
          {/* <h4 className="text-md font-light text-gray-400">By Spend</h4> */}
          <p className="text-sm text-muted-foreground">By Spend</p>
        </div>
        <ActionButtons />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Category ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Category Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Spend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category, index) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-purple-50"
              >
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                    #{category.id}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  $
                  {category.spend.toLocaleString('en-US', {
                    minimumFractionDigits: 2
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-8 w-full text-center text-sm text-gray-600">
        Total spend across top 5 categories: $
        {totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })} •
        Last 30 days
      </div>
    </div>
  );
};

export default TopCategoriesCard;
