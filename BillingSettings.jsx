import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@/hooks/useQuery';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Zap, ArrowRight, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import SubscriptionManager from '@/components/SubscriptionManager';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const plansMeta = {
  starter: { name: 'Starter', price: '$39/mo' },
  growth: { name: 'Growth', price: '$49/mo' },
  scale: { name: 'Scale', price: '$99/mo' },
  trial: { name: 'Trial' }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const InvoiceHistory = ({ onManage }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>View and download your past invoices.</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4">Your invoice history will appear here.</p>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" onClick={onManage}>
                    View All Invoices
                 </Button>
            </CardFooter>
        </Card>
    );
};


export default function BillingSettings() {
  const { activeOrgId, fetchDataForOrg } = useOutletContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isManaging, setIsManaging] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  const fetchSubscription = useCallback(() => {
    if (!activeOrgId) return Promise.resolve({ data: null, error: null });
    return supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', activeOrgId)
      .in('status', ['trialing', 'active', 'past_due', 'incomplete'])
      .maybeSingle();
  }, [activeOrgId]);

  const { 
    data: subscription, 
    isLoading: isSubscriptionLoading, 
    error: subscriptionError,
    refetch: refetchSubscription 
  } = useQuery(fetchSubscription, [activeOrgId], { enabled: !!activeOrgId });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('subscription_updated') === 'true') {
      toast({
        title: "Subscription Updated!",
        description: "Your plan details have been successfully updated.",
        variant: 'success'
      });
      refetchSubscription();
      navigate(location.pathname, { replace: true });
    }
  }, [refetchSubscription, toast, navigate, location.search, location.pathname]);

  const currentPlanMeta = useMemo(() => subscription?.plan_id ? plansMeta[subscription.plan_id] : null, [subscription]);

  const trialDaysRemaining = useMemo(() => {
      if (subscription?.status !== 'trialing' || !subscription.trial_ends_at) return 0;
      const ends = new Date(subscription.trial_ends_at).getTime();
      const now = new Date().getTime();
      return Math.max(0, Math.ceil((ends - now) / (1000 * 60 * 60 * 24)));
  }, [subscription]);
  const trialProgress = useMemo(() => (14 - trialDaysRemaining) / 14 * 100, [trialDaysRemaining]);

  const handleManageBilling = async () => {
    setIsManaging(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-customer-portal-session', {
        body: { organizationId: activeOrgId },
      });
      if (error) throw error;
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Could not retrieve billing portal URL.");
      }
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not load billing portal. Please try again.',
      });
    } finally {
      setIsManaging(false);
    }
  };
  
  const onPlanChanged = () => {
    refetchSubscription();
    if(fetchDataForOrg) fetchDataForOrg(activeOrgId);
    toast({
        title: "Redirecting to checkout...",
        description: "You'll be sent to Stripe to complete your subscription.",
    });
  }

  const handleTogglePlanSelector = () => {
    setShowPlanSelector(prev => !prev);
  };
  
  if (isSubscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading billing information...</p>
      </div>
    );
  }

  if (subscriptionError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Error Loading Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/90">An unexpected error occurred. Please try refreshing the page.</p>
          <p className="text-xs text-destructive/70 mt-2">Details: {subscriptionError.message}</p>
        </CardContent>
      </Card>
    );
  }

  const renderSubscriptionCard = () => {
      if (!subscription) {
          return (
              <Card className="bg-gradient-to-br from-background to-muted/30">
                  <CardHeader>
                      <CardTitle>No Active Subscription</CardTitle>
                      <CardDescription>Choose a plan to unlock Numinote's full potential.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-10">
                      <p className="text-muted-foreground mb-4">You are not subscribed to any plan.</p>
                      <Button onClick={handleTogglePlanSelector} size="lg" className="shadow-lg">
                          <Zap className="mr-2 h-5 w-5" />
                          Choose a Plan
                      </Button>
                  </CardContent>
              </Card>
          );
      }
      
      const isTrial = subscription.status === 'trialing';
      const isPastDue = subscription.status === 'past_due' || subscription.status === 'incomplete';
      
      return (
        <Card className="overflow-hidden">
            {isPastDue && (
                 <div className="bg-destructive/10 border-b border-destructive/20 p-4 text-destructive flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5" />
                    <div className="text-sm font-semibold">
                        <p>Your payment is past due. Please update your payment information to restore access.</p>
                    </div>
                 </div>
            )}
            <CardHeader className="bg-muted/50">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-3">
                            <CheckCircle className={cn("w-6 h-6", subscription.status === 'active' ? 'text-green-500' : 'text-blue-500')} />
                            Your Current Plan
                        </CardTitle>
                        <CardDescription>Manage your subscription and billing details.</CardDescription>
                    </div>
                    <Badge variant={isTrial ? 'secondary' : (isPastDue ? 'destructive' : 'default')} className="capitalize text-sm">{subscription.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{currentPlanMeta?.name || 'Unknown Plan'}</h3>
                    <p className="text-3xl font-bold">{currentPlanMeta?.price || '--'}</p>
                    <div className="text-sm text-muted-foreground">
                        {isTrial ? `Trial ends on ${formatDate(subscription.trial_ends_at)}`
                                 : `Next bill on ${formatDate(subscription.current_period_end)} for your ${subscription.plan_interval}ly plan.`}
                    </div>
                    <Button onClick={handleManageBilling} disabled={isManaging} className="w-full md:w-auto">
                        {isManaging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Manage Subscription
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {isTrial && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Trial Status</h3>
                        <Progress value={trialProgress} className="h-2" />
                        <p className="text-sm font-medium text-muted-foreground">{trialDaysRemaining} days left</p>
                        <Button onClick={handleTogglePlanSelector} size="sm" className="w-full md:w-auto shadow-lg">
                            <Zap className="mr-2 h-4 w-4" />
                            Upgrade to a paid plan
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
      );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing &amp; Subscription</h1>
        <p className="text-muted-foreground">View your plan details, manage billing, and see invoices.</p>
      </div>
      
      {renderSubscriptionCard()}

      <AnimatePresence>
        {showPlanSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="mt-8">
              <CardHeader>
                  <CardTitle>Change Your Plan</CardTitle>
                  <CardDescription>Select the plan that best fits your organization's needs.</CardDescription>
              </CardHeader>
              <CardContent>
                  <SubscriptionManager 
                    activeOrgId={activeOrgId} 
                    user={user}
                    currentPlan={subscription?.plan_id}
                    onPlanChange={onPlanChanged}
                  />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InvoiceHistory onManage={handleManageBilling} />
        {/* Placeholder for future usage card */}
        <Card>
            <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>Your current usage stats.</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-8">
                 <p>Usage details will be displayed here in a future update.</p>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}