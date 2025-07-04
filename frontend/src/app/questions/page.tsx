'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, MessageCircleQuestion } from 'lucide-react';
import QuestionsFeed from '@/components/questions-feed';
import PopularTags from '@/components/popular-tags';

type FilterType = 'popular' | 'new' | 'unanswered';

export default function QuestionsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('new');

  const filters = [
    { key: 'popular', label: 'Popular', icon: TrendingUp, description: 'Most viewed questions' },
    { key: 'new', label: 'New', icon: Clock, description: 'Recently asked questions' },
    { key: 'unanswered', label: 'Unanswered', icon: MessageCircleQuestion, description: 'Questions without answers' },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header - No hero section here */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Questions</h1>
            <p className="text-gray-600 mt-2">Browse questions from the community</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? 'default' : 'outline'}
                onClick={() => setActiveFilter(filter.key)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        {/* Filter Description */}
        <div className="mt-3 text-sm text-gray-500">
          {filters.find(f => f.key === activeFilter)?.description}
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Questions Section */}
        <div className="lg:col-span-3">
          <QuestionsFeed filter={activeFilter} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <PopularTags />
          </div>
        </div>
      </div>
    </div>
  );
}
