// import { useState, useEffect } from "react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
// import { CheckCircle2, Clock, Calendar, ArrowRight } from "lucide-react";

// type VisaStage = "F-1" | "CPT" | "OPT" | "STEM-OPT" | "H-1B";

// interface StageInfo {
//   id: VisaStage;
//   label: string;
//   description: string;
// }

// interface ContextualInfo {
//   daysLeft?: number;
//   deadline?: string;
//   nextStep?: string;
// }

// const stages: StageInfo[] = [
//   {
//     id: "F-1",
//     label: "F-1",
//     description: "F-1 Student Visa - Your initial student status for full-time academic study"
//   },
//   {
//     id: "CPT",
//     label: "CPT",
//     description: "Curricular Practical Training - Work authorization during your studies"
//   },
//   {
//     id: "OPT",
//     label: "OPT",
//     description: "Optional Practical Training - 12 months of work authorization after graduation"
//   },
//   {
//     id: "STEM-OPT",
//     label: "STEM-OPT",
//     description: "STEM OPT Extension - Additional 24 months for STEM degree holders"
//   },
//   {
//     id: "H-1B",
//     label: "H-1B",
//     description: "H-1B Work Visa - Long-term work authorization in specialty occupation"
//   }
// ];

// const API_BASE = "http://localhost:8000";

// // Fetch user's current stage and contextual info from backend
// const fetchUserStageData = async (): Promise<{ stage: VisaStage; info: ContextualInfo }> => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
//     }

//     const response = await fetch(`${API_BASE}/user/profile`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       const userStage = data.visa_stage || "F1";
      
//       // Map backend stages to component stages
//       const stageMap: Record<string, VisaStage> = {
//         "F1": "F-1",
//         "CPT": "CPT",
//         "OPT": "OPT",
//         "STEM-OPT": "STEM-OPT",
//         "H1B": "H-1B"
//       };

//       const mappedStage = stageMap[userStage] || "F-1";

//       // Calculate contextual info based on stage
//       let info: ContextualInfo = {};
      
//       switch (mappedStage) {
//         case "F-1":
//           info.nextStep = "Apply for CPT";
//           break;
//         case "CPT":
//           info.deadline = "Dec 15, 2025";
//           break;
//         case "OPT":
//           info.daysLeft = 120;
//           break;
//         case "STEM-OPT":
//           info.daysLeft = 542;
//           info.nextStep = "Prepare H-1B petition";
//           break;
//         default:
//           break;
//       }

//       return { stage: mappedStage, info };
//     }
    
//     return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
//   } catch (error) {
//     console.error("Error fetching visa stage:", error);
//     return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
//   }
// };

// export function VisaStageTimeline() {
//   const [currentStage, setCurrentStage] = useState<VisaStage>("F-1");
//   const [contextualInfo, setContextualInfo] = useState<ContextualInfo>({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchUserStageData().then(({ stage, info }) => {
//       setCurrentStage(stage);
//       setContextualInfo(info);
//       setIsLoading(false);
//     });
//   }, []);

//   const currentIndex = stages.findIndex((s) => s.id === currentStage);

//   if (isLoading) {
//     return (
//       <div className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:to-slate-900 border-b border-indigo-100 dark:border-slate-800 px-8 py-3">
//         <div className="max-w-4xl mx-auto">
//           <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }

//   // Determine which contextual info to show (prioritize deadline > days left > next step)
//   let contextDisplay = null;
//   if (contextualInfo.deadline) {
//     contextDisplay = (
//       <div className="flex items-center gap-1.5 text-xs">
//         <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
//         <span className="text-slate-600 dark:text-gray-400">
//           Deadline: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{contextualInfo.deadline}</span>
//         </span>
//       </div>
//     );
//   } else if (contextualInfo.daysLeft !== undefined) {
//     contextDisplay = (
//       <div className="flex items-center gap-1.5 text-xs">
//         <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
//         <span className="text-slate-600 dark:text-gray-400">
//           <span className="font-semibold text-indigo-600 dark:text-indigo-400">{contextualInfo.daysLeft} days</span> left
//         </span>
//       </div>
//     );
//   } else if (contextualInfo.nextStep) {
//     contextDisplay = (
//       <div className="flex items-center gap-1.5 text-xs">
//         <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
//         <span className="text-slate-600 dark:text-gray-400">
//           Next: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{contextualInfo.nextStep}</span>
//         </span>
//       </div>
//     );
//   }

//   return (
//     <TooltipProvider delayDuration={200}>
//       <div className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-slate-900/50 dark:to-slate-900/50 border-b border-indigo-100/50 dark:border-slate-800 px-8 py-3">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center gap-4">
//             {/* Progress Bar */}
//             <div className="relative flex items-center justify-between flex-1">
//               {/* Progress line background */}
//               <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 !bg-slate-300 dark:!bg-slate-600 rounded-full" style={{ backgroundColor: '#cbd5e1' }}>
//                 {/* Colored progress line */}
//                 <div
//                   className="absolute left-0 top-0 h-full !bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 shadow-md"
//                   style={{
//                     width: `${(currentIndex / (stages.length - 1)) * 100}%`,
//                     background: 'linear-gradient(to right, #4f46e5, #9333ea)'
//                   }}
//                 />
//               </div>

//               {/* Stage markers */}
//               {stages.map((stage, index) => {
//                 const isCompleted = index <= currentIndex;
//                 const isCurrent = index === currentIndex;

//                 return (
//                   <Tooltip key={stage.id}>
//                     <TooltipTrigger asChild>
//                       <div className="relative z-10 flex flex-col items-center gap-1.5 cursor-help group">
//                         {/* Stage circle */}
//                         <div
//                           className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
//                             isCurrent
//                               ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent scale-105 shadow-md ring-2 ring-indigo-100 dark:ring-indigo-900/50"
//                               : isCompleted
//                               ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent"
//                               : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
//                           }`}
//                         >
//                           {isCompleted ? (
//                             <CheckCircle2 className="w-4 h-4 text-white" />
//                           ) : (
//                             <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
//                           )}
//                         </div>

//                         {/* Stage label */}
//                         <span
//                           className={`text-xs whitespace-nowrap transition-colors ${
//                             isCurrent
//                               ? "text-indigo-600 dark:text-indigo-400 font-semibold"
//                               : isCompleted
//                               ? "text-slate-700 dark:text-gray-300"
//                               : "text-slate-400 dark:text-gray-600"
//                           }`}
//                         >
//                           {stage.label}
//                         </span>
//                       </div>
//                     </TooltipTrigger>
//                     <TooltipContent
//                       side="bottom"
//                       className="max-w-xs !bg-slate-900 !text-white !border-slate-700 shadow-xl z-50 dark:!bg-slate-950"
//                     >
//                       <p className="text-sm !text-white">{stage.description}</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 );
//               })}
//             </div>

//             {/* Contextual Information - inline on the right */}
//             {contextDisplay && (
//               <div className="flex-shrink-0 animate-in fade-in duration-500">
//                 <div className="px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-indigo-200/50 dark:border-slate-700/50 rounded-full">
//                   {contextDisplay}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }


// Nove 18, 2025
// import { useState, useEffect } from "react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
// import { CheckCircle2, Clock, Calendar, ArrowRight } from "lucide-react";

// type VisaStage = "F-1" | "CPT" | "OPT" | "STEM-OPT" | "H-1B";

// interface StageInfo {
//   id: VisaStage;
//   label: string;
//   description: string;
// }

// interface ContextualInfo {
//   daysLeft?: number;
//   deadline?: string;
//   nextStep?: string;
// }

// const stages: StageInfo[] = [
//   {
//     id: "F-1",
//     label: "F-1",
//     description: "F-1 Student Visa - Your initial student status for full-time academic study"
//   },
//   {
//     id: "CPT",
//     label: "CPT",
//     description: "Curricular Practical Training - Work authorization during your studies"
//   },
//   {
//     id: "OPT",
//     label: "OPT",
//     description: "Optional Practical Training - 12 months of work authorization after graduation"
//   },
//   {
//     id: "STEM-OPT",
//     label: "STEM-OPT",
//     description: "STEM OPT Extension - Additional 24 months for STEM degree holders"
//   },
//   {
//     id: "H-1B",
//     label: "H-1B",
//     description: "H-1B Work Visa - Long-term work authorization in specialty occupation"
//   }
// ];

// const API_BASE = "http://localhost:8000";

// // Fetch user's current stage and contextual info from backend
// const fetchUserStageData = async (): Promise<{ stage: VisaStage; info: ContextualInfo }> => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
//     }

//     const response = await fetch(`${API_BASE}/users/profile`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       const userStage = data.visa_stage || "F1";
      
//       // Map backend stages to component stages
//       const stageMap: Record<string, VisaStage> = {
//         "F1": "F-1",
//         "CPT": "CPT",
//         "OPT": "OPT",
//         "STEM-OPT": "STEM-OPT",
//         "H1B": "H-1B"
//       };

//       const mappedStage = stageMap[userStage] || "F-1";

//       // Calculate contextual info based on stage
//       let info: ContextualInfo = {};
      
//       switch (mappedStage) {
//         case "F-1":
//           info.nextStep = "Apply for CPT";
//           break;
//         case "CPT":
//           info.deadline = "Dec 15, 2025";
//           break;
//         case "OPT":
//           info.daysLeft = 120;
//           break;
//         case "STEM-OPT":
//           info.daysLeft = 542;
//           info.nextStep = "Prepare H-1B petition";
//           break;
//         default:
//           break;
//       }

//       return { stage: mappedStage, info };
//     }
    
//     return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
//   } catch (error) {
//     console.error("Error fetching visa stage:", error);
//     return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
//   }
// };

// export function VisaStageTimeline() {
//   const [currentStage, setCurrentStage] = useState<VisaStage>("F-1");
//   const [contextualInfo, setContextualInfo] = useState<ContextualInfo>({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchUserStageData().then(({ stage, info }) => {
//       setCurrentStage(stage);
//       setContextualInfo(info);
//       setIsLoading(false);
//     });
//   }, []);

//   const currentIndex = stages.findIndex((s) => s.id === currentStage);

//   if (isLoading) {
//     return (
//       <div className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:to-slate-900 border-b border-indigo-100 dark:border-slate-800 px-8 py-3">
//         <div className="max-w-4xl mx-auto">
//           <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }

//   // Determine which contextual info to show (prioritize deadline > days left > next step)
//   let contextDisplay = null;
//   if (contextualInfo.deadline) {
//     contextDisplay = (
//       <div className="flex items-center gap-1.5 text-xs">
//         <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
//         <span className="text-slate-600 dark:text-gray-400">
//           Deadline: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{contextualInfo.deadline}</span>
//         </span>
//       </div>
//     );
//   } else if (contextualInfo.daysLeft !== undefined) {
//     contextDisplay = (
//       <div className="flex items-center gap-1.5 text-xs">
//         <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
//         <span className="text-slate-600 dark:text-gray-400">
//           <span className="font-semibold text-indigo-600 dark:text-indigo-400">{contextualInfo.daysLeft} days</span> left
//         </span>
//       </div>
//     );
//   } else if (contextualInfo.nextStep) {
//     contextDisplay = (
//       <div className="flex items-center gap-1.5 text-xs">
//         <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
//         <span className="text-slate-600 dark:text-gray-400">
//           Next: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{contextualInfo.nextStep}</span>
//         </span>
//       </div>
//     );
//   }

//   return (
//     <TooltipProvider delayDuration={200}>
//       <div className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-slate-900/50 dark:to-slate-900/50 border-b border-indigo-100/50 dark:border-slate-800 px-8 py-3">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center gap-4">
//             {/* Progress Bar */}
//             <div className="relative flex items-center justify-between flex-1">
//               {/* Progress line background */}
//               <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 !bg-slate-300 dark:!bg-slate-600 rounded-full" style={{ backgroundColor: '#cbd5e1' }}>
//                 {/* Colored progress line */}
//                 <div
//                   className="absolute left-0 top-0 h-full !bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 shadow-md"
//                   style={{
//                     width: `${(currentIndex / (stages.length - 1)) * 100}%`,
//                     background: 'linear-gradient(to right, #4f46e5, #9333ea)'
//                   }}
//                 />
//               </div>

//               {/* Stage markers */}
//               {stages.map((stage, index) => {
//                 const isCompleted = index <= currentIndex;
//                 const isCurrent = index === currentIndex;

//                 return (
//                   <Tooltip key={stage.id}>
//                     <TooltipTrigger asChild>
//                       <div className="relative z-10 flex flex-col items-center gap-1.5 cursor-help group">
//                         {/* Stage circle */}
//                         <div
//                           className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
//                             isCurrent
//                               ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent scale-105 shadow-md ring-2 ring-indigo-100 dark:ring-indigo-900/50"
//                               : isCompleted
//                               ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent"
//                               : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
//                           }`}
//                         >
//                           {isCompleted ? (
//                             <CheckCircle2 className="w-4 h-4 text-white" />
//                           ) : (
//                             <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
//                           )}
//                         </div>

//                         {/* Stage label */}
//                         <span
//                           className={`text-xs whitespace-nowrap transition-colors ${
//                             isCurrent
//                               ? "text-indigo-600 dark:text-indigo-400 font-semibold"
//                               : isCompleted
//                               ? "text-slate-700 dark:text-gray-300"
//                               : "text-slate-400 dark:text-gray-600"
//                           }`}
//                         >
//                           {stage.label}
//                         </span>
//                       </div>
//                     </TooltipTrigger>
//                     <TooltipContent
//                       side="bottom"
//                       className="max-w-xs !bg-slate-900 !text-white !border-slate-700 shadow-xl z-50 dark:!bg-slate-950"
//                     >
//                       <p className="text-sm !text-white">{stage.description}</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 );
//               })}
//             </div>

//             {/* Contextual Information - inline on the right */}
//             {contextDisplay && (
//               <div className="flex-shrink-0 animate-in fade-in duration-500">
//                 <div className="px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-indigo-200/50 dark:border-slate-700/50 rounded-full">
//                   {contextDisplay}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }



// Nov 23, 2025
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { CheckCircle2, Clock, Calendar, ArrowRight, Sparkles, Circle } from "lucide-react";

type VisaStage = "F-1" | "CPT" | "OPT" | "STEM-OPT" | "H-1B";

interface StageInfo {
  id: VisaStage;
  label: string;
  description: string;
}

interface ContextualInfo {
  daysLeft?: number;
  deadline?: string;
  nextStep?: string;
}

const stages: StageInfo[] = [
  { id: "F-1", label: "F-1", description: "F-1 Student Visa - Full-time academic study status" },
  { id: "CPT", label: "CPT", description: "Curricular Practical Training - Work authorization during studies" },
  { id: "OPT", label: "OPT", description: "Optional Practical Training - 12 months post-grad authorization" },
  { id: "STEM-OPT", label: "STEM OPT", description: "STEM Extension - Additional 24 months authorization" },
  { id: "H-1B", label: "H-1B", description: "H-1B Specialty Occupation - Long-term work visa" }
];

const API_BASE = "http://localhost:8000";

const fetchUserStageData = async (): Promise<{ stage: VisaStage; info: ContextualInfo }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
    }

    const response = await fetch(`${API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      const userStage = data.visa_stage || "F1";
      
      const stageMap: Record<string, VisaStage> = {
        "F1": "F-1",
        "CPT": "CPT",
        "OPT": "OPT",
        "STEM-OPT": "STEM-OPT",
        "H1B": "H-1B"
      };

      const mappedStage = stageMap[userStage] || "F-1";

      let info: ContextualInfo = {};
      
      switch (mappedStage) {
        case "F-1":
          info.nextStep = "Apply for CPT";
          break;
        case "CPT":
          info.deadline = "Dec 15, 2025";
          break;
        case "OPT":
          info.daysLeft = 120;
          break;
        case "STEM-OPT":
          info.daysLeft = 542;
          info.nextStep = "Prepare H-1B petition";
          break;
        default:
          break;
      }

      return { stage: mappedStage, info };
    }
    
    return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
  } catch (error) {
    console.error("Error fetching visa stage:", error);
    return { stage: "F-1" as VisaStage, info: { nextStep: "Apply for CPT" } };
  }
};

export function VisaStageTimeline() {
  const [currentStage, setCurrentStage] = useState<VisaStage>("F-1");
  const [contextualInfo, setContextualInfo] = useState<ContextualInfo>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchUserStageData().then(({ stage, info }) => {
      setCurrentStage(stage);
      setContextualInfo(info);
      setIsLoading(false);
    });
  }, []);

  const currentIndex = stages.findIndex((s) => s.id === currentStage);
  const progressPercent = (currentIndex / (stages.length - 1)) * 100;

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100px',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          height: '6px',
          width: '66.666%',
          backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
          borderRadius: '9999px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
      </div>
    );
  }

  let contextConfig = { 
    icon: <Calendar style={{ width: '14px', height: '14px' }} />, 
    text: contextualInfo.deadline || "On Track", 
    label: "DEADLINE" 
  };
  
  if (contextualInfo.daysLeft !== undefined) {
    contextConfig = { 
      icon: <Clock style={{ width: '14px', height: '14px' }} />, 
      text: `${contextualInfo.daysLeft} days left`, 
      label: "TIME REMAINING" 
    };
  } else if (contextualInfo.nextStep && !contextualInfo.deadline) {
    contextConfig = { 
      icon: <ArrowRight style={{ width: '14px', height: '14px' }} />, 
      text: contextualInfo.nextStep, 
      label: "NEXT STEP" 
    };
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div style={{
        position: 'relative',
        width: '100%',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
        overflow: 'hidden'
      }}>
        
        <div style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px 32px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px'
          }}>
            
            {/* Timeline Section */}
            <div style={{ flex: 1, width: '100%', position: 'relative' }}>
              {/* Progress Track Background */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: 0,
                width: '100%',
                height: '2px',
                backgroundColor: isDark ? '#334155' : '#cbd5e1',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                {/* Active Progress Bar */}
                <div style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                  borderRadius: '9999px',
                  transition: 'width 1s ease-out'
                }} />
              </div>

              {/* Stages */}
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                {stages.map((stage, index) => {
                  const isCompleted = index < currentIndex;
                  const isCurrent = index === currentIndex;
                  const isFuture = index > currentIndex;

                  // Size variations
                  const nodeSize = isCurrent ? 36 : 32;
                  const iconSize = isCurrent ? 18 : 16;

                  return (
                    <Tooltip key={stage.id}>
                      <TooltipTrigger asChild>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          position: 'relative',
                          zIndex: 10
                        }}>
                          
                          {/* Node Circle */}
                          <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: `${nodeSize}px`,
                            height: `${nodeSize}px`,
                            borderRadius: '50%',
                            transition: 'all 0.3s',
                            border: '2px solid',
                            backgroundColor: isDark 
                              ? (isCompleted || isCurrent ? '#1e293b' : '#0f172a')
                              : (isCompleted || isCurrent ? '#ffffff' : '#f8fafc'),
                            borderColor: isCompleted || isCurrent 
                              ? '#6366f1' 
                              : isDark ? '#475569' : '#cbd5e1',
                            transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: isCurrent ? '0 0 0 4px rgba(99,102,241,0.15)' : 'none'
                          }}>

                            {/* Icons */}
                            {isCompleted && (
                              <CheckCircle2 
                                style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: '#6366f1' }} 
                                strokeWidth={2.5} 
                              />
                            )}
                            {isCurrent && (
                              <div style={{ 
                                width: '10px', 
                                height: '10px', 
                                backgroundColor: '#6366f1', 
                                borderRadius: '50%' 
                              }} />
                            )}
                            {isFuture && (
                              <Circle style={{ 
                                width: '10px', 
                                height: '10px', 
                                fill: isDark ? '#475569' : '#cbd5e1', 
                                color: 'transparent' 
                              }} />
                            )}
                          </div>

                          {/* Label Badge */}
                          <div style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 500,
                            transition: 'all 0.2s',
                            border: '1px solid',
                            backgroundColor: isCurrent 
                              ? (isDark ? '#312e81' : '#eef2ff')
                              : 'transparent',
                            color: isCurrent 
                              ? (isDark ? '#c7d2fe' : '#4338ca')
                              : isDark ? '#94a3b8' : '#64748b',
                            borderColor: isCurrent 
                              ? (isDark ? '#4c1d95' : '#c7d2fe')
                              : 'transparent'
                          }}>
                            {stage.label}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="bottom"
                        className="max-w-[200px]"
                        style={{
                          backgroundColor: isDark ? '#f8fafc' : '#1e293b',
                          color: isDark ? '#1e293b' : '#f8fafc',
                          border: 'none',
                          padding: '12px',
                          fontSize: '12px',
                          textAlign: 'center',
                          lineHeight: '1.5',
                          borderRadius: '8px'
                        }}
                      >
                        <p style={{ fontWeight: 500, marginBottom: '4px', color: '#a855f7' }}>
                          {stage.label}
                        </p>
                        {stage.description}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Contextual Widget */}
            <div style={{ flexShrink: 0, minWidth: '170px' }}>
               <div style={{
                 position: 'relative',
                 overflow: 'hidden',
                 borderRadius: '12px',
                 border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.6)'}`,
                 backgroundColor: isDark 
                   ? 'rgba(30, 41, 59, 0.6)'
                   : 'rgba(255, 255, 255, 0.7)',
                 backdropFilter: 'blur(12px)',
                 WebkitBackdropFilter: 'blur(12px)',
                 boxShadow: isDark 
                   ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)'
                   : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
               }}>
                 
                 <div style={{
                   padding: '14px 16px',
                   display: 'flex',
                   flexDirection: 'column',
                   gap: '4px',
                   position: 'relative'
                 }}>
                   <span style={{
                     fontSize: '9px',
                     textTransform: 'uppercase',
                     letterSpacing: '0.08em',
                     fontWeight: 600,
                     color: isDark ? '#64748b' : '#94a3b8'
                   }}>
                     {contextConfig.label}
                   </span>
                   <div style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     color: isDark ? '#a5b4fc' : '#6366f1'
                   }}>
                     {contextConfig.icon}
                     <span style={{
                       fontWeight: 600,
                       fontSize: '13px',
                       color: isDark ? '#f1f5f9' : '#1e293b'
                     }}>
                       {contextConfig.text}
                     </span>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .5;
            }
          }
        `}</style>
      </div>
    </TooltipProvider>
  );
}