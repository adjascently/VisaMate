// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Upload, Brain, FileText, Shield, Sparkles, Lock } from "lucide-react";
// import { Screen } from "../App"; // ✅ add this import

// interface LandingPageProps {
//   onNavigate: (screen: Screen) => void; // ✅ fixed typing
//   theme: "light" | "dark";
// }

// export function LandingPage({ onNavigate, theme }: LandingPageProps) {
//   return (
//     <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-[#0B1020] dark:via-[#0F172A] dark:to-[#1e1b4b]/20 transition-colors">
      
//       {/* Hero Section */}
//       <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
//         {/* Pill Badge */}
//         <div className="flex justify-center mb-8">
//           <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-100/80 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/50 rounded-full backdrop-blur-sm">
//             <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
//             <span className="text-indigo-700 dark:text-indigo-300">
//               Powered by AI & Verified Documents
//             </span>
//           </div>
//         </div>

//         {/* Hero Title */}
//         <h1 
//           className="mb-6 bg-gradient-to-r from-[#6366F1] to-[#A855F7] dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
//           style={{ 
//             fontSize: '4rem',
//             lineHeight: 1.1,
//             fontWeight: 800,
//             letterSpacing: '-0.02em',
//             filter: theme === 'dark' ? 'drop-shadow(0 0 24px rgba(168, 85, 247, 0.5))' : 'none'
//           }}
//         >
//           VisaMate: Your AI Immigration Copilot
//         </h1>

//         {/* Tagline */}
//         <p 
//           className="text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
//           style={{ fontSize: '1.375rem', lineHeight: 1.6 }}
//         >
//           Ask anything about CPT, OPT, STEM OPT & H-1B.
//         </p>

//         {/* CTA Button */}
//         <div className="flex justify-center mb-12">
//           <Button 
//             onClick={() => onNavigate("chat")}
//             className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-600 dark:hover:from-indigo-600 dark:hover:to-purple-700 text-white px-12 py-7 rounded-2xl shadow-2xl shadow-indigo-500/30 dark:shadow-indigo-500/20 transition-all hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1"
//             style={{ fontSize: '1.25rem' }}
//           >
//             Ask VisaMate →
//           </Button>
//         </div>

//         {/* Suggested Questions Carousel */}
//         <div className="max-w-3xl mx-auto mb-32">
//           <p className="text-slate-500 dark:text-gray-500 mb-4">Try asking:</p>
//           <div className="grid md:grid-cols-3 gap-3">
//             <button
//               onClick={() => onNavigate("chat")}
//               className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all text-left group"
//             >
//               <p className="text-slate-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
//                 "Can I work remotely on CPT?"
//               </p>
//             </button>
//             <button
//               onClick={() => onNavigate("chat")}
//               className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all text-left group"
//             >
//               <p className="text-slate-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
//                 "When does STEM OPT start?"
//               </p>
//             </button>
//             <button
//               onClick={() => onNavigate("policy-feed")}
//               className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all text-left group"
//             >
//               <p className="text-slate-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
//                 "Latest H-1B news?"
//               </p>
//             </button>
//           </div>
//         </div>

//         {/* ...rest of your code remains exactly as is... */}
//       </section>
//     </div>
//   );
// }

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Shield, Sparkles, Lock } from "lucide-react";

interface LandingPageProps {
  onNavigate: (screen: string) => void;
  theme: "light" | "dark";
}

export function LandingPage({ onNavigate, theme }: LandingPageProps) {
  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-[#0B1020] dark:via-[#0F172A] dark:to-[#1e1b4b]/20 transition-colors">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Pill Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-100/80 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/50 rounded-full backdrop-blur-sm">
            <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-indigo-700 dark:text-indigo-300">
              Powered by AI & Verified Documents
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 
          className="mb-6 bg-gradient-to-r from-[#6366F1] to-[#A855F7] dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
          style={{ 
            fontSize: '4rem',
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            filter: theme === 'dark' ? 'drop-shadow(0 0 24px rgba(168, 85, 247, 0.5))' : 'none'
          }}
        >
          VisaMate: Your AI Immigration Copilot
        </h1>

        {/* Tagline */}
        <p 
          className="text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          style={{ fontSize: '1.375rem', lineHeight: 1.6 }}
        >
          Ask anything about CPT, OPT, STEM OPT & H-1B.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-12">
          <Button 
            onClick={() => onNavigate('chat')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-600 dark:hover:from-indigo-600 dark:hover:to-purple-700 text-white px-12 py-7 rounded-2xl shadow-2xl shadow-indigo-500/30 dark:shadow-indigo-500/20 transition-all hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1"
            style={{ fontSize: '1.25rem' }}
          >
            Ask VisaMate→
          </Button>
        </div>

        {/* Suggested Questions Carousel */}
        <div className="max-w-3xl mx-auto mb-32">
          <p className="text-slate-500 dark:text-gray-500 mb-4">Try asking:</p>
          <div className="grid md:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all text-left group"
            >
              <p className="text-slate-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                "Can I work remotely on CPT?"
              </p>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all text-left group"
            >
              <p className="text-slate-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                "When does STEM OPT start?"
              </p>
            </button>
            <button
              onClick={() => onNavigate('policy-feed')}
              className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all text-left group"
            >
              <p className="text-slate-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                "Latest H-1B news?"
              </p>
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Smart Visa Copilot */}
          <Card className="p-8 bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-110 transition-all mx-auto">
              <span className="text-3xl">🩵</span>
            </div>
            <h3 className="mb-3 text-slate-900 dark:text-gray-100 text-lg font-semibold">Smart Visa Copilot</h3>
            <p className="text-slate-600 dark:text-gray-400">
              Chat with an AI trained on official USCIS and SEVP resources.
            </p>
          </Card>

          {/* Live Policy Feed */}
          <Card className="p-8 bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all mx-auto">
              <span className="text-3xl">🗞️</span>
            </div>
            <h3 className="mb-3 text-slate-900 dark:text-gray-100 text-lg font-semibold">Live Policy Feed</h3>
            <p className="text-slate-600 dark:text-gray-400">
              Stay informed with daily updates from verified immigration sources.
            </p>
          </Card>

          {/* Document Q&A */}
          <Card className="p-8 bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 group-hover:scale-110 transition-all mx-auto">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="mb-3 text-slate-900 dark:text-gray-100 text-lg font-semibold">Document Q&A</h3>
            <p className="text-slate-600 dark:text-gray-400">
              Upload your I-20, EAD, or offer letter — and ask VisaMate about it.
            </p>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section className="max-w-6xl mx-auto px-6 pt-40 pb-36">
        <div className="text-center mb-16">
          <h2 
            className="mb-4 bg-gradient-to-r from-[#6366F1] to-[#A855F7] dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700,
              filter: theme === 'dark' ? 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))' : 'none'
            }}
          >
            See VisaMate in Action
          </h2>
          <p className="text-[#64748B] dark:text-gray-400 max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
            Watch how VisaMate analyzes verified policy documents to provide accurate, citation-backed answers to complex immigration questions.
          </p>
        </div>

        {/* Chat Preview Card */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 p-8 rounded-2xl" style={{ boxShadow: '0 2px 16px rgba(0, 0, 0, 0.05)' }}>
            {/* Chat Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-gray-100 font-semibold">VisaMate AI</h4>
                <p className="text-slate-500 dark:text-gray-400 text-sm">Immigration Assistant</p>
              </div>
            </div>

            {/* Sample Q&A */}
            <div className="space-y-6">
              {/* Question */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-600 dark:text-gray-300">👤</span>
                </div>
                <div className="flex-1">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl rounded-tl-sm px-6 py-4">
                    <p className="text-slate-700 dark:text-gray-200">
                      Can I work remotely on CPT?
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl rounded-tl-sm px-6 py-5 border border-indigo-100 dark:border-indigo-900/50">
                    <p className="text-slate-700 dark:text-gray-200 mb-4">
                      Yes, remote work on CPT is permitted under specific conditions. The employer must have a physical location in the United States, and the work must be directly related to your major area of study.
                    </p>
                    
                    <p className="text-slate-700 dark:text-gray-200 mb-5">
                      According to SEVP guidance from March 2020, remote work arrangements are acceptable as long as academic requirements are met.
                    </p>
                    
                    {/* Citations */}
                    <div className="mb-4">
                      <p className="text-slate-500 dark:text-gray-400 mb-2 text-sm">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-300 rounded-lg backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer text-sm">
                          📄 USCIS CPT §3.2
                        </span>
                        <span className="px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-300 rounded-lg backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer text-sm">
                          📄 SEVP FAQ Q47
                        </span>
                      </div>
                    </div>

                    {/* Trust Badge */}
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-800/50 px-3 py-1.5">
                        <Shield className="w-4 h-4 mr-1.5" />
                        Trust Score: 92%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section id="why-it-matters" className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 
            className="mb-8 bg-gradient-to-r from-[#6366F1] to-[#A855F7] dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
            style={{ 
              fontSize: '2.25rem', 
              fontWeight: 700,
              filter: theme === 'dark' ? 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))' : 'none'
            }}
          >
            Why It Matters
          </h2>
          <p 
            className="text-slate-600 dark:text-gray-400 mb-6"
            style={{ fontSize: '1.125rem', lineHeight: 1.6 }}
          >
            International students often struggle to find clear, trustworthy answers about their visa status, whether it's a question about CPT, OPT, or just understanding what's allowed. VisaMate simplifies this process by letting students ask anything, from general immigration queries to policy-specific questions backed by uploaded documents like I-20s or EAD cards. Every response is verified against official USCIS, SEVP, and university sources, ensuring guidance that's both accurate and up-to-date. For universities, this means fewer repetitive queries and a lighter administrative load while students gain instant clarity and confidence in every decision.
          </p>
          <p 
            className="text-slate-600 dark:text-gray-400"
            style={{ fontSize: '1.125rem', lineHeight: 1.6 }}
          >
            Every answer is transparent, traceable, and grounded in verified sources, helping students make informed decisions about CPT, OPT, STEM-OPT and H1B with confidence.
          </p>
        </div>
      </section>
    </div>
  );
}