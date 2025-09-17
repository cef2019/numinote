import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Briefcase, Heart, Lightbulb, Users, Package, DollarSign, Activity, BrainCircuit, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';

const jobOpenings = [
  {
    title: "Senior Frontend Engineer (React)",
    department: "Engineering",
    location: "Remote",
    description: "Build beautiful, responsive, and intuitive user interfaces that empower nonprofits to manage their operations effectively. You'll work with React, TailwindCSS, and Framer Motion to bring our product vision to life."
  },
  {
    title: "Customer Success Manager",
    department: "Customer Support",
    location: "Remote",
    description: "Be the voice of our customers. You will onboard new organizations, provide exceptional support, and gather feedback to help shape the future of Numinote. A passion for helping others succeed is a must."
  },
  {
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote",
    description: "Tell the Numinote story to the world. You will be responsible for product positioning, go-to-market strategies, and creating compelling content that resonates with the nonprofit sector."
  },
  {
    title: "Backend Engineer (Supabase/PostgreSQL)",
    department: "Engineering",
    location: "Remote",
    description: "Design and maintain the scalable, secure, and reliable backend infrastructure that powers Numinote. Deep experience with Supabase, PostgreSQL, and serverless functions is essential."
  }
];

const benefits = [
  { icon: Package, text: "Generous stock options" },
  { icon: DollarSign, text: "Competitive salary" },
  { icon: Activity, text: "Comprehensive health benefits" },
  { icon: MapPin, text: "Fully remote work culture" },
];

const ApplicationForm = ({ job, open, onOpenChange }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [resumeFile, setResumeFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const coverLetter = formData.get('cover-letter');

        if (!resumeFile) {
            toast({ variant: 'destructive', title: "Resume is required" });
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Upload resume
            const fileExt = resumeFile.name.split('.').pop();
            const fileName = `${email}-${Date.now()}.${fileExt}`;
            const filePath = `public/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, resumeFile);

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: urlData } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath);

            if (!urlData || !urlData.publicUrl) {
                throw new Error("Could not get resume URL.");
            }

            // 3. Save application to database
            const { error: dbError } = await supabase
                .from('job_applications')
                .insert({
                    job_title: job.title,
                    name,
                    email,
                    phone,
                    cover_letter: coverLetter,
                    resume_url: urlData.publicUrl
                });

            if (dbError) throw dbError;

            toast({
                title: "Application Submitted!",
                description: "Thank you for applying. We will be in touch soon.",
            });
            onOpenChange(false);

        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Submission Failed",
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to submit your application. We're excited to hear from you!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input id="phone" name="phone" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="resume" className="text-right">Resume</Label>
                            <Input id="resume" name="resume" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="cover-letter" className="text-right pt-2">Cover Letter</Label>
                            <Textarea id="cover-letter" name="cover-letter" placeholder="Tell us why you're a great fit..." className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : 'Submit Application'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const JobCard = ({ job, index }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  return (
    <>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between transition-all hover:shadow-xl"
        >
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <div className="flex items-center flex-wrap space-x-4 mt-2 text-gray-600">
              <span className="flex items-center"><Briefcase className="h-4 w-4 mr-2" />{job.department}</span>
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{job.location}</span>
            </div>
            <p className="mt-3 text-gray-500 pr-4">{job.description}</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} variant="primary" className="mt-4 md:mt-0">
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
        <ApplicationForm job={job} open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  )
};

const ValueCard = ({ icon, title, children }) => (
  <div className="text-center">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary to-emerald-500 text-white mx-auto mb-4">
      {React.createElement(icon, { className: "h-8 w-8" })}
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{children}</p>
  </div>
);

const CareersPage = () => {
  return (
    <>
      <Helmet>
        <title>Careers at Numinote | Join Our Mission</title>
        <meta name="description" content="Join the Numinote team and help us build the future of nonprofit technology. Explore our open positions and learn about our culture." />
        <meta property="og:title" content="Careers at Numinote | Join Our Mission" />
        <meta property="og:description" content="Join the Numinote team and help us build the future of nonprofit technology. Explore our open positions and learn about our culture." />
      </Helmet>
      <div className="bg-gray-50">
        <div className="pt-20 pb-24 sm:pt-28 sm:pb-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-base font-semibold text-primary uppercase tracking-wide">Join Our Team</p>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Work on Something That Matters
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                We're a passionate, mission-driven team dedicated to empowering nonprofits through technology. If you're excited about making a tangible impact, we'd love to hear from you.
              </p>
            </motion.div>
          </div>
        </div>

        <section className="py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Life at Numinote</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        We are building a culture of innovation, collaboration, and purpose.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <ValueCard icon={Heart} title="Impact-Driven">
                        Your work directly contributes to the success of organizations tackling some of the world's most pressing issues.
                    </ValueCard>
                    <ValueCard icon={Lightbulb} title="Innovation & Ownership">
                        We encourage big ideas and give you the autonomy to run with them. Your voice and vision will shape our product.
                    </ValueCard>
                    <ValueCard icon={Users} title="Supportive Community">
                        Join a team of talented and kind people who are invested in your growth and success. We succeed together.
                    </ValueCard>
                </div>
            </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Our Benefits</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-primary mb-3">
                                {React.createElement(benefit.icon, { className: "h-6 w-6" })}
                            </div>
                            <p className="font-medium text-gray-700">{benefit.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        <div className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Current Openings</h2>
            {jobOpenings.length > 0 ? (
              <div className="space-y-6">
                {jobOpenings.map((job, index) => (
                  <JobCard key={job.title} job={job} index={index} />
                ))}
              </div>
            ) : (
                <div className="text-center text-gray-600 bg-gray-100 p-8 rounded-lg">
                    <BrainCircuit className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold">No Open Positions Currently</h3>
                    <p className="mt-2">We're always looking for talented people. Check back soon or send us a speculative application!</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CareersPage;