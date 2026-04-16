// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Input } from "./ui/input";
// import { Search, ExternalLink, CheckCircle2, TrendingUp, Loader2 } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Screen } from "../App";

// const API_BASE = "http://localhost:8000";

// const policyCategories = ["All", "CPT", "OPT", "STEM OPT", "H-1B", "Travel & Policy"];

// interface NewsItem {
//   link: string;
//   category: string;
//   summary: string;
//   title: string;
//   published?: string;
// }

// interface PolicyFeedProps {
//   onNavigate: (screen: Screen) => void;
//   theme?: "light" | "dark";
// }

// export function PolicyFeed({ onNavigate, theme = "light" }: PolicyFeedProps) {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUpdate, setSelectedUpdate] = useState<NewsItem | null>(null);
//   const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   const fetchNews = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE}/news/?limit=20`);
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch news");
//       }

//       const data = await response.json();
//       setNewsItems(data.news || []);
//     } catch (error) {
//       console.error("Error fetching news:", error);
//       // Fallback to empty array if fetch fails
//       setNewsItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredUpdates = newsItems.filter((update) => {
//     const matchesCategory =
//       selectedCategory === "All" || 
//       update.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
//       update.title.toLowerCase().includes(selectedCategory.toLowerCase());
    
//     const matchesSearch =
//       searchQuery === "" ||
//       update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       update.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
//     return matchesCategory && matchesSearch;
//   });

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "Recent";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric', 
//         year: 'numeric' 
//       });
//     } catch {
//       return "Recent";
//     }
//   };

//   const isRecent = (dateString?: string) => {
//     if (!dateString) return false;
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffTime = Math.abs(now.getTime() - date.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       return diffDays <= 7;
//     } catch {
//       return false;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-4xl">📢</span>
//             <h2
//               className="bg-gradient-to-r from-[#6366F1] to-[#A855F7] dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
//               style={{
//                 fontSize: "2rem",
//                 fontWeight: 700,
//                 filter:
//                   theme === "dark"
//                     ? "drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))"
//                     : "none",
//               }}
//             >
//               Latest Policy Updates
//             </h2>
//           </div>
//           <p className="text-slate-600 dark:text-gray-400">
//             Real-time USCIS and SEVP announcements with verified sources.
//           </p>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500" />
//             <Input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Find a rule or announcement…"
//               className="pl-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
//             />
//           </div>
//         </div>

//         {/* Filter Chips */}
//         <div className="flex flex-wrap gap-2 mb-8">
//           {policyCategories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`
//                 px-5 py-2.5 rounded-xl transition-all
//                 ${
//                   selectedCategory === category
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
//                     : "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
//                 }
//               `}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="text-center py-16">
//             <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
//             <p className="text-slate-600 dark:text-gray-400">Loading latest updates...</p>
//           </div>
//         ) : filteredUpdates.length > 0 ? (
//           <div className="grid gap-6 lg:grid-cols-2">
//             {filteredUpdates.map((update, index) => (
//               <Card
//                 key={index}
//                 className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all hover:scale-[1.03] cursor-pointer group"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <Badge className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
//                     {update.category}
//                   </Badge>
//                   <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
//                     <CheckCircle2 className="w-4 h-4" />
//                     <span className="text-sm">Verified</span>
//                   </div>
//                 </div>

//                 <h3 className="mb-3 text-slate-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-semibold">
//                   {update.title}
//                 </h3>

//                 <p className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-3">
//                   {update.summary}
//                 </p>

//                 <div className="flex items-center gap-4 mb-4 text-sm">
//                   <span className="text-slate-500 dark:text-gray-500">
//                     {formatDate(update.published)}
//                   </span>
//                   <span className="text-slate-400 dark:text-gray-600">•</span>
//                   <a
//                     href={update.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     onClick={(e) => e.stopPropagation()}
//                     className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
//                   >
//                     Source: USCIS.gov
//                     <ExternalLink className="w-3 h-3" />
//                   </a>
//                 </div>

//                 {isRecent(update.published) && (
//                   <Badge className="mb-4 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
//                     <TrendingUp className="w-3 h-3 mr-1" />
//                     New (≤ 7 days)
//                   </Badge>
//                 )}

//                 <div className="flex gap-3">
//                   <Button
//                     onClick={() => setSelectedUpdate(update)}
//                     variant="outline"
//                     className="flex-1 rounded-xl border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400"
//                   >
//                     See how this affects me
//                   </Button>
//                   <Button
//                     onClick={() => onNavigate("chat")}
//                     className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white"
//                   >
//                     Discuss this Update
//                   </Button>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Search className="w-10 h-10 text-slate-400 dark:text-gray-600" />
//             </div>
//             <h3 className="mb-2 text-slate-900 dark:text-gray-100">
//               No recent updates found for this category.
//             </h3>
//             <p className="text-slate-600 dark:text-gray-400">
//               Try selecting another filter or check back tomorrow.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Impact Modal */}
//       {selectedUpdate && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
//           onClick={() => setSelectedUpdate(null)}
//         >
//           <Card
//             className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-8 max-w-2xl w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3 className="mb-4 text-slate-900 dark:text-gray-100 text-xl font-semibold">
//               How This Affects You
//             </h3>
//             <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 mb-6">
//               <p className="text-slate-700 dark:text-gray-300 mb-4">
//                 {selectedUpdate.summary}
//               </p>
//               <a
//                 href={selectedUpdate.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2"
//               >
//                 Read full announcement on USCIS.gov
//                 <ExternalLink className="w-4 h-4" />
//               </a>
//             </div>
//             <div className="flex gap-3">
//               <Button
//                 onClick={() => {
//                   setSelectedUpdate(null);
//                   onNavigate("chat");
//                 }}
//                 className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white"
//               >
//                 Ask VisaMate More
//               </Button>
//               <Button
//                 onClick={() => setSelectedUpdate(null)}
//                 variant="outline"
//                 className="flex-1 rounded-xl"
//               >
//                 Close
//               </Button>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

// Nov 23, 2025
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search, ExternalLink, CheckCircle2, TrendingUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Screen } from "../App";

const API_BASE = "http://localhost:8000";

const policyCategories = ["All", "CPT", "OPT", "STEM OPT", "H-1B", "Travel & Policy"];

interface NewsItem {
  link: string;
  category: string;
  summary: string;
  title: string;
  published?: string;
}

interface PolicyFeedProps {
  onNavigate: (screen: Screen) => void;
  theme?: "light" | "dark";
}

export function PolicyFeed({ onNavigate, theme = "light" }: PolicyFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUpdate, setSelectedUpdate] = useState<NewsItem | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/news/?limit=20`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();
      setNewsItems(data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback to empty array if fetch fails
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle article discussion - dispatch custom event
  const handleDiscussUpdate = (article: NewsItem) => {
    console.log("📰 Triggering article discussion:", article.title);
    
    // Navigate to chat first
    onNavigate('chat');
    
    // Dispatch custom event after a short delay to ensure chat is ready
    setTimeout(() => {
      const event = new CustomEvent('discussArticle', {
        detail: {
          title: article.title,
          summary: article.summary,
          link: article.link,
          category: article.category,
          published: article.published
        }
      });
      window.dispatchEvent(event);
      console.log("✅ Article discussion event dispatched");
    }, 100);
  };

  const filteredUpdates = newsItems.filter((update) => {
    const matchesCategory =
      selectedCategory === "All" || 
      update.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      update.title.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchesSearch =
      searchQuery === "" ||
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return "Recent";
    }
  };

  const isRecent = (dateString?: string) => {
    if (!dateString) return false;
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📢</span>
            <h2
              className="bg-gradient-to-r from-[#6366F1] to-[#A855F7] dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                filter:
                  theme === "dark"
                    ? "drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))"
                    : "none",
              }}
            >
              Latest Policy Updates
            </h2>
          </div>
          <p className="text-slate-600 dark:text-gray-400">
            Real-time USCIS and SEVP announcements with verified sources.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a rule or announcement…"
              className="pl-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {policyCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-5 py-2.5 rounded-xl transition-all
                ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-gray-400">Loading latest updates...</p>
          </div>
        ) : filteredUpdates.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredUpdates.map((update, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all hover:scale-[1.03] cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                    {update.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>

                <h3 className="mb-3 text-slate-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-semibold">
                  {update.title}
                </h3>

                <p className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {update.summary}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="text-slate-500 dark:text-gray-500">
                    {formatDate(update.published)}
                  </span>
                  <span className="text-slate-400 dark:text-gray-600">•</span>
                  <a
                    href={update.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Source: USCIS.gov
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {isRecent(update.published) && (
                  <Badge className="mb-4 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    New (≤ 7 days)
                  </Badge>
                )}

                {/* ✅ Updated Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedUpdate(update)}
                    variant="outline"
                    className="flex-1 rounded-xl border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400"
                  >
                    See how this affects me
                  </Button>
                  <Button
                    onClick={() => handleDiscussUpdate(update)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white"
                  >
                    Discuss this Update
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400 dark:text-gray-600" />
            </div>
            <h3 className="mb-2 text-slate-900 dark:text-gray-100">
              No recent updates found for this category.
            </h3>
            <p className="text-slate-600 dark:text-gray-400">
              Try selecting another filter or check back tomorrow.
            </p>
          </div>
        )}
      </div>

      {/* Impact Modal */}
      {selectedUpdate && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedUpdate(null)}
        >
          <Card
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-slate-900 dark:text-gray-100 text-xl font-semibold">
              How This Affects You
            </h3>
            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 mb-6">
              <p className="text-slate-700 dark:text-gray-300 mb-4">
                {selectedUpdate.summary}
              </p>
              <a
                href={selectedUpdate.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2"
              >
                Read full announcement on USCIS.gov
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            {/* ✅ Updated Modal Button */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  handleDiscussUpdate(selectedUpdate);
                  setSelectedUpdate(null);
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white"
              >
                Ask VisaMate More
              </Button>
              <Button
                onClick={() => setSelectedUpdate(null)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}