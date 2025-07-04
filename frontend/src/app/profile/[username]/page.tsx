'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Award,
  TrendingUp,
  MessageCircle,
  Trophy,
  Medal,
  User,
  Edit3
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/components/auth-provider';
import { userService, UserProfile } from '@/lib/api';

export default function ProfilePage() {
  const { username: profileUsername } = useParams();
  const { username: currentUsername, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'activity' | 'questions' | 'answers' | 'badges'>('activity');

  const isOwnProfile = isAuthenticated && currentUsername === profileUsername;

  useEffect(() => {
    if (profileUsername) {
      loadProfile();
    }
  }, [profileUsername]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userService.getUserProfile(profileUsername as string);
      setProfile(profileData);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (type: 'gold' | 'silver' | 'bronze') => {
    switch (type) {
      case 'gold': return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 'silver': return <Medal className="h-4 w-4 text-gray-500" />;
      case 'bronze': return <Award className="h-4 w-4 text-orange-600" />;
    }
  };

  const getBadgeColor = (type: 'gold' | 'silver' | 'bronze') => {
    switch (type) {
      case 'gold': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-50 text-gray-800 border-gray-200';
      case 'bronze': return 'bg-orange-50 text-orange-800 border-orange-200';
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
        <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-4xl">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Member for {formatDate(profile.joinedDate)}</span>
                </div>
                {profile.location && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
                {isOwnProfile && (
                  <Button variant="outline" size="sm" className="mb-4">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Stats and Bio */}
            <div className="flex-1">
              {/* Reputation and Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatNumber(profile.reputation)}</div>
                  <div className="text-sm text-gray-600">Reputation</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatNumber(profile.questionCount)}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(profile.answerCount)}</div>
                  <div className="text-sm text-gray-600">Answers</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{formatNumber(profile.viewsCount)}</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Badges Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.slice(0, 6).map((badge) => (
                    <Badge
                      key={badge.id}
                      className={`${getBadgeColor(badge.type)} border flex items-center gap-1`}
                    >
                      {getBadgeIcon(badge.type)}
                      {badge.name}
                    </Badge>
                  ))}
                  {profile.badges.length > 6 && (
                    <Badge variant="outline" className="text-gray-500">
                      +{profile.badges.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { key: 'activity', label: 'Activity', icon: TrendingUp },
                { key: 'questions', label: 'Questions', icon: MessageCircle },
                { key: 'answers', label: 'Answers', icon: MessageCircle },
                { key: 'badges', label: 'Badges', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              {profile.recentActivity.map((activity) => (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'question' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'answer' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'question' && <MessageCircle className="h-4 w-4" />}
                          {activity.type === 'answer' && <MessageCircle className="h-4 w-4" />}
                          {activity.type === 'badge' && <Award className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                      {activity.url && (
                        <Button variant="outline" size="sm" onClick={() => router.push(activity.url!)}>
                          View
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Badges ({profile.badges.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.badges.map((badge) => (
                  <Card key={badge.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-full ${
                          badge.type === 'gold' ? 'bg-yellow-100' :
                          badge.type === 'silver' ? 'bg-gray-100' :
                          'bg-orange-100'
                        }`}>
                          {getBadgeIcon(badge.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                            <Badge className={getBadgeColor(badge.type)}>
                              {badge.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                          <p className="text-xs text-gray-500">Earned {formatDate(badge.earnedDate)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder for Questions and Answers tabs */}
          {(activeTab === 'questions' || activeTab === 'answers') && (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {activeTab === 'questions' ? 'Questions' : 'Answers'} content will be implemented here
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Badge Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Badge Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Gold</span>
                    </div>
                    <span className="font-semibold">
                      {profile.badges.filter(b => b.type === 'gold').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Medal className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Silver</span>
                    </div>
                    <span className="font-semibold">
                      {profile.badges.filter(b => b.type === 'silver').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Bronze</span>
                    </div>
                    <span className="font-semibold">
                      {profile.badges.filter(b => b.type === 'bronze').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reputation Graph Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Reputation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatNumber(profile.reputation)}
                  </div>
                  <p className="text-sm text-gray-500">Total Reputation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
