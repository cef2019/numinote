import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import AppLayout from '@/components/AppLayout';
import PublicLayout from '@/components/PublicLayout';

const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const ChartOfAccounts = lazy(() => import('@/pages/ChartOfAccounts'));
const Funds = lazy(() => import('@/pages/Funds'));
const Reports = lazy(() => import('@/pages/Reports'));
const Settings = lazy(() => import('@/pages/Settings'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));
const SubscribePage = lazy(() => import('@/pages/auth/SubscribePage'));
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const FeaturesPage = lazy(() => import('@/pages/public/FeaturesPage'));
const PricingPage = lazy(() => import('@/pages/public/PricingPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/public/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/public/TermsOfServicePage'));
const CookiePolicyPage = lazy(() => import('@/pages/public/CookiePolicyPage'));
const GdprPage = lazy(() => import('@/pages/public/GdprPage'));
const HelpCenterPage = lazy(() => import('@/pages/public/HelpCenterPage'));
const DocumentationPage = lazy(() => import('@/pages/public/DocumentationPage'));
const CommunityPage = lazy(() => import('@/pages/public/CommunityPage'));
const CommunityForumsPage = lazy(() => import('@/pages/public/CommunityForumsPage'));
const EventsPage = lazy(() => import('@/pages/public/EventsPage'));
const SuccessStoriesPage = lazy(() => import('@/pages/public/SuccessStoriesPage'));
const BlogPage = lazy(() => import('@/pages/public/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/public/BlogPostPage'));
const CareersPage = lazy(() => import('@/pages/public/CareersPage'));
const RoadmapPage = lazy(() => import('@/pages/public/RoadmapPage'));
const TemplatesPage = lazy(() => import('@/pages/public/TemplatesPage'));
const ChangelogPage = lazy(() => import('@/pages/public/ChangelogPage'));

const Invoices = lazy(() => import('@/pages/finance/Invoices'));
const Bills = lazy(() => import('@/pages/finance/Bills'));
const Donations = lazy(() => import('@/pages/finance/Donations'));
const Budgeting = lazy(() => import('@/pages/finance/Budgeting'));
const JournalEntries = lazy(() => import('@/pages/finance/JournalEntries'));
const BankReconciliation = lazy(() => import('@/pages/finance/BankReconciliation'));

const Projects = lazy(() => import('@/pages/projects/Projects'));
const ProjectOverview = lazy(() => import('@/pages/projects/ProjectOverview'));
const ProjectListPage = lazy(() => import('@/pages/projects/ProjectListPage'));
const Tasks = lazy(() => import('@/pages/projects/Tasks'));
const Gantt = lazy(() => import('@/pages/projects/Gantt'));

const Employees = lazy(() => import('@/pages/hr/Employees'));
const Payroll = lazy(() => import('@/pages/hr/Payroll'));

const PurchaseRequests = lazy(() => import('@/pages/supply-chain/PurchaseRequests'));
const PurchaseOrders = lazy(() => import('@/pages/supply-chain/PurchaseOrders'));
const Inventory = lazy(() => import('@/pages/supply-chain/Inventory'));

const ProfileSettings = lazy(() => import('@/pages/settings/ProfileSettings'));
const OrganizationSettings = lazy(() => import('@/pages/settings/OrganizationSettings'));
const UsersAndRolesSettings = lazy(() => import('@/pages/settings/UsersAndRolesSettings'));
const BillingSettings = lazy(() => import('@/pages/settings/BillingSettings'));
const SalesSettings = lazy(() => import('@/pages/settings/SalesSettings'));
const ExpensesSettings = lazy(() => import('@/pages/settings/ExpensesSettings'));
const AdvancedSettings = lazy(() => import('@/pages/settings/AdvancedSettings'));

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = (props) => {
  const { isAuthenticated, ...rest } = props;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<PublicLayout><Outlet {...rest} /></PublicLayout>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/gdpr" element={<GdprPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/forums" element={<CommunityForumsPage />} />
          <Route path="/community/events" element={<EventsPage />} />
          <Route path="/community/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/subscribe" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SubscribePage {...rest} />
          </ProtectedRoute>
        } />

        <Route
          path="/app"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AppLayout {...rest} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard {...rest} />} />
          <Route path="transactions" element={<Transactions {...rest} />} />
          <Route path="accounts" element={<ChartOfAccounts {...rest} />} />
          <Route path="funds" element={<Funds {...rest} />} />
          <Route path="reports" element={<Reports {...rest} />} />
          
          <Route path="finance/invoices" element={<Invoices {...rest} />} />
          <Route path="finance/bills" element={<Bills {...rest} />} />
          <Route path="finance/donations" element={<Donations {...rest} />} />
          <Route path="finance/budgeting" element={<Budgeting {...rest} />} />
          <Route path="finance/journal-entries" element={<JournalEntries {...rest} />} />
          <Route path="finance/reconciliation" element={<BankReconciliation {...rest} />} />

          <Route path="projects" element={<Projects {...rest} />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ProjectListPage {...rest} />} />
            <Route path="tasks" element={<Tasks {...rest} />} />
            <Route path="gantt" element={<Gantt {...rest} />} />
            <Route path=":projectId" element={<ProjectOverview {...rest} />} />
          </Route>

          <Route path="hr/employees" element={<Employees {...rest} />} />
          <Route path="hr/payroll" element={<Payroll {...rest} />} />

          <Route path="supply-chain/purchase-requests" element={<PurchaseRequests {...rest} />} />
          <Route path="supply-chain/purchase-orders" element={<PurchaseOrders {...rest} />} />
          <Route path="supply-chain/inventory" element={<Inventory {...rest} />} />

          <Route path="settings" element={<Settings {...rest} />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileSettings {...rest} />} />
            <Route path="organization" element={<OrganizationSettings {...rest} />} />
            <Route path="users" element={<UsersAndRolesSettings {...rest} />} />
            <Route path="billing" element={<BillingSettings {...rest} />} />
            <Route path="sales" element={<SalesSettings {...rest} />} />
            <Route path="expenses" element={<ExpensesSettings {...rest} />} />
            <Route path="advanced" element={<AdvancedSettings {...rest} />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/app" : "/"} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;