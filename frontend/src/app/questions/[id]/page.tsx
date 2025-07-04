'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { questionService, answerService, commentService, Question, Answer, PageResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown, AlertCircle, Edit3, MoreHorizontal, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import AnswerForm from '@/components/answer-form';
import AnswerItem from '@/components/answer-item';
import Pagination from '@/components/pagination';
import QuestionEditForm from '@/components/question-edit-form';
import EnhancedMarkdown from '@/components/enhanced-markdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CommentsSection from '@/components/comments-section';
import { formatDistanceToNow } from 'date-fns';
import PopularTags from '@/components/popular-tags';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, username } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<PageResponse<Answer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const loadingRef = useRef<boolean>(false);
  const currentIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;

    const questionId = id as string;

    // Skip if we've already loaded this question
    if (hasLoadedRef.current.has(questionId)) {
      return;
    }

    // Skip if currently loading the same question
    if (loadingRef.current && currentIdRef.current === questionId) {
      return;
    }

    const loadData = async () => {
      try {
        loadingRef.current = true;
        currentIdRef.current = questionId;
        setLoading(true);
        setError(null);
        setNotFound(false);

        // Load question and answers in a single API call
        const data = await questionService.getQuestionWithAnswers(Number(questionId), 0, 10);

        // Mark this question as loaded
        hasLoadedRef.current.add(questionId);

        setQuestion(data.question);
        setAnswers(data.answers);
        setCurrentPage(0);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load question');
        }
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    loadData();
  }, [id]);

  const loadQuestion = async () => {
    try {
      setError(null);
      setNotFound(false);
      const questionData = await questionService.getQuestion(Number(id));
      setQuestion(questionData);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError('Failed to load question');
      }
    }
  };

  const loadAnswers = async (page: number = 0) => {
    try {
      setAnswersLoading(true);
      const answersData = await answerService.getAnswers(Number(id), page, 10);
      setAnswers(answersData);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Failed to load answers:', err);
    } finally {
      setAnswersLoading(false);
    }
  };

  const handleAnswerSubmitted = () => {
    // Just reload answers to show the new answer - the answer count will be updated automatically
    loadAnswers(0);
  };

  const handleAnswerUpdated = () => {
    // Just reload current page of answers
    loadAnswers(currentPage);
  };

  const handlePageChange = (page: number) => {
    loadAnswers(page);
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleEditQuestion = async (data: { title: string; content: string; tags: string }) => {
    try {
      await questionService.updateQuestion(Number(id), {
        title: data.title,
        content: data.content,
        tags: data.tags
      });
      setIsEditingQuestion(false);
      loadQuestion(); // Reload to show updated content
    } catch (error) {
      throw error; // Let QuestionEditForm handle the error display
    }
  };

  const handleCancelEditQuestion = () => {
    setIsEditingQuestion(false);
  };

  const handleDeleteQuestion = async () => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await questionService.deleteQuestion(Number(id));
        router.push('/'); // Redirect to home after deletion
      } catch (error) {
        console.error('Failed to delete question:', error);
        alert('Error deleting question. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Question Not Found</h1>
          <p className="text-gray-600 mb-6">
            The question you're looking for doesn't exist or may have been removed.
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
              Go Home
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Question</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={loadQuestion} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
            <Button onClick={() => router.push('/')} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Question Content */}
        <div className="lg:col-span-3">
          {/* Question Card or Edit Form */}
          {isEditingQuestion ? (
            <div className="mb-8">
              <QuestionEditForm
                initialTitle={question.title}
                initialContent={question.content}
                initialTags={question.tags}
                onSave={handleEditQuestion}
                onCancel={handleCancelEditQuestion}
              />
            </div>
          ) : (
            <Card className="mb-8">
              <CardHeader className="px-8 pt-6 pb-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {question.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pt-1 pb-6">
                <div className="flex gap-4">
                  {/* Vote Section */}
                  {isAuthenticated && (
                    <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>

                      <div className="text-lg font-bold text-gray-700">
                        0
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Question Content */}
                  <div className="flex-1">
                    {/* Question Content with Enhanced Markdown Support */}
                    <div className="mb-6">
                      <EnhancedMarkdown>
                        {question.content}
                      </EnhancedMarkdown>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Author Info and Actions */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                            {question.authorUsername.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{question.authorUsername}</p>
                          <p className="text-sm text-gray-500">
                            Asked {formatDate(question.createdAt)}
                            {question.updatedAt !== question.createdAt && (
                              <span className="ml-2">• Edited {formatDate(question.updatedAt)}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* View Count Display */}
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="font-medium">{question.viewCount}</span>
                          <span className="ml-1">views</span>
                        </div>

                        {/* Actions Menu (only for question author) */}
                        {isAuthenticated && question.authorUsername === username && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setIsEditingQuestion(true)}>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={handleDeleteQuestion}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    {/* Comments Section */}
                    <CommentsSection
                      targetType="question"
                      targetId={question.id}
                      onLoadComments={commentService.getComments}
                      onCreateComment={commentService.createComment}
                      onUpdateComment={commentService.updateComment}
                      onDeleteComment={commentService.deleteComment}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Answers Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                {question.answerCount} {question.answerCount === 1 ? 'Answer' : 'Answers'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {answersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : answers && answers.content.length > 0 ? (
                <div className="space-y-6">
                  {answers.content.map((answer) => (
                    <AnswerItem
                      key={answer.id}
                      answer={answer}
                      isQuestionAuthor={question.authorUsername === username}
                      onAnswerUpdated={handleAnswerUpdated}
                    />
                  ))}

                  {/* Pagination */}
                  {answers.totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={answers.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No answers yet.</p>
                  {isAuthenticated ? (
                    <p className="text-sm text-gray-400">Be the first to answer this question!</p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push('/login')}>
                        Login
                      </span> to answer this question.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Write Answer Section */}
          {isAuthenticated ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <AnswerForm
                  questionId={Number(id)}
                  onAnswerSubmitted={handleAnswerSubmitted}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 border-dashed">
              <CardContent className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  You need to be logged in to answer this question.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Login to Answer
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <PopularTags />
          </div>
        </div>
      </div>
    </div>
  );
}
