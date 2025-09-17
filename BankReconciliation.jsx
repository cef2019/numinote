import React, { useState, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import AccountSelector from "@/components/AccountSelector";

export default function BankReconciliation({ transactions = [], accounts = [] }) {
  const { toast } = useToast();
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [statementEndingBalance, setStatementEndingBalance] = useState("");
  const [uploadedTransactions, setUploadedTransactions] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const fileInputRef = useRef(null);

  // Transactions from books filtered by account
  const bookTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.account_id?.toString() === selectedAccountId)
      .map((t) => {
        let amount = t.type === "Income" ? t.amount : -t.amount;
        return { ...t, amount };
      });
  }, [transactions, selectedAccountId]);

  // Unreconciled transactions
  const unreconciledBookTransactions = useMemo(() => {
    return bookTransactions.filter(
      (bt) => !matchedPairs.some((p) => p.book.id === bt.id)
    );
  }, [bookTransactions, matchedPairs]);

  const unreconciledBankTransactions = useMemo(() => {
    return uploadedTransactions.filter(
      (st, index) => !matchedPairs.some((p) => p.bankIndex === index)
    );
  }, [uploadedTransactions, matchedPairs]);

  // Handle file upload (CSV)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data.map((row, index) => ({
            id: `bank-${index}`,
            date: row.Date || row.date,
            description: row.Description || row.description,
            amount: parseFloat(row.Amount || row.amount || 0),
          }));
          setUploadedTransactions(parsedData);
          toast({
            title: "Success",
            description: "Bank statement uploaded successfully.",
          });
        },
        error: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to parse CSV: ${error.message}`,
          });
        },
      });
    }
  };

  // Auto-match transactions
  const autoMatchTransactions = useCallback(() => {
    let newMatches = [...matchedPairs];
    let availableBook = bookTransactions.filter(
      (bt) => !newMatches.some((p) => p.book.id === bt.id)
    );
    let availableBank = uploadedTransactions
      .map((st, i) => ({ ...st, index: i }))
      .filter((st) => !newMatches.some((p) => p.bankIndex === st.index));

    availableBook.forEach((bt) => {
      const potentialMatch = availableBank.find(
        (st) =>
          Math.abs(st.amount - bt.amount) < 0.01 &&
          Math.abs(new Date(st.date) - new Date(bt.date)) <
            3 * 24 * 60 * 60 * 1000 // within 3 days
      );
      if (potentialMatch) {
        newMatches.push({
          book: bt,
          bank: potentialMatch,
          bankIndex: potentialMatch.index,
        });
        availableBank = availableBank.filter(
          (st) => st.index !== potentialMatch.index
        );
      }
    });

    setMatchedPairs(newMatches);
    toast({
      title: "Auto-match complete",
      description: `Found ${newMatches.length - matchedPairs.length} new matches.`,
    });
  }, [bookTransactions, uploadedTransactions, matchedPairs, toast]);

  const handleAccountChange = (account) => {
    setSelectedAccountId(account ? account.id : "");
  };

  // Selected account details
  const selectedAccountDetails = useMemo(() => {
    return accounts.find((a) => a.id === selectedAccountId);
  }, [accounts, selectedAccountId]);

  const bookBalance = selectedAccountDetails?.balance || 0;

  // Cleared balance from matched pairs
  const clearedBalance = useMemo(() => {
    return matchedPairs.reduce((sum, pair) => sum + pair.book.amount, 0);
  }, [matchedPairs]);

  // Difference = Statement Balance - Cleared Balance
  const difference = useMemo(() => {
    return parseFloat(statementEndingBalance || 0) - clearedBalance;
  }, [statementEndingBalance, clearedBalance]);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Bank Reconciliation
        </h1>
      </motion.div>

      {/* Setup Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-sm border mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="bankAccount">Bank Account</Label>
            <AccountSelector
              accounts={accounts}
              value={selectedAccountId}
              onChange={handleAccountChange}
              categoryFilter={["Assets"]}
              placeholder="Select a bank account"
              disabledParent={true}
            />
          </div>
          <div>
            <Label htmlFor="statementBalance">Statement Ending Balance</Label>
            <Input
              id="statementBalance"
              type="number"
              placeholder="Enter ending balance"
              value={statementEndingBalance}
              onChange={(e) => setStatementEndingBalance(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="statementUpload">Upload Bank Statement (.csv)</Label>
            <input
              id="statementUpload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
              ref={fileInputRef}
            />
          </div>
        </div>
      </motion.div>

      {selectedAccountId && (
        <>
          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-sm text-gray-500">Statement Balance</p>
              <p className="text-2xl font-bold">
                ${parseFloat(statementEndingBalance || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <p className="text-sm text-gray-500">Cleared Balance</p>
              <p className="text-2xl font-bold">
                ${clearedBalance.toLocaleString()}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg shadow-sm border text-center ${
                difference === 0 ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <p className="text-sm text-gray-500">Difference</p>
              <p
                className={`text-2xl font-bold ${
                  difference === 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${difference.toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* Action Bar */}
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={autoMatchTransactions}
              disabled={uploadedTransactions.length === 0}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Auto-match
            </Button>
            <Button disabled={difference !== 0}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Finish Reconciliation
            </Button>
          </div>

          {/* Reconciliation Table */}
          <div className="grid grid-cols-2 gap-8">
            {/* Book Transactions */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-2">
                Book Transactions (Unreconciled)
              </h2>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left">Description</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unreconciledBookTransactions.map((t) => (
                      <tr key={t.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{t.date}</td>
                        <td>{t.description}</td>
                        <td
                          className={`text-right ${
                            t.amount >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {t.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bank Transactions */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-2">
                Bank Statement Transactions (Unreconciled)
              </h2>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left">Description</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unreconciledBankTransactions.map((t, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2">{t.date}</td>
                        <td>{t.description}</td>
                        <td
                          className={`text-right ${
                            t.amount >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {t.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Matched Transactions */}
          <div className="bg-white p-4 mt-8 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-2">Matched Transactions</h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Book Desc.</th>
                    <th className="text-right">Amount</th>
                    <th className="text-left pl-4">Bank Desc.</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedPairs.map((p, i) => (
                    <tr key={i} className="border-b bg-green-50">
                      <td className="py-2">{p.book.description}</td>
                      <td className="text-right">{p.book.amount.toFixed(2)}</td>
                      <td className="pl-4">{p.bank.description}</td>
                      <td className="text-right">{p.bank.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}