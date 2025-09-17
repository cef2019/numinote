import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Award, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const stories = [
  {
    orgName: 'Hope Foundation',
    title: 'Streamlining Operations to Focus on Community',
    category: 'Community Outreach',
    imgPlaceholder: 'Volunteers planting trees in a park',
    impact: 'Reduced administrative time by 40%, allowing for 2 new community programs.',
  },
  {
    orgName: 'Art for All Initiative',
    title: 'Gaining Financial Clarity to Expand Reach',
    category: 'Arts & Culture',
    imgPlaceholder: 'Children painting at an art workshop',
    impact: 'Secured a 25% increase in grant funding with transparent financial reports.',
  },
  {
    orgName: 'Global Health Partners',
    title: 'Managing Complex Projects Across Continents',
    category: 'International Aid',
    imgPlaceholder: 'Medical professionals working in a remote village',
    impact: 'Improved project budget tracking, leading to a 15% cost savings on major projects.',
  },
];

const SuccessStoriesPage = () => {
  return (
    <>
      <Helmet>
        <title>Success Stories | Numinote</title>
        <meta name="description" content="Read inspiring stories from nonprofits using Numinote to make a bigger impact." />
      </Helmet>
      <div className="bg-gray-50/50 min-h-screen">
        <div className="pt-20 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-white to-gray-50/50 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Award className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Customer Success Stories
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Discover how organizations like yours are achieving their missions with Numinote.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img  className="object-cover" alt={story.imgPlaceholder} src="https://images.unsplash.com/photo-1626447857058-2ba6a8868cb5" />
                  </div>
                  <CardHeader>
                    <p className="text-sm font-semibold text-primary">{story.category}</p>
                    <CardTitle>{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <blockquote className="border-l-2 border-primary pl-4 italic text-gray-600">
                      "{story.impact}"
                    </blockquote>
                    <p className="mt-4 font-semibold text-gray-800">- {story.orgName}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Read Full Story</Button>
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

export default SuccessStoriesPage;