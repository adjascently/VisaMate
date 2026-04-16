// // Nov 18, 2025
// import { useState, useEffect } from "react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Card } from "./ui/card";
// import { Badge } from "./ui/badge";
// import {
//   Send,
//   User,
//   Sparkles,
//   Paperclip,
//   Mic,
//   X,
//   TrendingUp,
//   Newspaper,
//   Clock,
//   ExternalLink,
//   Loader2,
// } from "lucide-react";
// import { Collapsible, CollapsibleContent } from "./ui/collapsible";
// import { Screen } from "../App";
// import { toast } from "sonner";
// import { VisaStageTimeline } from "./visa-stage-timeline";

// const API_BASE = "http://localhost:8000";

// // Example and trending question data
// const exampleQuestions = [
//   "Can I work remotely while on CPT?",
//   "When should I apply for STEM OPT?",
//   "What's the 60-day grace period after OPT?",
// ];

// const trendingQuestions = [
//   "How long can I work on CPT?",
//   "What documents do I need for OPT?",
//   "Can I change employers on H-1B?",
//   "What's the STEM OPT unemployment limit?",
// ];

// interface Message {
//   id: number;
//   role: "user" | "assistant" | "system";
//   content: string;
//   sources?: any[];
//   confidence?: number;
//   trust_score?: number;
// }

// interface UploadedDocument {
//   name: string;
//   size: string;
//   status: "processing" | "processed";
//   extracted?: {
//     sevisId: string;
//     programStart: string;
//     programEnd: string;
//     employer: string;
//   };
// }

// const initialMessages: Message[] = [];

// interface UnifiedChatProps {
//   onNavigate: (screen: Screen) => void;
// }

// export function UnifiedChat({ onNavigate }: UnifiedChatProps) {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState<UploadedDocument | null>(null);
//   const [isDocCardOpen, setIsDocCardOpen] = useState(true);
//   const [userId, setUserId] = useState<string>("");
//   const [currentStage, setCurrentStage] = useState<string>("onboarding");

//   // Initialize user_id on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Extract user_id from token or generate one
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const email = payload.sub || `user_${Date.now()}`;
//         setUserId(email);
//         console.log("User ID set to:", email);
//       } catch (error) {
//         console.error("Error parsing token:", error);
//         setUserId(`user_${Date.now()}`);
//       }
//     }
//   }, []);

//   // Initial greeting
//   const handleInitialGreeting = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("user_id", userId || `user_${Date.now()}`);
//       formData.append("message", "");

//       const response = await fetch(`${API_BASE}/chat/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) throw new Error("Failed to start conversation");

//       const data = await response.json();
      
//       if (data.messages && data.messages.length > 0) {
//         const newMessages = data.messages.map((msg: any, idx: number) => ({
//           id: messages.length + idx + 1,
//           role: "assistant" as const,
//           content: msg.content
//         }));
//         setMessages(newMessages);
//         setCurrentStage(data.stage || "onboarding");
//       }
//     } catch (error) {
//       console.error("Error starting conversation:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send message to new /chat endpoint
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to use the assistant");
//       onNavigate("auth");
//       return;
//     }

//     const userMessage: Message = {
//       id: messages.length + 1,
//       role: "user",
//       content: input,
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("user_id", userId || `user_${Date.now()}`);
//       formData.append("message", input);

//       const response = await fetch(`${API_BASE}/chat/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error("Failed to get response");
//       }

//       const data = await response.json();

//       // Handle multiple messages in response
//       if (data.messages && data.messages.length > 0) {
//         const newMessages = data.messages.map((msg: any, idx: number) => ({
//           id: messages.length + idx + 2,
//           role: "assistant" as const,
//           content: msg.content
//         }));
//         setMessages((prev) => [...prev, ...newMessages]);
//         setCurrentStage(data.stage || currentStage);
//       } else {
//         // Fallback for single message
//         const assistantMessage: Message = {
//           id: messages.length + 2,
//           role: "assistant",
//           content: data.content || "I couldn't generate a response.",
//         };
//         setMessages((prev) => [...prev, assistantMessage]);
//       }
//     } catch (error) {
//       console.error("Error querying API:", error);
//       toast.error("Failed to get response from assistant");
      
//       const errorMessage: Message = {
//         id: messages.length + 2,
//         role: "assistant",
//         content: "Sorry, I encountered an error processing your request. Please try again.",
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // // 📎 Simulate file upload
//   // const handleFileUpload = () => {
//   //   setUploadedFile({
//   //     name: "I-20_John_Doe.pdf",
//   //     size: "1.2 MB",
//   //     status: "processing",
//   //   });

//   //   setTimeout(() => {
//   //     setUploadedFile({
//   //       name: "I-20_John_Doe.pdf",
//   //       size: "1.2 MB",
//   //       status: "processed",
//   //       extracted: {
//   //         sevisId: "N0001234567",
//   //         programStart: "Aug 20 2024",
//   //         programEnd: "May 31 2025",
//   //         employer: "Airwallex Inc.",
//   //       },
//   //     });
//   //     setIsDocCardOpen(true);
//   //   }, 2000);
//   // };
//   // 📎 Real file upload to backend
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to upload documents");
//       return;
//     }
  
//     setUploadedFile({
//       name: file.name,
//       size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//       status: "processing",
//     });
  
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
  
//       const response = await fetch(`${API_BASE}/upload/upload/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Upload failed");
//       }
  
//       const data = await response.json();
//       console.log("Upload response:", data);
      
//       // Extract data from parsed_fields object
//       const fields = data.parsed_fields || {};
      
//       setUploadedFile({
//         name: file.name,
//         size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//         status: "processed",
//         extracted: {
//           sevisId: fields.SEVIS_ID || "Not found",
//           programStart: fields.Program_Start_Date || "Not found", 
//           programEnd: fields.Program_End_Date || "Not found",
//           employer: fields.Employer_Name || "Not found",
//         },
//       });
//       setIsDocCardOpen(true);
//       toast.success(`✅ ${data.doc_type} processed! Stage: ${data.detected_stage}`);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to process document");
//       setUploadedFile(null);
//     }
//   };
  
  
  
    


  

//   const handleRemoveFile = () => setUploadedFile(null);
//   const handleQuestionClick = (question: string) => setInput(question);

//   const isEmpty = messages.length === 0;

//   return (
//     <div className="flex flex-col h-[calc(100vh-73px)]">
//       {/* Visa Timeline */}
//       <VisaStageTimeline />
      
//       {/* Main Content */}
//       <div className="flex flex-1 bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-[#0F172A] dark:to-[#1e1b4b]/20 overflow-hidden">
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
//         <div className="flex-1 overflow-y-auto px-6 py-8">
//           {/* Empty State */}
//           {isEmpty ? (
//             <div className="text-center py-16">
//               <div className="w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/50">
//                 <Sparkles className="w-12 h-12 text-white" />
//               </div>
//               <h3 className="mb-6 text-slate-900 dark:text-gray-100 text-xl">
//                 Hi there 👋 I'm VisaMate.
//               </h3>
//               <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
//                 Click below to start your visa compliance journey, or ask me anything about your visa process:
//               </p>
//               <Button
//                 onClick={handleInitialGreeting}
//                 disabled={loading}
//                 className="mb-8 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-2xl px-8 py-4"
//               >
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
//                 Start Conversation
//               </Button>
//               <div className="space-y-3 max-w-2xl mx-auto">
//                 {exampleQuestions.map((question, i) => (
//                   <button
//                     key={i}
//                     onClick={() => handleQuestionClick(question)}
//                     className="w-full text-left px-6 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
//                   >
//                     <p className="text-slate-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
//                       "{question}"
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             // Messages
//             <div className="space-y-6 max-w-3xl mx-auto">
//               {messages.map((message) =>
//                 message.role === "system" ? (
//                   <div key={message.id} className="text-center py-2">
//                     <span className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 rounded-full text-sm">
//                       {message.content}
//                     </span>
//                   </div>
//                 ) : (
//                   <div
//                     key={message.id}
//                     className={`flex gap-4 ${
//                       message.role === "user" ? "justify-end" : ""
//                     }`}
//                   >
//                     {message.role === "assistant" && (
//                       <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
//                         <Sparkles className="w-5 h-5 text-white" />
//                       </div>
//                     )}

//                     <div
//                       className={`flex-1 max-w-2xl ${
//                         message.role === "user" ? "flex justify-end" : ""
//                       }`}
//                     >
//                       <div
//                         className={`rounded-2xl px-6 py-4 ${
//                           message.role === "user"
//                             ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-purple-500/20"
//                             : "bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-lg"
//                         }`}
//                       >
//                         <p
//                           className={
//                             message.role === "user"
//                               ? "text-white"
//                               : "text-slate-700 dark:text-gray-200 whitespace-pre-wrap"
//                           }
//                         >
//                           {message.content}
//                         </p>

//                         {/* Assistant footer with sources and confidence */}
//                         {message.role === "assistant" && (message.sources || message.trust_score || message.confidence) && (
//                           <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
//                             {/* Sources */}
//                             {message.sources && message.sources.length > 0 && (
//                               <div className="mb-3">
//                                 <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">Sources:</p>
//                                 <div className="flex flex-wrap gap-2">
//                                   {message.sources.slice(0, 3).map((source, idx) => (
//                                     <Badge
//                                       key={idx}
//                                       variant="outline"
//                                       className="text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
//                                     >
//                                       📄 {source.source || `Source ${idx + 1}`}
//                                     </Badge>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}

//                             {/* Trust Score / Confidence */}
//                             <div className="flex flex-wrap items-center gap-3 text-sm">
//                               {(message.trust_score || message.confidence) && (
//                                 <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
//                                   Trust Score: {message.trust_score || message.confidence}%
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {message.role === "user" && (
//                       <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
//                         <User className="w-5 h-5 text-slate-600 dark:text-gray-300" />
//                       </div>
//                     )}
//                   </div>
//                 )
//               )}

//               {/* Loading indicator */}
//               {loading && (
//                 <div className="flex gap-4">
//                   <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
//                     <Sparkles className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex-1 max-w-2xl">
//                     <div className="rounded-2xl px-6 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-lg">
//                       <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         <span>Thinking...</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Uploaded document preview */}
//           {uploadedFile && (
//             <div className="max-w-3xl mx-auto mt-6">
//               <Collapsible open={isDocCardOpen} onOpenChange={setIsDocCardOpen}>
//                 <Card className="bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xl p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
//                         <span className="text-2xl">📄</span>
//                       </div>
//                       <div>
//                         <h4 className="text-slate-900 dark:text-gray-100">
//                           {uploadedFile.name}
//                         </h4>
//                         <p className="text-sm text-slate-500 dark:text-gray-500">
//                           {uploadedFile.size}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {uploadedFile.status === "processed" && (
//                         <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
//                           ✅ Processed Successfully
//                         </Badge>
//                       )}
//                       {uploadedFile.status === "processing" && (
//                         <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
//                           ⏳ Processing...
//                         </Badge>
//                       )}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={handleRemoveFile}
//                         className="h-8 w-8 rounded-lg"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   {uploadedFile.status === "processed" &&
//                     uploadedFile.extracted && (
//                       <CollapsibleContent>
//                         <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-4">
//                           <h5 className="mb-3 text-slate-900 dark:text-gray-100">
//                             Extracted Information
//                           </h5>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 SEVIS ID
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.sevisId}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Program Start
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.programStart}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Program End
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.programEnd}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Employer
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.employer}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </CollapsibleContent>
//                     )}
//                 </Card>
//               </Collapsible>
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
//           <div className="max-w-3xl mx-auto">
//             {uploadedFile && (
//               <div className="mb-3">
//                 <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
//                   <span className="text-sm text-slate-700 dark:text-gray-300">
//                     {uploadedFile.name}
//                   </span>
//                   <button
//                     onClick={handleRemoveFile}
//                     className="text-slate-400 hover:text-slate-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-3 items-end mb-2">
//               <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
//                   placeholder="Ask a question or upload your document…"
//                   className="flex-1 border-0 bg-transparent focus-visible:ring-0 p-0"
//                   disabled={loading}
//                 />
//                 {/* <button
//                   onClick={handleFileUpload}
//                   className="text-slate-400 hover:text-purple-600"
//                   title="Attach File"
//                   disabled={loading}
//                 >
//                   <Paperclip className="w-5 h-5" />
//                 </button> */}

//                 <input
//                   type="file"
//                   id="file-upload"
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                 />
//                 <label htmlFor="file-upload">
//                   <button
//                     type="button"
//                     onClick={() => document.getElementById('file-upload')?.click()}
//                     className="text-slate-400 hover:text-purple-600"
//                     title="Attach File"
//                     disabled={loading}
//                   >
//                     <Paperclip className="w-5 h-5" />
//                   </button>
//                 </label>

//                 <button
//                   className="text-slate-400 hover:text-purple-600"
//                   title="Voice Input"
//                   disabled={loading}
//                 >
//                   <Mic className="w-5 h-5" />
//                 </button>
//               </div>
//               <Button
//                 onClick={handleSend}
//                 disabled={loading || !input.trim()}
//                 className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-2xl px-8 py-6 disabled:opacity-50"
//               >
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//               </Button>
//             </div>

//             <p className="text-slate-500 text-center text-sm">
//               VisaMate uses AI to analyze verified documents. Always confirm with your DSO.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Sidebar */}
//       <div className="w-80 bg-white/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto hidden xl:block">
//         <div className="space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <TrendingUp className="w-5 h-5 text-purple-600" />
//               <h4 className="text-slate-900 dark:text-gray-100">
//                 Trending Questions
//               </h4>
//             </div>
//             <div className="space-y-2">
//               {trendingQuestions.map((question, i) => (
//                 <button
//                   key={i}
//                   onClick={() => handleQuestionClick(question)}
//                   className="w-full text-left p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-300 hover:shadow-md transition-all text-sm"
//                   disabled={loading}
//                 >
//                   <p className="text-slate-700 dark:text-gray-300 hover:text-purple-600">
//                     {question}
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800 p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <Newspaper className="w-5 h-5 text-purple-600" />
//               <h4 className="text-slate-900 dark:text-gray-100">
//                 Latest News Impact
//               </h4>
//             </div>
//             <p className="text-sm text-slate-700 dark:text-gray-300 mb-3">
//               New STEM OPT fields added including Data Analytics and AI.
//             </p>
//             <Button
//               onClick={() => onNavigate("policy-feed")}
//               size="sm"
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-md"
//             >
//               View Policy Feed
//             </Button>
//           </Card>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }

// Nov 22, 2025
// import { useState, useEffect } from "react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Card } from "./ui/card";
// import { Badge } from "./ui/badge";
// import {
//   Send,
//   User,
//   Sparkles,
//   Paperclip,
//   Mic,
//   X,
//   TrendingUp,
//   Newspaper,
//   Clock,
//   ExternalLink,
//   Loader2,
// } from "lucide-react";
// import { Collapsible, CollapsibleContent } from "./ui/collapsible";
// import { Screen } from "../App";
// import { toast } from "sonner";
// import { VisaStageTimeline } from "./visa-stage-timeline";

// const API_BASE = "http://localhost:8000";

// // Example and trending question data
// const exampleQuestions = [
//   "Can I work remotely while on CPT?",
//   "When should I apply for STEM OPT?",
//   "What's the 60-day grace period after OPT?",
// ];

// const trendingQuestions = [
//   "How long can I work on CPT?",
//   "What documents do I need for OPT?",
//   "Can I change employers on H-1B?",
//   "What's the STEM OPT unemployment limit?",
// ];

// interface Message {
//   id: number;
//   role: "user" | "assistant" | "system";
//   content: string;
//   sources?: any[];
//   confidence?: number;
//   trust_score?: number;
// }

// interface UploadedDocument {
//   name: string;
//   size: string;
//   status: "processing" | "processed";
//   extracted?: {
//     sevisId: string;
//     programStart: string;
//     programEnd: string;
//     employer: string;
//   };
// }

// const initialMessages: Message[] = [];

// interface UnifiedChatProps {
//   onNavigate: (screen: Screen) => void;
// }

// // Helper function to format markdown-like text with bold
// const formatMessageContent = (text: string) => {
//   // Split by ** for bold formatting
//   const parts = text.split(/(\*\*.*?\*\*)/g);
  
//   return parts.map((part, index) => {
//     if (part.startsWith('**') && part.endsWith('**')) {
//       // Remove ** and make bold
//       const boldText = part.slice(2, -2);
//       return <strong key={index} className="font-semibold text-slate-900 dark:text-white">{boldText}</strong>;
//     }
//     return <span key={index}>{part}</span>;
//   });
// };

// export function UnifiedChat({ onNavigate }: UnifiedChatProps) {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState<UploadedDocument | null>(null);
//   const [isDocCardOpen, setIsDocCardOpen] = useState(true);
//   const [userId, setUserId] = useState<string>("");
//   const [currentStage, setCurrentStage] = useState<string>("onboarding");

//   // Initialize user_id on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Extract user_id from token or generate one
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const email = payload.sub || `user_${Date.now()}`;
//         setUserId(email);
//         console.log("User ID set to:", email);
//       } catch (error) {
//         console.error("Error parsing token:", error);
//         setUserId(`user_${Date.now()}`);
//       }
//     }
//   }, []);

//   // Initial greeting
//   const handleInitialGreeting = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("user_id", userId || `user_${Date.now()}`);
//       formData.append("message", "");

//       const response = await fetch(`${API_BASE}/chat/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) throw new Error("Failed to start conversation");

//       const data = await response.json();
      
//       if (data.messages && data.messages.length > 0) {
//         const newMessages = data.messages.map((msg: any, idx: number) => ({
//           id: messages.length + idx + 1,
//           role: "assistant" as const,
//           content: msg.content
//         }));
//         setMessages(newMessages);
//         setCurrentStage(data.stage || "onboarding");
//       }
//     } catch (error) {
//       console.error("Error starting conversation:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send message to new /chat endpoint
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to use the assistant");
//       onNavigate("auth");
//       return;
//     }

//     const userMessage: Message = {
//       id: messages.length + 1,
//       role: "user",
//       content: input,
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("user_id", userId || `user_${Date.now()}`);
//       formData.append("message", input);

//       const response = await fetch(`${API_BASE}/chat/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error("Failed to get response");
//       }

//       const data = await response.json();

//       // Handle multiple messages in response
//       if (data.messages && data.messages.length > 0) {
//         const newMessages = data.messages.map((msg: any, idx: number) => ({
//           id: messages.length + idx + 2,
//           role: "assistant" as const,
//           content: msg.content,
//           // Extract confidence and sources from top-level response
//           confidence: idx === data.messages.length - 1 ? data.confidence : undefined,
//           trust_score: idx === data.messages.length - 1 ? data.trust_score : undefined,
//           sources: idx === data.messages.length - 1 ? data.sources : undefined,
//         }));
//         setMessages((prev) => [...prev, ...newMessages]);
//         setCurrentStage(data.stage || currentStage);
//       } else {
//         // Fallback for single message
//         const assistantMessage: Message = {
//           id: messages.length + 2,
//           role: "assistant",
//           content: data.content || "I couldn't generate a response.",
//           confidence: data.confidence,
//           trust_score: data.trust_score,
//           sources: data.sources,
//         };
//         setMessages((prev) => [...prev, assistantMessage]);
//       }
//     } catch (error) {
//       console.error("Error querying API:", error);
//       toast.error("Failed to get response from assistant");
      
//       const errorMessage: Message = {
//         id: messages.length + 2,
//         role: "assistant",
//         content: "Sorry, I encountered an error processing your request. Please try again.",
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📎 Real file upload to backend
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to upload documents");
//       return;
//     }
  
//     setUploadedFile({
//       name: file.name,
//       size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//       status: "processing",
//     });
  
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
  
//       const response = await fetch(`${API_BASE}/upload/upload/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Upload failed");
//       }
  
//       const data = await response.json();
//       console.log("Upload response:", data);
      
//       // Extract data from parsed_fields object
//       const fields = data.parsed_fields || {};
      
//       setUploadedFile({
//         name: file.name,
//         size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//         status: "processed",
//         extracted: {
//           sevisId: fields.SEVIS_ID || "Not found",
//           programStart: fields.Program_Start_Date || "Not found", 
//           programEnd: fields.Program_End_Date || "Not found",
//           employer: fields.Employer_Name || "Not found",
//         },
//       });
//       setIsDocCardOpen(true);
//       toast.success(`✅ ${data.doc_type} processed! Stage: ${data.detected_stage}`);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to process document");
//       setUploadedFile(null);
//     }
//   };

//   const handleRemoveFile = () => setUploadedFile(null);
//   const handleQuestionClick = (question: string) => setInput(question);

//   const isEmpty = messages.length === 0;

//   return (
//     <div className="flex flex-col h-[calc(100vh-73px)]">
//       {/* Visa Timeline */}
//       <VisaStageTimeline />
      
//       {/* Main Content */}
//       <div className="flex flex-1 bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-[#0F172A] dark:to-[#1e1b4b]/20 overflow-hidden">
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
//         <div className="flex-1 overflow-y-auto px-6 py-8">
//           {/* Empty State */}
//           {isEmpty ? (
//             <div className="text-center py-16">
//               <div className="w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/50">
//                 <Sparkles className="w-12 h-12 text-white" />
//               </div>
//               <h3 className="mb-6 text-slate-900 dark:text-gray-100 text-xl">
//                 Hi there 👋 I'm VisaMate.
//               </h3>
//               <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
//                 Click below to start your visa compliance journey, or ask me anything about your visa process:
//               </p>
//               <Button
//                 onClick={handleInitialGreeting}
//                 disabled={loading}
//                 className="mb-8 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-2xl px-8 py-4"
//               >
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
//                 Start Conversation
//               </Button>
//               <div className="space-y-3 max-w-2xl mx-auto">
//                 {exampleQuestions.map((question, i) => (
//                   <button
//                     key={i}
//                     onClick={() => handleQuestionClick(question)}
//                     className="w-full text-left px-6 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
//                   >
//                     <p className="text-slate-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
//                       "{question}"
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             // Messages
//             <div className="space-y-6 max-w-3xl mx-auto">
//               {messages.map((message) =>
//                 message.role === "system" ? (
//                   <div key={message.id} className="text-center py-2">
//                     <span className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 rounded-full text-sm">
//                       {message.content}
//                     </span>
//                   </div>
//                 ) : (
//                   <div
//                     key={message.id}
//                     className={`flex gap-4 ${
//                       message.role === "user" ? "justify-end" : ""
//                     }`}
//                   >
//                     {message.role === "assistant" && (
//                       <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
//                         <Sparkles className="w-5 h-5 text-white" />
//                       </div>
//                     )}

//                     <div
//                       className={`flex-1 max-w-2xl ${
//                         message.role === "user" ? "flex justify-end" : ""
//                       }`}
//                     >
//                       <div
//                         className={`rounded-2xl px-6 py-4 ${
//                           message.role === "user"
//                             ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-purple-500/20"
//                             : "bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-lg"
//                         }`}
//                       >
//                         {/* Message Content with Bold Formatting */}
//                         <div
//                           className={`whitespace-pre-wrap ${
//                             message.role === "user"
//                               ? "text-white"
//                               : "text-slate-700 dark:text-gray-200"
//                           }`}
//                         >
//                           {formatMessageContent(message.content)}
//                         </div>

//                         {/* Assistant footer with sources and scores */}
//                         {message.role === "assistant" && (message.sources || message.trust_score || message.confidence) && (
//                           <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
//                             {/* Sources */}
//                             {message.sources && message.sources.length > 0 && (
//                               <div>
//                                 <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">Sources:</p>
//                                 <div className="flex flex-wrap gap-2">
//                                   {message.sources.slice(0, 3).map((source, idx) => (
//                                     <Badge
//                                       key={idx}
//                                       variant="outline"
//                                       className="text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
//                                     >
//                                       📄 {source.source || `Source ${idx + 1}`}
//                                     </Badge>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}

//                             {/* Trust Score - Label and value on separate lines */}
//                             {message.trust_score && (
//                               <div className="text-sm">
//                                 <div className="font-bold text-slate-700 dark:text-gray-200">
//                                   📊 Trust Score:
//                                 </div>
//                                 <div className="text-slate-600 dark:text-gray-400">
//                                   {message.trust_score}%
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {message.role === "user" && (
//                       <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
//                         <User className="w-5 h-5 text-slate-600 dark:text-gray-300" />
//                       </div>
//                     )}
//                   </div>
//                 )
//               )}

//               {/* Loading indicator */}
//               {loading && (
//                 <div className="flex gap-4">
//                   <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
//                     <Sparkles className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex-1 max-w-2xl">
//                     <div className="rounded-2xl px-6 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-lg">
//                       <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         <span>Thinking...</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Uploaded document preview */}
//           {uploadedFile && (
//             <div className="max-w-3xl mx-auto mt-6">
//               <Collapsible open={isDocCardOpen} onOpenChange={setIsDocCardOpen}>
//                 <Card className="bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xl p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
//                         <span className="text-2xl">📄</span>
//                       </div>
//                       <div>
//                         <h4 className="text-slate-900 dark:text-gray-100">
//                           {uploadedFile.name}
//                         </h4>
//                         <p className="text-sm text-slate-500 dark:text-gray-500">
//                           {uploadedFile.size}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {uploadedFile.status === "processed" && (
//                         <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
//                           ✅ Processed Successfully
//                         </Badge>
//                       )}
//                       {uploadedFile.status === "processing" && (
//                         <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
//                           ⏳ Processing...
//                         </Badge>
//                       )}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={handleRemoveFile}
//                         className="h-8 w-8 rounded-lg"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   {uploadedFile.status === "processed" &&
//                     uploadedFile.extracted && (
//                       <CollapsibleContent>
//                         <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-4">
//                           <h5 className="mb-3 text-slate-900 dark:text-gray-100">
//                             Extracted Information
//                           </h5>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 SEVIS ID
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.sevisId}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Program Start
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.programStart}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Program End
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.programEnd}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Employer
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.employer}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </CollapsibleContent>
//                     )}
//                 </Card>
//               </Collapsible>
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
//           <div className="max-w-3xl mx-auto">
//             {uploadedFile && (
//               <div className="mb-3">
//                 <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
//                   <span className="text-sm text-slate-700 dark:text-gray-300">
//                     {uploadedFile.name}
//                   </span>
//                   <button
//                     onClick={handleRemoveFile}
//                     className="text-slate-400 hover:text-slate-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-3 items-end mb-2">
//               <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
//                   placeholder="Ask a question or upload your document…"
//                   className="flex-1 border-0 bg-transparent focus-visible:ring-0 p-0"
//                   disabled={loading}
//                 />

//                 <input
//                   type="file"
//                   id="file-upload"
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                 />
//                 <label htmlFor="file-upload">
//                   <button
//                     type="button"
//                     onClick={() => document.getElementById('file-upload')?.click()}
//                     className="text-slate-400 hover:text-purple-600"
//                     title="Attach File"
//                     disabled={loading}
//                   >
//                     <Paperclip className="w-5 h-5" />
//                   </button>
//                 </label>

//                 <button
//                   className="text-slate-400 hover:text-purple-600"
//                   title="Voice Input"
//                   disabled={loading}
//                 >
//                   <Mic className="w-5 h-5" />
//                 </button>
//               </div>
//               <Button
//                 onClick={handleSend}
//                 disabled={loading || !input.trim()}
//                 className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-2xl px-8 py-6 disabled:opacity-50"
//               >
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//               </Button>
//             </div>

//             <p className="text-slate-500 text-center text-sm">
//               VisaMate uses AI to analyze verified documents. Always confirm with your DSO.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Sidebar */}
//       <div className="w-80 bg-white/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto hidden xl:block">
//         <div className="space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <TrendingUp className="w-5 h-5 text-purple-600" />
//               <h4 className="text-slate-900 dark:text-gray-100">
//                 Trending Questions
//               </h4>
//             </div>
//             <div className="space-y-2">
//               {trendingQuestions.map((question, i) => (
//                 <button
//                   key={i}
//                   onClick={() => handleQuestionClick(question)}
//                   className="w-full text-left p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-300 hover:shadow-md transition-all text-sm"
//                   disabled={loading}
//                 >
//                   <p className="text-slate-700 dark:text-gray-300 hover:text-purple-600">
//                     {question}
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800 p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <Newspaper className="w-5 h-5 text-purple-600" />
//               <h4 className="text-slate-900 dark:text-gray-100">
//                 Latest News Impact
//               </h4>
//             </div>
//             <p className="text-sm text-slate-700 dark:text-gray-300 mb-3">
//               New STEM OPT fields added including Data Analytics and AI.
//             </p>
//             <Button
//               onClick={() => onNavigate("policy-feed")}
//               size="sm"
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-md"
//             >
//               View Policy Feed
//             </Button>
//           </Card>

//           <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800 p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="text-lg">📊</div>
//               <h4 className="text-slate-900 dark:text-gray-100 font-semibold">
//                 What is Trust Score?
//               </h4>
//             </div>
//             <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
//               Our Trust Score (0-100%) shows how confident we are in each answer. 
//               It combines verification from multiple AI models and the quality of 
//               official USCIS sources used.
//             </p>
//             <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800">
//               <div className="space-y-2 text-xs text-slate-600 dark:text-gray-400">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                   <span><strong>85-100%:</strong> High confidence</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                   <span><strong>70-85%:</strong> Moderate confidence</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                   <span><strong>&lt;70%:</strong> Verify with DSO</span>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }

// Nov 22, 2025
// import { useState, useEffect } from "react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Card } from "./ui/card";
// import { Badge } from "./ui/badge";
// import {
//   Send,
//   User,
//   Sparkles,
//   Paperclip,
//   Mic,
//   X,
//   TrendingUp,
//   Newspaper,
//   Clock,
//   ExternalLink,
//   Loader2,
// } from "lucide-react";
// import { Collapsible, CollapsibleContent } from "./ui/collapsible";
// import { Screen } from "../App";
// import { toast } from "sonner";
// import { VisaStageTimeline } from "./visa-stage-timeline";

// const API_BASE = "http://localhost:8000";

// // Example and trending question data
// const exampleQuestions = [
//   "Can I work remotely while on CPT?",
//   "When should I apply for STEM OPT?",
//   "What's the 60-day grace period after OPT?",
// ];

// const trendingQuestions = [
//   "How long can I work on CPT?",
//   "What documents do I need for OPT?",
//   "Can I change employers on H-1B?",
//   "What's the STEM OPT unemployment limit?",
// ];

// interface Message {
//   id: number;
//   role: "user" | "assistant" | "system";
//   content: string;
//   sources?: any[];
//   confidence?: number;
//   trust_score?: number;
// }

// interface UploadedDocument {
//   name: string;
//   size: string;
//   status: "processing" | "processed";
//   extracted?: {
//     sevisId: string;
//     programStart: string;
//     programEnd: string;
//     employer: string;
//   };
// }

// const initialMessages: Message[] = [];

// interface UnifiedChatProps {
//   onNavigate: (screen: Screen) => void;
// }

// // Helper function to format markdown-like text with bold
// const formatMessageContent = (text: string) => {
//   // Split by ** for bold formatting
//   const parts = text.split(/(\*\*.*?\*\*)/g);
  
//   return parts.map((part, index) => {
//     if (part.startsWith('**') && part.endsWith('**')) {
//       // Remove ** and make bold
//       const boldText = part.slice(2, -2);
//       return <strong key={index} className="font-semibold text-slate-900 dark:text-white">{boldText}</strong>;
//     }
//     return <span key={index}>{part}</span>;
//   });
// };

// export function UnifiedChat({ onNavigate }: UnifiedChatProps) {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState<UploadedDocument | null>(null);
//   const [isDocCardOpen, setIsDocCardOpen] = useState(true);
//   const [userId, setUserId] = useState<string>("");
//   const [currentStage, setCurrentStage] = useState<string>("onboarding");

//   // Initialize user_id on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Extract user_id from token or generate one
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const email = payload.sub || `user_${Date.now()}`;
//         setUserId(email);
//         console.log("User ID set to:", email);
//       } catch (error) {
//         console.error("Error parsing token:", error);
//         setUserId(`user_${Date.now()}`);
//       }
//     }
//   }, []);

//   // Initial greeting
//   const handleInitialGreeting = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("user_id", userId || `user_${Date.now()}`);
//       formData.append("message", "");

//       const response = await fetch(`${API_BASE}/chat/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) throw new Error("Failed to start conversation");

//       const data = await response.json();
      
//       if (data.messages && data.messages.length > 0) {
//         const newMessages = data.messages.map((msg: any, idx: number) => ({
//           id: messages.length + idx + 1,
//           role: "assistant" as const,
//           content: msg.content
//         }));
//         setMessages(newMessages);
//         setCurrentStage(data.stage || "onboarding");
//       }
//     } catch (error) {
//       console.error("Error starting conversation:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send message to new /chat endpoint
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to use the assistant");
//       onNavigate("auth");
//       return;
//     }

//     const userMessage: Message = {
//       id: messages.length + 1,
//       role: "user",
//       content: input,
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("user_id", userId || `user_${Date.now()}`);
//       formData.append("message", input);

//       const response = await fetch(`${API_BASE}/chat/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error("Failed to get response");
//       }

//       const data = await response.json();

//       // Handle multiple messages in response
//       if (data.messages && data.messages.length > 0) {
//         const newMessages = data.messages.map((msg: any, idx: number) => ({
//           id: messages.length + idx + 2,
//           role: "assistant" as const,
//           content: msg.content,
//           // Extract confidence and sources from top-level response
//           confidence: idx === data.messages.length - 1 ? data.confidence : undefined,
//           trust_score: idx === data.messages.length - 1 ? data.trust_score : undefined,
//           sources: idx === data.messages.length - 1 ? data.sources : undefined,
//         }));
//         setMessages((prev) => [...prev, ...newMessages]);
//         setCurrentStage(data.stage || currentStage);
//       } else {
//         // Fallback for single message
//         const assistantMessage: Message = {
//           id: messages.length + 2,
//           role: "assistant",
//           content: data.content || "I couldn't generate a response.",
//           confidence: data.confidence,
//           trust_score: data.trust_score,
//           sources: data.sources,
//         };
//         setMessages((prev) => [...prev, assistantMessage]);
//       }
//     } catch (error) {
//       console.error("Error querying API:", error);
//       toast.error("Failed to get response from assistant");
      
//       const errorMessage: Message = {
//         id: messages.length + 2,
//         role: "assistant",
//         content: "Sorry, I encountered an error processing your request. Please try again.",
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📎 Real file upload to backend
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login to upload documents");
//       event.target.value = ""; // Reset input
//       return;
//     }
  
//     setUploadedFile({
//       name: file.name,
//       size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//       status: "processing",
//     });
  
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
  
//       const response = await fetch(`${API_BASE}/upload/upload/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Upload failed");
//       }
  
//       const data = await response.json();
//       console.log("Upload response:", data);
      
//       // Extract data from parsed_fields object
//       const fields = data.parsed_fields || {};
      
//       setUploadedFile({
//         name: file.name,
//         size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//         status: "processed",
//         extracted: {
//           sevisId: fields.SEVIS_ID || "Not found",
//           programStart: fields.Program_Start_Date || "Not found", 
//           programEnd: fields.Program_End_Date || "Not found",
//           employer: fields.Employer_Name || "Not found",
//         },
//       });
//       setIsDocCardOpen(true);
//       toast.success(`✅ ${data.doc_type} processed! Stage: ${data.detected_stage}`);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to process document");
//       setUploadedFile(null);
//     } finally {
//       // Reset the file input so the same file can be uploaded again
//       event.target.value = "";
//     }
//   };

//   const handleRemoveFile = () => setUploadedFile(null);
//   const handleQuestionClick = (question: string) => setInput(question);

//   const isEmpty = messages.length === 0;

//   return (
//     <div className="flex flex-col h-[calc(100vh-73px)]">
//       {/* Visa Timeline */}
//       <VisaStageTimeline />
      
//       {/* Main Content */}
//       <div className="flex flex-1 bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-[#0F172A] dark:to-[#1e1b4b]/20 overflow-hidden">
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
//         <div className="flex-1 overflow-y-auto px-6 py-8">
//           {/* Empty State */}
//           {isEmpty ? (
//             <div className="text-center py-16">
//               <div className="w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/50">
//                 <Sparkles className="w-12 h-12 text-white" />
//               </div>
//               <h3 className="mb-6 text-slate-900 dark:text-gray-100 text-xl">
//                 Hi there 👋 I'm VisaMate.
//               </h3>
//               <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
//                 Click below to start your visa compliance journey, or ask me anything about your visa process:
//               </p>
//               <Button
//                 onClick={handleInitialGreeting}
//                 disabled={loading}
//                 className="mb-8 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-2xl px-8 py-4"
//               >
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
//                 Start Conversation
//               </Button>
//               <div className="space-y-3 max-w-2xl mx-auto">
//                 {exampleQuestions.map((question, i) => (
//                   <button
//                     key={i}
//                     onClick={() => handleQuestionClick(question)}
//                     className="w-full text-left px-6 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
//                   >
//                     <p className="text-slate-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
//                       "{question}"
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             // Messages
//             <div className="space-y-6 max-w-3xl mx-auto">
//               {messages.map((message) =>
//                 message.role === "system" ? (
//                   <div key={message.id} className="text-center py-2">
//                     <span className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 rounded-full text-sm">
//                       {message.content}
//                     </span>
//                   </div>
//                 ) : (
//                   <div
//                     key={message.id}
//                     className={`flex gap-4 ${
//                       message.role === "user" ? "justify-end" : ""
//                     }`}
//                   >
//                     {message.role === "assistant" && (
//                       <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
//                         <Sparkles className="w-5 h-5 text-white" />
//                       </div>
//                     )}

//                     <div
//                       className={`flex-1 max-w-2xl ${
//                         message.role === "user" ? "flex justify-end" : ""
//                       }`}
//                     >
//                       <div
//                         className={`rounded-2xl px-6 py-4 ${
//                           message.role === "user"
//                             ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-purple-500/20"
//                             : "bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-lg"
//                         }`}
//                       >
//                         {/* Message Content with Bold Formatting */}
//                         <div
//                           className={`whitespace-pre-wrap ${
//                             message.role === "user"
//                               ? "text-white"
//                               : "text-slate-700 dark:text-gray-200"
//                           }`}
//                         >
//                           {formatMessageContent(message.content)}
//                         </div>

//                         {/* Assistant footer with sources and scores */}
//                         {message.role === "assistant" && (message.sources || message.trust_score || message.confidence) && (
//                           <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
//                             {/* Sources */}
//                             {message.sources && message.sources.length > 0 && (
//                               <div>
//                                 <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">Sources:</p>
//                                 <div className="flex flex-wrap gap-2">
//                                   {message.sources.slice(0, 3).map((source, idx) => (
//                                     <Badge
//                                       key={idx}
//                                       variant="outline"
//                                       className="text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
//                                     >
//                                       📄 {source.source || `Source ${idx + 1}`}
//                                     </Badge>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}

//                             {/* Trust Score - Label and value on separate lines */}
//                             {message.trust_score && (
//                               <div className="text-sm">
//                                 <div className="font-bold text-slate-700 dark:text-gray-200">
//                                   📊 Trust Score:
//                                 </div>
//                                 <div className="text-slate-600 dark:text-gray-400">
//                                   {message.trust_score}%
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {message.role === "user" && (
//                       <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
//                         <User className="w-5 h-5 text-slate-600 dark:text-gray-300" />
//                       </div>
//                     )}
//                   </div>
//                 )
//               )}

//               {/* Loading indicator */}
//               {loading && (
//                 <div className="flex gap-4">
//                   <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
//                     <Sparkles className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex-1 max-w-2xl">
//                     <div className="rounded-2xl px-6 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-lg">
//                       <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         <span>Thinking...</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Uploaded document preview */}
//           {uploadedFile && (
//             <div className="max-w-3xl mx-auto mt-6">
//               <Collapsible open={isDocCardOpen} onOpenChange={setIsDocCardOpen}>
//                 <Card className="bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xl p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
//                         <span className="text-2xl">📄</span>
//                       </div>
//                       <div>
//                         <h4 className="text-slate-900 dark:text-gray-100">
//                           {uploadedFile.name}
//                         </h4>
//                         <p className="text-sm text-slate-500 dark:text-gray-500">
//                           {uploadedFile.size}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {uploadedFile.status === "processed" && (
//                         <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
//                           ✅ Processed Successfully
//                         </Badge>
//                       )}
//                       {uploadedFile.status === "processing" && (
//                         <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
//                           ⏳ Processing...
//                         </Badge>
//                       )}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={handleRemoveFile}
//                         className="h-8 w-8 rounded-lg"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   {uploadedFile.status === "processed" &&
//                     uploadedFile.extracted && (
//                       <CollapsibleContent>
//                         <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-4">
//                           <h5 className="mb-3 text-slate-900 dark:text-gray-100">
//                             Extracted Information
//                           </h5>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 SEVIS ID
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.sevisId}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Program Start
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.programStart}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Program End
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.programEnd}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-slate-500 mb-1">
//                                 Employer
//                               </p>
//                               <p className="text-slate-900 dark:text-gray-100">
//                                 {uploadedFile.extracted.employer}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </CollapsibleContent>
//                     )}
//                 </Card>
//               </Collapsible>
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
//           <div className="max-w-3xl mx-auto">
//             {uploadedFile && (
//               <div className="mb-3">
//                 <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
//                   <span className="text-sm text-slate-700 dark:text-gray-300">
//                     {uploadedFile.name}
//                   </span>
//                   <button
//                     onClick={handleRemoveFile}
//                     className="text-slate-400 hover:text-slate-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-3 items-end mb-2">
//               <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
//                   placeholder="Ask a question or upload your document…"
//                   className="flex-1 border-0 bg-transparent focus-visible:ring-0 p-0"
//                   disabled={loading}
//                 />

//                 <input
//                   type="file"
//                   id="file-upload"
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                 />
//                 <label htmlFor="file-upload">
//                   <button
//                     type="button"
//                     onClick={() => document.getElementById('file-upload')?.click()}
//                     className="text-slate-400 hover:text-purple-600"
//                     title="Attach File"
//                     disabled={loading}
//                   >
//                     <Paperclip className="w-5 h-5" />
//                   </button>
//                 </label>

//                 <button
//                   className="text-slate-400 hover:text-purple-600"
//                   title="Voice Input"
//                   disabled={loading}
//                 >
//                   <Mic className="w-5 h-5" />
//                 </button>
//               </div>
//               <Button
//                 onClick={handleSend}
//                 disabled={loading || !input.trim()}
//                 className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-2xl px-8 py-6 disabled:opacity-50"
//               >
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//               </Button>
//             </div>

//             <p className="text-slate-500 text-center text-sm">
//               VisaMate uses AI to analyze verified documents. Always confirm with your DSO.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Sidebar */}
//       <div className="w-80 bg-white/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto hidden xl:block">
//         <div className="space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <TrendingUp className="w-5 h-5 text-purple-600" />
//               <h4 className="text-slate-900 dark:text-gray-100">
//                 Trending Questions
//               </h4>
//             </div>
//             <div className="space-y-2">
//               {trendingQuestions.map((question, i) => (
//                 <button
//                   key={i}
//                   onClick={() => handleQuestionClick(question)}
//                   className="w-full text-left p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-300 hover:shadow-md transition-all text-sm"
//                   disabled={loading}
//                 >
//                   <p className="text-slate-700 dark:text-gray-300 hover:text-purple-600">
//                     {question}
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800 p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <Newspaper className="w-5 h-5 text-purple-600" />
//               <h4 className="text-slate-900 dark:text-gray-100">
//                 Latest News Impact
//               </h4>
//             </div>
//             <p className="text-sm text-slate-700 dark:text-gray-300 mb-3">
//               New STEM OPT fields added including Data Analytics and AI.
//             </p>
//             <Button
//               onClick={() => onNavigate("policy-feed")}
//               size="sm"
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-md"
//             >
//               View Policy Feed
//             </Button>
//           </Card>

//           <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800 p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="text-lg">📊</div>
//               <h4 className="text-slate-900 dark:text-gray-100">
//                 What is Trust Score?
//               </h4>
//             </div>
//             <p className="text-sm text-slate-700 dark:text-gray-300 mb-3 leading-relaxed">
//               Our Trust Score (0-100%) shows how confident we are in each answer. 
//               It combines verification from multiple AI models and the quality of 
//               sources used.
//             </p>
//             <div className="space-y-2 text-xs text-slate-700 dark:text-gray-300">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                 <span><strong>85-100%:</strong> High confidence</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//                 <span><strong>70-84%:</strong> Moderate confidence</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                 <span><strong>&lt;70%:</strong> Verify with DSO</span>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }

// Nov 23, 2025
import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Send,
  User,
  Sparkles,
  Paperclip,
  Mic,
  X,
  TrendingUp,
  Newspaper,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { Screen } from "../App";
import { toast } from "sonner";
import { VisaStageTimeline } from "./visa-stage-timeline";

const API_BASE = "http://localhost:8000";

// Example and trending question data
const exampleQuestions = [
  "Can I work remotely while on CPT?",
  "When should I apply for STEM OPT?",
  "What's the 60-day grace period after OPT?",
];

const trendingQuestions = [
  "How long can I work on CPT?",
  "What documents do I need for OPT?",
  "Can I change employers on H-1B?",
  "What's the STEM OPT unemployment limit?",
];

// ✅ News Detection Keywords
const NEWS_QUERY_KEYWORDS = [
  'recent news', 'latest news', 'any news', 'recent update', 'latest update',
  'recent policy', 'latest policy', 'new rule', 'new regulation',
  'what\'s new', 'any update', 'recent change', 'latest change',
  'recent announcement', 'latest announcement', 'news on', 'news about',
  'updates on', 'updates about'
];

// ✅ Visa Keywords for Extraction
const VISA_KEYWORDS: Record<string, string[]> = {
  'h1b': ['h1b', 'h-1b', 'h1-b', 'h 1 b'],
  'opt': ['opt', 'optional practical training'],
  'cpt': ['cpt', 'curricular practical training'],
  'stem-opt': ['stem opt', 'stem-opt', 'stem extension'],
  'f1': ['f1', 'f-1', 'f 1', 'student visa'],
  'travel': ['travel', 'traveling', 'trip', 'departure', 'reentry'],
  'i-20': ['i-20', 'i20', 'form i-20', 'i 20'],
  'sevp': ['sevp', 'student exchange'],
  'dhs': ['dhs', 'homeland security'],
  'uscis': ['uscis', 'immigration services']
};

interface Message {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  sources?: any[];
  confidence?: number;
  trust_score?: number;
  newsArticles?: any[]; // Store news articles for special rendering
}

interface UploadedDocument {
  name: string;
  size: string;
  status: "processing" | "processed";
  extracted?: {
    sevisId: string;
    programStart: string;
    programEnd: string;
    employer: string;
  };
}

const initialMessages: Message[] = [];

interface UnifiedChatProps {
  onNavigate: (screen: Screen) => void;
}

// ✅ Check if query is asking about news
const isNewsQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return NEWS_QUERY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

// ✅ Extract visa-related keywords from message
const extractVisaKeywords = (message: string): string[] => {
  const lowerMessage = message.toLowerCase();
  const foundKeywords: string[] = [];
  
  for (const [category, patterns] of Object.entries(VISA_KEYWORDS)) {
    if (patterns.some(pattern => lowerMessage.includes(pattern))) {
      foundKeywords.push(category);
    }
  }
  
  return foundKeywords;
};

// ✅ Fetch relevant news from policy feed
const fetchRelevantNews = async (keywords: string[]): Promise<any[]> => {
  try {
    console.log("📡 Fetching news with keywords:", keywords);
    
    if (keywords.length === 0) {
      // No specific keywords - get general recent news
      console.log("📰 Fetching general news (no keywords)");
      const response = await fetch(`${API_BASE}/news/?limit=5`);
      
      if (!response.ok) {
        console.error("❌ Failed to fetch general news:", response.status);
        return [];
      }
      
      const data = await response.json();
      console.log("✅ General news response:", data);
      return data.news || [];
    }
    
    // Fetch news for each keyword
    const allNews: any[] = [];
    
    for (const keyword of keywords) {
      console.log(`🔍 Searching for: "${keyword}"`);
      const response = await fetch(`${API_BASE}/news/search?query=${encodeURIComponent(keyword)}&limit=3`);
      
      if (!response.ok) {
        console.error(`❌ Search failed for "${keyword}":`, response.status);
        continue;
      }
      
      const data = await response.json();
      console.log(`✅ Search results for "${keyword}":`, data.count, "articles");
      
      if (data.news && data.news.length > 0) {
        allNews.push(...data.news);
      }
    }
    
    console.log("📊 Total articles found:", allNews.length);
    
    // Remove duplicates based on link
    const uniqueNews = Array.from(
      new Map(allNews.map(item => [item.link, item])).values()
    );
    
    console.log("📊 Unique articles after dedup:", uniqueNews.length);
    
    // Sort by date and limit to 5
    return uniqueNews
      .sort((a: any, b: any) => {
        const dateA = new Date(a.published || 0).getTime();
        const dateB = new Date(b.published || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
      
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return [];
  }
};

// ✅ Format news as chat message
const formatNewsResponse = (news: any[], keywords: string[]): string => {
  if (news.length === 0) {
    return "I couldn't find any recent news articles matching your query. You can check the **News** page for the latest updates, or ask me something specific about your visa status!";
  }
  
  const keywordText = keywords.length > 0 
    ? ` about **${keywords.map(k => k.toUpperCase()).join(', ')}**`
    : '';
  
  let message = `Here are the latest policy updates${keywordText}:\n\n`;
  
  news.forEach((article, index) => {
    const date = article.published 
      ? new Date(article.published).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      : 'Recent';
    
    message += `**${index + 1}. ${article.title}**\n\n`;
    message += `📅 ${date} | 🏷️ ${article.category}\n\n`;
    message += `${article.summary}\n\n`;
    
    // Add separator between articles (but not after the last one)
    if (index < news.length - 1) {
      message += `---\n\n`;
    }
  });
  
  message += "\n💡 **Would you like me to explain how any of these updates might affect your visa status?**";
  
  return message;
};

// Helper function to format markdown-like text with bold and line breaks
const formatMessageContent = (text: string) => {
  // First, split by line breaks to preserve them
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Split each line by ** for bold formatting
    const parts = line.split(/(\*\*.*?\*\*)/g);
    
    const formattedLine = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove ** and make bold
        const boldText = part.slice(2, -2);
        return <strong key={`${lineIndex}-${partIndex}`} className="font-semibold text-slate-900 dark:text-white">{boldText}</strong>;
      }
      return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
    });
    
    // Add line break after each line (except the last one)
    return (
      <span key={lineIndex}>
        {formattedLine}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

export function UnifiedChat({ onNavigate }: UnifiedChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedDocument | null>(null);
  const [isDocCardOpen, setIsDocCardOpen] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [currentStage, setCurrentStage] = useState<string>("onboarding");
  const [articleContext, setArticleContext] = useState<any>(null);

  // Initialize user_id on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.sub || `user_${Date.now()}`;
        setUserId(email);
        console.log("User ID set to:", email);
      } catch (error) {
        console.error("Error parsing token:", error);
        setUserId(`user_${Date.now()}`);
      }
    }
  }, []);

  // ✅ Handle article discussion initialization (using useCallback to prevent stale closures)
  const handleArticleDiscussion = useCallback(async (article: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to discuss articles");
      onNavigate("auth");
      return;
    }

    console.log("🚀 Starting discussion for:", article.title);
    console.log("📊 Current userId:", userId);

    // Reset chat state - use functional updates to avoid stale state
    setArticleContext(article);
    setMessages(() => {
      console.log("🔄 Clearing messages for new article");
      return [];
    });
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", userId || `user_${Date.now()}`);
      formData.append("message", `I want to understand how this policy update affects me personally:\n\n**${article.title}**\n\nCategory: ${article.category}\n\nSummary: ${article.summary}\n\nPlease analyze this update based on my current visa stage and situation, and tell me:\n1. What changed\n2. How it affects me specifically\n3. What actions I need to take\n4. Any important deadlines\n\nSource: ${article.link}`);
      
      // ✅ Add flag to skip loading history for fresh article discussion
      formData.append("skip_history", "true");   // Skip loading old history
      formData.append("force_rag", "true");     // Bypass intent detection, go straight to RAG

      console.log("📤 Sending request to backend...");

      const response = await fetch(`${API_BASE}/chat/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (data.messages && data.messages.length > 0) {
        const newMessages = data.messages.map((msg: any, idx: number) => ({
          id: idx + 1,
          role: "assistant" as const,
          content: msg.content,
          confidence: idx === data.messages.length - 1 ? data.confidence : undefined,
          trust_score: idx === data.messages.length - 1 ? data.trust_score : undefined,
          sources: idx === data.messages.length - 1 ? data.sources : undefined,
        }));
        console.log("✅ Setting messages:", newMessages.length, "messages");
        console.log("📝 Message content:", newMessages[0].content.substring(0, 100) + "...");
        
        setMessages(() => {
          console.log("💾 Messages state updated");
          return newMessages;
        });
        
        setCurrentStage(data.stage || currentStage);
      } else {
        console.warn("⚠️ No messages in response");
      }
    } catch (error) {
      console.error("❌ Error discussing article:", error);
      toast.error("Failed to start discussion about this article");
      
      setMessages(() => [{
        id: 1,
        role: "assistant",
        content: "Sorry, I encountered an error analyzing this policy update. Please try asking me directly about it.",
      }]);
    } finally {
      setLoading(false);
      console.log("🏁 Discussion handler finished");
    }
  }, [userId, currentStage, onNavigate]);

  // ✅ Listen for custom "discussArticle" event
  useEffect(() => {
    if (!userId) return;

    const handleDiscussArticleEvent = (event: any) => {
      const article = event.detail;
      console.log("📰 Received article discussion event:", article.title);
      handleArticleDiscussion(article);
    };

    window.addEventListener('discussArticle', handleDiscussArticleEvent as EventListener);

    return () => {
      window.removeEventListener('discussArticle', handleDiscussArticleEvent as EventListener);
    };
  }, [userId, handleArticleDiscussion]);

  // Initial greeting
  const handleInitialGreeting = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", userId || `user_${Date.now()}`);
      formData.append("message", "");

      const response = await fetch(`${API_BASE}/chat/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Failed to start conversation");

      const data = await response.json();
      
      if (data.messages && data.messages.length > 0) {
        const newMessages = data.messages.map((msg: any, idx: number) => ({
          id: messages.length + idx + 1,
          role: "assistant" as const,
          content: msg.content
        }));
        setMessages(newMessages);
        setCurrentStage(data.stage || "onboarding");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced handleSend with news detection
  const handleSend = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to use the assistant");
      onNavigate("auth");
      return;
    }

    const originalInput = input.trim();

    // ✅ STEP 1: Check if this is a news query
    const isAskingAboutNews = isNewsQuery(originalInput);
    
    if (isAskingAboutNews) {
      console.log("🗞️ News query detected!");
      
      // Extract keywords
      const keywords = extractVisaKeywords(originalInput);
      console.log("📋 Keywords extracted:", keywords);
      
      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        role: "user",
        content: originalInput,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);
      
      try {
        // Fetch relevant news
        const relevantNews = await fetchRelevantNews(keywords);
        console.log("📰 Found news articles:", relevantNews.length);
        
        // Format response
        const newsResponse = formatNewsResponse(relevantNews, keywords);
        
        // Add assistant response with news
        const assistantMessage: Message = {
          id: messages.length + 2,
          role: "assistant",
          content: newsResponse,
          newsArticles: relevantNews // Store for special rendering
        };
        setMessages((prev) => [...prev, assistantMessage]);
        
      } catch (error) {
        console.error("Error handling news query:", error);
        
        // Fallback message
        const errorMessage: Message = {
          id: messages.length + 2,
          role: "assistant",
          content: "I had trouble fetching the latest news. Please try again or visit the News page directly.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
      
      return; // Exit early - don't send to LLM
    }

    // ✅ STEP 2: Not a news query - proceed with regular chat
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: originalInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", userId || `user_${Date.now()}`);
      formData.append("message", originalInput);

      const response = await fetch(`${API_BASE}/chat/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Handle multiple messages in response
      if (data.messages && data.messages.length > 0) {
        const newMessages = data.messages.map((msg: any, idx: number) => ({
          id: messages.length + idx + 2,
          role: "assistant" as const,
          content: msg.content,
          confidence: idx === data.messages.length - 1 ? data.confidence : undefined,
          trust_score: idx === data.messages.length - 1 ? data.trust_score : undefined,
          sources: idx === data.messages.length - 1 ? data.sources : undefined,
        }));
        setMessages((prev) => [...prev, ...newMessages]);
        setCurrentStage(data.stage || currentStage);
      } else {
        // Fallback for single message
        const assistantMessage: Message = {
          id: messages.length + 2,
          role: "assistant",
          content: data.content || "I couldn't generate a response.",
          confidence: data.confidence,
          trust_score: data.trust_score,
          sources: data.sources,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error querying API:", error);
      toast.error("Failed to get response from assistant");
      
      const errorMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // 📎 Real file upload to backend
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to upload documents");
      event.target.value = "";
      return;
    }
  
    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      status: "processing",
    });
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch(`${API_BASE}/upload/upload/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }
  
      const data = await response.json();
      console.log("Upload response:", data);
      
      const fields = data.parsed_fields || {};
      
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        status: "processed",
        extracted: {
          sevisId: fields.SEVIS_ID || "Not found",
          programStart: fields.Program_Start_Date || "Not found", 
          programEnd: fields.Program_End_Date || "Not found",
          employer: fields.Employer_Name || "Not found",
        },
      });
      setIsDocCardOpen(true);
      toast.success(`✅ ${data.doc_type} processed! Stage: ${data.detected_stage}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process document");
      setUploadedFile(null);
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveFile = () => setUploadedFile(null);
  const handleQuestionClick = (question: string) => setInput(question);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Visa Timeline */}
      <VisaStageTimeline />
      
      {/* Main Content */}
      <div className="flex flex-1 bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-[#0F172A] dark:to-[#1e1b4b]/20 overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Empty State */}
          {isEmpty ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/50">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="mb-6 text-slate-900 dark:text-gray-100 text-xl">
                Hi there 👋 I'm VisaMate.
              </h3>
              <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                Click below to start your visa compliance journey, or ask me anything about your visa process:
              </p>
              <Button
                onClick={handleInitialGreeting}
                disabled={loading}
                className="mb-8 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-2xl px-8 py-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Start Conversation
              </Button>
              <div className="space-y-3 max-w-2xl mx-auto">
                {exampleQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left px-6 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
                  >
                    <p className="text-slate-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      "{question}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* ✅ Article Preview Card */}
              {articleContext && (
                <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Newspaper className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            📰 Policy Update Discussion
                          </p>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {articleContext.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                        📅 {articleContext.published ? new Date(articleContext.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'} | 🏷️ {articleContext.category}
                      </p>
                      <a
                        href={articleContext.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all font-medium"
                      >
                        Read full article <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) =>
                message.role === "system" ? (
                  <div key={message.id} className="text-center py-2">
                    <span className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 rounded-full text-sm">
                      {message.content}
                    </span>
                  </div>
                ) : (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div
                      className={`flex-1 max-w-2xl ${
                        message.role === "user" ? "flex justify-end" : ""
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-6 py-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-purple-500/20"
                            : "bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-lg"
                        }`}
                      >
                        {/* Message Content with Bold Formatting */}
                        <div
                          className={`${
                            message.role === "user"
                              ? "text-white"
                              : "text-slate-700 dark:text-gray-200"
                          }`}
                        >
                          {/* For news messages, render each article with its link card */}
                          {message.newsArticles && message.newsArticles.length > 0 ? (
                            <div>
                              {/* Intro text */}
                              <div className="whitespace-pre-wrap mb-4">
                                {formatMessageContent(message.content.split('\n\n')[0])}
                              </div>
                              
                              {/* Each article with its link card */}
                              {message.newsArticles.map((article, idx) => (
                                <div key={idx} className="mb-6">
                                  {/* Article title */}
                                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                    {idx + 1}. {article.title}
                                  </h3>
                                  
                                  {/* Date and category */}
                                  <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">
                                    📅 {article.published ? new Date(article.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'} | 🏷️ {article.category}
                                  </p>
                                  
                                  {/* Summary */}
                                  <p className="text-slate-700 dark:text-gray-200 mb-3">
                                    {article.summary}
                                  </p>
                                  
                                  {/* Link card */}
                                  <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group text-sm"
                                  >
                                    <span className="text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-900 dark:group-hover:text-indigo-100 font-medium">
                                      Read full article
                                    </span>
                                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                                  </a>
                                  
                                  {/* Separator between articles */}
                                  {idx < message.newsArticles.length - 1 && (
                                    <hr className="my-6 border-slate-200 dark:border-slate-700" />
                                  )}
                                </div>
                              ))}
                              
                              {/* Closing question */}
                              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-slate-700 dark:text-gray-200">
                                  💡 <strong>Would you like me to explain how any of these updates might affect your visa status?</strong>
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Regular message rendering */
                            <div className="whitespace-pre-wrap">
                              {formatMessageContent(message.content)}
                            </div>
                          )}
                        </div>

                        {/* Assistant footer with sources and scores */}
                        {message.role === "assistant" && (message.sources || message.trust_score || message.confidence) && !message.newsArticles && (
                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                              <div>
                                <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">Sources:</p>
                                <div className="flex flex-wrap gap-2">
                                  {message.sources.slice(0, 3).map((source, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                    >
                                      📄 {source.source || `Source ${idx + 1}`}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Trust Score */}
                            {message.trust_score && (
                              <div className="text-sm">
                                <div className="font-bold text-slate-700 dark:text-gray-200">
                                  📊 Trust Score:
                                </div>
                                <div className="text-slate-600 dark:text-gray-400">
                                  {message.trust_score}%
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-slate-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Loading indicator */}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 max-w-2xl">
                    <div className="rounded-2xl px-6 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-lg">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Uploaded document preview */}
          {uploadedFile && (
            <div className="max-w-3xl mx-auto mt-6">
              <Collapsible open={isDocCardOpen} onOpenChange={setIsDocCardOpen}>
                <Card className="bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div>
                        <h4 className="text-slate-900 dark:text-gray-100">
                          {uploadedFile.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-gray-500">
                          {uploadedFile.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadedFile.status === "processed" && (
                        <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                          ✅ Processed Successfully
                        </Badge>
                      )}
                      {uploadedFile.status === "processing" && (
                        <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
                          ⏳ Processing...
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="h-8 w-8 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {uploadedFile.status === "processed" &&
                    uploadedFile.extracted && (
                      <CollapsibleContent>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-4">
                          <h5 className="mb-3 text-slate-900 dark:text-gray-100">
                            Extracted Information
                          </h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-500 mb-1">
                                SEVIS ID
                              </p>
                              <p className="text-slate-900 dark:text-gray-100">
                                {uploadedFile.extracted.sevisId}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 mb-1">
                                Program Start
                              </p>
                              <p className="text-slate-900 dark:text-gray-100">
                                {uploadedFile.extracted.programStart}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 mb-1">
                                Program End
                              </p>
                              <p className="text-slate-900 dark:text-gray-100">
                                {uploadedFile.extracted.programEnd}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 mb-1">
                                Employer
                              </p>
                              <p className="text-slate-900 dark:text-gray-100">
                                {uploadedFile.extracted.employer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    )}
                </Card>
              </Collapsible>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
          <div className="max-w-3xl mx-auto">
            {uploadedFile && (
              <div className="mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="text-sm text-slate-700 dark:text-gray-300">
                    {uploadedFile.name}
                  </span>
                  <button
                    onClick={handleRemoveFile}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 items-end mb-2">
              <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
                  placeholder="Ask a question or upload your document…"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 p-0"
                  disabled={loading}
                />

                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload">
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="text-slate-400 hover:text-purple-600"
                    title="Attach File"
                    disabled={loading}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </label>

                <button
                  className="text-slate-400 hover:text-purple-600"
                  title="Voice Input"
                  disabled={loading}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white rounded-2xl px-8 py-6 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>

            <p className="text-slate-500 text-center text-sm">
              VisaMate uses AI to analyze verified documents. Always confirm with your DSO.
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto hidden xl:block">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h4 className="text-slate-900 dark:text-gray-100">
                Trending Questions
              </h4>
            </div>
            <div className="space-y-2">
              {trendingQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleQuestionClick(question)}
                  className="w-full text-left p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-300 hover:shadow-md transition-all text-sm"
                  disabled={loading}
                >
                  <p className="text-slate-700 dark:text-gray-300 hover:text-purple-600">
                    {question}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Newspaper className="w-5 h-5 text-purple-600" />
              <h4 className="text-slate-900 dark:text-gray-100">
                Latest News Impact
              </h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-gray-300 mb-3">
              New STEM OPT fields added including Data Analytics and AI.
            </p>
            <Button
              onClick={() => onNavigate("policy-feed")}
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-md"
            >
              View Policy Feed
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-lg">📊</div>
              <h4 className="text-slate-900 dark:text-gray-100">
                What is Trust Score?
              </h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-gray-300 mb-3 leading-relaxed">
              Our Trust Score (0-100%) shows how confident we are in each answer. 
              It combines verification from multiple AI models and the quality of 
              sources used.
            </p>
            <div className="space-y-2 text-xs text-slate-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span><strong>85-100%:</strong> High confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span><strong>70-84%:</strong> Moderate confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span><strong>&lt;70%:</strong> Verify with DSO</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}