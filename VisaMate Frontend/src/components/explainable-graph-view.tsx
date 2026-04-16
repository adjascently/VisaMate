import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Screen } from "../App"; // ✅ Correct import for type alignment

interface ExplainableGraphViewProps {
  onNavigate: (screen: Screen) => void;
}

export function ExplainableGraphView({ onNavigate }: ExplainableGraphViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => onNavigate("cited-answer")}
            className="mb-4 rounded-xl"
          >
            ← Back to Answer
          </Button>
          <h2 className="mb-2 text-slate-900 dark:text-gray-100 font-semibold text-xl">
            AI Reasoning Graph
          </h2>
          <p className="text-slate-600 dark:text-gray-400">
            Visual representation of how VisaMate analyzed policy documents to
            answer your question
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Graph Visualization */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="relative">
              {/* Question Node */}
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-lg max-w-md text-center">
                  Can I work remotely on CPT?
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-px h-16 bg-gradient-to-b from-blue-400 to-transparent"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Document Nodes */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    color: "emerald",
                    name: "USCIS_CPT.pdf",
                    section: "Section 3.2",
                    detail: "Employment requirements and location guidelines",
                    match: "95%",
                  },
                  {
                    color: "blue",
                    name: "SEVP_FAQ.pdf",
                    section: "Q47",
                    detail: "Remote work guidance from March 2020",
                    match: "88%",
                  },
                  {
                    color: "violet",
                    name: "NU_Policy.pdf",
                    section: "Page 12",
                    detail: "University-specific CPT requirements",
                    match: "72%",
                  },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-br from-${doc.color}-50 to-${doc.color}-100/40 border border-${doc.color}-200 rounded-xl p-4`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-8 h-8 bg-${doc.color}-500 rounded-lg flex items-center justify-center`}
                      >
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <Badge
                        className={`bg-${doc.color}-200 text-${doc.color}-800 hover:bg-${doc.color}-200`}
                      >
                        {doc.match} match
                      </Badge>
                    </div>
                    <h4 className="mb-1 text-slate-900 dark:text-gray-100">
                      {doc.name}
                    </h4>
                    <p className="text-slate-600 dark:text-gray-400">
                      {doc.section}
                    </p>
                    <p className="text-slate-500 dark:text-gray-500 mt-2">
                      {doc.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Processing Steps */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-px h-16 bg-gradient-to-b from-transparent to-indigo-400"
                    ></div>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-slate-900 dark:text-gray-100">
                    AI Synthesis & Reasoning
                  </h4>
                </div>
                <p className="text-slate-700 dark:text-gray-300">
                  Cross-referencing federal regulations (USCIS) with
                  program-specific guidance (SEVP) and institutional policies to
                  provide a comprehensive, verified answer.
                </p>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center mb-8">
                <div className="w-px h-12 bg-gradient-to-b from-purple-400 to-transparent"></div>
              </div>

              {/* Answer Node */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <h4 className="text-white">Verified Answer</h4>
                </div>
                <p>
                  Yes, remote work on CPT is permitted when the employer has a
                  U.S. physical location and the work is related to your major.
                  Always consult your DSO before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            {/* Reasoning Steps */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="mb-4 text-slate-900 dark:text-gray-100">
                Reasoning Steps
              </h4>

              {[
                ["1", "Query Analysis", "Identified keywords: CPT, remote work, location"],
                ["2", "Document Retrieval", "Found 3 relevant policy documents"],
                ["3", "Context Extraction", "Extracted 8 relevant passages"],
                ["4", "Policy Synthesis", "Combined federal & institutional rules"],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex gap-3 mb-4">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                    {num}
                  </div>
                  <div>
                    <p>{title}</p>
                    <p className="text-slate-600 dark:text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p>Answer Generation</p>
                  <p className="text-slate-600 dark:text-gray-400">
                    Verified answer with citations
                  </p>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="mb-4 text-slate-900 dark:text-gray-100">
                Key Insights
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p>Federal guidelines permit remote CPT with conditions</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <p>Employer must have a U.S. physical presence</p>
                </div>
                <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
                  <p>University requires additional verification</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="mb-4 text-slate-900 dark:text-gray-100">
                Next Steps
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl"
                  onClick={() => onNavigate("chat")}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Ask Follow-up Question
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
