'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

interface EnhancedMarkdownProps {
  children: string;
  className?: string;
}

export default function EnhancedMarkdown({ children, className = '' }: EnhancedMarkdownProps) {
  return (
    <div className={`prose prose-lg max-w-none prose-headings:mt-6 prose-headings:mb-4 prose-p:my-4 prose-code:text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,        // GitHub Flavored Markdown (tables, strikethrough, task lists)
          remarkMath,       // Math expressions with LaTeX
          remarkBreaks,     // Line breaks in paragraphs
          remarkEmoji,      // Emoji support (:smile: → 😄)
        ]}
        rehypePlugins={[
          rehypeKatex,      // Render math expressions
          rehypeHighlight,  // Syntax highlighting for code blocks
          rehypeRaw,        // Allow raw HTML
        ]}
        components={{
          // Enhanced code blocks with language detection
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-jetbrains text-red-600 dark:text-red-400"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-6">
                {language && (
                  <div className="absolute top-0 right-0 bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs text-gray-600 dark:text-gray-300 rounded-bl-md font-mono">
                    {language}
                  </div>
                )}
                <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 overflow-x-auto border mx-0">
                  <code className={`font-jetbrains text-sm ${className || ''}`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          // Enhanced blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-6 py-3 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300 my-6 mx-0"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Enhanced paragraphs with better spacing
          p: ({ children, ...props }) => (
            <p className="my-4 leading-relaxed text-gray-800 dark:text-gray-200" {...props}>
              {children}
            </p>
          ),

          // Enhanced lists with better margins
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-outside ml-6 my-6 space-y-2" {...props}>
              {children}
            </ul>
          ),

          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-outside ml-6 my-6 space-y-2" {...props}>
              {children}
            </ol>
          ),

          // Enhanced tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                {children}
              </table>
            </div>
          ),

          th: ({ children, ...props }) => (
            <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold" {...props}>
              {children}
            </th>
          ),

          td: ({ children, ...props }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
              {children}
            </td>
          ),

          // Enhanced task lists
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 scale-110"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },

          // Enhanced headings with anchor links
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </h1>
          ),

          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </h2>
          ),

          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </h3>
          ),

          h4: ({ children, ...props }) => (
            <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </h4>
          ),

          // Enhanced links
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),

          // Enhanced horizontal rules
          hr: ({ ...props }) => (
            <hr className="my-8 border-t-2 border-gray-300 dark:border-gray-600" {...props} />
          ),

          // Disable unwrapping of pre elements
          pre: ({ children }) => <div>{children}</div>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
