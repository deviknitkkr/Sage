import axios from 'axios';
import { authService } from './auth';

// Ensure API_BASE_URL is always defined
const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
  : 'http://localhost:8080';

export interface Question {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  answerCount: number;
  viewCount: number;
}

export interface Answer {
  id: number;
  content: string;
  authorUsername: string;
  authorId: number;
  questionId: number;
  createdAt: string;
  updatedAt: string;
  accepted: boolean;
  upvoteCount: number;
  downvoteCount: number;
  totalVotes: number;
  isAuthor: boolean;
}

export interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  isAuthor: boolean;
}

export interface CommentRequest {
  content: string;
}

export interface AnswerRequest {
  content: string;
}

export interface QuestionRequest {
  title: string;
  content: string;
  tags?: string;
}

export interface QuestionWithAnswers {
  question: Question;
  answers: PageResponse<Answer>;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Tag {
  id: number;
  name: string;
  description: string;
  questionCount: number;
}

class QuestionService {
  private baseURL = `${API_BASE_URL}/api/questions`;

  constructor() {
    this.getQuestions = this.getQuestions.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.searchQuestions = this.searchQuestions.bind(this);
    this.getQuestionsByTag = this.getQuestionsByTag.bind(this);
    this.getQuestionWithAnswers = this.getQuestionWithAnswers.bind(this);
  }

  private getAuthHeaders() {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getQuestions(page: number = 0, size: number = 10): Promise<PageResponse<Question>> {
    const response = await axios.get(`${this.baseURL}/public`, {
      params: { page, size }
    });
    return response.data;
  }

  async getQuestion(id: number): Promise<Question> {
    const response = await axios.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createQuestion(questionData: QuestionRequest): Promise<Question> {
    const response = await axios.post(this.baseURL, questionData, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async updateQuestion(id: number, questionData: QuestionRequest): Promise<Question> {
    const response = await axios.put(`${this.baseURL}/${id}`, questionData, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async deleteQuestion(id: number): Promise<void> {
    await axios.delete(`${this.baseURL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  async searchQuestions(query: string, page: number = 0, size: number = 10): Promise<Question[]> {
    const response = await axios.get(`${this.baseURL}/search`, {
      params: { query, page, size }
    });
    return response.data;
  }

  async getQuestionsByTag(tagName: string, page: number = 0, size: number = 10): Promise<Question[]> {
    const response = await axios.get(`${this.baseURL}/tagged/${tagName}`, {
      params: { page, size }
    });
    return response.data;
  }

  async getQuestionWithAnswers(id: number, page: number = 0, size: number = 10): Promise<QuestionWithAnswers> {
    const response = await axios.get(`${this.baseURL}/${id}/with-answers`, {
      params: { page, size },
      headers: this.getAuthHeaders()
    });
    return response.data;
  }
}

class AnswerService {
  private baseURL = `${API_BASE_URL}/api/questions`;

  constructor() {
    this.createAnswer = this.createAnswer.bind(this);
    this.getAnswers = this.getAnswers.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
    this.deleteAnswer = this.deleteAnswer.bind(this);
    this.acceptAnswer = this.acceptAnswer.bind(this);
    this.voteAnswer = this.voteAnswer.bind(this);
  }

  private getAuthHeaders() {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createAnswer(questionId: number, answerData: AnswerRequest): Promise<Answer> {
    const response = await axios.post(`${this.baseURL}/${questionId}/answers`, answerData, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async getAnswers(questionId: number, page: number = 0, size: number = 10): Promise<PageResponse<Answer>> {
    const response = await axios.get(`${this.baseURL}/${questionId}/answers`, {
      params: { page, size }
    });
    return response.data;
  }

  async updateAnswer(questionId: number, answerId: number, answerData: AnswerRequest): Promise<Answer> {
    const response = await axios.put(`${this.baseURL}/${questionId}/answers/${answerId}`, answerData, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async deleteAnswer(answerId: number): Promise<void> {
    // Find the question ID from the answer - this might need to be passed as parameter
    await axios.delete(`${this.baseURL.replace('/questions', '')}/answers/${answerId}`, {
      headers: this.getAuthHeaders()
    });
  }

  async acceptAnswer(answerId: number): Promise<Answer> {
    const response = await axios.post(`${this.baseURL.replace('/questions', '')}/answers/${answerId}/accept`, {}, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async voteAnswer(answerId: number, vote: 'up' | 'down'): Promise<Answer> {
    const response = await axios.post(`${this.baseURL.replace('/questions', '')}/answers/${answerId}/votes`, { vote }, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }
}

class CommentService {
  private baseURL = `${API_BASE_URL}/api/comments`;

  constructor() {
    this.getComments = this.getComments.bind(this);
    this.createComment = this.createComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  private getAuthHeaders() {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getComments(targetType: string, targetId: number): Promise<Comment[]> {
    const response = await axios.get(`${this.baseURL}/${targetType}/${targetId}`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async createComment(targetType: string, targetId: number, content: string): Promise<Comment> {
    const response = await axios.post(`${this.baseURL}/${targetType}/${targetId}`, { content }, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async updateComment(commentId: number, content: string): Promise<Comment> {
    const response = await axios.put(`${this.baseURL}/${commentId}`, { content }, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async deleteComment(commentId: number): Promise<void> {
    await axios.delete(`${this.baseURL}/${commentId}`, {
      headers: this.getAuthHeaders()
    });
  }
}

class TagService {
  private baseURL = `${API_BASE_URL}/api/tags`;

  constructor() {
    this.getPopularTags = this.getPopularTags.bind(this);
    this.searchTags = this.searchTags.bind(this);
    this.getAllTags = this.getAllTags.bind(this);
  }

  async getAllTags(): Promise<Tag[]> {
    const response = await axios.get(`${this.baseURL}`);
    return response.data;
  }

  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    const response = await axios.get(`${this.baseURL}/popular`, {
      params: { limit }
    });
    return response.data;
  }

  async searchTags(query: string): Promise<Tag[]> {
    const response = await axios.get(`${this.baseURL}/search`, {
      params: { query }
    });
    return response.data;
  }
}

class UserService {
  private baseURL = `${API_BASE_URL}/api/users`;

  constructor() {
    this.getUserProfile = this.getUserProfile.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
  }

  private getAuthHeaders() {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getUserProfile(username: string): Promise<UserProfile> {
    const response = await axios.get(`${this.baseURL}/${username}/profile`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async updateUserProfile(username: string, profileData: UpdateProfileRequest): Promise<void> {
    await axios.put(`${this.baseURL}/${username}/profile`, profileData, {
      headers: this.getAuthHeaders()
    });
  }
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  reputation: number;
  questionCount: number;
  answerCount: number;
  viewsCount: number;
  joinedDate: string;
  badges: UserBadge[];
  recentActivity: ActivityItem[];
}

export interface UserBadge {
  id: number;
  name: string;
  description: string;
  type: 'GOLD' | 'SILVER' | 'BRONZE';
  icon: string;
  earnedDate: string;
  reason?: string;
}

export interface ActivityItem {
  id: number;
  type: 'question' | 'answer' | 'badge';
  title: string;
  date: string;
  url?: string;
}

export interface UpdateProfileRequest {
  bio?: string;
  location?: string;
  website?: string;
}

// Add to exports
export const questionService = new QuestionService();
export const answerService = new AnswerService();
export const commentService = new CommentService();
export const tagService = new TagService();
export const userService = new UserService();
