import { motion, useScroll } from 'framer-motion'
import { useRef } from 'react'
import { 
    Check, Star, Monitor, BarChart3, Palette, Microscope, 
    Smartphone, Scale, Heart, GraduationCap, ChevronRight, 
    ArrowRight, Search, MapPin, Users, Award, ShieldCheck, Zap 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
    const navigate = useNavigate();
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const categories = [
        { icon: Monitor, title: "Technology", count: "2,500+ positions", color: "from-purple-500 to-indigo-500", glow: "rgba(168,85,247,0.15)" },
        { icon: BarChart3, title: "Business", count: "1,800+ positions", color: "from-blue-500 to-cyan-500", glow: "rgba(59,130,246,0.15)" },
        { icon: Palette, title: "Design", count: "950+ positions", color: "from-pink-500 to-rose-500", glow: "rgba(244,63,94,0.15)" },
        { icon: Microscope, title: "Research", count: "720+ positions", color: "from-teal-500 to-emerald-500", glow: "rgba(20,184,166,0.15)" },
        { icon: Smartphone, title: "Marketing", count: "1,200+ positions", color: "from-amber-500 to-orange-500", glow: "rgba(245,158,11,0.15)" },
        { icon: Scale, title: "Legal", count: "450+ positions", color: "from-slate-400 to-slate-600", glow: "rgba(148,163,184,0.15)" },
        { icon: Heart, title: "Healthcare", count: "890+ positions", color: "from-red-500 to-rose-400", glow: "rgba(239,68,68,0.15)" },
        { icon: GraduationCap, title: "Education", count: "640+ positions", color: "from-violet-500 to-fuchsia-500", glow: "rgba(139,92,246,0.15)" }
    ];

    const stats = [
        { number: "10K+", label: "Active Internships", icon: Zap, color: "text-purple-400" },
        { number: "500+", label: "Partner Companies", icon: Users, color: "text-blue-400" },
        { number: "50K+", label: "Students Placed", icon: Award, color: "text-emerald-400" },
        { number: "98%", label: "Success Rate", icon: ShieldCheck, color: "text-amber-400" }
    ];

    return (
        <div ref={ref} className="bg-[#030014] text-white min-h-screen relative overflow-hidden select-none">
            {/* Absolute Ambient Glowing Blobs */}
            <div className="glow-blob glow-purple top-[-150px] left-[-150px]"></div>
            <div className="glow-blob glow-blue top-[25vh] right-[-200px]"></div>
            <div className="glow-blob glow-purple bottom-[-200px] left-[10%]"></div>
            
            {/* Hero Section */}
            <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
                    {/* Glowing Accent Pill Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-8 shadow-inner hover:border-white/15 transition-colors"
                    >
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        🚀 Introducing Placify 2.0
                    </motion.div>

                    {/* Elevated Headline */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight bg-gradient-to-b from-white via-[#f3f4f6] to-[#9ca3af] bg-clip-text text-transparent mb-6"
                    >
                        Unlock Your Potential.<br />
                        <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">Find Your Internship</span>
                    </motion.h1>

                    {/* Elevated Paragraph */}
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-base md:text-xl text-gray-400 mb-10 max-w-2xl font-normal leading-relaxed"
                    >
                        Connect with top companies and discover thousands of high-fidelity, rewarding internships across various industries globally.
                    </motion.p>

                    {/* Dual Action Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-md mb-16"
                    >
                        <button 
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-violet-600/20 hover:shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Get Started Now <ArrowRight className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => {
                                const section = document.getElementById('how-it-works');
                                if (section) section.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold px-8 py-4 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Learn More
                        </button>
                    </motion.div>
                </div>

                {/* Dashboard Mockup Representation */}
                <motion.div
                    initial={{ opacity: 0, y: 80, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-5xl mx-auto relative z-10 px-4"
                >
                    <div className="relative rounded-3xl p-3 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-2xl">
                        <div className="bg-[#05031b]/95 rounded-2xl overflow-hidden border border-white/5 text-left flex flex-col md:flex-row h-[420px] md:h-[480px]">
                            {/* Dashboard Sidebar */}
                            <div className="hidden md:flex flex-col w-56 border-r border-white/5 p-5 bg-[#030014]/60">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">P</div>
                                    <span className="font-bold text-white tracking-wide text-sm">Placify Suite</span>
                                </div>
                                <div className="space-y-2">
                                    {["Dashboard", "Internships", "My Applications", "Courses", "Messages", "Settings"].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${i === 1 ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}>
                                            <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-white' : 'bg-transparent'}`}></div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Dashboard Content Panel */}
                            <div className="flex-1 p-6 flex flex-col bg-[#070425]/50 overflow-y-auto">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="font-extrabold text-xl text-white">Find Opportunities</h3>
                                        <p className="text-xs text-gray-400">Discover matching jobs based on your criteria</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-1.5 w-full sm:w-64">
                                        <Search className="w-4 h-4 text-gray-500" />
                                        <input type="text" placeholder="Search internships..." className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full" disabled />
                                    </div>
                                </div>

                                {/* Mock Job Cards */}
                                <div className="space-y-4 flex-1">
                                    {[
                                        { title: "Frontend Engineering Intern", company: "Meta", location: "Remote / London", salary: "$4,500/mo", tag: "React, TS", glow: "border-purple-500/30" },
                                        { title: "Product Design Intern", company: "Airbnb", location: "San Francisco, CA", salary: "$5,200/mo", tag: "Figma, UX", glow: "border-indigo-500/30" },
                                        { title: "Machine Learning Research", company: "Google DeepMind", location: "Mumbai (Hybrid)", salary: "Competitive", tag: "Python, PyTorch", glow: "border-emerald-500/30" }
                                    ].map((job, i) => (
                                        <div key={i} className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg text-white border border-white/10`}>
                                                    {job.company[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-white">{job.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                                        <span>{job.company}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-0 border-white/5 pt-3 sm:pt-0">
                                                <span className="text-xs text-emerald-400 font-semibold">{job.salary}</span>
                                                <span className="text-[10px] text-indigo-300 font-semibold px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 mt-1.5">{job.tag}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 relative z-10 bg-white/[0.01] border-y border-white/[0.04] backdrop-blur-3xl">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Why Choose Placify?</h2>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto">Everything you need to kickstart and secure your dream career journey</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Top-Tier Opportunities", desc: "Access high-value internships from industry giants and pioneering startups.", glow: "group-hover:shadow-purple-500/20" },
                            { title: "Smart Alignment", desc: "Get recommendations tailor-matched precisely to your personal skillset and trajectory.", glow: "group-hover:shadow-blue-500/20" },
                            { title: "Sleek Applications", desc: "Craft your professional presence and apply with rapid, simplified workflows.", glow: "group-hover:shadow-emerald-500/20" },
                            { title: "Expert Mentorship", desc: "In-depth guidebooks, courses, and direct resources designed for your absolute success.", glow: "group-hover:shadow-amber-500/20" }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={fadeInUp}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] backdrop-blur-xl p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Check className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white tracking-wide">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">How It Works</h2>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto">Get hired in just three simple steps</p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto relative space-y-16">
                        {/* Connecting Line */}
                        <div className="absolute left-[31px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-500/80 via-indigo-500/30 to-blue-500/80 hidden md:block"></div>

                        {[
                            { step: "01", title: "Refine Your Profile", desc: "Sign up, seed your skills, outline your core interests, and map your ultimate trajectory." },
                            { step: "02", title: "Explore Matches", desc: "Gain direct alignment to custom opportunities mapped precisely to your skillset." },
                            { step: "03", title: "Submit & Secure", desc: "Submit polished resumes directly to company dashboards and land your ideal position." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.5 }}
                                variants={fadeInUp}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col md:flex-row gap-6 md:gap-10 items-start relative z-10 group"
                            >
                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                                    {item.step}
                                </div>
                                <div className="flex-1 bg-white/[0.01] border border-white/[0.03] group-hover:border-white/[0.08] p-6 rounded-3xl backdrop-blur-md hover:bg-white/[0.03] transition-all">
                                    <h3 className="text-2xl font-bold mb-3 text-white tracking-wide">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Stats Grid */}
            <section className="py-20 px-6 relative z-10 bg-gradient-to-r from-purple-950/20 via-indigo-950/30 to-blue-950/20 border-y border-white/[0.04]">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center bg-white/[0.01] border border-white/[0.03] p-6 rounded-2xl hover:border-white/[0.08] transition-all"
                            >
                                <div className="mb-4">
                                    <stat.icon className={`w-8 h-8 ${stat.color} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]`} />
                                </div>
                                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{stat.number}</div>
                                <div className="text-xs md:text-sm text-gray-400 font-medium tracking-wide uppercase">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Category Grid Section */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Explore by Category</h2>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto">Discover custom internships mapped precisely to your field of interest</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ 
                                    scale: 1.03,
                                    boxShadow: `0 10px 30px -5px ${category.glow}`,
                                    borderColor: "rgba(255,255,255,0.15)"
                                }}
                                className="bg-white/[0.02] border border-white/[0.04] p-8 rounded-3xl text-center cursor-pointer transition-all duration-350 group flex flex-col items-center"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${category.color} bg-opacity-20 flex items-center justify-center mb-5 group-hover:scale-115 transition-all shadow-lg`}>
                                    <category.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-white text-lg mb-1.5 tracking-wide">{category.title}</h3>
                                <p className="text-xs text-gray-400 font-semibold">{category.count}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Companies Section */}
            <section className="py-24 px-6 relative z-10 bg-white/[0.01] border-y border-white/[0.04] backdrop-blur-2xl">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">Post Internships &<br /><span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Hire Top Talent</span></h2>
                            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                Connect with highly motivated students from premium universities. Our platform makes it effortless to post internship opportunities, manage applications, and secure matching candidates for your team.
                            </p>
                            <div className="space-y-4 mb-8">
                                {[
                                    "Post unlimited internship positions",
                                    "Unlock pre-screened talent listings",
                                    "Futuristic filtering and analytical search tools",
                                    "Automated workflow application management"
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={fadeInUp}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex-shrink-0 w-6 h-6 bg-indigo-500/10 rounded-full border border-indigo-500/30 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <span className="text-gray-300 text-sm font-medium">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <button 
                                onClick={() => navigate('/signup')}
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
                            >
                                Post an Internship <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInUp}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            {[
                                { title: "Express Onboarding", desc: "Build your corporate profile and seed parameters in minutes." },
                                { title: "Smart Suggestions", desc: "Instant high-fidelity system candidate suggestions." },
                                { title: "Analytical Insights", desc: "Track conversion flow, metrics, and insights cleanly." },
                                { title: "Priority Support", desc: "Custom support channels prepared for your enterprise." }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-3xl hover:border-white/[0.08] hover:bg-white/[0.03] transition-all"
                                >
                                    <h4 className="font-bold text-white text-base mb-2 tracking-wide">{feature.title}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">User Experiences</h2>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto">Real success stories from students and partner companies</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Johnson", role: "Computer Science Student", text: "Found my dream internship at Google within 2 weeks! The platform made the entire process so smooth.", rating: 5 },
                            { name: "Michael Chen", role: "HR Manager, Tech Corp", text: "We've hired 15 amazing interns through Placify. The quality of candidates is outstanding.", rating: 5 },
                            { name: "Emily Davis", role: "Business Graduate", text: "The personalized recommendations helped me discover opportunities I wouldn't have found otherwise.", rating: 5 }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                transition={{ delay: index * 0.15 }}
                                className="bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] p-8 rounded-3xl backdrop-blur-md flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex gap-1 mb-5">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm md:text-base leading-relaxed italic mb-6">"{testimonial.text}"</p>
                                </div>
                                <div className="border-t border-white/[0.04] pt-4 mt-4">
                                    <p className="font-bold text-white tracking-wide text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-indigo-300 font-semibold mt-0.5">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Call to Action (CTA) Section */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                        className="relative rounded-3xl p-12 bg-gradient-to-r from-violet-950/40 via-indigo-950/40 to-blue-950/40 border border-white/10 text-center overflow-hidden backdrop-blur-3xl shadow-2xl"
                    >
                        {/* Glow spots inside CTA */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight relative z-10 leading-tight">Ready to Start Your Journey?</h2>
                        <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl mx-auto relative z-10 leading-relaxed">Join thousands of students and hiring teams driving their career vectors cleanly forward.</p>
                        <div className="relative z-10 flex justify-center">
                            <button 
                                onClick={() => navigate('/signup')}
                                className="bg-white text-gray-950 font-bold px-10 py-4 rounded-xl text-sm md:text-base hover:bg-gray-100 transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-lg shadow-white/10"
                            >
                                Get Started Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Premium Custom Footer */}
            <footer className="py-16 px-6 relative z-10 border-t border-white/[0.04] bg-[#020010]/80 backdrop-blur-2xl">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
                    <div>
                        <h3 className="text-white font-extrabold text-xl mb-4 tracking-wider flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">P</span>
                            Placify
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-xs">Your intelligent, high-fidelity gateway to secure the most rewarding internship vectors globally.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Platform</h4>
                        <ul className="space-y-2.5 text-xs text-gray-400 list-none p-0">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Browse Internships</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Company Listings</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Education & Courses</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2.5 text-xs text-gray-400 list-none p-0">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">About Our Vision</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Collaborators</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2.5 text-xs text-gray-400 list-none p-0">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Principles</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Operations</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto border-t border-white/[0.04] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; 2026 Placify. Designed for high fidelity.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}