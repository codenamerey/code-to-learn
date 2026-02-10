"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  WandSparkles,
  Sparkles,
  Plus,
  X,
  Link as LinkIcon,
  Upload,
  File,
  Eye,
} from "lucide-react";

interface AIGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseGenerated?: () => void;
}

export function AIGeneratorModal({
  open,
  onOpenChange,
  onCourseGenerated,
}: AIGeneratorModalProps) {
  const [topic, setTopic] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [includeVisualizer, setIncludeVisualizer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  const readFileAsText = (file: globalThis.File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationStatus("Preparing...");

    try {
      const fileContents = await Promise.all(
        files.map((f) => readFileAsText(f)),
      );

      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, links, fileContents, customPrompt, includeVisualizer }),
      });

      if (!response.ok || !response.body) {
        setError("Failed to start course generation");
        setIsGenerating(false);
        return;
      }

      // Read the SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.message) {
                setGenerationStatus(data.message);
                
                // Check for errors
                if (data.message.startsWith("Error:")) {
                  setError(data.message);
                  setIsGenerating(false);
                  return;
                }
              }
              
              if (data.success) {
                // Course generation complete
                setGenerationStatus("Course generated successfully!");
                
                // Notify parent component to refresh courses
                if (onCourseGenerated) {
                  onCourseGenerated();
                }

                // Reset state after a short delay
                setTimeout(() => {
                  setTopic("");
                  setCustomPrompt("");
                  setLinks([]);
                  setFiles([]);
                  setError(null);
                  setGenerationStatus("");
                  onOpenChange(false);
                }, 1500);
                
                setIsGenerating(false);
                return;
              }
            } catch (e) {
              // Ignore JSON parse errors for partial chunks
            }
          }
        }
      }
    } catch (err) {
      setError((err as Error).message);
      setIsGenerating(false);
      setGenerationStatus("");
    }
  };

  const handleAddLink = () => {
    if (currentLink.trim() && !links.includes(currentLink.trim())) {
      setLinks([...links, currentLink.trim()]);
      setCurrentLink("");
    }
  };

  const handleRemoveLink = (linkToRemove: string) => {
    setLinks(links.filter((link) => link !== linkToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLink();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      // Reset input value to allow re-uploading the same file
      e.target.value = "";
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <WandSparkles className="text-[#0995BC]" />
            Generate Your Own Course
          </DialogTitle>
          <DialogDescription>
            Create a personalized course tailored to your learning needs. Fill
            in the details below to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Topic Input */}
          <div className="space-y-2">
            <label htmlFor="topic" className="text-sm font-medium">
              Course Title
            </label>
            <input
              id="topic"
              type="text"
              placeholder="e.g., Machine Learning, Web Development, Data Structures..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0995BC]"
            />
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <label
              htmlFor="customPrompt"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Sparkles size={16} />
              Custom Instructions (Optional)
            </label>
            <p className="text-xs text-gray-500">
              Add specific requirements, teaching style, or focus areas for your
              course
            </p>
            <textarea
              id="customPrompt"
              placeholder="e.g., Focus on practical examples, include real-world projects, emphasize best practices..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0995BC] resize-none"
            />
          </div>

          {/* Sources */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Upload size={16} />
              Upload Files (Optional)
            </label>
            <p className="text-xs text-gray-500">
              Upload PDFs, text files, or other documents for the AI to learn
              from
            </p>
            <input
              type="file"
              id="sources"
              className="hidden"
              multiple
              accept=".pdf,.txt,.doc,.docx,.md"
              onChange={handleFileChange}
            />
            <label
              htmlFor="sources"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors"
            >
              <Upload size={20} />
              <span>Click to upload or drag and drop files</span>
            </label>

            {/* Display uploaded files */}
            {files.length > 0 && (
              <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md group hover:bg-gray-100 transition-colors"
                  >
                    <File size={14} className="text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file)}
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <LinkIcon size={16} />
              Links (YouTube, Articles, Documentation, etc.)
            </label>
            <p className="text-xs text-gray-500">
              Add links to YouTube videos, articles, or documentation that you
              want the AI to learn from
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter a link (YouTube, article, etc.)..."
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0995BC]"
              />
              <button
                onClick={handleAddLink}
                disabled={!currentLink.trim()}
                className="px-3 py-2 bg-[#0995BC] text-white rounded-md hover:bg-[#0880A8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Add link"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Display added links */}
            {links.length > 0 && (
              <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md group hover:bg-gray-100 transition-colors"
                  >
                    <LinkIcon size={14} className="text-gray-500 shrink-0" />
                    <span className="text-sm flex-1 truncate" title={link}>
                      {link}
                    </span>
                    <button
                      onClick={() => handleRemoveLink(link)}
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove link"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visualizer Option */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Eye size={16} />
              Include Visualizer
            </label>
            <p className="text-xs text-gray-500">
              Add an interactive visualizer panel to the lessons for enhanced learning
            </p>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVisualizer}
                  onChange={(e) => setIncludeVisualizer(e.target.checked)}
                  className="w-4 h-4 text-[#0995BC] rounded border-gray-300 focus:ring-[#0995BC]"
                />
                <span className="text-sm">Enable visualizer for this course</span>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        {isGenerating && generationStatus && (
          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-center gap-2">
            <Sparkles className="animate-spin" size={16} />
            {generationStatus}
          </div>
        )}

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="px-4 py-2 bg-[#0995BC] text-white rounded-md hover:bg-[#0880A8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="animate-spin" size={16} />
                Generating...
              </>
            ) : (
              <>
                <WandSparkles size={16} />
                Generate Course
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
