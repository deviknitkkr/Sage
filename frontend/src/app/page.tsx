'use client';

import { useAuth } from '@/components/auth-provider';
import QuestionsFeed from '@/components/questions-feed';
import PopularTags from '@/components/popular-tags';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Sage</h1>
            <p className="text-gray-600 mt-2">
              Ask questions, share knowledge, and learn from the community
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Questions Section */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Questions</h2>
          </div>

          <QuestionsFeed filter="all" />
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
