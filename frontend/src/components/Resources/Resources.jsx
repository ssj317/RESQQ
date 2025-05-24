import React from 'react'

export const Resources = () => {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Resource Management</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left">Resource Name</th>
                  <th className="px-6 py-3 text-left">Quantity</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-4">Medical Supplies</td>
                  <td className="px-6 py-4">500</td>
                  <td className="px-6 py-4">Warehouse A</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Available
                    </span>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">Food Packages</td>
                  <td className="px-6 py-4">300</td>
                  <td className="px-6 py-4">Warehouse B</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Low Stock
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
