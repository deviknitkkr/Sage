'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import EditForm from '@/components/edit-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

export interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  isAuthor: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onCommentUpdated: () => void;
  onUpdateComment: (commentId: number, content: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

export default function CommentItem({
  comment,
  onCommentUpdated,
  onUpdateComment,
  onDeleteComment
}: CommentItemProps) {
  const { username } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleEdit = async (newContent: string) => {
    try {
      await onUpdateComment(comment.id, newContent);
      setIsEditing(false);
      onCommentUpdated();
    } catch (error) {
      throw error; // Let EditForm handle the error display
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDeleteComment(comment.id);
      onCommentUpdated();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="pl-4 border-l-2 border-gray-200">
        <EditForm
          initialContent={comment.content}
          onSave={handleEdit}
          onCancel={() => setIsEditing(false)}
          title="Edit Comment"
          placeholder="Update your comment..."
        />
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 p-3 border-l-2 border-gray-200 bg-gray-50 rounded-r-md">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white text-xs">
          {comment.authorUsername.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="font-medium">{comment.authorUsername}</span>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDate(comment.createdAt)}</span>
              {comment.updatedAt !== comment.createdAt && (
                <span className="ml-1">• edited</span>
              )}
            </div>
          </div>

          {/* Actions Menu (only for comment author) */}
          {comment.isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-3 w-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-sm text-gray-800 mt-1 leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
