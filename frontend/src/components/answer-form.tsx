'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { answerService, AnswerRequest } from '@/lib/api';

interface AnswerFormProps {
  questionId: number;
  onAnswerSubmitted: () => void;
}

export default function AnswerForm({ questionId, onAnswerSubmitted }: AnswerFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Please provide an answer');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const answerData: AnswerRequest = {
        content: content.trim()
      };

      await answerService.createAnswer(questionId, answerData);

      // Reset form
      setContent('');
      setShowPreview(false);

      // Notify parent component
      onAnswerSubmitted();

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Your Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="answer-content" className="text-sm font-medium text-gray-700">
                Answer Content
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
                    <EyeOff className="h-4 w-4" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>
            </div>

            {showPreview ? (
              <div className="min-h-[200px] p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="prose max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({node, inline, children, ...props}) => {
                        return !inline ? (
                          <pre className="bg-gray-100 rounded-md p-4 overflow-x-auto font-jetbrains">
                            <code {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code className="bg-gray-100 px-1 rounded text-sm font-jetbrains" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {content || '*No content to preview*'}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <Textarea
                id="answer-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your answer here... You can use Markdown formatting including code blocks."
                className="min-h-[200px] font-jetbrains text-sm"
                disabled={isSubmitting}
              />
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 <strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use <code className="bg-gray-100 px-1 rounded">```</code> for code blocks</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">`backticks`</code> for inline code</li>
              <li>Support for **bold**, *italic*, and [links](url)</li>
              <li>Be clear, helpful, and provide complete solutions</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-500">
              {content.length} characters
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setContent('');
                  setShowPreview(false);
                  setError(null);
                }}
                disabled={isSubmitting || !content}
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Answer
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
