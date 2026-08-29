import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import BookCover from '../components/Book/BookCover';
import { getPublications } from '../services/bookService';
import type { Book } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const formatParam = searchParams.get('format') || '';
  
  const [keyword, setKeyword] = useState(queryParam);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [filterFormat, setFilterFormat] = useState(formatParam);

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  async function fetchResults() {
    setLoading(true);
    try {
      const q = searchParams.get('q') || '';
      const formatType = searchParams.get('format') ? parseInt(searchParams.get('format')!) : undefined;
      const categorySlug = searchParams.get('category') || undefined;
      
      const { books: resultBooks, totalCount: total } = await getPublications({
        keyword: q,
        formatType,
        categorySlug,
        page: 1,
        pageSize: 40
      });
      setBooks(resultBooks);
      setTotalCount(total);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (keyword.trim()) {
      newParams.set('q', keyword);
    } else {
      newParams.delete('q');
    }
    
    if (filterFormat) {
      newParams.set('format', filterFormat);
    } else {
      newParams.delete('format');
    }
    
    setSearchParams(newParams);
  };

  return (
    <div className="search-page-wrapper" style={{ minHeight: '100vh', backgroundColor: '#0f0f1a', color: '#e0e0e0', paddingTop: '20px', paddingBottom: '40px' }}>
      <Container>
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <h2 className="text-center mb-4" style={{ color: '#00d4ff', fontWeight: '700' }}>Tìm Kiếm Truyện</h2>
            <Form onSubmit={handleSearch}>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Nhập tên truyện, tác giả..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ backgroundColor: '#1a1a2e', color: 'white', border: '1px solid #333' }}
                />
                <Form.Select 
                  style={{ maxWidth: '150px', backgroundColor: '#1a1a2e', color: 'white', border: '1px solid #333' }}
                  value={filterFormat}
                  onChange={(e) => setFilterFormat(e.target.value)}
                >
                  <option value="">Tất cả định dạng</option>
                  <option value="1">Truyện chữ</option>
                  <option value="2">Truyện tranh</option>
                </Form.Select>
                <Button type="submit" variant="primary" style={{ backgroundColor: '#5955d1', border: 'none' }}>
                  <FontAwesomeIcon icon={faSearch} /> Tìm
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang tìm kiếm...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 border-bottom border-secondary pb-2">
              <h5 className="mb-0">
                Kết quả tìm kiếm cho <span style={{ color: '#00d4ff' }}>{queryParam ? `"${queryParam}"` : 'Tất cả'}</span> 
                <span className="text-muted ms-2 fs-6">({totalCount} truyện)</span>
              </h5>
            </div>
            
            {books.length > 0 ? (
              <Row className="g-4">
                {books.map((book) => (
                  <Col key={book.id} xs={6} sm={4} md={3} lg={2}>
                    <BookCover book={book} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5 text-muted">
                <h4>Không tìm thấy kết quả nào phù hợp</h4>
                <p>Hãy thử với các từ khóa khác</p>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};
