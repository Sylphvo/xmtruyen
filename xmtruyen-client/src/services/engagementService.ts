import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5172/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Bookmarks
export const toggleBookmark = async (chapterId: string, chapterType: number) => {
  const response = await axios.post(`${API_URL}/bookmark`, { chapterId, chapterType }, getAuthHeaders());
  return response.data;
};

export const getBookmarks = async (page = 1, pageSize = 20) => {
  const response = await axios.get(`${API_URL}/bookmark?page=${page}&pageSize=${pageSize}`, getAuthHeaders());
  return response.data;
};

export const deleteBookmark = async (id: string) => {
  const response = await axios.delete(`${API_URL}/bookmark/${id}`, getAuthHeaders());
  return response.data;
};

// Favorites
export const toggleFavorite = async (publicationId: string) => {
  const response = await axios.post(`${API_URL}/favorite/toggle/${publicationId}`, {}, getAuthHeaders());
  return response.data;
};

export const getFavorites = async (page = 1, pageSize = 20) => {
  const response = await axios.get(`${API_URL}/favorite?page=${page}&pageSize=${pageSize}`, getAuthHeaders());
  return response.data;
};

export const checkFavorite = async (publicationId: string) => {
  const response = await axios.get(`${API_URL}/favorite/check/${publicationId}`, getAuthHeaders());
  return response.data;
};

// History
export const saveHistory = async (publicationId: string, lastReadChapterId: string, lastReadChapterType: number) => {
  const response = await axios.post(`${API_URL}/history`, { publicationId, lastReadChapterId, lastReadChapterType }, getAuthHeaders());
  return response.data;
};

export const getHistory = async (page = 1, pageSize = 20) => {
  const response = await axios.get(`${API_URL}/history?page=${page}&pageSize=${pageSize}`, getAuthHeaders());
  return response.data;
};

export const deleteHistory = async (publicationId: string) => {
  const response = await axios.delete(`${API_URL}/history/${publicationId}`, getAuthHeaders());
  return response.data;
};

// Reviews
export const createReview = async (publicationId: string, rating: number, content: string) => {
  const response = await axios.post(`${API_URL}/review`, { publicationId, rating, content }, getAuthHeaders());
  return response.data;
};

export const getReviews = async (publicationId: string, page = 1, pageSize = 20) => {
  const response = await axios.get(`${API_URL}/review/publication/${publicationId}?page=${page}&pageSize=${pageSize}`);
  return response.data;
};
