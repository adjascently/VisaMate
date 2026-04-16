import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Shield,
  ChevronDown,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Screen } from "../App"; // ✅ Added import

const sources = [
  {
    id: 1,
    name: "USCIS_CPT.pdf",
    section: "Section 3.2 - Employment Requirements",
    relevance: 95,
    excerpt:
      "Curricular Practical Training (CPT) must be an integral part of an established curriculum. Employment can be on-campus or off-campus, and may include remote work if the employer maintains a physical U.S. location.",
  },
  {
    id: 2,
    name: "SEVP_FAQ.pdf",
    section: "Q47 - Remote Work on CPT",
    relevance: 88,
    excerpt:
      "As of March 2020 guidance, students may engage in remote work for CPT as long as the employer has a physical presence in the United States and the work is directly related to the student's major area of study.",
  },
  {
    id: 3,
    name: "NU_Policy.pdf",
    section: "Page 12 - CPT Guidelines",
    relevance: 72,
    excerpt:
      "Northwestern University requires all CPT applications to include employer verification of U.S. physical location, regardless of remote work arrangements.",
  },
];

// ✅ Fixed prop typing
export function CitedAnswerView({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void;
}) {
  const [expandedSources, setExpandedSources] = useState<number[]>([1]);

  const toggleSource = (id: number) => {
    setExpandedSources((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => onNavigate("chat")}
            className="mb-4 rounded-xl"
          >
            ← Back to Chat
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Answer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/50">
              {/* Trust Score */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3>Can I work remotely on CPT?</h3>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg">
                  <Shield className="w-4 h-4 mr-1" />
                  High Confidence
                </Badge>
              </div>

              {/* Answer */}
              <div className="prose prose-sm max-w-none mb-6">
                <p>
                  Based on USCIS and SEVP guidelines, remote work on CPT is
                  generally permitted under specific conditions:
                </p>

                <p>
                  <strong>1. Physical Presence Requirement:</strong> The
                  employer must have a physical location in the United States,
                  even if you work remotely.
                </p>

                <p>
                  <strong>2. Work Authorization:</strong> Your CPT authorization
                  must be valid and the remote work must be directly related to
                  your major area of study.
                </p>

                <p>
                  <strong>3. Employer Location:</strong> According to SEVP
                  guidance (March 2020), the employer's worksite location should
                  be within the U.S., but remote work is acceptable if it meets
                  academic requirements.
                </p>

                <p>
                  <strong>Important:</strong> You should always consult with
                  your Designated School Official (DSO) before starting any
                  remote CPT arrangement.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => onNavigate("graph")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explain Reasoning
                </Button>
                <Button variant="outline" className="rounded-xl">
                  Ask Follow-up
                </Button>
              </div>
            </div>

            {/* Expandable Citations */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/50">
              <h3 className="mb-4">Source Documents</h3>

              <div className="space-y-3">
                {sources.map((source) => (
                  <Collapsible
                    key={source.id}
                    open={expandedSources.includes(source.id)}
                    onOpenChange={() => toggleSource(source.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-start gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <h4>{source.name}</h4>
                            <ChevronDown
                              className={`w-5 h-5 text-slate-400 transition-transform ${
                                expandedSources.includes(source.id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                          <p className="text-slate-600">{source.section}</p>
                          <div className="mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                              {source.relevance}% relevant
                            </span>
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="mt-2 ml-14 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-700 italic mb-3">
                          "{source.excerpt}"
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Full Document
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <h4 className="mb-4">Trust Metrics</h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Source Quality</span>
                    <span>95%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[95%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Answer Confidence</span>
                    <span>88%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[88%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Citation Coverage</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 w-[92%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <h4 className="mb-4">Analysis Details</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Documents Analyzed</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Citations Found</span>
                  <span>8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Processing Time</span>
                  <span>1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Updated</span>
                  <span>Oct 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
