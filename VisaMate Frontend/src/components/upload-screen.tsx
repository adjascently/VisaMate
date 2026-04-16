import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";
import { Screen } from "../App"; // ✅ Added import for Screen type

const promptSuggestions = [
  "What's my CPT end date?",
  "Is my employer name listed?",
  "Does this form have all required signatures?",
];

interface ParsedFields {
  SEVIS_ID?: string;
  Program_Start_Date?: string;
  Program_End_Date?: string;
  Employer_Name?: string;
}

interface UploadedDoc {
  id: number;
  name: string;
  size: string;
  status: "uploading" | "complete" | "error";
  progress: number;
  extracted?: {
    sevisId: string;
    programStart: string;
    programEnd: string;
    employer: string;
  };
}

// ✅ Fixed prop typing to match App.tsx
export function UploadScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [uploading, setUploading] = useState(false);

  // ==============================
  // 📤 File Upload Handler
  // ==============================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const newDoc: UploadedDoc = {
      id: documents.length + 1,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      status: "uploading",
      progress: 30,
    };
    setDocuments((prev) => [...prev, newDoc]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data: ParsedFields = res.data.parsed_fields || {};

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === newDoc.id
            ? {
                ...doc,
                status: "complete",
                progress: 100,
                extracted: {
                  sevisId: data.SEVIS_ID || "—",
                  programStart: data.Program_Start_Date || "—",
                  programEnd: data.Program_End_Date || "—",
                  employer: data.Employer_Name || "—",
                },
              }
            : doc
        )
      );
    } catch (err) {
      console.error("Upload failed:", err);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === newDoc.id ? { ...doc, status: "error", progress: 0 } : doc
        )
      );
      alert("❌ Upload failed. Please check backend logs.");
    } finally {
      setUploading(false);
    }
  };

  // ==============================
  // 🗑️ Delete Document
  // ==============================
  const handleDelete = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  // ==============================
  // 📄 Render
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-[#0B1020] dark:to-[#0F172A] p-6 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2 text-slate-900 dark:text-gray-100 font-semibold text-lg">
            📄 Document Assistant
          </h2>
          <p className="text-slate-600 dark:text-gray-400">
            Upload your I-20, EAD, or offer letter — and let VisaMate
            automatically extract key visa details.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => document.getElementById("fileUpload")?.click()}
          className="bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors p-12 mb-8 text-center cursor-pointer group"
        >
          <input
            id="fileUpload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="mb-2 text-slate-900 dark:text-gray-100 font-medium">
            Drop your I-20, EAD, or Offer Letter here
          </h3>
          <p className="text-slate-600 dark:text-gray-400 mb-1">
            (PDF, JPEG, PNG)
          </p>
          <p className="text-slate-500 dark:text-gray-500">or click to browse</p>
        </div>

        {/* Uploaded Documents */}
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="bg-white dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg rounded-2xl mb-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="truncate text-slate-900 dark:text-gray-100 font-medium">
                      {doc.name}
                    </h4>
                    <p className="text-slate-500 dark:text-gray-500 text-sm">
                      {doc.size}
                    </p>
                  </div>

                  {doc.status === "complete" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  {doc.status === "error" && (
                    <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </div>

                {doc.status === "uploading" && (
                  <Progress value={doc.progress} className="w-full" />
                )}

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
                <h4 className="mb-4 text-slate-900 dark:text-gray-100 font-semibold">
                  Extracted Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 dark:text-gray-500 mb-1">
                      SEVIS ID:
                    </p>
                    <p className="text-slate-900 dark:text-gray-100">
                      {doc.extracted.sevisId}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-gray-500 mb-1">
                      Program Start:
                    </p>
                    <p className="text-slate-900 dark:text-gray-100">
                      {doc.extracted.programStart}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-gray-500 mb-1">
                      Program End:
                    </p>
                    <p className="text-slate-900 dark:text-gray-100">
                      {doc.extracted.programEnd}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-gray-500 mb-1">
                      Employer:
                    </p>
                    <p className="text-slate-900 dark:text-gray-100">
                      {doc.extracted.employer}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl">
                Download PDF Summary
              </Button>
              <Button
                onClick={() => handleDelete(doc.id)}
                variant="outline"
                className="rounded-xl text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {/* Footer Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => onNavigate("landing")}
            className="flex-1 rounded-xl"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => onNavigate("chat")}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white"
          >
            Continue to Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
