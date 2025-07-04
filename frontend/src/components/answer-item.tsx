'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ThumbsUp,
  ThumbsDown,
  Check,
  Clock,
  Edit3,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Answer, answerService, commentService, Comment } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';
import EditForm from '@/components/edit-form';
import CommentsSection from '@/components/comments-section';
import EnhancedMarkdown from '@/components/enhanced-markdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface AnswerItemProps {
  answer: Answer;
  isQuestionAuthor: boolean;
  onAnswerUpdated: () => void;
}

export default function AnswerItem({ answer, isQuestionAuthor, onAnswerUpdated }: AnswerItemProps) {
  const { username } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    setIsVoting(true);
    try {
      await answerService.voteAnswer(answer.id, voteType);
      onAnswerUpdated();
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await answerService.acceptAnswer(answer.id);
      onAnswerUpdated();
    } catch (error) {
      console.error('Failed to accept answer:', error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this answer?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await answerService.deleteAnswer(answer.id);
      onAnswerUpdated();
    } catch (error) {
      console.error('Failed to delete answer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async (newContent: string) => {
    try {
      await answerService.updateAnswer(answer.questionId, answer.id, { content: newContent });
      setIsEditing(false);
      onAnswerUpdated();
    } catch (error) {
      throw error; // Let EditForm handle the error display
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditForm
        initialContent={answer.content}
        onSave={handleEdit}
        onCancel={handleCancelEdit}
        title="Edit Answer"
        placeholder="Update your answer..."
      />
    );
  }

  return (
    <Card className={`transition-all duration-200 ${answer.accepted ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-2 min-w-[60px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('up')}
              disabled={isVoting}
              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>

            <div className="text-lg font-bold text-gray-700">
              {answer.totalVotes}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('down')}
              disabled={isVoting}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>

            {/* Accept Button (only for question author) */}
            {isQuestionAuthor && !answer.accepted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAccept}
                disabled={isAccepting}
                className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 mt-2"
                title="Accept this answer"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}

            {answer.accepted && (
              <div className="flex items-center justify-center h-8 w-8 bg-green-100 text-green-600 rounded-full mt-2">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Answer Content */}
          <div className="flex-1">
            {/* Accepted Badge */}
            {answer.accepted && (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700 mb-4">
                ✓ Accepted Answer
              </Badge>
            )}

            {/* Answer Content with Enhanced Markdown */}
            <EnhancedMarkdown>
              {answer.content}
            </EnhancedMarkdown>

            {/* Author Info and Actions */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm">
                    {answer.authorUsername.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-gray-900">{answer.authorUsername}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Answered {formatDate(answer.createdAt)}</span>
                    {answer.updatedAt !== answer.createdAt && (
                      <span className="ml-2">• Edited {formatDate(answer.updatedAt)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Menu (only for answer author) */}
              {username && (answer.isAuthor || answer.authorUsername === username) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Comments Section */}
            <CommentsSection
              targetType="answer"
              targetId={answer.id}
              onLoadComments={commentService.getComments}
              onCreateComment={commentService.createComment}
              onUpdateComment={commentService.updateComment}
              onDeleteComment={commentService.deleteComment}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
