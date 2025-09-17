import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
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
            <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
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

const GdprPage = () => (
  <PolicyPage title="GDPR Compliance" lastUpdated="August 25, 2025">
    <h2>1. Our Commitment to GDPR</h2>
    <p>Numinote is fully committed to complying with the General Data Protection Regulation (GDPR) and ensuring the protection of all personal data we handle. We have a robust and effective data protection program in place which complies with existing law and abides by the data protection principles of lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity, and confidentiality.</p>
    
    <h2>2. Your Role and Our Role</h2>
    <p>When you use Numinote to manage your organization's data, your organization is the <strong>Data Controller</strong>. This means you are responsible for the data you collect and input into our Service. Numinote acts as the <strong>Data Processor</strong> on your behalf. We only process your Customer Data based on your instructions and for the sole purpose of providing and maintaining the Service, as outlined in our <Link to="/terms-of-service">Terms of Service</Link> and a Data Processing Addendum (DPA), available upon request.</p>

    <h2>3. Your Rights Under GDPR</h2>
    <p>If you are in the European Economic Area (EEA), you have certain data protection rights. Numinote aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.</p>
    <ul>
      <li><strong>The right to access, update or delete</strong> the information we have on you. You can access and update your account information directly within your settings.</li>
      <li><strong>The right of rectification.</strong> You have the right to have your information rectified if that information is inaccurate or incomplete.</li>
      <li><strong>The right to object.</strong> You have the right to object to our processing of your Personal Data.</li>
      <li><strong>The right of restriction.</strong> You have the right to request that we restrict the processing of your personal information.</li>
      <li><strong>The right to data portability.</strong> You have the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format.</li>
      <li><strong>The right to withdraw consent.</strong> You also have the right to withdraw your consent at any time where Numinote relied on your consent to process your personal information.</li>
    </ul>
    <p>To exercise any of these rights, please contact our support team via our <Link to="/contact">Contact Page</Link>.</p>
    
    <h2>4. Data Transfers</h2>
    <p>Our Service is hosted by Supabase, which may store data in data centers located outside the EEA. We rely on Supabase's commitment to GDPR and their use of Standard Contractual Clauses (SCCs) as a valid mechanism for transferring data internationally, ensuring your data is protected to the same high standards as it is within the EEA.</p>

    <h2>5. Data Security</h2>
    <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. For more details, see the "Data Security" section of our <Link to="/privacy-policy">Privacy Policy</Link>.</p>
  </PolicyPage>
);

export default GdprPage;