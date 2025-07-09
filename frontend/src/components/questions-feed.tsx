'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { questionService, Question } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, User, Eye } from 'lucide-react';
import Pagination from '@/components/pagination';
import { formatDistanceToNow } from 'date-fns';

interface QuestionsFeedProps {
  filter: 'new' | 'popular' | 'unanswered' | 'all';
}

export default function QuestionsFeed({ filter }: QuestionsFeedProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadQuestions(0, filter);
  }, [filter]);

  const loadQuestions = async (page: number = 0, currentFilter: string) => {
    try {
      setLoading(true);
      const response = await questionService.getQuestions(page, 10);
      setQuestions(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadQuestions(page, filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => loadQuestions(0, filter)} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No questions found.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {questions.map((question) => (
              <Card key={question.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link href={`/questions/${question.id}`} className="text-blue-600 hover:text-blue-800 text-lg font-semibold leading-tight block mb-3 hover:underline">
                        {question.title}
                      </Link>
                      <div className="text-gray-600 mb-4 text-sm leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <span>{children}</span>,
                            code: ({ children }) => (
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{children}</code>
                            ),
                            pre: ({ children }) => <span>{children}</span>,
                            h1: ({ children }) => <span className="font-semibold">{children}</span>,
                            h2: ({ children }) => <span className="font-semibold">{children}</span>,
                            h3: ({ children }) => <span className="font-semibold">{children}</span>,
                            h4: ({ children }) => <span className="font-semibold">{children}</span>,
                            ul: ({ children }) => <span>{children}</span>,
                            ol: ({ children }) => <span>{children}</span>,
                            blockquote: ({ children }) => <span className="italic text-gray-500">{children}</span>,
                          }}
                        >
                          {question.content.substring(0, 200)}
                        </ReactMarkdown>
                        {question.content.length > 200 && <span className="text-gray-400">...</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {question.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                              {tag}
                            </Badge>
                          ))}
                          {question.tags.length > 4 && (
                            <Badge variant="outline" className="text-xs px-3 py-1 text-gray-500">
                              +{question.tags.length - 4} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="font-medium">{question.answerCount}</span>
                            <span className="ml-1 text-xs">answers</span>
                          </div>
                          <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="font-medium">{question.viewCount}</span>
                            <span className="ml-1 text-xs">views</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span className="font-medium text-gray-700">{question.authorUsername}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDate(question.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
