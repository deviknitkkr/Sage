'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Eye, EyeOff, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';

interface QuestionEditFormProps {
  initialTitle: string;
  initialContent: string;
  initialTags: string[];
  onSave: (data: { title: string; content: string; tags: string }) => Promise<void>;
  onCancel: () => void;
}

export default function QuestionEditForm({
  initialTitle,
  initialContent,
  initialTags,
  onSave,
  onCancel
}: QuestionEditFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags.join(', '));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

  const hasChanges = () => {
    return title.trim() !== initialTitle ||
           content.trim() !== initialContent ||
           tags.trim() !== initialTags.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    if (!hasChanges()) {
      onCancel();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        tags: tags.trim()
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-blue-700">
          Edit Question
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Title Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Question Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question? Be specific and clear."
              className="font-jetbrains"
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500">
              {title.length}/150 characters
            </div>
          </div>

          {/* Content Field with Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Question Details *
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide details about your question. Include any code, error messages, or context that would help others understand your problem."
                className="min-h-[200px] font-jetbrains text-sm"
                disabled={isSubmitting}
              />
            )}
          </div>

          {/* Tags Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Tags
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="javascript, react, typescript (separate with commas)"
              className="font-jetbrains"
              disabled={isSubmitting}
            />
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {parsedTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500">
              {parsedTags.length} tags • Use commas to separate multiple tags
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 <strong>Tips for editing:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Make your title clear and specific</li>
              <li>Use code blocks with ``` for better formatting</li>
              <li>Add relevant tags to help others find your question</li>
              <li>Include any error messages or expected behavior</li>
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
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim() || !hasChanges()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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
