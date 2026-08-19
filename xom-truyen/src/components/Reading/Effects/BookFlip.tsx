import React, { useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import '../../../styles/BookEffect.css';

interface BookFlipProps {
    pages: { content: string; type: 'text' | 'image' }[];
    currentPage: number;
    onPageChange: (page: number) => void;
    width?: number;
    height?: number;
    themeStyles?: any;
    fontSize?: number;
    fontFamily?: string;
    lineHeight?: number;
    imageFit?: 'width' | 'height';
}

const BookFlip: React.FC<BookFlipProps> = ({
    pages, currentPage, onPageChange, width = 600, height = 800,
    themeStyles, fontSize, fontFamily, lineHeight, imageFit
}) => {
    const flipBookRef = useRef<any>(null);

    const handleFlip = useCallback((e: any) => {
        onPageChange(e.data);
    }, [onPageChange]);

    if (!pages || pages.length === 0) return null;

    const FlipBook = HTMLFlipBook as any;

    return (
        <div className="book-flip-container" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            perspective: '2500px', minHeight: '80vh', width: '100%', overflow: 'hidden'
        }}>
            <FlipBook
                ref={flipBookRef}
                width={width}
                height={height}
                size="stretch"
                minWidth={300}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1200}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={handleFlip}
                className="book-spread"
                style={{}}
                startPage={currentPage}
                drawShadow={true}
                flippingTime={900}
                usePortrait={window.innerWidth < 768}
                startZIndex={0}
                autoSize={true}
                maxShadowOpacity={0.6}
                showPageCorners={true}
                disableFlipByClick={false}
            >
                {pages.map((page, idx) => (
                    <div key={idx} className={`book-page ${idx % 2 === 0 ? 'left-page' : 'right-page'}`} data-density={idx === 0 || idx === pages.length - 1 ? 'hard' : 'soft'} style={{backgroundColor: themeStyles?.panel || '#fdfbf7'}}>
                        {page.type === 'image' ? (
                            <img src={page.content} alt={`Page ${idx + 1}`}
                                 style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: imageFit === 'height' ? 'contain' : 'cover' 
                                 }} />
                        ) : (
                            <div className="text-page-content" style={{
                                padding: '40px 50px', 
                                fontSize: `${fontSize || 16}px`, 
                                lineHeight: lineHeight || 1.8,
                                fontFamily: fontFamily || 'Literata, Georgia, serif',
                                backgroundColor: themeStyles?.panel || '#fdfbf7',
                                color: themeStyles?.text || '#333',
                                height: '100%', overflow: 'hidden'
                            }}>
                                <div dangerouslySetInnerHTML={{ __html: page.content }} />
                            </div>
                        )}
                    </div>
                ))}
            </FlipBook>
        </div>
    );
};

export default BookFlip;
