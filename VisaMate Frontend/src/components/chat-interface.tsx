import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, User, Sparkles, Paperclip, Mic, Upload } from "lucide-react";
import { Screen } from "../App"; // ✅ Proper import for navigation typing

const immigrationOptions = [
  "F-1 Student (currently enrolled)",
  "F-1 Student on CPT (Curricular Practical Training)",
  "F-1 Student on OPT (Optional Practical Training)",
  "F-1 Student on STEM OPT Extension",
  "H-1B Employee",
  "Prospective Student (admitted, but not yet in the U.S.)",
  "Other / Transitioning between statuses",
];

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `Hello, and welcome to **VisaMate** — your professional immigration compliance advisor.  
I’m here to help you stay fully compliant throughout your U.S. visa journey from F-1 student status to H-1B employment and beyond.  

To provide the most accurate and personalized guidance, I’ll need to collect a few details about your current situation.  
This will take approximately 2–3 minutes.  

Let’s begin — could you please tell me your **current immigration status**?`,
    },
  ]);

  const [input, setInput] = useState("");
  const [stage, setStage] = useState<"onboarding" | "chat">("onboarding");

  // 🧠 Handle message send
  const handleSend = (customInput?: string) => {
    const userText = customInput || input.trim();
    if (!userText) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: userText,
    };
    setMessages((prev) => [...prev, userMessage]);

    if (stage === "onboarding") {
      setTimeout(() => {
        const { response, uploadPrompt } = getPersonaResponse(userText);
        const newMessages: Message[] = [
          { id: messages.length + 2, role: "assistant", content: response },
        ];
        if (uploadPrompt)
          newMessages.push({
            id: messages.length + 3,
            role: "assistant",
            content: uploadPrompt,
          });
        setMessages((prev) => [...prev, ...newMessages]);
      }, 600);
    }

    setInput("");
  };

  // 🎭 Persona logic
  const getPersonaResponse = (status: string) => {
    setStage("chat");
    let response = "";
    let uploadPrompt = "";

    if (status.includes("currently enrolled")) {
      response = `Great! I see you’re an F-1 student currently enrolled in a U.S. institution.  
To set up your compliance profile, I’ll need the following:  
• Which university are you attending?  
• What’s your program of study (e.g., MS in Computer Science)?  
• What’s your expected graduation date (as listed on your I-20)?  
• Have you participated in CPT or OPT before, or will this be your first time?`;
      uploadPrompt = `📄 Please upload your **latest Form I-20** showing your current program and travel signature.  
(Optional: You may also upload your **passport visa page** for visa validity confirmation.)`;
    } else if (status.includes("CPT")) {
      response = `Thank you. I see that you’re currently authorized for CPT.  
Let’s confirm your details:  
• What’s your CPT start and end date (from your I-20)?  
• Who is your current employer?  
• What’s your employment type — full-time, part-time, or contractual?`;
      uploadPrompt = `📄 Please upload your **I-20 with CPT authorization** and optionally your **employment offer letter**.`;
    } else if (status.includes("OPT")) {
      response = `Got it — you’re currently on OPT.  
Let’s verify a few things:  
• What’s your OPT start and end date (from your EAD card)?  
• Who is your current employer?`;
      uploadPrompt = `📄 Please upload your **EAD card (front & back)** and **I-20 showing OPT authorization**.`;
    } else if (status.includes("STEM")) {
      response = `Thank you. You’re on the STEM OPT extension — excellent.  
To maintain compliance:  
• What’s your EAD validity period?  
• Who is your current employer?  
• Have you submitted your Form I-983 (training plan)?`;
      uploadPrompt = `📄 Please upload your **STEM OPT EAD card**, **I-20 with STEM OPT recommendation**, and **Form I-983**.`;
    } else if (status.includes("H-1B")) {
      response = `Welcome! You’re currently working in the U.S. on an H-1B visa.  
Let’s confirm a few details:  
• Who is your sponsoring employer?  
• What’s your job title?  
• What’s your H-1B start and expiry date (from your I-797)?`;
      uploadPrompt = `📄 Please upload your **Form I-797 Approval Notice**, **I-94**, and optionally your **pay stub or offer letter**.`;
    } else if (status.includes("Prospective")) {
      response = `That’s exciting — welcome to your U.S. journey ahead!  
Let’s get you prepared for arrival:  
• Have you received your Form I-20 from your university?  
• When does your program start?`;
      uploadPrompt = `📄 Please upload your **Form I-20**, **passport biographical page**, and optional SEVIS fee receipt.`;
    } else {
      response = `Thank you for sharing. You can now ask me any questions about your visa stage or upload your documents for verification.`;
    }

    return { response, uploadPrompt };
  };

  // 📎 Handle document upload
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadMsg: Message = {
      id: messages.length + 1,
      role: "user",
      content: `📎 Uploaded file: ${file.name}`,
    };
    setMessages((prev) => [...prev, uploadMsg]);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: `✅ I’ve successfully processed your document.  
**Type:** ${data.doc_type || "Unknown"}  
**SEVIS ID:** ${data.parsed_fields?.SEVIS_ID || "N/A"}  
**Program End Date:** ${data.parsed_fields?.Program_End_Date || "N/A"}`,
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content:
            "⚠️ File upload failed. Please try again or check backend connection.",
        },
      ]);
    }
  };

  // =============================================================
  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] flex flex-col transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-slate-900 dark:text-gray-100 font-semibold text-lg">
            VisaMate Advisor
          </h2>
          <p className="text-slate-600 dark:text-gray-400">
            Professional guidance for F-1, OPT, STEM OPT, and H-1B compliance.
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4">
              {msg.role === "user" ? (
                <>
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600 dark:text-gray-300" />
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl px-6 py-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-700 dark:text-gray-200">
                      {msg.content}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl px-6 py-5 border border-indigo-100 dark:border-indigo-900/50">
                    <p className="text-slate-700 dark:text-gray-200 whitespace-pre-line">
                      {msg.content}
                    </p>

                    {/* Immigration options during onboarding */}
                    {msg.id === 1 && stage === "onboarding" && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {immigrationOptions.map((opt, i) => (
                          <Button
                            key={i}
                            onClick={() => handleSend(opt)}
                            variant="outline"
                            className="text-sm border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400"
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Upload prompt */}
                    {msg.content.includes("📄") && (
                      <div className="mt-4 flex items-center gap-3">
                        <label className="cursor-pointer text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          <span>Attach Document</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                          />
                        </label>
                        <Button
                          onClick={() => onNavigate("upload")}
                          variant="outline"
                          className="flex items-center gap-2 rounded-lg"
                        >
                          <Upload className="w-4 h-4" />
                          Open Upload Screen
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your response…"
            className="flex-1 border-0 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 focus-visible:ring-0"
          />
          <Button
            onClick={() => handleSend()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl px-6 py-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
