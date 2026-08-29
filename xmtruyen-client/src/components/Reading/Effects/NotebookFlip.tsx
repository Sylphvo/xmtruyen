import React from 'react';
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

const NotebookFlip: React.FC<Props> = ({ pages, currentPage, onPageChange, themeStyles, fontSize, fontFamily, lineHeight, imageFit }) => {
    
    // Notebook effect: pages flip from the top
    const page = pages[currentPage];
    
    if (!page) return null;

    return (
        <div style={{ 
            width: '100%', 
            minHeight: '80vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            perspective: '1500px'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    initial={{ rotateX: -90, opacity: 0, transformOrigin: 'top center' }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0, transformOrigin: 'bottom center' }}
                    transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                        backgroundColor: themeStyles?.panel || '#fff',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        borderRadius: '0 0 10px 10px',
                        overflow: 'hidden'
                    }}
                >
                    {/* Ring binder simulation at the top */}
                    <div style={{ height: '30px', background: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #333 20px, #333 30px)', opacity: 0.2 }}></div>
                    
                    <div style={{ padding: '40px' }}>
                        {page.type === 'image'
                            ? <img src={page.content} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                            : <div className="text-content" style={{ 
                                fontSize: `${fontSize || 18}px`,
                                fontFamily: fontFamily || 'inherit',
                                lineHeight: lineHeight || 1.8,
                                color: themeStyles?.text || '#333',
                                textAlign: 'justify',
                                minHeight: '50vh'
                            }} dangerouslySetInnerHTML={{ __html: page.content }} />
                        }
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default NotebookFlip;
