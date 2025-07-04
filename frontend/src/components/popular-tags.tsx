'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, TrendingUp } from 'lucide-react';
import { useTags } from '@/components/tags-provider';

export default function PopularTags() {
  const { popularTags, loading, error } = useTags();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="h-5 w-5 mr-2" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="h-5 w-5 mr-2" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <TrendingUp className="h-5 w-5 mr-2" />
          Popular Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        {popularTags.length === 0 ? (
          <p className="text-sm text-gray-500">No tags available yet.</p>
        ) : (
          <div className="space-y-3">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/questions/tagged/${encodeURIComponent(tag.name)}`}
                className="block hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-3 w-3 text-gray-400" />
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                    >
                      {tag.name}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {tag.questionCount}
                  </span>
                </div>
                {tag.description && (
                  <p className="text-xs text-gray-400 mt-1 pl-5 line-clamp-2">
                    {tag.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t">
          <Link
            href="/tags"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all tags →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
