"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface AiContentProps {
  content: string;
  className?: string;
}

export function AiContent({ content, className }: AiContentProps) {
  return (
    <div
      className={cn(
        "prose prose-sm prose-invert max-w-none",
        // Headings
        "prose-headings:font-bold prose-headings:text-foreground",
        "prose-h1:text-base prose-h1:mb-3 prose-h1:mt-0",
        "prose-h2:text-sm prose-h2:mb-2 prose-h2:mt-4",
        "prose-h3:text-sm prose-h3:mb-1.5 prose-h3:mt-3",
        // Paragraphs
        "prose-p:text-sm prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-2",
        // Lists
        "prose-ul:text-sm prose-ul:text-muted-foreground prose-ul:my-2 prose-ul:pl-4",
        "prose-ol:text-sm prose-ol:text-muted-foreground prose-ol:my-2 prose-ol:pl-4",
        "prose-li:my-0.5",
        // Strong / Bold
        "prose-strong:text-foreground prose-strong:font-semibold",
        // Links
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        // Horizontal rules
        "prose-hr:border-border prose-hr:my-3",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
