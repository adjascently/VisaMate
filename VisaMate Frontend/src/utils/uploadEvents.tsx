import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";

// Temporary mock until backend OCR is wired
const mockDocuments = [
  { 
    id: 1, 
    name: "I-20_Parsed.pdf", 
    size: "1.2 MB", 
    status: "complete", 
    progress: 100,
    extracted: {
      sevisId: "N0035873419",
      programStart: "04 September 2024",
      programEnd: "20 December 2026",
      employer: "Airwallex Inc."
    }
  },
];

const promptSuggestions = [
  "What's my CPT end date?",
  "Is my employer name listed?",
  "Does this form have all required signatures?"
];

interface UploadScreenProps {
  onNavigate: (screen: string) => void;
}

export function UploadScreen({ onNavigate }: UploadScreenProps) {
  const [documents, setDocuments] = useState(mockDocuments);
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] p-6 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2 text-slate-900 dark:text-gray-100 font-semibold text-lg">📄 Document Assistant</h2>
          <p className="text-slate-600 dark:text-gray-400">
            Upload your I-20, EAD, or offer letter — and let VisaMate automatically extract key visa details.
          </p>
        </div>

        {showEmpty ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-16 mb-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 opacity-40">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="mb-3 text-slate-900 dark:text-gray-100">No documents yet.</h3>
            <p className="text-slate-600 dark:text-gray-400 mb-6">
              Drag & drop a file here or click upload to get started.
            </p>
            <Button 
              onClick={() => setShowEmpty(false)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors p-12 mb-8 text-center cursor-pointer group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-slate-900 dark:text-gray-100 font-medium">Drop your I-20, EAD, or Offer Letter here</h3>
              <p className="text-slate-600 dark:text-gray-400 mb-1">(PDF, JPEG, PNG)</p>
              <p className="text-slate-500 dark:text-gray-500">or click to browse</p>
            </div>

            {/* Uploaded Documents */}
            {documents.length > 0 && (
              <div className="space-y-6">
                {documents.map((doc) => (
                  <div key={doc.id}>
                    {/* Document Card */}
                    <Card className="bg-white dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg rounded-2xl">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="truncate text-slate-900 dark:text-gray-100 font-medium">{doc.name}</h4>
                              <p className="text-slate-500 dark:text-gray-500 text-sm">{doc.size}</p>
                            </div>
                            
                            {doc.status === "complete" && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          {doc.status === "complete" && (
                            <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                              ✅ Document processed successfully
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Extracted Summary */}
                      {doc.extracted && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 mb-6">
                          <h4 className="mb-4 text-slate-900 dark:text-gray-100 font-semibold">Extracted Information</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500 dark:text-gray-500 mb-1">SEVIS ID:</p>
                              <p className="text-slate-900 dark:text-gray-100">{doc.extracted.sevisId}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 dark:text-gray-500 mb-1">Program Start:</p>
                              <p className="text-slate-900 dark:text-gray-100">{doc.extracted.programStart}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 dark:text-gray-500 mb-1">Program End:</p>
                              <p className="text-slate-900 dark:text-gray-100">{doc.extracted.programEnd}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 dark:text-gray-500 mb-1">Employer:</p>
                              <p className="text-slate-900 dark:text-gray-100">{doc.extracted.employer}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Prompt Suggestions */}
                      <div className="mb-4">
                        <p className="text-slate-600 dark:text-gray-400 mb-3">Ask about this document:</p>
                        <div className="flex flex-wrap gap-2">
                          {promptSuggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => onNavigate('chat')}
                              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors border border-indigo-200/50 dark:border-indigo-800/50 text-sm"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 rounded-xl">
                          Download PDF Summary
                        </Button>
                        <Button 
                          variant="outline"
                          className="rounded-xl text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>

                    {/* AI Explanation Example */}
                    <div className="mt-4 ml-16">
                      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900/50 p-5 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white">✨</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-700 dark:text-gray-200 mb-2">
                              Your CPT authorization ends on <strong>{doc.extracted.programEnd}</strong>, 
                              as listed in your I-20.
                            </p>
                            <p className="text-slate-600 dark:text-gray-400 text-sm">
                              <span className="text-slate-500 dark:text-gray-500">Source:</span>{" "}
                              <span className="text-indigo-600 dark:text-indigo-400">{doc.name}</span>
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('landing')}
            className="flex-1 rounded-xl"
          >
            Back to Home
          </Button>
          <Button 
            onClick={() => onNavigate('chat')}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white"
          >
            Continue to Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
