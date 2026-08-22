import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5172';

export interface StaticPage {
    id?: string;
    slug: string;
    title: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    status: string;
    updatedAt?: string;
}

export interface FaqItem {
    id?: string;
    category: string;
    question: string;
    answer: string;
    orderIndex: number;
    isActive: boolean;
}

export const staticPageApi = {
    getAllPages: async () => {
        const response = await axios.get(`${API_URL}/api/admin/pages`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },
    createPage: async (data: StaticPage) => {
        const response = await axios.post(`${API_URL}/api/admin/pages`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },
    updatePage: async (id: string, data: StaticPage) => {
        const response = await axios.put(`${API_URL}/api/admin/pages/${id}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },
    deletePage: async (id: string) => {
        const response = await axios.delete(`${API_URL}/api/admin/pages/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};

export const faqApi = {
    getAllFaqs: async () => {
        const response = await axios.get(`${API_URL}/api/admin/faq`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },
    createFaq: async (data: FaqItem) => {
        const response = await axios.post(`${API_URL}/api/admin/faq`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },
    updateFaq: async (id: string, data: FaqItem) => {
        const response = await axios.put(`${API_URL}/api/admin/faq/${id}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    },
    deleteFaq: async (id: string) => {
        const response = await axios.delete(`${API_URL}/api/admin/faq/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    }
};
