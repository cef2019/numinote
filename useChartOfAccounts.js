import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import Papa from 'papaparse';

const buildHierarchy = (list) => {
  if (!list || list.length === 0) return [];
  const listCopy = JSON.parse(JSON.stringify(list));
  const map = {};
  const roots = [];
  listCopy.forEach(node => {
    map[node.id] = { ...node, subAccounts: [] };
  });
  listCopy.forEach(node => {
    if (node.parent_id && map[node.parent_id]) {
      map[node.parent_id].subAccounts.push(map[node.id]);
    } else {
      roots.push(map[node.id]);
    }
  });
  return roots;
};

export const useChartOfAccounts = (rawAccounts, activeOrgId, fetchDataForOrg, fileInputRef) => {
  const { toast } = useToast();
  const [groupedAccounts, setGroupedAccounts] = useState({});
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (rawAccounts && rawAccounts.length > 0) {
      const hierarchy = buildHierarchy(rawAccounts);
      const grouped = hierarchy.reduce((acc, curr) => {
        const category = curr.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(curr);
        return acc;
      }, {});
      setGroupedAccounts(grouped);
    } else {
      setGroupedAccounts({});
    }
  }, [rawAccounts]);

  const handleExport = () => {
    const dataToExport = rawAccounts.map(acc => {
      const parent = rawAccounts.find(p => p.id === acc.parent_id);
      return {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        category: acc.category,
        balance: acc.balance,
        parent_code: parent ? parent.code : ''
      };
    });
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `chart_of_accounts_${activeOrgId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: "Chart of Accounts exported." });
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsImporting(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data, errors } = results;
          if (errors.length > 0) {
            toast({ variant: 'destructive', title: 'Import Error', description: `Error parsing CSV on row ${errors[0].row}: ${errors[0].message}` });
            setIsImporting(false);
            return;
          }

          try {
            const parentAccountsData = data
                .filter(row => !row.parent_code)
                .map(row => ({
                    organization_id: activeOrgId,
                    code: row.code,
                    name: row.name,
                    type: row.type,
                    category: row.category,
                    balance: parseFloat(row.balance || 0),
                    parent_id: null,
                }));
            
            if (parentAccountsData.length > 0) {
                const { error: parentError } = await supabase.from('accounts').upsert(parentAccountsData, { onConflict: 'organization_id, code' });
                if (parentError) throw new Error(`Error importing parent accounts: ${parentError.message}`);
            }

            const { data: updatedAccounts, error: fetchError } = await supabase.from('accounts').select('id, code').eq('organization_id', activeOrgId);
            if (fetchError) throw new Error(`Could not refetch accounts: ${fetchError.message}`);

            const codeToIdMap = new Map(updatedAccounts.map(acc => [acc.code, acc.id]));

            const childAccountsData = data
              .filter(row => row.parent_code)
              .map(row => {
                  const parentId = codeToIdMap.get(row.parent_code);
                  if (row.parent_code && !parentId) {
                      throw new Error(`Parent account with code "${row.parent_code}" not found for child account "${row.code}".`);
                  }
                  return {
                      organization_id: activeOrgId,
                      code: row.code,
                      name: row.name,
                      type: row.type,
                      category: row.category,
                      balance: parseFloat(row.balance || 0),
                      parent_id: parentId,
                  };
              });

            if (childAccountsData.length > 0) {
                const { error: childError } = await supabase.from('accounts').upsert(childAccountsData, { onConflict: 'organization_id, code' });
                if (childError) throw new Error(`Error importing child accounts: ${childError.message}`);
            }
            
            await fetchDataForOrg(activeOrgId);
            toast({ title: "Import Successful", description: `${data.length} accounts have been processed.` });
          } catch (error) {
            toast({ variant: 'destructive', title: 'Import Failed', description: error.message, duration: 7000 });
          } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
          }
        },
      });
    }
  };

  const downloadTemplate = () => {
    const templateData = [{
      code: '1000',
      name: 'Cash and Bank',
      type: 'Bank',
      category: 'Assets',
      balance: '0.00',
      parent_code: '',
      description: 'Parent account for all cash and bank accounts.',
    },{
      code: '1001',
      name: 'Operating Account',
      type: 'Bank',
      category: 'Assets',
      balance: '50000.00',
      parent_code: '1000',
      description: 'Main checking account for daily operations.'
    },{
      code: '4000',
      name: 'Donations',
      type: 'Income',
      category: 'Revenue',
      balance: '0.00',
      parent_code: '',
      description: 'Revenue from individual and corporate donations.'
    },{
      code: '5000',
      name: 'Program Expenses',
      type: 'Expense',
      category: 'Expenses',
      balance: '0.00',
      parent_code: '',
      description: 'Expenses directly related to program delivery.'
    }];
    const csv = Papa.unparse(templateData, {
        columns: ['code', 'name', 'type', 'category', 'balance', 'parent_code', 'description']
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'chart_of_accounts_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    groupedAccounts,
    handleExport,
    handleFileImport,
    downloadTemplate,
    isImporting,
  };
};