import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TrialBanner from '@/components/TrialBanner';
import { supabase } from '@/lib/customSupabaseClient';
import { useQuery } from '@/hooks/useQuery';

const AppLayout = (props) => {
  const {
    onLogout,
    userProfile,
    organizations,
    activeOrgId,
    switchActiveOrg,
    organizationSettings,
    loadingData,
    fetchDataForOrg,
    ...rest
  } = props;

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery(
    () => supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', activeOrgId)
      .in('status', ['trialing', 'active'])
      .maybeSingle(),
    [activeOrgId],
    { enabled: !!activeOrgId }
  );

  const location = useLocation();
  const isSubscribePage = location.pathname === '/subscribe';

  if (!loadingData && !isSubscriptionLoading && !subscription && !isSubscribePage) {
    if (organizations && organizations.length > 0) { // Only redirect if we know there are orgs
      return <Navigate to="/subscribe" state={{ from: location }} replace />;
    }
  }


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userProfile={userProfile}
          onLogout={onLogout}
          organizations={organizations}
          activeOrgId={activeOrgId}
          switchActiveOrg={switchActiveOrg}
          organizationSettings={organizationSettings}
          onMenuClick={() => setSidebarOpen(true)}
          allData={rest.allData}
          fetchDataForOrg={fetchDataForOrg}
        />
        <TrialBanner subscription={subscription} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet context={{ ...rest, ...rest.allData, organizationSettings, activeOrgId, fetchDataForOrg }} />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;