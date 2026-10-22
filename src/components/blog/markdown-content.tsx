"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  return (
    <div className={`markdown-body space-y-6 text-foreground/90 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-8 mb-4 border-b border-border/80 pb-2.5"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-7 mb-3.5 flex items-center gap-2"
              {...props}
            >
              <span className="w-1.5 h-6 rounded-full bg-primary inline-block" />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-lg sm:text-xl font-bold text-foreground mt-6 mb-2.5"
              {...props}
            >
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-4" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 pl-2 text-sm sm:text-base text-foreground/80" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 pl-2 text-sm sm:text-base text-foreground/80" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 py-2 my-4 bg-surface-secondary/50 rounded-r-xl italic text-foreground text-sm sm:text-base"
              {...props}
            >
              {children}
            </blockquote>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-foreground" {...props}>
              {children}
            </strong>
          ),
          code: ({ inline, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-surface-secondary border border-border text-primary font-mono text-xs"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-4 rounded-2xl overflow-hidden border border-border bg-surface-secondary p-4 font-mono text-xs sm:text-sm text-foreground overflow-x-auto">
                <code {...props}>{children}</code>
              </div>
            );
          },
          hr: ({ ...props }) => (
            <hr className="my-8 border-t border-border/80" {...props} />
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6 rounded-2xl border border-border">
              <table className="w-full text-left text-xs sm:text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-surface-secondary/70 border-b border-border text-foreground font-bold" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-border/60" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-surface-secondary/30 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-3 font-bold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-3 text-foreground/80" {...props}>
              {children}
            </td>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-primary hover:underline font-semibold"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
