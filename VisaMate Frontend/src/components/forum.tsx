// import { useState, useEffect } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { 
//   MessageSquare, 
//   ThumbsUp, 
//   Plus, 
//   Filter,
//   X,
//   Clock,
//   User
// } from "lucide-react";
// import { toast } from "sonner";

// interface ForumProps {
//   onNavigate: (screen: Screen) => void;
//   theme: "light" | "dark";
// }

// interface Post {
//   _id: string;
//   title: string;
//   content: string;
//   user_email: string;
//   visa_stage: string;
//   tags: string[];
//   likes: number;
//   liked_by: string[];
//   timestamp: string;
// }

// const API_BASE = "http://localhost:8000";

// export function Forum({ onNavigate, theme }: ForumProps) {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [selectedStage, setSelectedStage] = useState<string>("");
//   const [selectedTag, setSelectedTag] = useState<string>("");
  
//   // Create post form
//   const [newPostTitle, setNewPostTitle] = useState("");
//   const [newPostContent, setNewPostContent] = useState("");
//   const [newPostTags, setNewPostTags] = useState("");

//   const visaStages = ["F1", "CPT", "OPT", "STEM-OPT", "H1B"];
//   const commonTags = ["question", "advice", "success-story", "timeline", "documentation"];

//   useEffect(() => {
//     fetchPosts();
//   }, [selectedStage, selectedTag]);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       let url = `${API_BASE}/forum/posts?limit=20`;
//       if (selectedStage) url += `&visa_stage=${selectedStage}`;
//       if (selectedTag) url += `&tag=${selectedTag}`;

//       const response = await fetch(url);
//       const data = await response.json();
//       setPosts(data.posts || []);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("Failed to load posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createPost = async () => {
//     if (!newPostTitle.trim() || !newPostContent.trim()) {
//       toast.error("Title and content are required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: newPostTitle,
//           content: newPostContent,
//           tags: newPostTags.split(",").map(t => t.trim()).filter(Boolean)
//         })
//       });

//       if (response.ok) {
//         toast.success("Post created successfully!");
//         setShowCreateModal(false);
//         setNewPostTitle("");
//         setNewPostContent("");
//         setNewPostTags("");
//         fetchPosts();
//       } else {
//         toast.error("Failed to create post");
//       }
//     } catch (error) {
//       console.error("Error creating post:", error);
//       toast.error("Failed to create post");
//     }
//   };

//   const likePost = async (postId: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${postId}/like`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         fetchPosts();
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const formatDate = (timestamp: string) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//               Community Forum
//             </h1>
//             <p className="text-slate-600 dark:text-slate-400 mt-2">
//               Connect with fellow international students
//             </p>
//           </div>
//           <Button
//             onClick={() => setShowCreateModal(true)}
//             className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             New Post
//           </Button>
//         </div>

//         {/* Filters */}
//         <Card className="p-4 mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//           <div className="flex items-center gap-4 flex-wrap">
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-slate-500" />
//               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                 Filters:
//               </span>
//             </div>

//             {/* Visa Stage Filter */}
//             <div className="flex gap-2">
//               {visaStages.map(stage => (
//                 <Badge
//                   key={stage}
//                   variant={selectedStage === stage ? "default" : "outline"}
//                   className="cursor-pointer"
//                   onClick={() => setSelectedStage(selectedStage === stage ? "" : stage)}
//                 >
//                   {stage}
//                 </Badge>
//               ))}
//             </div>

//             {/* Tag Filter */}
//             <div className="flex gap-2">
//               {commonTags.map(tag => (
//                 <Badge
//                   key={tag}
//                   variant={selectedTag === tag ? "default" : "outline"}
//                   className="cursor-pointer"
//                   onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
//                 >
//                   {tag}
//                 </Badge>
//               ))}
//             </div>

//             {(selectedStage || selectedTag) && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   setSelectedStage("");
//                   setSelectedTag("");
//                 }}
//               >
//                 <X className="w-4 h-4 mr-1" />
//                 Clear
//               </Button>
//             )}
//           </div>
//         </Card>

//         {/* Posts List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
//           </div>
//         ) : posts.length === 0 ? (
//           <Card className="p-12 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//             <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//             <p className="text-slate-600 dark:text-slate-400">
//               No posts found. Be the first to start a discussion!
//             </p>
//           </Card>
//         ) : (
//           <div className="space-y-4">
//             {posts.map(post => (
//               <Card
//                 key={post._id}
//                 className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur hover:shadow-lg transition-all cursor-pointer"
//                 onClick={() => {
//                   localStorage.setItem("currentPostId", post._id);
//                   onNavigate("forum-detail" as Screen);
//                 }}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="flex-1">
//                     {/* Post Header */}
//                     <div className="flex items-center gap-3 mb-3">
//                       <Badge variant="outline" className="text-xs">
//                         {post.visa_stage}
//                       </Badge>
//                       <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//                         <User className="w-3 h-3" />
//                         <span>{post.user_email.split("@")[0]}</span>
//                         <Clock className="w-3 h-3 ml-2" />
//                         <span>{formatDate(post.timestamp)}</span>
//                       </div>
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
//                       {post.title}
//                     </h3>

//                     {/* Content Preview */}
//                     <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
//                       {post.content}
//                     </p>

//                     {/* Tags */}
//                     {post.tags.length > 0 && (
//                       <div className="flex gap-2 mb-3">
//                         {post.tags.map(tag => (
//                           <Badge key={tag} variant="secondary" className="text-xs">
//                             #{tag}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Like Button */}
//                   <div className="flex flex-col items-center gap-1">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         likePost(post._id);
//                       }}
//                       className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
//                     >
//                       <ThumbsUp className="w-4 h-4" />
//                     </Button>
//                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       {post.likes}
//                     </span>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* Create Post Modal */}
//         {showCreateModal && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <Card className="max-w-2xl w-full p-6 bg-white dark:bg-slate-800">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//                   Create New Post
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setShowCreateModal(false)}
//                 >
//                   <X className="w-5 h-5" />
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Title
//                   </label>
//                   <Input
//                     placeholder="What's your question or topic?"
//                     value={newPostTitle}
//                     onChange={(e) => setNewPostTitle(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Content
//                   </label>
//                   <Textarea
//                     placeholder="Share your thoughts, questions, or experiences..."
//                     value={newPostContent}
//                     onChange={(e) => setNewPostContent(e.target.value)}
//                     rows={6}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Tags (comma-separated)
//                   </label>
//                   <Input
//                     placeholder="e.g., cpt, timeline, advice"
//                     value={newPostTags}
//                     onChange={(e) => setNewPostTags(e.target.value)}
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     onClick={createPost}
//                     className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500"
//                   >
//                     Post
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowCreateModal(false)}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// ***********************************************


// import { useState, useEffect } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { 
//   MessageSquare, 
//   ThumbsUp, 
//   Plus, 
//   Filter,
//   X,
//   Clock,
//   User
// } from "lucide-react";
// import { toast } from "sonner";

// interface ForumProps {
//   onNavigate: (screen: Screen) => void;
//   theme: "light" | "dark";
// }

// interface Post {
//   _id: string;
//   title: string;
//   content: string;
//   user_email: string;
//   visa_stage: string;
//   tags: string[];
//   likes: number;
//   liked_by: string[];
//   timestamp: string;
// }

// const API_BASE = "http://localhost:8000";

// export function Forum({ onNavigate, theme }: ForumProps) {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [selectedStage, setSelectedStage] = useState<string>("");
//   const [selectedTag, setSelectedTag] = useState<string>("");
  
//   // Create post form
//   const [newPostTitle, setNewPostTitle] = useState("");
//   const [newPostContent, setNewPostContent] = useState("");
//   const [newPostTags, setNewPostTags] = useState("");

//   const visaStages = ["F1", "CPT", "OPT", "STEM-OPT", "H1B"];
//   const commonTags = ["question", "advice", "success-story", "timeline", "documentation"];

//   useEffect(() => {
//     fetchPosts();
//   }, [selectedStage, selectedTag]);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       let url = `${API_BASE}/forum/posts?limit=20`;
//       if (selectedStage) url += `&visa_stage=${selectedStage}`;
//       if (selectedTag) url += `&tag=${selectedTag}`;

//       const response = await fetch(url);
//       const data = await response.json();
      
//       // Client-side filter backup if backend doesn't filter tags properly
//       let filteredPosts = data.posts || [];
//       if (selectedTag && filteredPosts.length > 0) {
//         filteredPosts = filteredPosts.filter(post => 
//           post.tags && post.tags.includes(selectedTag.toLowerCase())
//         );
//       }
      
//       setPosts(filteredPosts);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("Failed to load posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createPost = async () => {
//     if (!newPostTitle.trim() || !newPostContent.trim()) {
//       toast.error("Title and content are required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: newPostTitle,
//           content: newPostContent,
//           tags: newPostTags.split(",").map(t => t.trim()).filter(Boolean)
//         })
//       });

//       if (response.ok) {
//         toast.success("Post created successfully!");
//         setShowCreateModal(false);
//         setNewPostTitle("");
//         setNewPostContent("");
//         setNewPostTags("");
//         fetchPosts();
//       } else {
//         toast.error("Failed to create post");
//       }
//     } catch (error) {
//       console.error("Error creating post:", error);
//       toast.error("Failed to create post");
//     }
//   };

//   const likePost = async (postId: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${postId}/like`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         fetchPosts();
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const formatDate = (timestamp: string) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     // Handle negative time (future dates - shouldn't happen but just in case)
//     if (diffMs < 0) return "just now";
    
//     if (diffMins < 1) return "just now";
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//               Community Forum
//             </h1>
//             <p className="text-slate-600 dark:text-slate-400 mt-2">
//               Connect with fellow international students
//             </p>
//           </div>
//           <Button
//             onClick={() => setShowCreateModal(true)}
//             className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             New Post
//           </Button>
//         </div>

//         {/* Filters */}
//         <Card className="p-4 mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//           <div className="flex items-center gap-4 flex-wrap">
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-slate-500" />
//               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                 Filters:
//               </span>
//             </div>

//             {/* Visa Stage Filter */}
//             <div className="flex gap-2">
//               {visaStages.map(stage => (
//                 <Badge
//                   key={stage}
//                   variant={selectedStage === stage ? "default" : "outline"}
//                   className="cursor-pointer"
//                   onClick={() => setSelectedStage(selectedStage === stage ? "" : stage)}
//                 >
//                   {stage}
//                 </Badge>
//               ))}
//             </div>

//             {/* Tag Filter */}
//             <div className="flex gap-2">
//               {commonTags.map(tag => (
//                 <Badge
//                   key={tag}
//                   variant={selectedTag === tag ? "default" : "outline"}
//                   className="cursor-pointer"
//                   onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
//                 >
//                   {tag}
//                 </Badge>
//               ))}
//             </div>

//             {(selectedStage || selectedTag) && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   setSelectedStage("");
//                   setSelectedTag("");
//                 }}
//               >
//                 <X className="w-4 h-4 mr-1" />
//                 Clear
//               </Button>
//             )}
//           </div>
//         </Card>

//         {/* Posts List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
//           </div>
//         ) : posts.length === 0 ? (
//           <Card className="p-12 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//             <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//             <p className="text-slate-600 dark:text-slate-400">
//               No posts found. Be the first to start a discussion!
//             </p>
//           </Card>
//         ) : (
//           <div className="space-y-4">
//             {posts.map(post => (
//               <Card
//                 key={post._id}
//                 className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur hover:shadow-lg transition-all cursor-pointer"
//                 onClick={() => {
//                   localStorage.setItem("currentPostId", post._id);
//                   onNavigate("forum-detail" as Screen);
//                 }}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="flex-1">
//                     {/* Post Header */}
//                     <div className="flex items-center gap-3 mb-3">
//                       <Badge variant="outline" className="text-xs">
//                         {post.visa_stage}
//                       </Badge>
//                       <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//                         <User className="w-3 h-3" />
//                         <span>{post.user_email.split("@")[0]}</span>
//                         <Clock className="w-3 h-3 ml-2" />
//                         <span>{formatDate(post.timestamp)}</span>
//                       </div>
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
//                       {post.title}
//                     </h3>

//                     {/* Content Preview */}
//                     <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
//                       {post.content}
//                     </p>

//                     {/* Tags */}
//                     {post.tags.length > 0 && (
//                       <div className="flex gap-2 mb-3">
//                         {post.tags.map(tag => (
//                           <Badge key={tag} variant="secondary" className="text-xs">
//                             #{tag}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Like Button */}
//                   <div className="flex flex-col items-center gap-1">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         likePost(post._id);
//                       }}
//                       className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
//                     >
//                       <ThumbsUp className="w-4 h-4" />
//                     </Button>
//                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       {post.likes}
//                     </span>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* Create Post Modal */}
//         {showCreateModal && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <Card className="max-w-2xl w-full p-6 bg-white dark:bg-slate-800">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//                   Create New Post
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setShowCreateModal(false)}
//                 >
//                   <X className="w-5 h-5" />
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Title
//                   </label>
//                   <Input
//                     placeholder="What's your question or topic?"
//                     value={newPostTitle}
//                     onChange={(e) => setNewPostTitle(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Content
//                   </label>
//                   <Textarea
//                     placeholder="Share your thoughts, questions, or experiences..."
//                     value={newPostContent}
//                     onChange={(e) => setNewPostContent(e.target.value)}
//                     rows={6}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Tags (comma-separated)
//                   </label>
//                   <Input
//                     placeholder="e.g., cpt, timeline, advice"
//                     value={newPostTags}
//                     onChange={(e) => setNewPostTags(e.target.value)}
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     onClick={createPost}
//                     className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500"
//                   >
//                     Post
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowCreateModal(false)}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







// import { useState, useEffect } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { 
//   MessageSquare, 
//   ThumbsUp, 
//   Plus, 
//   Filter,
//   X,
//   Clock,
//   User
// } from "lucide-react";
// import { toast } from "sonner";

// interface ForumProps {
//   onNavigate: (screen: Screen) => void;
//   theme: "light" | "dark";
// }

// interface Post {
//   _id: string;
//   title: string;
//   content: string;
//   user_email: string;
//   visa_stage: string;
//   tags: string[];
//   likes: number;
//   liked_by: string[];
//   timestamp: string;
// }

// const API_BASE = "http://localhost:8000";

// export function Forum({ onNavigate, theme }: ForumProps) {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [selectedStage, setSelectedStage] = useState<string>("");
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [timeUpdate, setTimeUpdate] = useState(0); // Force re-render for time updates
  
//   // Create post form
//   const [newPostTitle, setNewPostTitle] = useState("");
//   const [newPostContent, setNewPostContent] = useState("");
//   const [newPostTags, setNewPostTags] = useState("");

//   const visaStages = ["F1", "CPT", "OPT", "STEM-OPT", "H1B"];
//   const commonTags = ["f1", "cpt", "opt", "stem-opt", "h1b", "question", "advice", "timeline", "documentation", "experience"];

//   useEffect(() => {
//     fetchPosts();
//   }, [selectedStage, selectedTags]);

//   // Update timestamps every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeUpdate(prev => prev + 1);
//     }, 60000); // Update every 60 seconds

//     return () => clearInterval(timer);
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       let url = `${API_BASE}/forum/posts?limit=20`;
//       if (selectedStage) url += `&visa_stage=${selectedStage}`;

//       const response = await fetch(url);
//       const data = await response.json();
      
//       // Client-side filter for multiple tags (AND logic - must have ALL selected tags)
//       let filteredPosts = data.posts || [];
//       if (selectedTags.length > 0) {
//         filteredPosts = filteredPosts.filter(post => 
//           post.tags && selectedTags.every(tag => post.tags.includes(tag.toLowerCase()))
//         );
//       }
      
//       setPosts(filteredPosts);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("Failed to load posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createPost = async () => {
//     if (!newPostTitle.trim() || !newPostContent.trim()) {
//       toast.error("Title and content are required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: newPostTitle,
//           content: newPostContent,
//           tags: newPostTags.split(",").map(t => t.trim()).filter(Boolean)
//         })
//       });

//       if (response.ok) {
//         toast.success("Post created successfully!");
//         setShowCreateModal(false);
//         setNewPostTitle("");
//         setNewPostContent("");
//         setNewPostTags("");
//         fetchPosts();
//       } else {
//         toast.error("Failed to create post");
//       }
//     } catch (error) {
//       console.error("Error creating post:", error);
//       toast.error("Failed to create post");
//     }
//   };

//   const likePost = async (postId: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${postId}/like`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         fetchPosts();
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const formatDate = (timestamp: string) => {
//     // timeUpdate is used here to trigger recalculation every minute
//     const _ = timeUpdate;
    
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     // Handle negative time (future dates - shouldn't happen but just in case)
//     if (diffMs < 0) return "just now";
    
//     if (diffMins < 1) return "just now";
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//               Community Forum
//             </h1>
//             <p className="text-slate-600 dark:text-slate-400 mt-2">
//               Connect with fellow international students
//             </p>
//           </div>
//           <Button
//             onClick={() => setShowCreateModal(true)}
//             className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             New Post
//           </Button>
//         </div>

//         {/* Filters */}
//         <Card className="p-4 mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//           <div className="flex items-center gap-4 flex-wrap">
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-slate-500" />
//               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                 Filters:
//               </span>
//             </div>

//             {/* Visa Stage Filter */}
//             <div className="flex items-center gap-2">
//               <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                 Visa Stage:
//               </span>
//               {visaStages.map(stage => (
//                 <Badge
//                   key={stage}
//                   variant={selectedStage === stage ? "default" : "outline"}
//                   className="cursor-pointer"
//                   onClick={() => setSelectedStage(selectedStage === stage ? "" : stage)}
//                 >
//                   {stage}
//                 </Badge>
//               ))}
//             </div>

//             <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

//             {/* Tag Filter */}
//             <div className="flex items-center gap-2">
//               <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                 Tags:
//               </span>
//               {commonTags.map(tag => (
//                 <Badge
//                   key={tag}
//                   variant={selectedTags.includes(tag) ? "default" : "outline"}
//                   className="cursor-pointer"
//                   onClick={() => {
//                     if (selectedTags.includes(tag)) {
//                       setSelectedTags(selectedTags.filter(t => t !== tag));
//                     } else {
//                       setSelectedTags([...selectedTags, tag]);
//                     }
//                   }}
//                 >
//                   #{tag}
//                 </Badge>
//               ))}
//             </div>

//             {(selectedStage || selectedTags.length > 0) && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   setSelectedStage("");
//                   setSelectedTags([]);
//                 }}
//               >
//                 <X className="w-4 h-4 mr-1" />
//                 Clear
//               </Button>
//             )}
//           </div>
//         </Card>

//         {/* Posts List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
//           </div>
//         ) : posts.length === 0 ? (
//           <Card className="p-12 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//             <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//             <p className="text-slate-600 dark:text-slate-400">
//               No posts found. Be the first to start a discussion!
//             </p>
//           </Card>
//         ) : (
//           <div className="space-y-4">
//             {posts.map(post => (
//               <Card
//                 key={post._id}
//                 className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur hover:shadow-lg transition-all cursor-pointer"
//                 onClick={() => {
//                   localStorage.setItem("currentPostId", post._id);
//                   onNavigate("forum-detail" as Screen);
//                 }}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="flex-1">
//                     {/* Post Header */}
//                     <div className="flex items-center gap-3 mb-3">
//                       <Badge variant="outline" className="text-xs">
//                         {post.visa_stage}
//                       </Badge>
//                       <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//                         <User className="w-3 h-3" />
//                         <span>{post.user_email.split("@")[0]}</span>
//                         <Clock className="w-3 h-3 ml-2" />
//                         <span>{formatDate(post.timestamp)}</span>
//                       </div>
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
//                       {post.title}
//                     </h3>

//                     {/* Content Preview */}
//                     <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
//                       {post.content}
//                     </p>

//                     {/* Tags */}
//                     {post.tags.length > 0 && (
//                       <div className="flex gap-2 mb-3">
//                         {post.tags.map(tag => (
//                           <Badge key={tag} variant="secondary" className="text-xs">
//                             #{tag}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Like Button */}
//                   <div className="flex flex-col items-center gap-1">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         likePost(post._id);
//                       }}
//                       className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
//                     >
//                       <ThumbsUp className="w-4 h-4" />
//                     </Button>
//                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       {post.likes}
//                     </span>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* Create Post Modal */}
//         {showCreateModal && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <Card className="max-w-2xl w-full p-6 bg-white dark:bg-slate-800">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//                   Create New Post
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setShowCreateModal(false)}
//                 >
//                   <X className="w-5 h-5" />
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Title
//                   </label>
//                   <Input
//                     placeholder="What's your question or topic?"
//                     value={newPostTitle}
//                     onChange={(e) => setNewPostTitle(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Content
//                   </label>
//                   <Textarea
//                     placeholder="Share your thoughts, questions, or experiences..."
//                     value={newPostContent}
//                     onChange={(e) => setNewPostContent(e.target.value)}
//                     rows={6}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Tags (comma-separated)
//                   </label>
//                   <Input
//                     placeholder="e.g., cpt, timeline, advice"
//                     value={newPostTags}
//                     onChange={(e) => setNewPostTags(e.target.value)}
//                   />
//                   <div className="flex gap-2 mt-2 flex-wrap">
//                     <span className="text-xs text-slate-500">Suggestions:</span>
//                     {commonTags.map(tag => (
//                       <Badge
//                         key={tag}
//                         variant="outline"
//                         className="cursor-pointer text-xs hover:bg-purple-100 dark:hover:bg-purple-900"
//                         onClick={() => {
//                           const currentTags = newPostTags.split(',').map(t => t.trim()).filter(Boolean);
//                           if (!currentTags.includes(tag)) {
//                             setNewPostTags(currentTags.length > 0 ? `${newPostTags}, ${tag}` : tag);
//                           }
//                         }}
//                       >
//                         #{tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     onClick={createPost}
//                     className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500"
//                   >
//                     Post
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowCreateModal(false)}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// November 10, 2025

// import { useState, useEffect } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { 
//   MessageSquare, 
//   ThumbsUp, 
//   Plus, 
//   Filter,
//   X,
//   Clock,
//   User
// } from "lucide-react";
// import { toast } from "sonner";

// interface ForumProps {
//   onNavigate: (screen: Screen) => void;
//   theme: "light" | "dark";
// }

// interface Post {
//   _id: string;
//   title: string;
//   content: string;
//   user_email: string;
//   visa_stage: string;
//   tags: string[];
//   likes: number;
//   liked_by: string[];
//   timestamp: string;
// }

// const API_BASE = "http://localhost:8000";

// export function Forum({ onNavigate, theme }: ForumProps) {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [selectedStage, setSelectedStage] = useState<string>("");
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [timeUpdate, setTimeUpdate] = useState(0); // Force re-render for time updates
  
//   // Create post form
//   const [newPostTitle, setNewPostTitle] = useState("");
//   const [newPostContent, setNewPostContent] = useState("");
//   const [newPostTags, setNewPostTags] = useState("");

//   const visaStages = ["F1", "CPT", "OPT", "STEM-OPT", "H1B"];
//   const commonTags = ["f1", "cpt", "opt", "stem-opt", "h1b", "question", "advice", "timeline", "documentation", "experience"];

//   useEffect(() => {
//     fetchPosts();
//   }, [selectedStage, selectedTags]);

//   // Update timestamps every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeUpdate(prev => prev + 1);
//     }, 60000); // 60 seconds

//     return () => clearInterval(timer);
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       let url = `${API_BASE}/forum/posts?limit=20`;
//       if (selectedStage) url += `&visa_stage=${selectedStage}`;

//       const response = await fetch(url);
//       const data = await response.json();
      
//       // Client-side filter for multiple tags (AND logic - must have ALL selected tags)
//       let filteredPosts = data.posts || [];
//       if (selectedTags.length > 0) {
//         filteredPosts = filteredPosts.filter(post => 
//           post.tags && selectedTags.every(tag => post.tags.includes(tag.toLowerCase()))
//         );
//       }
      
//       setPosts(filteredPosts);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("Failed to load posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createPost = async () => {
//     if (!newPostTitle.trim() || !newPostContent.trim()) {
//       toast.error("Title and content are required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: newPostTitle,
//           content: newPostContent,
//           tags: newPostTags.split(",").map(t => t.trim()).filter(Boolean)
//         })
//       });

//       if (response.ok) {
//         toast.success("Post created successfully!");
//         setShowCreateModal(false);
//         setNewPostTitle("");
//         setNewPostContent("");
//         setNewPostTags("");
//         fetchPosts();
//       } else {
//         toast.error("Failed to create post");
//       }
//     } catch (error) {
//       console.error("Error creating post:", error);
//       toast.error("Failed to create post");
//     }
//   };

//   const likePost = async (postId: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${postId}/like`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         fetchPosts();
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const formatDate = (timestamp: string, _forceUpdate: number) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMs < 0) return "just now";
//     if (diffMins < 1) return "just now";
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2
//               className="bg-gradient-to-r from-[#6366F1] to-[#A855F7] bg-clip-text text-transparent"
//               style={{
//                 fontSize: "2rem",
//                 fontWeight: 700,
//               }}
//             >
//               Community Forum
//             </h2>
//             <p className="text-slate-600 dark:text-slate-400 mt-2">
//               Connect with fellow international students
//             </p>
//           </div>
//           <Button
//             onClick={() => setShowCreateModal(true)}
//             className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             New Post
//           </Button>
//         </div>

//         {/* Filters */}
//         <Card className="p-4 mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//           <div className="flex items-center gap-4 flex-wrap">
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-slate-500" />
//               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                 Filters:
//               </span>
//             </div>

//             {/* Visa Stage Filter */}
//             <div className="flex items-center gap-2">
//               <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                 Visa Stage:
//               </span>
//               {visaStages.map(stage => (
//                 <Badge
//                   key={stage}
//                   variant={selectedStage === stage ? "default" : "outline"}
//                   className="cursor-pointer"
//                   onClick={() => setSelectedStage(selectedStage === stage ? "" : stage)}
//                 >
//                   {stage}
//                 </Badge>
//               ))}
//             </div>

//             <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

//             {/* Tag Filter */}
//             <div className="flex items-center gap-2">
//               <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                 Tags:
//               </span>
//               {commonTags.map(tag => (
//                 <Badge
//                   key={tag}
//                   variant={selectedTags.includes(tag) ? "default" : "outline"}
//                   className="cursor-pointer"
//                   onClick={() => {
//                     if (selectedTags.includes(tag)) {
//                       setSelectedTags(selectedTags.filter(t => t !== tag));
//                     } else {
//                       setSelectedTags([...selectedTags, tag]);
//                     }
//                   }}
//                 >
//                   #{tag}
//                 </Badge>
//               ))}
//             </div>

//             {(selectedStage || selectedTags.length > 0) && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   setSelectedStage("");
//                   setSelectedTags([]);
//                 }}
//               >
//                 <X className="w-4 h-4 mr-1" />
//                 Clear
//               </Button>
//             )}
//           </div>
//         </Card>

//         {/* Posts List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
//           </div>
//         ) : posts.length === 0 ? (
//           <Card className="p-12 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//             <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//             <p className="text-slate-600 dark:text-slate-400">
//               No posts found. Be the first to start a discussion!
//             </p>
//           </Card>
//         ) : (
//           <div className="space-y-4">
//             {posts.map(post => (
//               <Card
//                 key={`${post._id}-${timeUpdate}`}
//                 className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur hover:shadow-lg transition-all cursor-pointer"
//                 onClick={() => {
//                   localStorage.setItem("currentPostId", post._id);
//                   onNavigate("forum-detail" as Screen);
//                 }}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="flex-1">
//                     {/* Post Header */}
//                     <div className="flex items-center gap-3 mb-3">
//                       <Badge variant="outline" className="text-xs">
//                         {post.visa_stage}
//                       </Badge>
//                       <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//                         <User className="w-3 h-3" />
//                         <span>{post.user_email.split("@")[0]}</span>
//                         <Clock className="w-3 h-3 ml-2" />
//                         <span>{formatDate(post.timestamp, timeUpdate)}</span>
//                       </div>
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
//                       {post.title}
//                     </h3>

//                     {/* Content Preview */}
//                     <p className="text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
//                       {post.content}
//                     </p>

//                     {/* Tags */}
//                     {post.tags.length > 0 && (
//                       <div className="flex gap-2 mb-3">
//                         {post.tags.map(tag => (
//                           <Badge key={tag} variant="secondary" className="text-xs">
//                             #{tag}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Like Button */}
//                   <div className="flex flex-col items-center gap-1">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         likePost(post._id);
//                       }}
//                       className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
//                     >
//                       <ThumbsUp className="w-4 h-4" />
//                     </Button>
//                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                       {post.likes}
//                     </span>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* Create Post Modal */}
//         {showCreateModal && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <Card className="max-w-2xl w-full p-6 bg-white dark:bg-slate-800">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//                   Create New Post
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setShowCreateModal(false)}
//                 >
//                   <X className="w-5 h-5" />
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Title
//                   </label>
//                   <Input
//                     placeholder="What's your question or topic?"
//                     value={newPostTitle}
//                     onChange={(e) => setNewPostTitle(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Content
//                   </label>
//                   <Textarea
//                     placeholder="Share your thoughts, questions, or experiences..."
//                     value={newPostContent}
//                     onChange={(e) => setNewPostContent(e.target.value)}
//                     rows={6}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
//                     Tags (comma-separated)
//                   </label>
//                   <Input
//                     placeholder="e.g., cpt, timeline, advice"
//                     value={newPostTags}
//                     onChange={(e) => setNewPostTags(e.target.value)}
//                   />
//                   <div className="flex gap-2 mt-2 flex-wrap">
//                     <span className="text-xs text-slate-500">Suggestions:</span>
//                     {commonTags.map(tag => (
//                       <Badge
//                         key={tag}
//                         variant="outline"
//                         className="cursor-pointer text-xs hover:bg-purple-100 dark:hover:bg-purple-900"
//                         onClick={() => {
//                           const currentTags = newPostTags.split(',').map(t => t.trim()).filter(Boolean);
//                           if (!currentTags.includes(tag)) {
//                             setNewPostTags(currentTags.length > 0 ? `${newPostTags}, ${tag}` : tag);
//                           }
//                         }}
//                       >
//                         #{tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     onClick={createPost}
//                     className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
//                   >
//                     Post
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowCreateModal(false)}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// Nov 22, 2025
// import { useState, useEffect } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { 
//   MessageSquare, 
//   ThumbsUp, 
//   Plus, 
//   Filter,
//   X,
//   Clock,
//   User,
//   Search
// } from "lucide-react";
// import { toast } from "sonner";

// interface ForumProps {
//   onNavigate: (screen: Screen) => void;
//   theme: "light" | "dark";
// }

// interface Post {
//   _id: string;
//   title: string;
//   content: string;
//   user_email: string;
//   visa_stage: string;
//   tags: string[];
//   likes: number;
//   liked_by: string[];
//   timestamp: string;
// }

// const API_BASE = "http://localhost:8000";

// export function Forum({ onNavigate, theme }: ForumProps) {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [selectedStage, setSelectedStage] = useState<string>("");
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [timeUpdate, setTimeUpdate] = useState(0);
//   const [currentUserId, setCurrentUserId] = useState<string>("");
  
//   // Create post form
//   const [newPostTitle, setNewPostTitle] = useState("");
//   const [newPostContent, setNewPostContent] = useState("");
//   const [newPostTags, setNewPostTags] = useState("");

//   const visaStages = ["F1", "CPT", "OPT", "STEM-OPT", "H1B"];
//   const commonTags = ["f1", "cpt", "opt", "stem-opt", "h1b", "question", "advice", "timeline", "documentation", "experience"];

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         setCurrentUserId(payload.sub || "");
//       } catch (error) {
//         console.error("Error parsing token:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     fetchPosts();
//   }, [selectedStage, selectedTags]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeUpdate(prev => prev + 1);
//     }, 60000);

//     return () => clearInterval(timer);
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       let url = `${API_BASE}/forum/posts?limit=20`;
//       if (selectedStage) url += `&visa_stage=${selectedStage}`;

//       const response = await fetch(url);
//       const data = await response.json();
      
//       let filteredPosts = data.posts || [];
//       if (selectedTags.length > 0) {
//         filteredPosts = filteredPosts.filter(post => 
//           post.tags && selectedTags.every(tag => post.tags.includes(tag.toLowerCase()))
//         );
//       }
      
//       setPosts(filteredPosts);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("Failed to load posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createPost = async () => {
//     if (!newPostTitle.trim() || !newPostContent.trim()) {
//       toast.error("Title and content are required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: newPostTitle,
//           content: newPostContent,
//           tags: newPostTags.split(",").map(t => t.trim()).filter(Boolean)
//         })
//       });

//       if (response.ok) {
//         toast.success("Post created successfully!");
//         setShowCreateModal(false);
//         setNewPostTitle("");
//         setNewPostContent("");
//         setNewPostTags("");
//         fetchPosts();
//       } else {
//         toast.error("Failed to create post");
//       }
//     } catch (error) {
//       console.error("Error creating post:", error);
//       toast.error("Failed to create post");
//     }
//   };

//   const likePost = async (postId: string) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${postId}/like`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setPosts(prevPosts => 
//           prevPosts.map(post => {
//             if (post._id === postId) {
//               const isLiked = post.liked_by.includes(currentUserId);
//               return {
//                 ...post,
//                 likes: data.likes,
//                 liked_by: isLiked 
//                   ? post.liked_by.filter(id => id !== currentUserId)
//                   : [...post.liked_by, currentUserId]
//               };
//             }
//             return post;
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const isLikedByCurrentUser = (post: Post): boolean => {
//     return post.liked_by && post.liked_by.includes(currentUserId);
//   };

//   const formatDate = (timestamp: string, _forceUpdate: number) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMs < 0) return "just now";
//     if (diffMins < 1) return "just now";
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-4xl">💬</span>
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
//               Community Forum
//             </h2>
//           </div>
//           <div className="flex items-center justify-between">
//             <p className="text-slate-600 dark:text-gray-400">
//               Connect with fellow international students
//             </p>
//             <Button
//               onClick={() => setShowCreateModal(true)}
//               className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               New Post
//             </Button>
//           </div>
//         </div>

//         {/* Filter Chips */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           <div className="flex items-center gap-2 mr-4">
//             <Filter className="w-4 h-4 text-slate-400 dark:text-gray-500" />
//             <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
//               Filters:
//             </span>
//           </div>
//           {visaStages.map(stage => (
//             <button
//               key={stage}
//               onClick={() => setSelectedStage(selectedStage === stage ? "" : stage)}
//               className={`
//                 px-5 py-2.5 rounded-xl transition-all
//                 ${
//                   selectedStage === stage
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
//                     : "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
//                 }
//               `}
//             >
//               {stage}
//             </button>
//           ))}
//         </div>

//         {/* Tag Filters */}
//         <div className="flex flex-wrap gap-2 mb-8">
//           <span className="text-sm font-medium text-slate-600 dark:text-gray-400 mr-2 flex items-center">
//             Tags:
//           </span>
//           {commonTags.map(tag => (
//             <button
//               key={tag}
//               onClick={() => {
//                 if (selectedTags.includes(tag)) {
//                   setSelectedTags(selectedTags.filter(t => t !== tag));
//                 } else {
//                   setSelectedTags([...selectedTags, tag]);
//                 }
//               }}
//               className={`
//                 px-5 py-2.5 rounded-xl transition-all
//                 ${
//                   selectedTags.includes(tag)
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
//                     : "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
//                 }
//               `}
//             >
//               #{tag}
//             </button>
//           ))}
          
//           {(selectedStage || selectedTags.length > 0) && (
//             <button
//               onClick={() => {
//                 setSelectedStage("");
//                 setSelectedTags([]);
//               }}
//               className="px-5 py-2.5 rounded-xl transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600"
//             >
//               <X className="w-4 h-4 mr-1 inline" />
//               Clear
//             </button>
//           )}
//         </div>

//         {/* Posts List */}
//         {loading ? (
//           <div className="text-center py-16">
//             <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-slate-600 dark:text-gray-400">Loading posts...</p>
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Search className="w-10 h-10 text-slate-400 dark:text-gray-600" />
//             </div>
//             <h3 className="mb-2 text-slate-900 dark:text-gray-100">
//               No posts found for this filter.
//             </h3>
//             <p className="text-slate-600 dark:text-gray-400">
//               Try selecting another filter or be the first to post!
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {posts.map(post => {
//               const isLiked = isLikedByCurrentUser(post);
              
//               return (
//                 <Card
//                   key={`${post._id}-${timeUpdate}`}
//                   className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all cursor-pointer"
//                   onClick={() => {
//                     localStorage.setItem("currentPostId", post._id);
//                     onNavigate("forum-detail" as Screen);
//                   }}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-4">
//                         <Badge className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
//                           {post.visa_stage}
//                         </Badge>
//                       </div>

//                       <h3 className="mb-3 text-xl text-slate-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold">
//                         {post.title}
//                       </h3>

//                       <p className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-2">
//                         {post.content}
//                       </p>

//                       <div className="flex items-center gap-4 mb-3 text-sm">
//                         <div className="flex items-center gap-1 text-slate-500 dark:text-gray-500">
//                           <User className="w-3 h-3" />
//                           <span>{post.user_email.split("@")[0]}</span>
//                         </div>
//                         <span className="text-slate-400 dark:text-gray-600">•</span>
//                         <div className="flex items-center gap-1 text-slate-500 dark:text-gray-500">
//                           <Clock className="w-3 h-3" />
//                           <span>{formatDate(post.timestamp, timeUpdate)}</span>
//                         </div>
//                       </div>

//                       {post.tags.length > 0 && (
//                         <div className="flex gap-2">
//                           {post.tags.map(tag => (
//                             <Badge 
//                               key={tag} 
//                               variant="secondary" 
//                               className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300"
//                             >
//                               #{tag}
//                             </Badge>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     {/* Like Button */}
//                     <div className="flex flex-col items-center gap-1">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           likePost(post._id);
//                         }}
//                         className={`hover:bg-indigo-50 dark:hover:bg-indigo-950/30 ${
//                           isLiked 
//                             ? 'text-indigo-600 dark:text-indigo-400' 
//                             : 'text-slate-500 dark:text-slate-400'
//                         }`}
//                       >
//                         <ThumbsUp 
//                           className="w-4 h-4" 
//                           fill={isLiked ? "currentColor" : "none"}
//                         />
//                       </Button>
//                       <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                         {post.likes}
//                       </span>
//                     </div>
//                   </div>
//                 </Card>
//               );
//             })}
//           </div>
//         )}

//         {/* Create Post Modal */}
//         {showCreateModal && (
//           <div 
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
//             onClick={() => setShowCreateModal(false)}
//           >
//             <Card 
//               className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-8 max-w-2xl w-full rounded-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
//                   Create New Post
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setShowCreateModal(false)}
//                   className="hover:bg-slate-100 dark:hover:bg-slate-700"
//                 >
//                   <X className="w-5 h-5" />
//                 </Button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
//                     Title
//                   </label>
//                   <Input
//                     placeholder="What's your question or topic?"
//                     value={newPostTitle}
//                     onChange={(e) => setNewPostTitle(e.target.value)}
//                     className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
//                     Content
//                   </label>
//                   <Textarea
//                     placeholder="Share your thoughts, questions, or experiences..."
//                     value={newPostContent}
//                     onChange={(e) => setNewPostContent(e.target.value)}
//                     rows={6}
//                     className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
//                     Tags (comma-separated)
//                   </label>
//                   <Input
//                     placeholder="e.g., cpt, timeline, advice"
//                     value={newPostTags}
//                     onChange={(e) => setNewPostTags(e.target.value)}
//                     className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
//                   />
//                   <div className="flex gap-2 mt-2 flex-wrap">
//                     <span className="text-xs text-slate-500 dark:text-gray-500">Suggestions:</span>
//                     {commonTags.map(tag => (
//                       <Badge
//                         key={tag}
//                         variant="outline"
//                         className="cursor-pointer text-xs hover:bg-indigo-100 dark:hover:bg-indigo-950/30 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300"
//                         onClick={() => {
//                           const currentTags = newPostTags.split(',').map(t => t.trim()).filter(Boolean);
//                           if (!currentTags.includes(tag)) {
//                             setNewPostTags(currentTags.length > 0 ? `${newPostTags}, ${tag}` : tag);
//                           }
//                         }}
//                       >
//                         #{tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     onClick={createPost}
//                     className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white shadow-md"
//                   >
//                     Post
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowCreateModal(false)}
//                     className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
//                   >
//                     Close
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// Nov 22, 2025
import { useState, useEffect } from "react";
import { Screen } from "../App";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Filter,
  X,
  Clock,
  User,
  Search,
  MoreVertical,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface ForumProps {
  onNavigate: (screen: Screen) => void;
  theme: "light" | "dark";
}

interface Post {
  _id: string;
  title: string;
  content: string;
  user_email: string;
  visa_stage: string;
  tags: string[];
  likes: number;
  liked_by: string[];
  timestamp: string;
}

const API_BASE = "http://localhost:8000";

export function Forum({ onNavigate, theme }: ForumProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeUpdate, setTimeUpdate] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  
  // Create post form
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");

  const visaStages = ["F1", "CPT", "OPT", "STEM-OPT", "H1B"];
  const commonTags = ["f1", "cpt", "opt", "stem-opt", "h1b", "question", "advice", "timeline", "documentation", "experience"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub || "");
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedStage, selectedTags]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUpdate(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/forum/posts?limit=20`;
      if (selectedStage) url += `&visa_stage=${selectedStage}`;

      const response = await fetch(url);
      const data = await response.json();
      
      let filteredPosts = data.posts || [];
      if (selectedTags.length > 0) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags && selectedTags.every(tag => post.tags.includes(tag.toLowerCase()))
        );
      }
      
      setPosts(filteredPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/forum/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          tags: newPostTags.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      if (response.ok) {
        toast.success("Post created successfully!");
        setShowCreateModal(false);
        setNewPostTitle("");
        setNewPostContent("");
        setNewPostTags("");
        fetchPosts();
      } else {
        toast.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  const likePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/forum/${postId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              const isLiked = post.liked_by.includes(currentUserId);
              return {
                ...post,
                likes: data.likes,
                liked_by: isLiked 
                  ? post.liked_by.filter(id => id !== currentUserId)
                  : [...post.liked_by, currentUserId]
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/forum/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success("Post deleted successfully");
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const isLikedByCurrentUser = (post: Post): boolean => {
    return post.liked_by && post.liked_by.includes(currentUserId);
  };

  const formatDate = (timestamp: string, _forceUpdate: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMs < 0) return "just now";
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">💬</span>
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
              Community Forum
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-slate-600 dark:text-gray-400">
              Connect with fellow international students
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2 mr-4">
            <Filter className="w-4 h-4 text-slate-400 dark:text-gray-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
              Filters:
            </span>
          </div>
          {visaStages.map(stage => (
            <button
              key={stage}
              onClick={() => setSelectedStage(selectedStage === stage ? "" : stage)}
              className={`
                px-5 py-2.5 rounded-xl transition-all
                ${
                  selectedStage === stage
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                }
              `}
            >
              {stage}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm font-medium text-slate-600 dark:text-gray-400 mr-2 flex items-center">
            Tags:
          </span>
          {commonTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              className={`
                px-5 py-2.5 rounded-xl transition-all
                ${
                  selectedTags.includes(tag)
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                }
              `}
            >
              #{tag}
            </button>
          ))}
          
          {(selectedStage || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSelectedStage("");
                setSelectedTags([]);
              }}
              className="px-5 py-2.5 rounded-xl transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600"
            >
              <X className="w-4 h-4 mr-1 inline" />
              Clear
            </button>
          )}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-gray-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400 dark:text-gray-600" />
            </div>
            <h3 className="mb-2 text-slate-900 dark:text-gray-100">
              No posts found for this filter.
            </h3>
            <p className="text-slate-600 dark:text-gray-400">
              Try selecting another filter or be the first to post!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => {
              const isLiked = isLikedByCurrentUser(post);
              
              return (
                <Card
                  key={`${post._id}-${timeUpdate}`}
                  className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => {
                    localStorage.setItem("currentPostId", post._id);
                    onNavigate("forum-detail" as Screen);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                          {post.visa_stage}
                        </Badge>
                        {/* Kebab menu - only show for post owner */}
                        {post.user_email === currentUserId && (
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuPostId(openMenuPostId === post._id ? null : post._id);
                              }}
                              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                            {/* Dropdown menu */}
                            {openMenuPostId === post._id && (
                              <div className="absolute right-0 top-8 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[120px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuPostId(null);
                                    if (window.confirm("Are you sure you want to delete this post?")) {
                                      deletePost(post._id);
                                    }
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Post
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <h3 className="mb-3 text-xl text-slate-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold">
                        {post.title}
                      </h3>

                      <p className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{post.user_email.split("@")[0]}</span>
                        </div>
                        <span className="text-slate-400 dark:text-gray-600">•</span>
                        <div className="flex items-center gap-1 text-slate-500 dark:text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(post.timestamp, timeUpdate)}</span>
                        </div>
                      </div>

                      {post.tags.length > 0 && (
                        <div className="flex gap-2">
                          {post.tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Like Button */}
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          likePost(post._id);
                        }}
                        className={`hover:bg-indigo-50 dark:hover:bg-indigo-950/30 ${
                          isLiked 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <ThumbsUp 
                          className="w-4 h-4" 
                          fill={isLiked ? "currentColor" : "none"}
                        />
                      </Button>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {post.likes}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <Card 
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-8 max-w-2xl w-full rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                  Create New Post
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                  className="hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
                    Title
                  </label>
                  <Input
                    placeholder="What's your question or topic?"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
                    Content
                  </label>
                  <Textarea
                    placeholder="Share your thoughts, questions, or experiences..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={6}
                    className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
                    Tags (comma-separated)
                  </label>
                  <Input
                    placeholder="e.g., cpt, timeline, advice"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-gray-500">Suggestions:</span>
                    {commonTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer text-xs hover:bg-indigo-100 dark:hover:bg-indigo-950/30 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300"
                        onClick={() => {
                          const currentTags = newPostTags.split(',').map(t => t.trim()).filter(Boolean);
                          if (!currentTags.includes(tag)) {
                            setNewPostTags(currentTags.length > 0 ? `${newPostTags}, ${tag}` : tag);
                          }
                        }}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={createPost}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white shadow-md"
                  >
                    Post
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}