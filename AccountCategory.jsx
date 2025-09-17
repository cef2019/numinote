import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import AccountRow from './AccountRow';

const AccountCategory = ({ category, accounts = [], onEdit, onDelete, onAddSubAccount, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const categoryTotals = accounts.reduce((sum, acc) => {
    const calculateTotal = (account) => {
      let total = parseFloat(account.balance) || 0;
      if (account.subAccounts && account.subAccounts.length > 0) {
        total += account.subAccounts.reduce((subSum, subAcc) => subSum + calculateTotal(subAcc), 0);
      }
      return total;
    };
    return sum + calculateTotal(acc);
  }, 0);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
        aria-expanded={isOpen}
        aria-controls={`accounts-${category}`}
      >
        <div className="flex items-center">
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-500 mr-3" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500 mr-3" />
          )}
          <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
        </div>
        <span className="font-mono text-lg font-semibold text-gray-700">
          ${categoryTotals.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </button>

      {isOpen && (
        <div id={`accounts-${category}`} className="mt-1 pl-4">
          <table className="w-full mt-2">
            <tbody className="divide-y divide-gray-200">
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    level={0}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddSubAccount={onAddSubAccount}
                    onSelect={onSelect} // <-- pass selection down
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-gray-500 italic">
                    No accounts available in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountCategory;