'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import CommentItem, { Comment } from '@/components/comment-item';
import CommentForm from '@/components/comment-form';

interface CommentsSectionProps {
  targetType: 'question' | 'answer';
  targetId: number;
  onLoadComments: (targetType: string, targetId: number) => Promise<Comment[]>;
  onCreateComment: (targetType: string, targetId: number, content: string) => Promise<Comment>;
  onUpdateComment: (commentId: number, content: string) => Promise<Comment>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

export default function CommentsSection({
  targetType,
  targetId,
  onLoadComments,
  onCreateComment,
  onUpdateComment,
  onDeleteComment
}: CommentsSectionProps) {
  const { isAuthenticated, username } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [targetId, targetType]);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const commentsData = await onLoadComments(targetType, targetId);
      setComments(commentsData);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (content: string) => {
    try {
      await onCreateComment(targetType, targetId, content);
      setShowCommentForm(false);
      await loadComments(); // Reload comments to show the new one
    } catch (error) {
      throw error; // Let CommentForm handle the error display
    }
  };

  const handleUpdateComment = async (commentId: number, content: string) => {
    try {
      await onUpdateComment(commentId, content);
      await loadComments(); // Reload comments to show the updated one
    } catch (error) {
      throw error; // Let the comment edit form handle the error display
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await onDeleteComment(commentId);
      await loadComments(); // Reload comments to remove the deleted one
    } catch (error) {
      console.error('Failed to delete comment:', error);
      // Could add a toast notification here
    }
  };

  const handleCommentUpdated = () => {
    loadComments(); // Reload comments when any comment is updated
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-500">Loading comments...</span>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
        </div>

        {/* Add Comment Button */}
        {isAuthenticated && !showCommentForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCommentForm(true)}
            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add comment
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      {showCommentForm && (
        <div className="border-l-2 border-blue-200 pl-4 bg-blue-50 p-3 rounded-r-md">
          <div className="text-sm font-medium text-blue-700 mb-2">
            Add a comment
          </div>
          <CommentForm
            onSubmit={handleCreateComment}
            onCancel={() => setShowCommentForm(false)}
            placeholder={`Comment on this ${targetType}...`}
            showCancel={true}
          />
        </div>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && comments.length === 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No comments yet.</p>
          <p>
            <span className="text-blue-600 cursor-pointer hover:underline">
              Login
            </span> to add a comment.
          </p>
        </div>
      )}

      {/* Empty State for Authenticated Users */}
      {isAuthenticated && comments.length === 0 && !showCommentForm && (
        <div className="text-center py-4 text-sm text-gray-500">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}
