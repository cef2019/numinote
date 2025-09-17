import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useOutletContext, Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import SubscriptionManager from '@/components/SubscriptionManager';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function SubscribePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { organizationSettings, activeOrgId, loadingData } = useOutletContext() || {};
  const { user } = useAuth();
  const fromTrial = new URLSearchParams(location.search).get('from_trial') === 'true';

  // 🔒 Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  if (!user) {
    return null; // prevent flicker while redirecting
  }

  return (
    <>
      <SEO
        title="Subscribe to Numinote"
        description="Choose a plan that fits your nonprofit's needs and unlock powerful features to streamline your operations."
      />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-block">
              <img className="h-10 w-auto mx-auto" alt="Numinote Logo" src="/logo.svg" />
            </Link>
            <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
              {fromTrial ? "Your Trial Has Ended" : "Choose Your Plan"}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {fromTrial 
                ? "Please choose a plan to continue using Numinote and keep your mission moving forward."
                : "Unlock powerful features to manage your finances, projects, and people."
              }
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <SubscriptionManager 
              organizationSettings={organizationSettings} 
              activeOrgId={activeOrgId} 
              loadingData={loadingData}
              user={user}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}