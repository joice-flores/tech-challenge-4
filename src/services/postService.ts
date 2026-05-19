import { api } from './api';

export interface Post {
  id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  author: string;
}

interface ApiListResponse {
  success: boolean;
  data: Post[];
}

interface ApiSingleResponse {
  success: boolean;
  data: Post;
}

function normalizePostList(payload: ApiListResponse | Post[]): Post[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.data;
}

function normalizeSinglePost(payload: ApiSingleResponse | Post): Post {
  if ('data' in payload) {
    return payload.data;
  }

  return payload;
}

export async function fetchPosts(): Promise<Post[]> {
  const { data } = await api.get<ApiListResponse | Post[]>('/posts');
  return normalizePostList(data);
}

export async function fetchPostById(id: string): Promise<Post> {
  const { data } = await api.get<ApiSingleResponse | Post>(`/posts/${id}`);
  return normalizeSinglePost(data);
}

export async function searchPosts(query: string): Promise<Post[]> {
  const { data } = await api.get<ApiListResponse | Post[]>('/posts/search', {
    params: { q: query },
  });
  return normalizePostList(data);
}

export async function createPost(data: CreatePostData): Promise<Post> {
  const { data: res } = await api.post<ApiSingleResponse>('/posts', data);
  return res.data;
}

export async function updatePost(id: string, data: Partial<CreatePostData>): Promise<Post> {
  const { data: res } = await api.put<ApiSingleResponse>(`/posts/${id}`, data);
  return res.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}
