// ORIGINAL
// import { useState, useEffect } from "react";
// import { LandingPage } from "./components/landing-page";
// import { UploadScreen } from "./components/upload-screen";
// import { UnifiedChat } from "./components/unified-chat";
// import { CitedAnswerView } from "./components/cited-answer-view";
// import { ExplainableGraphView } from "./components/explainable-graph-view";
// import { ExplainabilityHub } from "./components/explainability-hub";
// import { PolicyFeed } from "./components/policy-feed";
// import { ProfileSettings } from "./components/profile-settings";
// import { Footer } from "./components/footer";
// import { Button } from "./components/ui/button";
// import { Toaster } from "./components/ui/sonner";
// import { Home, MessageSquare, Newspaper, User, Sun, Moon } from "lucide-react";

// // ✅ Exported Screen type so it can be reused by other components
// export type Screen =
//   | "landing"
//   | "upload"
//   | "chat"
//   | "cited-answer"
//   | "graph"
//   | "explainability"
//   | "policy-feed"
//   | "profile";

// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
//   const [theme, setTheme] = useState<"light" | "dark">("light");

//   // ✅ Updated: screen IDs match Screen type
//   const screens = [
//     { id: "landing" as Screen, label: "Home", icon: Home },
//     { id: "chat" as Screen, label: "Assist", icon: MessageSquare },
//     { id: "policy-feed" as Screen, label: "News", icon: Newspaper },
//     { id: "profile" as Screen, label: "Profile", icon: User },
//   ];

//   // Apply theme
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

//   const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
//     if (newTheme === "auto") setTheme("light");
//     else setTheme(newTheme);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Toaster />

//       {/* 🧭 Top Navigation */}
//       <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50 transition-colors">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           {/* Left: Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
//               <span className="text-white font-semibold text-lg">VM</span>
//             </div>
//             <div>
//               <h3
//                 className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent font-bold text-lg"
//               >
//                 VisaMate
//               </h3>
//             </div>
//           </div>

//           {/* Center: Navigation Tabs */}
//           <nav className="hidden md:flex items-center gap-1">
//             {screens.map((screen) => {
//               const Icon = screen.icon;
//               const isActive = currentScreen === screen.id;
//               return (
//                 <button
//                   key={screen.id}
//                   onClick={() => setCurrentScreen(screen.id)}
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all relative
//                     ${
//                       isActive
//                         ? "text-purple-600 dark:text-purple-400"
//                         : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800"
//                     }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span>{screen.label}</span>
//                   {isActive && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] rounded-full" />
//                   )}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Right: Theme Toggle */}
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleTheme}
//               className="rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800"
//               title="Toggle theme"
//             >
//               {theme === "light" ? (
//                 <Moon className="w-5 h-5" />
//               ) : (
//                 <Sun className="w-5 h-5" />
//               )}
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* 🧩 Screen Renderer */}
//       <main className="flex-1">
//         {currentScreen === "landing" && (
//           <LandingPage onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "upload" && (
//           <UploadScreen onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "chat" && (
//           <UnifiedChat onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "cited-answer" && (
//           <CitedAnswerView onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "graph" && (
//           <ExplainableGraphView onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "explainability" && (
//           <ExplainabilityHub onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "policy-feed" && (
//           <PolicyFeed onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "profile" && (
//           <ProfileSettings theme={theme} onThemeChange={handleThemeChange} />
//         )}
//       </main>

//       {/* 🦶 Footer (hide on chat) */}
//       {currentScreen !== "chat" && <Footer />}
//     </div>
//   );
// }


// // New changes - Nov 9, 2025
// import { useState, useEffect } from "react";
// import { LandingPage } from "./components/landing-page";
// import { UploadScreen } from "./components/upload-screen";
// import { UnifiedChat } from "./components/unified-chat";
// import { CitedAnswerView } from "./components/cited-answer-view";
// import { ExplainableGraphView } from "./components/explainable-graph-view";
// import { ExplainabilityHub } from "./components/explainability-hub";
// import { PolicyFeed } from "./components/policy-feed";
// import { ProfileSettings } from "./components/profile-settings";
// import { Forum } from "./components/forum";
// import { ForumPostDetail } from "./components/forum-post-detail";
// import { Footer } from "./components/footer";
// import { Button } from "./components/ui/button";
// import { Toaster } from "./components/ui/sonner";
// import { Home, MessageSquare, Newspaper, User, Sun, Moon, Users } from "lucide-react";

// // ✅ Exported Screen type with forum screens added
// export type Screen =
//   | "landing"
//   | "upload"
//   | "chat"
//   | "cited-answer"
//   | "graph"
//   | "explainability"
//   | "policy-feed"
//   | "profile"
//   | "forum"
//   | "forum-detail";

// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
//   const [theme, setTheme] = useState<"light" | "dark">("light");

//   // ✅ Updated: screen IDs match Screen type with Forum added
//   const screens = [
//     { id: "landing" as Screen, label: "Home", icon: Home },
//     { id: "chat" as Screen, label: "Assist", icon: MessageSquare },
//     { id: "forum" as Screen, label: "Forum", icon: Users },
//     { id: "policy-feed" as Screen, label: "News", icon: Newspaper },
//     { id: "profile" as Screen, label: "Profile", icon: User },
//   ];

//   // Apply theme
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

//   const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
//     if (newTheme === "auto") setTheme("light");
//     else setTheme(newTheme);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Toaster />

//       {/* 🧭 Top Navigation */}
//       <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50 transition-colors">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           {/* Left: Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
//               <span className="text-white font-semibold text-lg">VM</span>
//             </div>
//             <div>
//               <h3
//                 className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent font-bold text-lg"
//               >
//                 VisaMate
//               </h3>
//             </div>
//           </div>

//           {/* Center: Navigation Tabs */}
//           <nav className="hidden md:flex items-center gap-1">
//             {screens.map((screen) => {
//               const Icon = screen.icon;
//               const isActive = currentScreen === screen.id || 
//                 (currentScreen === "forum-detail" && screen.id === "forum");
//               return (
//                 <button
//                   key={screen.id}
//                   onClick={() => setCurrentScreen(screen.id)}
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all relative
//                     ${
//                       isActive
//                         ? "text-purple-600 dark:text-purple-400"
//                         : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800"
//                     }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span>{screen.label}</span>
//                   {isActive && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] rounded-full" />
//                   )}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Right: Theme Toggle */}
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleTheme}
//               className="rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800"
//               title="Toggle theme"
//             >
//               {theme === "light" ? (
//                 <Moon className="w-5 h-5" />
//               ) : (
//                 <Sun className="w-5 h-5" />
//               )}
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* 🧩 Screen Renderer */}
//       <main className="flex-1">
//         {currentScreen === "landing" && (
//           <LandingPage onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "upload" && (
//           <UploadScreen onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "chat" && (
//           <UnifiedChat onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "cited-answer" && (
//           <CitedAnswerView onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "graph" && (
//           <ExplainableGraphView onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "explainability" && (
//           <ExplainabilityHub onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "policy-feed" && (
//           <PolicyFeed onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "profile" && (
//           <ProfileSettings theme={theme} onThemeChange={handleThemeChange} />
//         )}
//         {currentScreen === "forum" && (
//           <Forum onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "forum-detail" && (
//           <ForumPostDetail onNavigate={setCurrentScreen} theme={theme} />
//         )}
//       </main>

//       {/* 🦶 Footer (hide on chat and forum-detail) */}
//       {currentScreen !== "chat" && currentScreen !== "forum-detail" && <Footer />}
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { LandingPage } from "./components/landing-page";
// import { UploadScreen } from "./components/upload-screen";
// import { UnifiedChat } from "./components/unified-chat";
// import { CitedAnswerView } from "./components/cited-answer-view";
// import { ExplainableGraphView } from "./components/explainable-graph-view";
// import { ExplainabilityHub } from "./components/explainability-hub";
// import { PolicyFeed } from "./components/policy-feed";
// import { ProfileSettings } from "./components/profile-settings";
// import { Forum } from "./components/forum";
// import { ForumPostDetail } from "./components/forum-post-detail";
// import { AuthScreen } from "./components/auth-screen";
// import { Footer } from "./components/footer";
// import { Button } from "./components/ui/button";
// import { Toaster } from "./components/ui/sonner";
// import { toast } from "sonner";
// import { Home, MessageSquare, Newspaper, User, Sun, Moon, Users } from "lucide-react";

// // ✅ Exported Screen type with forum screens added
// export type Screen =
//   | "landing"
//   | "upload"
//   | "chat"
//   | "cited-answer"
//   | "graph"
//   | "explainability"
//   | "policy-feed"
//   | "profile"
//   | "forum"
//   | "forum-detail"
//   | "auth";

// export default function App() {
//   const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
//   const [theme, setTheme] = useState<"light" | "dark">("light");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check login status on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   // ✅ Updated: screen IDs match Screen type with Forum moved to right of News
//   const screens = [
//     { id: "landing" as Screen, label: "Home", icon: Home },
//     { id: "chat" as Screen, label: "Assist", icon: MessageSquare },
//     { id: "policy-feed" as Screen, label: "News", icon: Newspaper },
//     { id: "forum" as Screen, label: "Forum", icon: Users },
//     { id: "profile" as Screen, label: "Profile", icon: User },
//   ];

//   // Apply theme
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

//   const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
//     if (newTheme === "auto") setTheme("light");
//     else setTheme(newTheme);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Toaster />

//       {/* 🧭 Top Navigation */}
//       <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50 transition-colors">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           {/* Left: Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
//               <span className="text-white font-semibold text-lg">VM</span>
//             </div>
//             <div>
//               <h3
//                 className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent font-bold text-lg"
//               >
//                 VisaMate
//               </h3>
//             </div>
//           </div>

//           {/* Center: Navigation Tabs */}
//           <nav className="hidden md:flex items-center gap-1">
//             {screens.map((screen) => {
//               const Icon = screen.icon;
//               const isActive = currentScreen === screen.id || 
//                 (currentScreen === "forum-detail" && screen.id === "forum");
//               return (
//                 <button
//                   key={screen.id}
//                   onClick={() => setCurrentScreen(screen.id)}
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all relative
//                     ${
//                       isActive
//                         ? "text-purple-600 dark:text-purple-400"
//                         : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800"
//                     }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span>{screen.label}</span>
//                   {isActive && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] rounded-full" />
//                   )}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Right: Theme Toggle + Auth */}
//           <div className="flex items-center gap-2">
//             {isLoggedIn ? (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   localStorage.removeItem("token");
//                   localStorage.removeItem("userEmail");
//                   setIsLoggedIn(false);
//                   toast.success("Logged out successfully");
//                   setCurrentScreen("landing");
//                 }}
//                 className="mr-2"
//               >
//                 Logout
//               </Button>
//             ) : (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentScreen("auth")}
//                 className="mr-2"
//               >
//                 Login
//               </Button>
//             )}
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleTheme}
//               className="rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800"
//               title="Toggle theme"
//             >
//               {theme === "light" ? (
//                 <Moon className="w-5 h-5" />
//               ) : (
//                 <Sun className="w-5 h-5" />
//               )}
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* 🧩 Screen Renderer */}
//       <main className="flex-1">
//         {currentScreen === "landing" && (
//           <LandingPage onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "upload" && (
//           <UploadScreen onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "chat" && (
//           <UnifiedChat onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "cited-answer" && (
//           <CitedAnswerView onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "graph" && (
//           <ExplainableGraphView onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "explainability" && (
//           <ExplainabilityHub onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "policy-feed" && (
//           <PolicyFeed onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "profile" && (
//           <ProfileSettings theme={theme} onThemeChange={handleThemeChange} />
//         )}
//         {currentScreen === "forum" && (
//           <Forum onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "forum-detail" && (
//           <ForumPostDetail onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "auth" && (
//           <AuthScreen 
//             onNavigate={setCurrentScreen} 
//             onLoginSuccess={() => setIsLoggedIn(true)}
//           />
//         )}
//       </main>

//       {/* 🦶 Footer (hide on chat and forum-detail) */}
//       {currentScreen !== "chat" && currentScreen !== "forum-detail" && <Footer />}
//     </div>
//   );
// }


// Nov 23, 2025
// import { useState, useEffect } from "react";
// import { LandingPage } from "./components/landing-page";
// import { UploadScreen } from "./components/upload-screen";
// import { UnifiedChat } from "./components/unified-chat";
// import { CitedAnswerView } from "./components/cited-answer-view";
// import { ExplainableGraphView } from "./components/explainable-graph-view";
// import { ExplainabilityHub } from "./components/explainability-hub";
// import { PolicyFeed } from "./components/policy-feed";
// import { ProfileSettings } from "./components/profile-settings";
// import { Forum } from "./components/forum";
// import { ForumPostDetail } from "./components/forum-post-detail";
// import { AuthScreen } from "./components/auth-screen";
// import { Footer } from "./components/footer";
// import { Button } from "./components/ui/button";
// import { Toaster } from "./components/ui/sonner";
// import { toast } from "sonner";
// import { Home, MessageSquare, Newspaper, User, Sun, Moon, Users } from "lucide-react";

// // ✅ Exported Screen type with forum screens added
// export type Screen =
//   | "landing"
//   | "upload"
//   | "chat"
//   | "cited-answer"
//   | "graph"
//   | "explainability"
//   | "policy-feed"
//   | "profile"
//   | "forum"
//   | "forum-detail"
//   | "auth";

// export default function App() {
//   // ✅ Initialize from URL hash or default to landing
//   const getInitialScreen = (): Screen => {
//     const hash = window.location.hash.slice(1); // Remove the # symbol
//     const validScreens: Screen[] = [
//       "landing", "upload", "chat", "cited-answer", "graph", 
//       "explainability", "policy-feed", "profile", "forum", "forum-detail", "auth"
//     ];
//     return validScreens.includes(hash as Screen) ? (hash as Screen) : "landing";
//   };

//   const [currentScreen, setCurrentScreen] = useState<Screen>(getInitialScreen());
//   const [theme, setTheme] = useState<"light" | "dark">("light");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check login status on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   // ✅ Sync URL hash with current screen
//   useEffect(() => {
//     window.location.hash = currentScreen;
//   }, [currentScreen]);

//   // ✅ Listen for browser back/forward navigation
//   useEffect(() => {
//     const handleHashChange = () => {
//       const hash = window.location.hash.slice(1);
//       const validScreens: Screen[] = [
//         "landing", "upload", "chat", "cited-answer", "graph", 
//         "explainability", "policy-feed", "profile", "forum", "forum-detail", "auth"
//       ];
//       if (validScreens.includes(hash as Screen)) {
//         setCurrentScreen(hash as Screen);
//       }
//     };

//     window.addEventListener('hashchange', handleHashChange);
//     return () => window.removeEventListener('hashchange', handleHashChange);
//   }, []);

//   // ✅ Updated: screen IDs match Screen type with Forum moved to right of News
//   const screens = [
//     { id: "landing" as Screen, label: "Home", icon: Home },
//     { id: "chat" as Screen, label: "Assist", icon: MessageSquare },
//     { id: "policy-feed" as Screen, label: "News", icon: Newspaper },
//     { id: "forum" as Screen, label: "Forum", icon: Users },
//     { id: "profile" as Screen, label: "Profile", icon: User },
//   ];

//   // Apply theme
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

//   const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
//     if (newTheme === "auto") setTheme("light");
//     else setTheme(newTheme);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Toaster />

//       {/* 🧭 Top Navigation */}
//       <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50 transition-colors">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           {/* Left: Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
//               <span className="text-white font-semibold text-lg">VM</span>
//             </div>
//             <div>
//               <h3
//                 className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent font-bold text-lg"
//               >
//                 VisaMate
//               </h3>
//             </div>
//           </div>

//           {/* Center: Navigation Tabs */}
//           <nav className="hidden md:flex items-center gap-1">
//             {screens.map((screen) => {
//               const Icon = screen.icon;
//               const isActive = currentScreen === screen.id || 
//                 (currentScreen === "forum-detail" && screen.id === "forum");
//               return (
//                 <button
//                   key={screen.id}
//                   onClick={() => setCurrentScreen(screen.id)}
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all relative
//                     ${
//                       isActive
//                         ? "text-purple-600 dark:text-purple-400"
//                         : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800"
//                     }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span>{screen.label}</span>
//                   {isActive && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] rounded-full" />
//                   )}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Right: Theme Toggle + Auth */}
//           <div className="flex items-center gap-2">
//             {isLoggedIn ? (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   localStorage.removeItem("token");
//                   localStorage.removeItem("userEmail");
//                   setIsLoggedIn(false);
//                   toast.success("Logged out successfully");
//                   setCurrentScreen("landing");
//                 }}
//                 className="mr-2"
//               >
//                 Logout
//               </Button>
//             ) : (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentScreen("auth")}
//                 className="mr-2"
//               >
//                 Login
//               </Button>
//             )}
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleTheme}
//               className="rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800"
//               title="Toggle theme"
//             >
//               {theme === "light" ? (
//                 <Moon className="w-5 h-5" />
//               ) : (
//                 <Sun className="w-5 h-5" />
//               )}
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* 🧩 Screen Renderer */}
//       <main className="flex-1">
//         {currentScreen === "landing" && (
//           <LandingPage onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "upload" && (
//           <UploadScreen onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "chat" && (
//           <UnifiedChat onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "cited-answer" && (
//           <CitedAnswerView onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "graph" && (
//           <ExplainableGraphView onNavigate={setCurrentScreen} />
//         )}
//         {currentScreen === "explainability" && (
//           <ExplainabilityHub onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "policy-feed" && (
//           <PolicyFeed onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "profile" && (
//           <ProfileSettings theme={theme} onThemeChange={handleThemeChange} />
//         )}
//         {currentScreen === "forum" && (
//           <Forum onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "forum-detail" && (
//           <ForumPostDetail onNavigate={setCurrentScreen} theme={theme} />
//         )}
//         {currentScreen === "auth" && (
//           <AuthScreen 
//             onNavigate={setCurrentScreen} 
//             onLoginSuccess={() => setIsLoggedIn(true)}
//           />
//         )}
//       </main>

//       {/* 🦶 Footer (hide on chat and forum-detail) */}
//       {currentScreen !== "chat" && currentScreen !== "forum-detail" && <Footer />}
//     </div>
//   );
// }


// Nov 23, 2025
import { useState, useEffect } from "react";
import { LandingPage } from "./components/landing-page";
import { UploadScreen } from "./components/upload-screen";
import { UnifiedChat } from "./components/unified-chat";
import { CitedAnswerView } from "./components/cited-answer-view";
import { ExplainableGraphView } from "./components/explainable-graph-view";
import { ExplainabilityHub } from "./components/explainability-hub";
import { PolicyFeed } from "./components/policy-feed";
import { ProfileSettings } from "./components/profile-settings";
import { Forum } from "./components/forum";
import { ForumPostDetail } from "./components/forum-post-detail";
import { AuthScreen } from "./components/auth-screen";
import { Footer } from "./components/footer";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Home, MessageSquare, Newspaper, User, Sun, Moon, Users } from "lucide-react";

// ✅ Exported Screen type with forum screens added
export type Screen =
  | "landing"
  | "upload"
  | "chat"
  | "cited-answer"
  | "graph"
  | "explainability"
  | "policy-feed"
  | "profile"
  | "forum"
  | "forum-detail"
  | "auth";

export default function App() {
  // ✅ Initialize from URL hash or default to landing
  const getInitialScreen = (): Screen => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    const validScreens: Screen[] = [
      "landing", "upload", "chat", "cited-answer", "graph", 
      "explainability", "policy-feed", "profile", "forum", "forum-detail", "auth"
    ];
    return validScreens.includes(hash as Screen) ? (hash as Screen) : "landing";
  };

  const [currentScreen, setCurrentScreen] = useState<Screen>(getInitialScreen());
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Sync URL hash with current screen
  useEffect(() => {
    window.location.hash = currentScreen;
  }, [currentScreen]);

  // ✅ Listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const validScreens: Screen[] = [
        "landing", "upload", "chat", "cited-answer", "graph", 
        "explainability", "policy-feed", "profile", "forum", "forum-detail", "auth"
      ];
      if (validScreens.includes(hash as Screen)) {
        setCurrentScreen(hash as Screen);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ✅ Updated: screen IDs match Screen type with Forum moved to right of News
  const screens = [
    { id: "landing" as Screen, label: "Home", icon: Home },
    { id: "chat" as Screen, label: "Assist", icon: MessageSquare },
    { id: "policy-feed" as Screen, label: "News", icon: Newspaper },
    { id: "forum" as Screen, label: "Forum", icon: Users },
    { id: "profile" as Screen, label: "Profile", icon: User },
  ];

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    if (newTheme === "auto") setTheme("light");
    else setTheme(newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />

      {/* 🧭 Top Navigation */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-semibold text-lg">VM</span>
            </div>
            <div>
              <h3
                className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent font-bold text-lg"
              >
                VisaMate
              </h3>
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {screens.map((screen) => {
              const Icon = screen.icon;
              const isActive = currentScreen === screen.id || 
                (currentScreen === "forum-detail" && screen.id === "forum");
              return (
                <button
                  key={screen.id}
                  onClick={() => setCurrentScreen(screen.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all relative
                    ${
                      isActive
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{screen.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle + Auth */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userEmail");
                  setIsLoggedIn(false);
                  toast.success("Logged out successfully");
                  setCurrentScreen("landing");
                }}
                className="mr-2"
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentScreen("auth")}
                className="mr-2"
              >
                Login
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* 🧩 Screen Renderer */}
      <main className="flex-1">
        {currentScreen === "landing" && (
          <LandingPage onNavigate={setCurrentScreen} theme={theme} />
        )}
        {currentScreen === "upload" && (
          <UploadScreen onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "chat" && (
          <UnifiedChat onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "cited-answer" && (
          <CitedAnswerView onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "graph" && (
          <ExplainableGraphView onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "explainability" && (
          <ExplainabilityHub onNavigate={setCurrentScreen} theme={theme} />
        )}
        {currentScreen === "policy-feed" && (
          <PolicyFeed onNavigate={setCurrentScreen} theme={theme} />
        )}
        {currentScreen === "profile" && (
          <ProfileSettings theme={theme} onThemeChange={handleThemeChange} />
        )}
        {currentScreen === "forum" && (
          <Forum onNavigate={setCurrentScreen} theme={theme} />
        )}
        {currentScreen === "forum-detail" && (
          <ForumPostDetail onNavigate={setCurrentScreen} theme={theme} />
        )}
        {currentScreen === "auth" && (
          <AuthScreen 
            onNavigate={setCurrentScreen} 
            onLoginSuccess={() => setIsLoggedIn(true)}
          />
        )}
      </main>

      {/* 🦶 Footer (hide on chat and forum-detail) */}
      {currentScreen !== "chat" && currentScreen !== "forum-detail" && <Footer />}
    </div>
  );
}