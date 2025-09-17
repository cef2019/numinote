import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const communitySections = [
  {
    icon: MessageSquare,
    title: 'Community Forums',
    description: "Ask questions, share your best practices, and connect with other nonprofit professionals. Our forums are the perfect place to learn and collaborate.",
    linkText: 'Visit Forums',
    href: '/community/forums',
  },
  {
    icon: Calendar,
    title: 'Upcoming Events',
    description: 'Join our webinars, workshops, and user meetups. Learn from experts and network with peers in the nonprofit sector.',
    linkText: 'View Events Calendar',
    href: '/community/events',
  },
  {
    icon: Award,
    title: 'Success Stories',
    description: 'Read inspiring stories from organizations just like yours who are using Numinote to amplify their impact. See what’s possible.',
    linkText: 'Read Stories',
    href: '/community/success-stories',
  },
];

const CommunityPage = () => {
  return (
    <>
      <Helmet>
        <title>Community | Numinote</title>
        <meta name="description" content="Join the Numinote community. Connect with other nonprofit leaders, share insights, and learn from your peers." />
      </Helmet>
      <div className="bg-gray-50/50">
        <div className="pt-20 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-white to-gray-50/50 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Users className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                    Welcome to the Numinote Community
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    Connect, learn, and grow with a network of passionate nonprofit professionals.
                </p>
            </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {communitySections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <section.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{section.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col">
                                <p className="text-gray-600 flex-grow">{section.description}</p>
                                <Button asChild variant="outline" className="mt-6 w-full">
                                    <Link to={section.href}>{section.linkText}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-24 text-center bg-white p-12 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900">Ready to Join the Conversation?</h3>
                <p className="mt-2 text-lg text-gray-600">Create your free account to start connecting with peers today.</p>
                <Button asChild size="lg" className="mt-6">
                    <Link to="/signup">Get Started Now</Link>
                </Button>
            </div>
        </div>
      </div>
    </>
  );
};

export default CommunityPage;