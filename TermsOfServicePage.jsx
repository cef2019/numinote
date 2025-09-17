import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const PolicyPage = ({ title, lastUpdated, children }) => (
  <>
    <Helmet>
      <title>{title} | Numinote</title>
      <meta name="description" content={`Read the ${title} for Numinote, effective ${lastUpdated}.`} />
    </Helmet>
    <div className="bg-white py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <FileText className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-500">Last updated and effective: {lastUpdated}</p>
          </div>
          <div className="prose prose-lg max-w-none prose-a:text-primary hover:prose-a:underline">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  </>
);

const TermsOfServicePage = () => (
  <PolicyPage title="Terms of Service" lastUpdated="August 25, 2025">
    <h2>1. Agreement to Terms</h2>
    <p>By accessing or using our Service, you agree to be bound by these Terms of Service ("Terms") and our <Link to="/privacy-policy">Privacy Policy</Link>. If you are using the Service on behalf of an organization, you are agreeing to these Terms for that organization and promising that you have the authority to bind that organization to these terms. In that case, "you" and "your" will refer to that organization. If you do not agree to these terms, do not use the Service.</p>
    
    <h2>2. Description of Service</h2>
    <p>Numinote provides a comprehensive software-as-a-service platform designed for nonprofit organizations, which includes tools for accounting, financial management, project management, and more (the "Service"). We reserve the right to modify or discontinue the Service at any time.</p>

    <h2>3. Your Account and Responsibilities</h2>
    <p>You are responsible for safeguarding your account and for any activities or actions under your account. You must provide us with accurate, complete, and current registration information. You agree not to disclose your password to any third party. You are solely responsible for all data, information, and content ("Customer Data") that you upload, post, or otherwise transmit via the Service. We are not liable for any loss or damage arising from your failure to comply with this security obligation.</p>

    <h2>4. Subscriptions and Payment</h2>
    <p>The Service may be available under different subscription plans. Fees for each plan are posted on our <Link to="/pricing">Pricing Page</Link>. By subscribing, you agree to pay all applicable fees. Payments are billed in advance on a recurring basis and are non-refundable, except as required by law or as specified in your subscription plan.</p>

    <h2>5. Intellectual Property</h2>
    <p>We own and retain all rights, title, and interest in and to the Service and all underlying technology, software, and content, including all related intellectual property rights. You own your Customer Data. We do not claim any ownership rights in your Customer Data. You grant us a worldwide, non-exclusive, limited-term license to access, use, process, and display Customer Data as reasonably necessary to provide and maintain the Service.</p>

    <h2>6. Acceptable Use</h2>
    <p>You agree not to use the Service to: (a) violate any local, state, national, or international law; (b) harass, abuse, or harm another person; (c) impersonate any person or entity; or (d) engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service. We reserve the right to terminate your access for violating these rules.</p>

    <h2>7. Termination</h2>
    <p>We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. You may cancel your account at any time. Upon termination, your right to use the Service will immediately cease, and we may delete your Customer Data.</p>

    <h2>8. Disclaimer of Warranties</h2>
    <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
    
    <h2>9. Limitation of Liability</h2>
    <p>IN NO EVENT SHALL NUMINOTE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.</p>

    <h2>10. Changes to Terms</h2>
    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
  </PolicyPage>
);

export default TermsOfServicePage;