import React, { useState, useEffect } from 'react';
import { getReceipts } from '../lib/supabase';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('Meals');
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipts();
  }, [activeCategory]);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      const data = await getReceipts(activeCategory);
      setReceipts(data || []);
    } catch (error) {
      console.error('Error loading receipts:', error);
      toast.error('Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Receipt History</h1>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveCategory('Meals')}
            className={`flex-1 py-3 px-6 rounded-lg text-lg font-medium transition-all ${
              activeCategory === 'Meals'
                ? 'bg-[#F8BF1E] text-white'
                : 'bg-white border-2 border-[#F8BF1E] text-[#F8BF1E]'
            }`}
          >
            Meals
          </button>
          <button
            onClick={() => setActiveCategory('Accommodation')}
            className={`flex-1 py-3 px-6 rounded-lg text-lg font-medium transition-all ${
              activeCategory === 'Accommodation'
                ? 'bg-[#F8BF1E] text-white'
                : 'bg-white border-2 border-[#F8BF1E] text-[#F8BF1E]'
            }`}
          >
            Accommodation
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F8BF1E] mx-auto"></div>
            <p className="mt-4 text-lg">Loading receipts...</p>
          </div>
        ) : receipts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No receipts found for this category</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Items</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Amount</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Currency</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{receipt.date_recu || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{receipt.company || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      {Array.isArray(receipt.items_purchased) ? receipt.items_purchased.join(', ') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      {receipt.total_amount ? receipt.total_amount.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">{receipt.devise || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};