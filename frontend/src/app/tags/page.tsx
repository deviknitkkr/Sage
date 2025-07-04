'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tagService } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Tag, Search, Hash, TrendingUp } from 'lucide-react';

interface TagInfo {
  id: number;
  name: string;
  description: string;
  questionCount: number;
}

export default function TagsPage() {
  const router = useRouter();
  const [allTags, setAllTags] = useState<TagInfo[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    filterTags();
  }, [allTags, searchQuery]);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const tagsData = await tagService.getAllTags();
      setAllTags(tagsData);
    } catch (err: any) {
      console.error('Failed to load tags:', err);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const filterTags = () => {
    let filtered = allTags;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by popular (most questions) by default
    filtered.sort((a, b) => b.questionCount - a.questionCount);

    setFilteredTags(filtered);
  };

  const getRankingIcon = (index: number) => {
    if (index === 0) return { icon: '🥇', color: 'text-yellow-600' };
    if (index === 1) return { icon: '🥈', color: 'text-gray-500' };
    if (index === 2) return { icon: '🥉', color: 'text-orange-600' };
    return { icon: `#${index + 1}`, color: 'text-gray-400' };
  };

  const handleTagClick = (tagName: string) => {
    router.push(`/questions/tagged/${tagName}`);
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Tags</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={loadTags} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags</h1>
        <p className="text-gray-600 mb-6">
          A tag is a keyword or label that categorizes your question with other, similar questions.
          Using the right tags makes it easier for others to find and answer your question.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-500">
          {filteredTags.length} {filteredTags.length === 1 ? 'tag' : 'tags'}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      {/* Tags Grid - Visually enhanced cards */}
      {filteredTags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTags.map((tag, index) => {
            const { icon, color } = getRankingIcon(index);
            return (
              <Card
                key={tag.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-400 flex flex-col"
                onClick={() => handleTagClick(tag.name)}
              >
                <CardContent className="p-4 flex flex-col flex-grow">
                  {/* Tag Name */}
                  <div className="mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent font-bold text-sm px-3 py-1"
                    >
                      {tag.name}
                    </Badge>
                  </div>

                  {/* Tag Description */}
                  {tag.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed flex-grow">
                      {tag.description}
                    </p>
                  )}

                  {/* Bottom section */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1.5 text-green-500" />
                        <span className="font-semibold">{tag.questionCount.toLocaleString()}</span>
                        <span className="ml-1">questions</span>
                    </div>
                    <div className={`flex items-center font-bold ${color}`}>
                        <span className="text-lg">{icon}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          {searchQuery ? (
            <>
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No tags found</h2>
              <p className="text-gray-600 mb-6">
                No tags match your search for "{searchQuery}". Try a different search term.
              </p>
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
                className="mr-4"
              >
                Clear Search
              </Button>
              <Button
                onClick={() => router.push('/ask')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ask a Question
              </Button>
            </>
          ) : (
            <>
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tags Found</h2>
              <p className="text-gray-600 mb-6">
                There are no tags available yet. Tags will appear here once questions are posted.
              </p>
              <Button
                onClick={() => router.push('/ask')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ask a Question
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
