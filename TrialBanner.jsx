import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

const TrialBanner = ({ subscription }) => {
  if (!subscription || subscription.status !== 'trialing' || !subscription.trial_ends_at) {
    return null;
  }

  const trialEndDate = parseISO(subscription.trial_ends_at);
  const daysRemaining = differenceInDays(trialEndDate, new Date());

  const getBannerContent = () => {
    if (daysRemaining < 0) {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        title: "Your trial has ended!",
        description: "Please subscribe to continue using Numinote.",
        buttonText: "Subscribe Now",
        variant: "destructive",
      };
    }
    if (daysRemaining <= 7) {
      return {
        icon: <Info className="h-4 w-4" />,
        title: `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`,
        description: "Don't lose access to your data. Choose a plan to continue.",
        buttonText: "Choose a Plan",
        variant: "default",
      };
    }
    return {
      icon: <Info className="h-4 w-4" />,
      title: `You have ${daysRemaining} days left in your trial.`,
      description: "Explore all features and see how Numinote can help your organization.",
      buttonText: "Upgrade Plan",
      variant: "default",
    };
  };

  const { icon, title, description, buttonText, variant } = getBannerContent();

  return (
    <Alert variant={variant} className="rounded-none border-l-0 border-r-0 border-t-0">
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        {description}
        <Button asChild size="sm">
          <Link to="/subscribe?from_trial=true">{buttonText}</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default TrialBanner;