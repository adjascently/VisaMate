// import { useState, useEffect } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { 
//   ArrowLeft,
//   ThumbsUp, 
//   MessageSquare,
//   Clock,
//   User,
//   Send
// } from "lucide-react";
// import { toast } from "sonner";

// interface ForumPostDetailProps {
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

// interface Comment {
//   _id: string;
//   text: string;
//   user_email: string;
//   timestamp: string;
// }

// const API_BASE = "http://localhost:8000";

// export function ForumPostDetail({ onNavigate, theme }: ForumPostDetailProps) {
//   const [post, setPost] = useState<Post | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [newComment, setNewComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchPostDetail();
//   }, []);

//   const fetchPostDetail = async () => {
//     try {
//       setLoading(true);
//       const postId = localStorage.getItem("currentPostId");
//       if (!postId) {
//         toast.error("No post selected");
//         onNavigate("forum" as Screen);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/forum/${postId}`);
//       const data = await response.json();
//       setPost(data.post);
//       setComments(data.comments || []);
//     } catch (error) {
//       console.error("Error fetching post:", error);
//       toast.error("Failed to load post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const likePost = async () => {
//     if (!post) return;
    
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${post._id}/like`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         fetchPostDetail();
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const submitComment = async () => {
//     if (!post || !newComment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${post._id}/comment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ text: newComment })
//       });

//       if (response.ok) {
//         toast.success("Comment added!");
//         setNewComment("");
//         fetchPostDetail();
//       } else {
//         toast.error("Failed to add comment");
//       }
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       toast.error("Failed to add comment");
//     } finally {
//       setSubmitting(false);
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

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
//         <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
//         <Card className="p-8 text-center">
//           <p className="text-slate-600 dark:text-slate-400">Post not found</p>
//           <Button onClick={() => onNavigate("forum" as Screen)} className="mt-4">
//             Back to Forum
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Back Button */}
//         <Button
//           variant="ghost"
//           onClick={() => onNavigate("forum" as Screen)}
//           className="mb-6"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Forum
//         </Button>

//         {/* Post Card */}
//         <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur mb-6">
//           {/* Post Header */}
//           <div className="flex items-center gap-3 mb-4">
//             <Badge variant="outline" className="text-sm">
//               {post.visa_stage}
//             </Badge>
//             <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//               <User className="w-4 h-4" />
//               <span>{post.user_email.split("@")[0]}</span>
//               <Clock className="w-4 h-4 ml-3" />
//               <span>{formatDate(post.timestamp)}</span>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
//             {post.title}
//           </h1>

//           {/* Content */}
//           <div className="prose dark:prose-invert max-w-none mb-6">
//             <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
//               {post.content}
//             </p>
//           </div>

//           {/* Tags */}
//           {post.tags.length > 0 && (
//             <div className="flex gap-2 mb-6">
//               {post.tags.map(tag => (
//                 <Badge key={tag} variant="secondary">
//                   #{tag}
//                 </Badge>
//               ))}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
//             <Button
//               variant="outline"
//               onClick={likePost}
//               className="gap-2"
//             >
//               <ThumbsUp className="w-4 h-4" />
//               {post.likes} Likes
//             </Button>
//             <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//               <MessageSquare className="w-4 h-4" />
//               <span>{comments.length} Comments</span>
//             </div>
//           </div>
//         </Card>

//         {/* Add Comment Section */}
//         <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur mb-6">
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//             Add a Comment
//           </h3>
//           <div className="flex gap-3">
//             <Textarea
//               placeholder="Share your thoughts..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               rows={3}
//               className="flex-1"
//             />
//             <Button
//               onClick={submitComment}
//               disabled={submitting || !newComment.trim()}
//               className="bg-gradient-to-r from-purple-600 to-blue-500"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </Card>

//         {/* Comments List */}
//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
//             Comments ({comments.length})
//           </h3>
          
//           {comments.length === 0 ? (
//             <Card className="p-8 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//               <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//               <p className="text-slate-600 dark:text-slate-400">
//                 No comments yet. Be the first to comment!
//               </p>
//             </Card>
//           ) : (
//             comments.map(comment => (
//               <Card
//                 key={comment._id}
//                 className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur"
//               >
//                 <div className="flex items-center gap-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
//                   <User className="w-4 h-4" />
//                   <span className="font-medium">{comment.user_email.split("@")[0]}</span>
//                   <Clock className="w-3 h-3 ml-2" />
//                   <span>{formatDate(comment.timestamp)}</span>
//                 </div>
//                 <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
//                   {comment.text}
//                 </p>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// ********************************************

// import { useState, useEffect } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { 
//   ArrowLeft,
//   ThumbsUp, 
//   MessageSquare,
//   Clock,
//   User,
//   Send
// } from "lucide-react";
// import { toast } from "sonner";

// interface ForumPostDetailProps {
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

// interface Comment {
//   _id: string;
//   text: string;
//   user_email: string;
//   timestamp: string;
// }

// const API_BASE = "http://localhost:8000";

// export function ForumPostDetail({ onNavigate, theme }: ForumPostDetailProps) {
//   const [post, setPost] = useState<Post | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [newComment, setNewComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchPostDetail();
//   }, []);

//   const fetchPostDetail = async () => {
//     try {
//       setLoading(true);
//       const postId = localStorage.getItem("currentPostId");
//       if (!postId) {
//         toast.error("No post selected");
//         onNavigate("forum" as Screen);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/forum/${postId}`);
//       const data = await response.json();
//       setPost(data.post);
//       setComments(data.comments || []);
//     } catch (error) {
//       console.error("Error fetching post:", error);
//       toast.error("Failed to load post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const likePost = async () => {
//     if (!post) return;
    
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${post._id}/like`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         fetchPostDetail();
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const submitComment = async () => {
//     if (!post || !newComment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${post._id}/comment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ text: newComment })
//       });

//       if (response.ok) {
//         toast.success("Comment added!");
//         setNewComment("");
//         fetchPostDetail();
//       } else {
//         toast.error("Failed to add comment");
//       }
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       toast.error("Failed to add comment");
//     } finally {
//       setSubmitting(false);
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

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
//         <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
//         <Card className="p-8 text-center">
//           <p className="text-slate-600 dark:text-slate-400">Post not found</p>
//           <Button onClick={() => onNavigate("forum" as Screen)} className="mt-4">
//             Back to Forum
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Back Button */}
//         <Button
//           variant="ghost"
//           onClick={() => onNavigate("forum" as Screen)}
//           className="mb-6"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Forum
//         </Button>

//         {/* Post Card */}
//         <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur mb-6">
//           {/* Post Header */}
//           <div className="flex items-center gap-3 mb-4">
//             <Badge variant="outline" className="text-sm">
//               {post.visa_stage}
//             </Badge>
//             <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//               <User className="w-4 h-4" />
//               <span>{post.user_email.split("@")[0]}</span>
//               <Clock className="w-4 h-4 ml-3" />
//               <span>{formatDate(post.timestamp)}</span>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
//             {post.title}
//           </h1>

//           {/* Content */}
//           <div className="prose dark:prose-invert max-w-none mb-6">
//             <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
//               {post.content}
//             </p>
//           </div>

//           {/* Tags */}
//           {post.tags.length > 0 && (
//             <div className="flex gap-2 mb-6">
//               {post.tags.map(tag => (
//                 <Badge key={tag} variant="secondary">
//                   #{tag}
//                 </Badge>
//               ))}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
//             <Button
//               variant="outline"
//               onClick={likePost}
//               className="gap-2"
//             >
//               <ThumbsUp className="w-4 h-4" />
//               {post.likes} Likes
//             </Button>
//             <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//               <MessageSquare className="w-4 h-4" />
//               <span>{comments.length} Comments</span>
//             </div>
//           </div>
//         </Card>

//         {/* Add Comment Section */}
//         <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur mb-6">
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//             Add a Comment
//           </h3>
//           <div className="flex gap-3">
//             <Textarea
//               placeholder="Share your thoughts..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               rows={3}
//               className="flex-1"
//             />
//             <Button
//               onClick={submitComment}
//               disabled={submitting || !newComment.trim()}
//               className="bg-gradient-to-r from-purple-600 to-blue-500"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </Card>

//         {/* Comments List */}
//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
//             Comments ({comments.length})
//           </h3>
          
//           {comments.length === 0 ? (
//             <Card className="p-8 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//               <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//               <p className="text-slate-600 dark:text-slate-400">
//                 No comments yet. Be the first to comment!
//               </p>
//             </Card>
//           ) : (
//             comments.map(comment => (
//               <Card
//                 key={comment._id}
//                 className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur"
//               >
//                 <div className="flex items-center gap-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
//                   <User className="w-4 h-4" />
//                   <span className="font-medium">{comment.user_email.split("@")[0]}</span>
//                   <Clock className="w-3 h-3 ml-2" />
//                   <span>{formatDate(comment.timestamp)}</span>
//                 </div>
//                 <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
//                   {comment.text}
//                 </p>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import { Screen } from "../App";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Textarea } from "./ui/textarea";
// import { Badge } from "./ui/badge";
// import { 
//   ArrowLeft,
//   ThumbsUp, 
//   MessageSquare,
//   Clock,
//   User,
//   Send
// } from "lucide-react";
// import { toast } from "sonner";

// interface ForumPostDetailProps {
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

// interface Comment {
//   _id: string;
//   text: string;
//   user_email: string;
//   timestamp: string;
// }

// const API_BASE = "http://localhost:8000";

// export function ForumPostDetail({ onNavigate, theme }: ForumPostDetailProps) {
//   const [post, setPost] = useState<Post | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [newComment, setNewComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [timeUpdate, setTimeUpdate] = useState(0); // Force re-render for time updates

//   useEffect(() => {
//     fetchPostDetail();
//   }, []);

//   // Update timestamps every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeUpdate(prev => prev + 1);
//     }, 60000); // Update every 60 seconds

//     return () => clearInterval(timer);
//   }, []);

//   const fetchPostDetail = async () => {
//     try {
//       setLoading(true);
//       const postId = localStorage.getItem("currentPostId");
//       if (!postId) {
//         toast.error("No post selected");
//         onNavigate("forum" as Screen);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/forum/${postId}`);
//       const data = await response.json();
//       setPost(data.post);
//       setComments(data.comments || []);
//     } catch (error) {
//       console.error("Error fetching post:", error);
//       toast.error("Failed to load post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const likePost = async () => {
//     if (!post) return;
    
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE}/forum/${post._id}/like`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         fetchPostDetail();
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   const submitComment = async () => {
//     if (!post || !newComment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("token");
//       const userEmail = localStorage.getItem("userEmail");
      
//       const response = await fetch(`${API_BASE}/forum/${post._id}/comment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ text: newComment })
//       });

//       if (response.ok) {
//         toast.success("Comment added!");
        
//         // Add comment to list immediately without refetching
//         const newCommentObj: Comment = {
//           _id: Date.now().toString(), // Temporary ID
//           text: newComment,
//           user_email: userEmail || "You",
//           timestamp: new Date().toISOString()
//         };
//         setComments([...comments, newCommentObj]);
//         setNewComment("");
//       } else {
//         toast.error("Failed to add comment");
//       }
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       toast.error("Failed to add comment");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatDate = (timestamp: string, _forceUpdate: number) => {
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

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
//         <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
//         <Card className="p-8 text-center">
//           <p className="text-slate-600 dark:text-slate-400">Post not found</p>
//           <Button onClick={() => onNavigate("forum" as Screen)} className="mt-4">
//             Back to Forum
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Back Button */}
//         <Button
//           variant="ghost"
//           onClick={() => onNavigate("forum" as Screen)}
//           className="mb-6"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Forum
//         </Button>

//         {/* Post Card */}
//         <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur mb-6">
//           {/* Post Header */}
//           <div className="flex items-center gap-3 mb-4">
//             <Badge variant="outline" className="text-sm">
//               {post.visa_stage}
//             </Badge>
//             <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//               <User className="w-4 h-4" />
//               <span>{post.user_email.split("@")[0]}</span>
//               <Clock className="w-4 h-4 ml-3" />
//               <span>{formatDate(post.timestamp, timeUpdate)}</span>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
//             {post.title}
//           </h1>

//           {/* Content */}
//           <div className="prose dark:prose-invert max-w-none mb-6">
//             <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
//               {post.content}
//             </p>
//           </div>

//           {/* Tags */}
//           {post.tags.length > 0 && (
//             <div className="flex gap-2 mb-6">
//               {post.tags.map(tag => (
//                 <Badge key={tag} variant="secondary">
//                   #{tag}
//                 </Badge>
//               ))}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
//             <Button
//               variant="outline"
//               onClick={likePost}
//               className="gap-2"
//             >
//               <ThumbsUp className="w-4 h-4" />
//               {post.likes} Likes
//             </Button>
//             <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//               <MessageSquare className="w-4 h-4" />
//               <span>{comments.length} Comments</span>
//             </div>
//           </div>
//         </Card>

//         {/* Add Comment Section */}
//         <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur mb-6">
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//             Add a Comment
//           </h3>
//           <div className="flex gap-3">
//             <Textarea
//               placeholder="Share your thoughts..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               rows={3}
//               className="flex-1"
//             />
//             <Button
//               onClick={submitComment}
//               disabled={submitting || !newComment.trim()}
//               className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </Card>

//         {/* Comments List */}
//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
//             Comments ({comments.length})
//           </h3>
          
//           {comments.length === 0 ? (
//             <Card className="p-8 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur">
//               <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//               <p className="text-slate-600 dark:text-slate-400">
//                 No comments yet. Be the first to comment!
//               </p>
//             </Card>
//           ) : (
//             comments.map(comment => (
//               <Card
//                 key={`${comment._id}-${timeUpdate}`}
//                 className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur"
//               >
//                 <div className="flex items-center gap-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
//                   <User className="w-4 h-4" />
//                   <span className="font-medium">{comment.user_email.split("@")[0]}</span>
//                   <Clock className="w-3 h-3 ml-2" />
//                   <span>{formatDate(comment.timestamp, timeUpdate)}</span>
//                 </div>
//                 <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
//                   {comment.text}
//                 </p>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// Nov 22, 2025
import { useState, useEffect } from "react";
import { Screen } from "../App";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  ThumbsUp, 
  MessageSquare,
  Clock,
  User,
  Send,
  MoreVertical,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface ForumPostDetailProps {
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

interface Comment {
  _id: string;
  text: string;
  user_email: string;
  timestamp: string;
}

const API_BASE = "http://localhost:8000";

export function ForumPostDetail({ onNavigate, theme }: ForumPostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timeUpdate, setTimeUpdate] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [openMenuCommentId, setOpenMenuCommentId] = useState<string | null>(null);

  // Get current user ID from token
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
    fetchPostDetail();
  }, []);

  // Update timestamps every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUpdate(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuCommentId) {
        setOpenMenuCommentId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuCommentId]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const postId = localStorage.getItem("currentPostId");
      if (!postId) {
        toast.error("No post selected");
        onNavigate("forum" as Screen);
        return;
      }

      const response = await fetch(`${API_BASE}/forum/${postId}`);
      const data = await response.json();
      setPost(data.post);
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const likePost = async () => {
    if (!post) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/forum/${post._id}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPostDetail();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const submitComment = async () => {
    if (!post || !newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      
      console.log("Submitting comment:", newComment);
      
      const response = await fetch(`${API_BASE}/forum/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Comment added successfully:", data);
        toast.success("Comment added!");
        setNewComment("");
        // Refetch to get complete, accurate data from server
        await fetchPostDetail();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to add comment:", errorData);
        toast.error(errorData.detail || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Network error - please try again");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Ctrl+Enter to submit comment
  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitComment();
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!post) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/forum/${post._id}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success("Comment deleted successfully");
        setComments(prevComments => prevComments.filter(c => c._id !== commentId));
      } else {
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-slate-600 dark:text-gray-400">Post not found</p>
          <Button onClick={() => onNavigate("forum" as Screen)} className="mt-4">
            Back to Forum
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("forum" as Screen)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forum
        </Button>

        {/* Post Card */}
        <Card className="p-8 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 backdrop-blur mb-6">
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-sm">
              {post.visa_stage}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-500">
              <User className="w-4 h-4" />
              <span>{post.user_email.split("@")[0]}</span>
              <Clock className="w-4 h-4 ml-3" />
              <span>{formatDate(post.timestamp, timeUpdate)}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-gray-100 mb-4">
            {post.title}
          </h1>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-slate-700 dark:text-gray-300 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 mb-6">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={likePost}
              className="gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              {post.likes} Likes
            </Button>
            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
              <MessageSquare className="w-4 h-4" />
              <span>{comments.length} Comments</span>
            </div>
          </div>
        </Card>

        {/* Add Comment Section */}
        <Card className="p-6 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 backdrop-blur mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
            Add a Comment
          </h3>
          <div className="flex gap-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleCommentKeyDown}
              rows={3}
              className="flex-1"
            />
            <Button
              onClick={submitComment}
              disabled={submitting || !newComment.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
            Comments ({comments.length})
          </h3>
          
          {comments.length === 0 ? (
            <Card className="p-8 text-center bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 backdrop-blur">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </Card>
          ) : (
            comments.map(comment => (
              <Card
                key={`${comment._id}-${timeUpdate}`}
                className="p-6 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 backdrop-blur"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-500">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{comment.user_email.split("@")[0]}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>{formatDate(comment.timestamp, timeUpdate)}</span>
                  </div>

                  {/* Kebab menu - only show for comment owner */}
                  {comment.user_email === currentUserId && (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuCommentId(openMenuCommentId === comment._id ? null : comment._id);
                        }}
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 h-6 w-6 p-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      
                      {/* Dropdown menu */}
                      {openMenuCommentId === comment._id && (
                        <div className="absolute right-0 top-6 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[140px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuCommentId(null);
                              if (window.confirm("Are you sure you want to delete this comment?")) {
                                deleteComment(comment._id);
                              }
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Comment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-slate-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.text}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}