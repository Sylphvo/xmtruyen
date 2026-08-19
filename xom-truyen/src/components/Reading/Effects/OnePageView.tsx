import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    pages: { content: string; type: 'text' | 'image' }[];
    currentPage: number;
    onPageChange: (idx: number) => void;
    themeStyles?: any;
    fontSize?: number;
    fontFamily?: string;
    lineHeight?: number;
    imageFit?: 'width' | 'height';
}

const OnePageView: React.FC<Props> = ({ pages, currentPage, onPageChange, themeStyles, fontSize, fontFamily, lineHeight, imageFit }) => {
    
    const page = pages[currentPage];
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to top when page changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [currentPage]);

    if (!page) return null;

    return (
        <div style={{ 
            width: '100%', 
            minHeight: '80vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start',
            paddingTop: '20px'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        backgroundColor: 'transparent'
                    }}
                >
                    <div ref={containerRef} style={{ padding: '20px', minHeight: '60vh' }}>
                        {page.type === 'image'
                            ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* One Page for comic might want to show all pages, but here it's page by page */}
                                <img src={page.content} style={{ width: imageFit === 'width' ? '100%' : 'auto', height: imageFit === 'height' ? '100vh' : 'auto', objectFit: 'contain' }} />
                              </div>
                            : <div className="text-content" style={{ 
                                fontSize: `${fontSize || 18}px`,
                                fontFamily: fontFamily || 'inherit',
                                lineHeight: lineHeight || 1.8,
                                color: themeStyles?.text || '#333',
                                textAlign: 'justify'
                            }} dangerouslySetInnerHTML={{ __html: page.content }} />
                        }
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default OnePageView;
