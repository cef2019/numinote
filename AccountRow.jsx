import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Edit, Trash2, GitBranchPlus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccountRow = ({ account, level, onEdit, onDelete, onAddSubAccount, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubAccounts = account.subAccounts && account.subAccounts.length > 0;

  return (
    <>
      <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hover:bg-gray-50 group cursor-pointer"
        onClick={() => onSelect && onSelect(account)} // <-- selection happens here
      >
        <td className="px-4 py-3 w-1/3" style={{ paddingLeft: `${level * 24 + 16}px` }}>
          <div className="flex items-center">
            {hasSubAccounts ? (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering row select
                  setIsExpanded(!isExpanded);
                }}
                className="mr-2 p-1 rounded-full hover:bg-gray-200"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-6 mr-2"></div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{account.name}</span>
              <span className="font-mono text-sm text-gray-500">{account.code}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 w-1/3 text-gray-600">{account.type}</td>
        <td className="px-4 py-3 w-1/3 text-right font-mono text-gray-800">
          ${parseFloat(account.balance || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
        <td className="px-4 py-3 w-auto text-right">
          <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" title="Add Sub-account" onClick={(e) => { e.stopPropagation(); onAddSubAccount(account); }}>
              <GitBranchPlus className="w-4 h-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit" onClick={(e) => { e.stopPropagation(); onEdit(account); }}>
              <Edit className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(account); }}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" title="Select Account" onClick={(e) => { e.stopPropagation(); onSelect(account); }}>
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </Button>
          </div>
        </td>
      </motion.tr>

      <AnimatePresence>
        {isExpanded && hasSubAccounts && (
          <>
            {account.subAccounts.map((subAcc) => (
              <AccountRow
                key={subAcc.id}
                account={subAcc}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubAccount={onAddSubAccount}
                onSelect={onSelect} // <-- pass selection down
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccountRow;