import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5172";

/**
 * Generic component cho tất cả trang tĩnh.
 * Fetch nội dung từ API theo slug → render HTML.
 */
interface StaticPageProps {
    slugProp?: string;
}

export default function StaticPage({ slugProp }: StaticPageProps) {
    const { slug: paramSlug } = useParams<{ slug: string }>();
    const slug = slugProp || paramSlug;
    
    const [page, setPage] = useState<{ title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/pages/${slug}`)
            .then(res => setPage(res.data))
            .catch(() => setPage(null))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div style={{ padding: 60, textAlign: 'center', flex: 1 }}>Đang tải...</div>;
    if (!page) return <div style={{ padding: 60, textAlign: 'center', flex: 1 }}>Trang không tồn tại</div>;

    return (
        <main style={{ flex: 1, backgroundColor: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', marginTop: '40px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>{page.title}</h1>
                <div 
                    className="static-page-content"
                    style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </main>
    );
}
