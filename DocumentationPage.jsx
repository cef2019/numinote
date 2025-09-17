import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const sections = [
  { name: 'Introduction', icon: BookOpen },
  { name: 'Core Concepts', icon: FileText },
  { name: 'API Reference', icon: Code },
];

const documentationContent = {
  introduction: {
    title: 'Welcome to the Numinote Documentation',
    content: "This documentation provides a comprehensive guide to using Numinote's features. Whether you are a new user or an experienced administrator, you'll find the information you need to make the most of our platform.",
  },
  coreConcepts: {
    title: 'Core Concepts',
    content: "Understand the fundamentals of Numinote, including Fund Accounting, Project Management, and our double-entry bookkeeping system. These concepts are key to leveraging the full power of the application.",
  },
  apiReference: {
    title: 'API Reference',
    content: "For developers, our API reference provides all the information needed to integrate your own applications with Numinote. Explore endpoints, request/response formats, and authentication methods. (Note: API access is available on select plans).",
  },
};

const DocumentationPage = () => {
  return (
    <>
      <Helmet>
        <title>Documentation | Numinote</title>
        <meta name="description" content="Explore the official Numinote documentation. Find in-depth guides, API references, and tutorials to help you master our platform." />
      </Helmet>
      <div className="flex min-h-screen bg-gray-50/50">
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 pt-28 p-4">
          <nav>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Documentation</p>
            <ul>
              {sections.map(section => (
                <li key={section.name}>
                  <a href={`#${section.name.toLowerCase().replace(' ', '-')}`} className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                    <section.icon className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{section.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.section 
              id="introduction" 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">{documentationContent.introduction.title}</h1>
              <p className="text-lg text-gray-600">{documentationContent.introduction.content}</p>
            </motion.section>

            <motion.section 
              id="core-concepts" 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-6">{documentationContent.coreConcepts.title}</h2>
              <p className="text-lg text-gray-600">{documentationContent.coreConcepts.content}</p>
            </motion.section>

            <motion.section 
              id="api-reference"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-6">{documentationContent.apiReference.title}</h2>
              <p className="text-lg text-gray-600">{documentationContent.apiReference.content}</p>
            </motion.section>
            
            <div className="mt-24 text-center bg-white p-12 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900">Ready to Dive In?</h3>
              <p className="mt-2 text-lg text-gray-600">Start managing your nonprofit with clarity and confidence.</p>
              <Link to="/signup">
                <Button size="lg" className="mt-6">Get Started for Free</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DocumentationPage;