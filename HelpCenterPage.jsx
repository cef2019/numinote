import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, Search, ChevronDown, Book, Settings, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const faqCategories = [
  {
    name: 'Getting Started',
    icon: Book,
    questions: [
      { q: 'How do I create my first organization?', a: 'After signing up, you will be prompted to create an organization. Just enter your organization\'s name, and we\'ll set up your workspace.' },
      { q: 'How do I invite team members?', a: 'Go to Settings > Users & Roles, and click "Invite User". You can assign them a role and specific permissions upon invitation.' },
      { q: 'Can I switch between multiple organizations?', a: 'Yes! If you are a member of multiple organizations, you can switch between them using the organization switcher in the top left of the sidebar.' },
    ],
  },
  {
    name: 'Accounting & Finance',
    icon: Briefcase,
    questions: [
      { q: 'What is a Chart of Accounts?', a: 'The Chart of Accounts is a list of all financial accounts in your general ledger. Numinote provides a default list, but you can customize it to fit your needs.' },
      { q: 'How do I create an invoice?', a: 'Navigate to Finance > Invoices and click "New Invoice". Fill in the customer details, line items, and payment information.' },
      { q: 'Can I track restricted funds?', a: 'Yes, our Fund Accounting module is designed for this. Create funds in the Funds section and link them to specific donations or transactions.' },
    ],
  },
  {
    name: 'Project Management',
    icon: Briefcase,
    questions: [
      { q: 'How do I create a new project?', a: 'Go to the Projects section and click "New Project". You can define the project name, budget, timeline, and assign a manager.' },
      { q: 'Can I assign tasks to team members?', a: 'Yes. Within a project, you can create tasks and assign them to specific team members, set due dates, and track their status.' },
    ],
  },
  {
    name: 'Account & Billing',
    icon: Settings,
    questions: [
      { q: 'How do I update my profile information?', a: 'Go to Settings > Profile to update your name, email, and password.' },
      { q: 'Where can I see my current subscription plan?', a: 'Your current plan and billing details are available under Settings > Billing.' },
    ],
  },
];

const FaqItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b">
            <button
                className="w-full flex justify-between items-center py-4 text-left text-gray-800 hover:text-primary transition-colors"
                onClick={onClick}
            >
                <span className="font-medium">{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-5 w-5" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-gray-600">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const HelpCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openQuestion, setOpenQuestion] = useState(null);

  const handleQuestionToggle = (categoryName, questionIndex) => {
    const questionId = `${categoryName}-${questionIndex}`;
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <>
      <Helmet>
        <title>Help Center | Numinote</title>
        <meta name="description" content="Find answers to frequently asked questions and get support from our team. Your guide to mastering Numinote." />
      </Helmet>
      <div className="bg-gray-50/50">
        <div className="pt-20 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <LifeBuoy className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Numinote Help Center
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Welcome! How can we help you today?
              </p>
              <div className="mt-8 max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search for articles..."
                    className="w-full pl-12 pr-4 py-3 h-12 text-base rounded-full shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {filteredCategories.length > 0 ? (
                <div className="space-y-12">
                {filteredCategories.map((category) => (
                    <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center mb-6">
                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                                <category.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                        </div>
                        <div className="space-y-2">
                        {category.questions.map((faq, index) => (
                            <FaqItem
                                key={faq.q}
                                question={faq.q}
                                answer={faq.a}
                                isOpen={openQuestion === `${category.name}-${index}`}
                                onClick={() => handleQuestionToggle(category.name, index)}
                            />
                        ))}
                        </div>
                    </motion.div>
                ))}
                </div>
            ) : (
                <div className="col-span-full text-center py-12">
                    <p className="text-lg text-gray-600">No results found for "{searchTerm}".</p>
                    <p className="text-gray-500 mt-2">Try searching for another keyword or check our categories.</p>
                </div>
            )}

            <div className="mt-24 text-center bg-white p-12 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900">Can't find what you're looking for?</h3>
                <p className="mt-2 text-lg text-gray-600">Our support team is here to help. Reach out to us anytime.</p>
                <Button asChild size="lg" className="mt-6">
                    <Link to="/contact">Contact Support</Link>
                </Button>
            </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenterPage;