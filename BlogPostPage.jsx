import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from './BlogPage'; // Import the blogPosts array

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Article Not Found | Numinote</title>
          <meta name="description" content="The blog article you are looking for could not be found." />
          <meta property="og:title" content="Article Not Found | Numinote" />
          <meta property="og:description" content="The blog article you are looking for could not be found." />
        </Helmet>
        <div className="bg-gray-50 py-20 sm:py-32 min-h-screen flex items-center justify-center">
          <div className="max-w-xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
            >
              Article Not Found
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg text-gray-600"
            >
              Oops! It seems the article you're looking for doesn't exist or has been moved.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6"
            >
              <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary-dark font-medium">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Numinote Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | Numinote Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
      </Helmet>
      <div className="bg-gray-50 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img class="w-full h-80 object-cover" alt={post.title} src={post.image} />
            <div className="p-8 sm:p-10">
              <p className="text-primary font-semibold text-sm uppercase">{post.category}</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {post.title}
              </h1>
              <div className="mt-4 text-gray-600 text-sm">
                By <span className="font-medium text-gray-900">{post.author}</span> on {post.date}
              </div>
              <div className="mt-8 prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              <div className="mt-10 pt-6 border-t border-gray-200">
                <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary-dark font-medium">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;