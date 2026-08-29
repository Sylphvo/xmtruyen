import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

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

const CoverflowView: React.FC<Props> = ({ pages, currentPage, onPageChange, themeStyles, fontSize, fontFamily, lineHeight, imageFit }) => {
    return (
        <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
            <Swiper
                modules={[EffectCoverflow, Navigation, Keyboard]}
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView="auto"
                initialSlide={currentPage}
                coverflowEffect={{
                    rotate: 40,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: true,
                }}
                navigation
                keyboard={{ enabled: true }}
                onSlideChange={(swiper) => onPageChange(swiper.activeIndex)}
                style={{ width: '100%', height: '100%', padding: '40px 0' }}
            >
                {pages.map((page, idx) => (
                    <SwiperSlide key={idx} style={{ 
                        width: '400px', 
                        height: '100%', 
                        backgroundColor: themeStyles?.panel || '#fff', 
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                        {page.type === 'image'
                            ? <img src={page.content} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            : <div className="text-content" style={{ 
                                padding: '20px', 
                                fontSize: `${(fontSize || 18) * 0.8}px`,
                                fontFamily: fontFamily || 'inherit',
                                lineHeight: lineHeight || 1.8,
                                color: themeStyles?.text || '#333',
                                textAlign: 'justify',
                                height: '100%',
                                overflowY: 'auto'
                            }} dangerouslySetInnerHTML={{ __html: page.content }} />
                        }
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CoverflowView;
