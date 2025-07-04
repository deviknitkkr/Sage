'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface EditFormProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
  title: string;
  placeholder?: string;
}

export default function EditForm({
  initialContent,
  onSave,
  onCancel,
  title,
  placeholder = "Edit your content here..."
}: EditFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    if (content.trim() === initialContent.trim()) {
      onCancel();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(content.trim());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Content
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-3 w-3" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    Preview
                  </>
                )}
              </Button>
            </div>

            {showPreview ? (
              <div className="min-h-[120px] p-3 border border-gray-200 rounded-md bg-gray-50">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        return isInline ? (
                          <code className="bg-gray-100 px-1 rounded text-xs font-jetbrains" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-gray-100 rounded-md p-3 overflow-x-auto">
                            <code className={`font-jetbrains text-sm ${className || ''}`} {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      },
                      pre: ({children}) => {
                        return <div>{children}</div>;
                      }
                    }}
                  >
                    {content || '*No content to preview*'}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="min-h-[120px] font-jetbrains text-sm"
                disabled={isSubmitting}
              />
            )}
          </div>

          <div className="text-xs text-gray-500">
            {content.length} characters • Markdown supported
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              size="sm"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim() || content.trim() === initialContent.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
