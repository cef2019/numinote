import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const blogPosts = [
  {
    slug: "fundraising-tips-small-nonprofits",
    title: "5 Fundraising Tips for Small Nonprofits",
    category: "Fundraising",
    excerpt: "Discover effective strategies to boost your fundraising efforts, even with a small team and limited resources.",
    content: `
      <p class="mb-4">Fundraising is the lifeblood of any nonprofit, but for smaller organizations, it can feel like an uphill battle. With limited staff and budgets, maximizing every effort is crucial. Here are five actionable tips to help your small nonprofit thrive:</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">1. Diversify Your Funding Sources</h2>
      <p class="mb-4">Don't put all your eggs in one basket. Relying too heavily on a single source of income, whether it's grants, individual donors, or events, can leave your organization vulnerable. Explore a mix of:</p>
      <ul class="list-disc list-inside mb-4">
        <li>Individual giving (online, direct mail, major donors)</li>
        <li>Grants (foundations, government)</li>
        <li>Corporate sponsorships</li>
        <li>Events (virtual or in-person)</li>
        <li>Earned income (if applicable)</li>
      </ul>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">2. Leverage Digital Platforms</h2>
      <p class="mb-4">A strong online presence is non-negotiable. Utilize social media, email marketing, and your website to tell your story, engage supporters, and solicit donations. Tools like online donation forms and peer-to-peer fundraising platforms can significantly expand your reach.</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">3. Cultivate Relationships with Donors</h2>
      <p class="mb-4">Fundraising isn't just about asking for money; it's about building lasting relationships. Thank your donors promptly and genuinely, share impact stories, and invite them to engage with your mission beyond just financial contributions. A loyal donor base is your most valuable asset.</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">4. Tell Your Story Effectively</h2>
      <p class="mb-4">People give to causes that resonate with them emotionally. Craft compelling narratives that highlight the problem you're solving, the impact you're making, and the lives you're changing. Use photos, videos, and testimonials to bring your work to life.</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">5. Collaborate with Other Nonprofits</h2>
      <p class="mb-4">Partnerships can amplify your impact and open new fundraising avenues. Consider joint events, shared grant applications, or collaborative campaigns with organizations that have complementary missions. This can reduce costs and expand your donor pool.</p>
      <p class="mt-4">By implementing these tips, even small nonprofits can build a robust fundraising strategy that supports their vital work in the community.</p>
    `,
    author: "Gai Chol Paul",
    date: "July 20, 2025",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6"
  },
  {
    slug: "importance-financial-transparency",
    title: "The Importance of Financial Transparency",
    category: "Finance",
    excerpt: "Learn why financial transparency is crucial for building trust with donors and how to achieve it.",
    content: `
      <p class="mb-4">Financial transparency is more than just a buzzword in the nonprofit sector; it's a cornerstone of trust and accountability. For organizations relying on public support, demonstrating how funds are used is paramount. Here's why it matters and how to achieve it:</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">Why Transparency is Crucial</h2>
      <ul class="list-disc list-inside mb-4">
        <li><strong>Builds Donor Trust:</strong> Donors want to know their contributions are making a real difference and are being managed responsibly. Transparent reporting fosters confidence and encourages continued support.</li>
        <li><strong>Enhances Credibility:</strong> A financially transparent organization is seen as more credible and reputable, attracting new donors, partners, and volunteers.</li>
        <li><strong>Ensures Accountability:</strong> Transparency holds the organization accountable to its mission, its stakeholders, and the public. It helps prevent misuse of funds and promotes ethical practices.</li>
        <li><strong>Improves Decision-Making:</strong> Clear financial data allows for better internal decision-making, enabling the organization to allocate resources effectively and identify areas for improvement.</li>
        <li><strong>Meets Regulatory Requirements:</strong> Many jurisdictions have specific reporting requirements for nonprofits. Transparency ensures compliance and avoids legal issues.</li>
      </ul>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">How to Achieve Financial Transparency</h2>
      <p class="mb-4">Implementing transparency requires a commitment to open communication and clear reporting:</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">1. Publish Annual Reports</h3>
      <p class="mb-4">Make your annual financial statements, including income statements, balance sheets, and cash flow statements, easily accessible on your website. Consider creating a simplified, donor-friendly version that highlights key achievements and financial summaries.</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">2. Use Clear and Understandable Language</h3>
      <p class="mb-4">Avoid jargon. Present financial information in a way that is easy for a non-expert to understand. Use charts, graphs, and infographics to visualize data.</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">3. Detail Program Expenses</h3>
      <p class="mb-4">Break down your expenses by program, administrative costs, and fundraising. This shows donors exactly how their money is being spent on your mission versus overhead.</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">4. Be Responsive to Inquiries</h3>
      <p class="mb-4">Encourage questions from donors and the public, and respond promptly and thoroughly. This demonstrates a genuine commitment to openness.</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">5. Utilize Third-Party Evaluators</h3>
      <p class="mb-4">Consider getting rated by independent charity evaluators like Charity Navigator or GuideStar. These platforms provide objective assessments of your financial health and accountability.</p>
      <p class="mt-4">By embracing financial transparency, nonprofits can build stronger relationships with their supporters and ensure long-term sustainability for their vital work.</p>
    `,
    author: "Gai Chol Paul",
    date: "July 15, 2025",
    image: "https://images.unsplash.com/photo-1554224155-1696413565d3"
  },
  {
    slug: "how-to-write-winning-grant-proposal",
    title: "How to Write a Winning Grant Proposal",
    category: "Grants",
    excerpt: "A step-by-step guide to crafting compelling grant proposals that get funded.",
    content: `
      <p class="mb-4">Securing grants can be a game-changer for nonprofits, providing crucial funding for programs and operations. However, writing a winning grant proposal is an art and a science. Follow this step-by-step guide to increase your chances of success:</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">1. Research and Identify Potential Funders</h2>
      <p class="mb-4">Don't waste time applying for grants that aren't a good fit. Thoroughly research foundations and organizations whose mission and funding priorities align with your project. Look at their past grantees and funding amounts.</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">2. Understand the Funder's Guidelines</h2>
      <p class="mb-4">Every funder has specific requirements. Read the Request for Proposal (RFP) or guidelines meticulously. Pay attention to:</p>
      <ul class="list-disc list-inside mb-4">
        <li>Eligibility criteria</li>
        <li>Application format and length</li>
        <li>Required attachments (budgets, resumes, letters of support)</li>
        <li>Submission deadlines and methods</li>
      </ul>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">3. Craft a Compelling Narrative</h2>
      <p class="mb-4">Your proposal should tell a clear, concise, and persuasive story. Typically, a grant proposal includes:</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Executive Summary</h3>
      <p class="mb-4">A brief overview of your entire proposal, highlighting your organization, the problem, your solution, and the requested funding. Write this last!</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Statement of Need</h3>
      <p class="mb-4">Clearly articulate the problem you're addressing, supported by data and statistics. Explain why this issue is important and how it impacts the community you serve.</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Project Description</h3>
      <p class="mb-4">Detail your proposed solution. Describe your goals, objectives (SMART: Specific, Measurable, Achievable, Relevant, Time-bound), activities, and timeline. Explain how your project will address the identified need.</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Organizational Capacity</h3>
      <p class="mb-4">Showcase your organization's ability to successfully execute the project. Highlight your mission, history, key staff, and past achievements relevant to the proposal.</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Evaluation Plan</h3>
      <p class="mb-4">Explain how you will measure the success of your project. What metrics will you use? How will you collect data? This demonstrates accountability and impact.</p>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Budget</h3>
      <p class="mb-4">Provide a detailed and realistic budget that aligns with your project activities. Justify each expense and show how the requested funds will be used efficiently.</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">4. Review and Refine</h2>
      <p class="mb-4">Proofread meticulously for grammar, spelling, and clarity. Ensure all guidelines have been met. Have someone else review it for fresh eyes. A polished proposal reflects professionalism.</p>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">5. Submit and Follow Up</h2>
      <p class="mb-4">Submit your proposal well before the deadline. If appropriate, follow up with the funder as per their instructions, but avoid excessive contact.</p>
      <p class="mt-4">Grant writing is a continuous learning process. With practice and persistence, you can master the art of crafting winning proposals that secure the funding your nonprofit needs.</p>
    `,
    author: "Gai Chol Paul",
    date: "July 10, 2025",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
  },
];

const BlogPostCard = ({ post, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
  >
    <img  class="w-full h-56 object-cover" alt={post.title} src={post.image} />
    <div className="p-6 flex-grow flex flex-col">
      <p className="text-primary font-semibold text-sm">{post.category}</p>
      <h3 className="mt-2 text-xl font-bold text-gray-800 flex-grow">{post.title}</h3>
      <p className="mt-2 text-gray-600">{post.excerpt}</p>
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{post.author}</p>
          <p className="text-sm text-gray-500">{post.date}</p>
        </div>
        <Link to={`/blog/${post.slug}`} className="text-primary hover:text-primary-dark font-semibold flex items-center">
          Read More <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Blog | Numinote</title>
        <meta name="description" content="Insights, tips, and resources for nonprofits from the team at Numinote." />
        <meta property="og:title" content="Blog | Numinote" />
        <meta property="og:description" content="Insights, tips, and resources for nonprofits from the team at Numinote." />
      </Helmet>
      <div className="bg-gray-50">
        <div className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-base font-semibold text-primary uppercase tracking-wide">Numinote Blog</p>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Insights for Impact
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                Your source for expert advice, industry trends, and best practices for nonprofit management.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <BlogPostCard key={post.title} post={post} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;