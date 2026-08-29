import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

const SliderView: React.FC<Props> = ({ pages, currentPage, onPageChange, themeStyles, fontSize, fontFamily, lineHeight, imageFit }) => {
    return (
        <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
            <Swiper
                modules={[Navigation, Keyboard, Pagination]}
                navigation
                keyboard={{ enabled: true }}
                pagination={{ type: 'fraction' }}
                initialSlide={currentPage}
                onSlideChange={(swiper) => onPageChange(swiper.activeIndex)}
                style={{ width: '100%', height: '100%' }}
                speed={400}
                spaceBetween={0}
                slidesPerView={1}
            >
                {pages.map((page, idx) => (
                    <SwiperSlide key={idx} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {page.type === 'image'
                            ? <img src={page.content} style={{ width: imageFit === 'width' ? '100%' : 'auto', height: imageFit === 'height' ? '100%' : 'auto', objectFit: 'contain', maxWidth: '800px' }} />
                            : <div className="text-content" style={{ 
                                padding: '40px 80px', 
                                maxWidth: '800px',
                                fontSize: `${fontSize || 18}px`,
                                fontFamily: fontFamily || 'inherit',
                                lineHeight: lineHeight || 1.8,
                                color: themeStyles?.text || 'inherit',
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

export default SliderView;
