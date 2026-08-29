import React, { useState } from 'react';
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

const CardsStack: React.FC<Props> = ({ pages, currentPage, onPageChange, themeStyles, fontSize, fontFamily, lineHeight, imageFit }) => {
    
    // Show current page and next 2 pages stacked
    const visiblePages = pages.slice(currentPage, currentPage + 3);

    return (
        <div style={{ 
            width: '100%', 
            minHeight: '80vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative'
        }}>
            <AnimatePresence>
                {visiblePages.map((page, idx) => {
                    const isFront = idx === 0;
                    const absoluteIdx = currentPage + idx;
                    
                    return (
                        <motion.div
                            key={absoluteIdx}
                            initial={{ scale: 0.8, y: 50, opacity: 0 }}
                            animate={{ 
                                scale: 1 - idx * 0.05, 
                                y: idx * 20, 
                                zIndex: 10 - idx,
                                opacity: 1 - idx * 0.2
                            }}
                            exit={{ x: -500, opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                            drag={isFront ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x;
                                if (swipe < -100) {
                                    if (currentPage < pages.length - 1) onPageChange(currentPage + 1);
                                } else if (swipe > 100) {
                                    if (currentPage > 0) onPageChange(currentPage - 1);
                                }
                            }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                maxWidth: '600px',
                                height: '70vh',
                                backgroundColor: themeStyles?.panel || '#fff',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                cursor: isFront ? 'grab' : 'auto'
                            }}
                        >
                            <div style={{ padding: '40px', height: '100%', overflowY: 'auto' }}>
                                {page.type === 'image'
                                    ? <img src={page.content} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                    );
                })}
            </AnimatePresence>
            
            <div style={{ position: 'absolute', bottom: '20px', fontSize: '14px', color: '#888' }}>
                Vuốt sang trái để qua trang tiếp theo
            </div>
        </div>
    );
};

export default CardsStack;
