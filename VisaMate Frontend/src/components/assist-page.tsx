import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Send, 
  User, 
  Sparkles, 
  Paperclip, 
  Mic, 
  FileText, 
  ExternalLink, 
  Clock,
  ChevronDown,
  ChevronUp,
  Brain,
  CheckCircle2
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

const exampleQuestions = [
  "Can I work remotely while on CPT?",
  "When should I apply for STEM OPT?",
  "What's the 60-day grace period after OPT?"
];

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  citations?: Citation[];
  reasoning?: string;
  sourceQuality?: number;
  citationCoverage?: number;
}

interface Citation {
  title: string;
  description: string;
  date: string;
  url: string;
}

const sampleCitations: Citation[] = [
  {
    title: "USCIS CPT Guidelines – Section 3.2 Employment Requirements",
    description: "CPT must be an integral part of an established curriculum. Students must be currently enrolled and maintain valid F-1 status.",
    date: "Oct 2025",
    url: "#"
  },
  {
    title: "DHS Study in the States – Remote Work Policy",
    description: "Remote work arrangements must be approved by DSO. The employer must have a physical location in the United States.",
    date: "Sept 2025",
    url: "#"
  },
  {
    title: "SEVP Policy Guidance – Work Authorization",
    description: "All CPT employment must be directly related to the student's major area of study as determined by the DSO.",
    date: "Aug 2025",
    url: "#"
  }
];

const dataFreshness = [
  { source: "USCIS", date: "Oct 2025", color: "bg-purple-500" },
  { source: "DHS", date: "Sept 2025", color: "bg-blue-500" },
  { source: "SEVP", date: "Aug 2025", color: "bg-sky-500" }
];

interface AssistPageProps {
  onNavigate: (screen: string) => void;
}

export function AssistPage({ onNavigate }: AssistPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [expandedCitations, setExpandedCitations] = useState<number[]>([0]);
  const [currentResponse, setCurrentResponse] = useState<Message | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: input === exampleQuestions[0]
          ? "You can work remotely on CPT only if it's approved by your DSO and meets your program requirements. The employer must have a physical location in the United States, and the work must be directly related to your major area of study. Remote work arrangements need to be documented and approved before you begin employment."
          : input === exampleQuestions[1]
          ? "The STEM OPT extension must be filed within 90 days before your current OPT expires. Make sure to work with your DSO to submit Form I-983 and update your SEVIS record. Your employer must be enrolled in E-Verify, and you'll need to develop a training plan that outlines your learning objectives."
          : input === exampleQuestions[2]
          ? "The 60-day grace period allows you to prepare to leave the United States, change your status, or transfer to another school. During this period, you cannot work. The grace period begins the day after your OPT employment authorization expires or the date you complete your program, whichever comes later."
          : "I can help you understand CPT, OPT, and STEM-OPT policies. Please ask me a specific question about your visa process, or try one of the example questions above.",
        confidence: 88,
        sourceQuality: 96,
        citationCoverage: 92,
        citations: sampleCitations,
        reasoning: "VisaMate analyzed this question by extracting key concepts (CPT, remote work, requirements). The answer is cross-referenced with official USCIS guidelines, DHS policies, and SEVP regulations. We prioritize accuracy by verifying multiple authoritative sources and highlighting any conditions or requirements that apply to your specific situation."
      };
      setMessages(prev => [...prev, aiResponse]);
      setCurrentResponse(aiResponse);
    }, 800);
    
    setInput("");
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const toggleCitation = (index: number) => {
    setExpandedCitations(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const isEmpty = messages.length === 0;

  // Use the last assistant message for the explainability panel
  const displayResponse = currentResponse || messages.filter(m => m.role === "assistant").pop();

  return (
    <div className="flex h-[calc(100vh-73px)] bg-[#FAFAFA] dark:bg-slate-950">
      {/* Left Section - Chat Interface (65%) */}
      <div className="flex-1 flex flex-col" style={{ flexBasis: '65%' }}>
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {isEmpty ? (
            /* Empty State */
            <div className="text-center py-16 max-w-3xl mx-auto">
              <h3 className="mb-2 text-[#1E1E1E] dark:text-gray-100" style={{ fontSize: '1.75rem' }}>
                Hi there 👋 I'm VisaMate.
              </h3>
              <p className="mb-12 max-w-xl mx-auto" style={{ color: 'rgba(30, 30, 30, 0.6)', opacity: 0.8 }}>
                <span className="dark:text-gray-400">Ask me anything about your visa process — for example:</span>
              </p>
              
              {/* Example Question Cards */}
              <div className="space-y-4 max-w-2xl mx-auto">
                {exampleQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left px-6 py-5 bg-white dark:bg-slate-800/50 rounded-[20px] hover:shadow-lg transition-all group border border-slate-200 dark:border-slate-700 hover:border-[#A78BFA] dark:hover:border-[#A78BFA]"
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  >
                    <p className="text-[#1E1E1E] dark:text-gray-200 group-hover:text-[#A78BFA] dark:group-hover:text-[#A78BFA] transition-colors">
                      {question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "assistant" && (
                    <div className="w-10 h-10 bg-gradient-to-br from-[#A78BFA] to-[#60A5FA] rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`flex-1 max-w-2xl ${message.role === "user" ? "flex justify-end" : ""}`}>
                    <div className={`rounded-[20px] px-6 py-4 ${
                      message.role === "user"
                        ? "bg-[#60A5FA] text-white"
                        : "bg-white dark:bg-slate-800/80 border-2 border-[#A78BFA] dark:border-[#A78BFA]/50"
                    }`}
                    style={message.role === "assistant" ? { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } : undefined}>
                      <p className={message.role === "user" ? "text-white" : "text-[#1E1E1E] dark:text-gray-200"}>
                        {message.content}
                      </p>
                      
                      {/* Explainability Badge on AI Response */}
                      {message.role === "assistant" && message.confidence && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                            Confidence: {message.confidence}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-slate-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end mb-3">
              <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[20px] px-5 py-4 focus-within:border-[#A78BFA] dark:focus-within:border-[#A78BFA] transition-colors shadow-md">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question or drop your I-20, EAD, or offer letter here…"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-[#1E1E1E] dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500"
                />
                <button 
                  className="text-slate-400 dark:text-gray-500 hover:text-[#A78BFA] dark:hover:text-[#A78BFA] transition-colors p-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button 
                  className="text-slate-400 dark:text-gray-500 hover:text-[#A78BFA] dark:hover:text-[#A78BFA] transition-colors p-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg"
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <Button 
                onClick={handleSend}
                className="bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] hover:from-[#9333EA] hover:to-[#3B82F6] text-white rounded-[20px] px-8 py-6 transition-all"
                style={{ boxShadow: '0 8px 16px rgba(167, 139, 250, 0.3)' }}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="text-center text-sm" style={{ color: 'rgba(30, 30, 30, 0.5)' }}>
              <span className="dark:text-gray-500">VisaMate uses AI to analyze verified documents. Always confirm with your DSO.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Explainability Panel (35%) */}
      <div 
        className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto"
        style={{ flexBasis: '35%', minWidth: '420px' }}
      >
        <div className="p-8 sticky top-0">
          <div className="mb-8">
            <h3 className="mb-2 text-[#1E1E1E] dark:text-gray-100">
              Explainability — How VisaMate Builds Trust
            </h3>
            <p className="text-sm" style={{ color: 'rgba(30, 30, 30, 0.6)' }}>
              <span className="dark:text-gray-400">Transparency & verification for AI-generated answers.</span>
            </p>
          </div>

          {displayResponse ? (
            <div className="space-y-6">
              {/* 1. Citations & Sources */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-950/50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#A78BFA]" />
                  </div>
                  <h4 className="text-[#1E1E1E] dark:text-gray-100">Citations & Sources</h4>
                </div>
                <div className="space-y-3">
                  {displayResponse.citations?.map((citation, index) => (
                    <Collapsible key={index} open={expandedCitations.includes(index)} onOpenChange={() => toggleCitation(index)}>
                      <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[20px] overflow-hidden">
                        <CollapsibleTrigger className="w-full p-4 flex items-start justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex-1">
                            <p className="text-[#1E1E1E] dark:text-gray-100 text-sm mb-1">{citation.title}</p>
                            <Badge className="bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50 border-0 text-xs">
                              Updated {citation.date}
                            </Badge>
                          </div>
                          {expandedCitations.includes(index) ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 dark:text-gray-500 flex-shrink-0 ml-2" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-gray-500 flex-shrink-0 ml-2" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-3">
                            <p className="text-sm italic mb-3" style={{ color: 'rgba(30, 30, 30, 0.7)' }}>
                              <span className="dark:text-gray-400">{citation.description}</span>
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs rounded-lg border-[#A78BFA] text-[#A78BFA] hover:bg-purple-50 dark:hover:bg-purple-950/30"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Full Document
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs rounded-lg"
                              >
                                Copy Link
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              </div>

              {/* 2. Confidence Levels */}
              <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[20px] p-5">
                <h4 className="text-[#1E1E1E] dark:text-gray-100 mb-4">Confidence Levels</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#1E1E1E] dark:text-gray-200">Source Quality</span>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">{displayResponse.sourceQuality}%</span>
                    </div>
                    <Progress value={displayResponse.sourceQuality} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#1E1E1E] dark:text-gray-200">Answer Confidence</span>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">{displayResponse.confidence}%</span>
                    </div>
                    <Progress value={displayResponse.confidence} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#1E1E1E] dark:text-gray-200">Citation Coverage</span>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">{displayResponse.citationCoverage}%</span>
                    </div>
                    <Progress value={displayResponse.citationCoverage} className="h-2" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-2 text-xs mb-3">
                    <div className="flex gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[#1E1E1E] dark:text-gray-400">High {'>'}80%</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-[#1E1E1E] dark:text-gray-400">Medium 60-79%</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-[#1E1E1E] dark:text-gray-400">Low {'<'}60%</span>
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs rounded-lg border-slate-300 dark:border-slate-600"
                  >
                    Multi-Model Consensus
                  </Button>
                </div>
              </Card>

              {/* 3. Reasoning Summary */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800 rounded-[20px] p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#A78BFA] to-[#60A5FA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#1E1E1E] dark:text-gray-100 mb-2">Reasoning Summary</h4>
                    <p className="text-sm" style={{ color: 'rgba(30, 30, 30, 0.7)' }}>
                      <span className="dark:text-gray-300">{displayResponse.reasoning}</span>
                    </p>
                  </div>
                </div>
              </Card>

              {/* 4. Data Freshness Timeline */}
              <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[20px] p-5">
                <h4 className="text-[#1E1E1E] dark:text-gray-100 mb-4">Data Freshness Timeline</h4>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-2 top-6 bottom-6 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-sky-500"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-6 relative">
                    {dataFreshness.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-4 h-4 ${item.color} rounded-full flex-shrink-0 ring-4 ring-white dark:ring-slate-800`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-[#1E1E1E] dark:text-gray-100">{item.source}</p>
                          <p className="text-xs" style={{ color: 'rgba(30, 30, 30, 0.5)' }}>
                            <span className="dark:text-gray-500">{item.date}</span>
                          </p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-[20px] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-slate-400 dark:text-gray-600" />
              </div>
              <p className="text-sm" style={{ color: 'rgba(30, 30, 30, 0.6)' }}>
                <span className="dark:text-gray-400">Ask a question to see explainability metrics</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


