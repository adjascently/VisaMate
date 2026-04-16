import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Progress } from "./ui/progress";
import {
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner"; // ✅ fixed import (no version in import path)
import { Screen } from "../App"; // ✅ consistent type import

const citations = [
  {
    id: 1,
    source: "USCIS CPT Guidelines",
    link: "https://uscis.gov/cpt",
    date: "Oct 2025",
    section: "Section 3.2 - Employment Requirements",
    excerpt:
      "Curricular Practical Training (CPT) must be an integral part of an established curriculum. Employment can be on-campus or off-campus, and may include remote work if the employer maintains a physical U.S. location.",
  },
  {
    id: 2,
    source: "DHS Study in the States",
    link: "https://studyinthestates.dhs.gov",
    date: "Sept 2025",
    section: "FAQ Q47 - Remote Work on CPT",
    excerpt:
      "As of March 2020 guidance, students may engage in remote work for CPT as long as the employer has a physical presence in the United States and the work is directly related to the student's major area of study.",
  },
  {
    id: 3,
    source: "SEVP Policy Guidance",
    link: "https://ice.gov/sevp",
    date: "Aug 2025",
    section: "Remote Work Provisions",
    excerpt:
      "The employer's worksite location should be within the U.S., but remote work is acceptable if it meets academic requirements and DSO approval is obtained.",
  },
];

const consensusData = {
  gpt4: 88,
  claude3: 92,
  agreement: 95,
};

interface ExplainabilityHubProps {
  onNavigate: (screen: Screen) => void;
  theme?: "light" | "dark";
}

export function ExplainabilityHub({
  onNavigate,
  theme = "light",
}: ExplainabilityHubProps) {
  const [showConsensus, setShowConsensus] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("✅ Link copied to clipboard");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80)
      return "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400";
    if (confidence >= 60)
      return "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400";
    return "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h2
            className="mb-3 bg-gradient-to-r from-[#6366F1] to-[#A855F7] dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent"
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              filter:
                theme === "dark"
                  ? "drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))"
                  : "none",
            }}
          >
            Explainability — How VisaMate Builds Trust
          </h2>
          <p className="text-slate-600 dark:text-gray-400">
            Transparency & verification center for AI-generated answers.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6">
              <Accordion
                type="multiple"
                defaultValue={["citations", "reasoning"]}
                className="space-y-4"
              >
                {/* 🔹 Citations Section */}
                <AccordionItem value="citations" className="border-0">
                  <AccordionTrigger className="py-4 text-slate-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                      <span>Citations & Sources</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-4 space-y-4">
                    {citations.map((citation) => (
                      <div
                        key={citation.id}
                        className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="mb-1 text-slate-900 dark:text-gray-100">
                              {citation.source}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                              {citation.section}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
                            {citation.date}
                          </Badge>
                        </div>

                        <p className="text-slate-700 dark:text-gray-300 italic mb-4">
                          "{citation.excerpt}"
                        </p>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(citation.link, "_blank", "noopener")
                            }
                            className="rounded-lg text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Full Document
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={() => copyToClipboard(citation.link)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* 🔹 Reasoning Summary */}
                <AccordionItem value="reasoning" className="border-0">
                  <AccordionTrigger className="py-4 text-slate-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <span>Reasoning Summary</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-4">
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                      <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                        VisaMate analyzed your question{" "}
                        <strong>"Can I work remotely on CPT?"</strong> by
                        identifying key concepts (CPT, remote work, employer
                        location), retrieving relevant federal and SEVP
                        policies, and cross-verifying institutional rules. The
                        AI synthesized a verified answer grounded in cited
                        evidence from these sources.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 🔹 Data Recency */}
                <AccordionItem value="recency" className="border-0">
                  <AccordionTrigger className="py-4 text-slate-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <span>Data Freshness Timeline</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-4">
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent"></div>
                      {citations.map((c) => (
                        <div key={c.id} className="relative pl-12 pb-6">
                          <div className="absolute left-3 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-slate-900 dark:text-gray-100">
                                {c.source}
                              </h4>
                              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                Updated {c.date}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                              {c.section}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* 🔹 Confidence Levels */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6">
              <h4 className="mb-4 text-slate-900 dark:text-gray-100">
                Confidence Levels
              </h4>
              <div className="space-y-4">
                {[
                  { label: "Source Quality", value: 95 },
                  { label: "Answer Confidence", value: 88 },
                  { label: "Citation Coverage", value: 92 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600 dark:text-gray-400">
                        {item.label}
                      </span>
                      <Badge className={getConfidenceColor(item.value)}>
                        {item.value}%
                      </Badge>
                    </div>
                    <Progress
                      value={item.value}
                      className="h-2 bg-slate-200 dark:bg-slate-700"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* 🔹 Multi-Model Consensus */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-900 dark:text-gray-100">
                  Multi-Model Consensus
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConsensus(!showConsensus)}
                  className="rounded-lg text-xs"
                >
                  {showConsensus ? "Hide" : "Show"}
                </Button>
              </div>

              {showConsensus && (
                <div className="space-y-4">
                  {[
                    { label: "GPT-4o", value: consensusData.gpt4 },
                    { label: "Claude 3", value: consensusData.claude3 },
                  ].map((model) => (
                    <div
                      key={model.label}
                      className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-700 dark:text-gray-300">
                          {model.label}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {model.value}%
                        </span>
                      </div>
                      <Progress
                        value={model.value}
                        className="h-2 bg-slate-200 dark:bg-slate-700"
                      />
                    </div>
                  ))}

                  <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-700 dark:text-indigo-400">
                        Agreement
                      </span>
                      <span className="text-indigo-700 dark:text-indigo-400">
                        {consensusData.agreement}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* 🔹 Confidence Legend */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 p-6">
              <h4 className="mb-4 text-slate-900 dark:text-gray-100">
                Confidence Legend
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-gray-300">
                    ≥ 80% — High Confidence
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-gray-300">
                    60–79% — Medium Confidence
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-slate-700 dark:text-gray-300">
                    &lt; 60% — Low Confidence
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
