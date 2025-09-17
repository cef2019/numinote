import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const forumTopics = [
  { title: 'Fundraising Strategies', description: 'Share tips and ask questions about raising money.', posts: 128, lastPost: '2 hours ago' },
  { title: 'Grant Writing', description: 'Discussions on finding and applying for grants.', posts: 97, lastPost: '5 hours ago' },
  { title: 'Volunteer Management', description: 'Best practices for recruiting and managing volunteers.', posts: 215, lastPost: '1 day ago' },
  { title: 'Nonprofit Accounting', description: 'All about bookkeeping, compliance, and financial reporting.', posts: 153, lastPost: '3 days ago' },
];

const CommunityForumsPage = () => {
  return (
    <>
      <Helmet>
        <title>Community Forums | Numinote</title>
        <meta name="description" content="Join the discussion in the Numinote Community Forums. Ask questions, share knowledge, and connect with peers." />
      </Helmet>
      <div className="bg-gray-50/50 min-h-screen">
        <div className="pt-20 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-white to-gray-50/50">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Community Forums
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              A place to ask questions, share knowledge, and connect with other nonprofit leaders.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input placeholder="Search topics..." className="pl-10" />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Start New Topic
            </Button>
          </div>

          <div className="space-y-4">
            {forumTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>
                      <Link to="#" className="hover:underline">{topic.title}</Link>
                    </CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="text-sm text-muted-foreground justify-between">
                    <span>{topic.posts} posts</span>
                    <span>Last post: {topic.lastPost}</span>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityForumsPage;