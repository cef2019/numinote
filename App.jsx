import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import AppRoutes from '@/components/AppRoutes';
import { supabase } from '@/lib/customSupabaseClient';
import { useCart } from '@/hooks/useCart';

const PageMeta = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Numinote';
  let description = "Streamline your nonprofit's finances, projects, and operations with Numinote. The intuitive, powerful, and affordable solution for organizations making a difference.";

  if (path === '/') {
    title = 'Numinote - The All-in-One Nonprofit Management System';
  } else if (path.startsWith('/app/dashboard')) {
    title = 'Dashboard';
  } else {
    const pageName = path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ');
    if (pageName) {
        title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }
  }

  return <SEO title={title} description={description} url={path} />;
};


function App() {
  const { session, user, loading: authLoading, signOut } = useAuth();
  const isAuthenticated = !!session;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { clearCart } = useCart();

  const [organizations, setOrganizations] = useState([]);
  const [activeOrgId, setActiveOrgId] = useState(localStorage.getItem('activeOrgId') || null);
  const [loadingData, setLoadingData] = useState(false);
  
  const [allData, setAllData] = useState({});
  const [organizationSettings, setOrganizationSettings] = useState(null);

  const resetAppState = useCallback(() => {
      setOrganizations([]);
      setActiveOrgId(null);
      setAllData({});
      setOrganizationSettings(null);
      localStorage.removeItem('activeOrgId');
  }, []);

  const fetchDataForOrg = useCallback(async (orgId) => {
    if (!orgId || !supabase) return;
    setLoadingData(true);
    try {
      const { data, error } = await supabase.rpc('get_organization_data', {
        p_organization_id: orgId
      });

      if (error) {
        // Rethrow the error to be caught by the caller
        throw new Error(`Failed to fetch organization data: ${error.message}`);
      }
      
      if (!data) {
        console.warn("get_organization_data returned null or undefined data for org:", orgId);
        setAllData({});
        setOrganizationSettings(null);
        setLoadingData(false);
        return;
      }
      
      const accounts = data.accounts || [];

      setAllData({
        funds: data.funds || [],
        accounts: accounts,
        projects: data.projects || [],
        transactions: data.transactions || [],
        invoices: data.invoices || [],
        bills: data.bills || [],
        donations: data.donations || [],
        journalEntries: (data.journal_entries || []).map(je => ({...je, journal_entry_lines: je.journal_entry_lines || []})),
        employees: data.employees || [],
        purchaseRequests: (data.purchase_requests || []).map(pr => ({...pr, items: pr.items || []})),
        purchaseOrders: (data.purchase_orders || []).map(po => ({...po, items: po.items || []})),
        inventory: data.inventory || [],
        budgets: (data.budgets || []).map(b => ({...b, line_items: b.line_items || []})),
        organizationSettings: data.organization_settings || null,
      });
      setOrganizationSettings(data.organization_settings || null);

    } catch (error) {
      console.error("Fetch data error:", error);
      toast({ variant: 'destructive', title: 'Error Fetching Organization Data', description: 'There was a problem loading your organization’s data. Please check your connection and try again.' });
      if(error.message.includes('Access denied')){
        await signOut();
        resetAppState();
        navigate('/login');
      }
    } finally {
      setLoadingData(false);
    }
  }, [toast, resetAppState, navigate, signOut]);

  const fetchAndSetInitialData = useCallback(async () => {
    if(!supabase) {
      setLoadingData(false);
      return { hasOrgs: false, error: true };
    }
    setLoadingData(true);
    try {
      const { data: orgsData, error: orgDetailsError } = await supabase.rpc('get_user_organizations');
      if (orgDetailsError) throw orgDetailsError;
      
      if (!orgsData || orgsData.length === 0) {
        const params = new URLSearchParams(location.search);
        const justSubscribed = params.get('subscription_success') === 'true';

        if (justSubscribed) {
          await new Promise(resolve => setTimeout(resolve, 3000));
          return fetchAndSetInitialData();
        }

        setOrganizations([]);
        setActiveOrgId(null);
        return { hasOrgs: false };
      }

      setOrganizations(orgsData);

      let orgToLoad = localStorage.getItem('activeOrgId');
      if (!orgToLoad || !orgsData.some(o => o.id === orgToLoad)) {
        orgToLoad = orgsData.length > 0 ? orgsData[0].id : null;
      }
      
      if (orgToLoad) {
        setActiveOrgId(orgToLoad);
        localStorage.setItem('activeOrgId', orgToLoad);
        await fetchDataForOrg(orgToLoad);
        return { hasOrgs: true, loadedOrgId: orgToLoad };
      }
      return { hasOrgs: true, loadedOrgId: null };
    } catch (error) {
      console.error("Error loading user organizations:", error);
      toast({ variant: 'destructive', title: 'Could not load organizations', description: "We couldn't fetch your organization details. It might be a temporary network issue. Please refresh the page." });
      setOrganizations([]);
      setActiveOrgId(null);
      return { hasOrgs: false, error: true };
    } finally {
       setLoadingData(false);
    }
  }, [toast, fetchDataForOrg, location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('ecommerce_success') === 'true') {
      clearCart();
      toast({
        title: "Purchase Successful!",
        description: "Thank you for your order. We'll process it shortly.",
        variant: 'success',
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, clearCart, toast, navigate]);
  
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated && user) {
        await fetchAndSetInitialData();
      } else if (!authLoading) {
        resetAppState();
      }
    };
    handleAuthChange();
  }, [isAuthenticated, user, authLoading, fetchAndSetInitialData, resetAppState]);

  useEffect(() => {
    if (!activeOrgId || !isAuthenticated || !supabase) {
      return;
    }

    const channel = supabase.channel(`public:all-org-tables:${activeOrgId}`)
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
        }, 
        (payload) => {
          console.log('Realtime change detected, refetching data for org:', activeOrgId, payload);
          fetchDataForOrg(activeOrgId);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to realtime updates for org:', activeOrgId);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Realtime channel error:`, err);
          toast({
            variant: "destructive",
            title: "Realtime Connection Error",
            description: "Could not listen for live updates. Please refresh the page.",
          });
        }
      });
      
    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };

  }, [activeOrgId, isAuthenticated, fetchDataForOrg, toast]);

  const switchActiveOrg = (orgId) => {
    if (orgId === activeOrgId) return;
    setActiveOrgId(orgId);
    localStorage.setItem('activeOrgId', orgId);
    fetchDataForOrg(orgId);
    toast({ title: "Switched Organization", description: `You are now working in ${organizations.find(o => o.id === orgId)?.name}.` });
  };

  const handleLogout = async () => {
    await signOut();
    resetAppState();
    navigate('/');
  };

  const overallLoading = authLoading || (isAuthenticated && loadingData);

  if (overallLoading && location.pathname.startsWith('/app')) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background">
            <svg
                className="animate-spin h-10 w-10 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
    );
  }

  return (
    <>
      <PageMeta />
      <ScrollToTop />
      <AppRoutes
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        organizationSettings={organizationSettings}
        allData={allData}
        userProfile={user?.user_metadata}
        organizations={organizations}
        activeOrgId={activeOrgId}
        switchActiveOrg={switchActiveOrg}
        fetchDataForOrg={fetchDataForOrg}
        loadingData={overallLoading}
      />
      <Toaster />
    </>
  );
}

export default App;