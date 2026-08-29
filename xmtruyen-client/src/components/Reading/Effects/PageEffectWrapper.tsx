import React, { lazy, Suspense } from 'react';

export type PageEffect = 'magazine' | 'book' | 'slider' | 'coverflow' | 'notebook' | 'cards' | 'onepage';

// Lazy load từng effect
const MagazineFlip = lazy(() => import('./MagazineFlip'));
const BookFlip = lazy(() => import('./BookFlip'));
const SliderView = lazy(() => import('./SliderView'));
const CoverflowView = lazy(() => import('./CoverflowView'));
const NotebookFlip = lazy(() => import('./NotebookFlip'));
const CardsStack = lazy(() => import('./CardsStack'));
const OnePageView = lazy(() => import('./OnePageView'));

interface Props {
    effect: PageEffect;
    pages: { content: string; type: 'text' | 'image' }[];
    currentPage: number;
    onPageChange: (page: number) => void;
    themeStyles?: any;
    fontSize?: number;
    fontFamily?: string;
    lineHeight?: number;
    imageFit?: 'width' | 'height';
}

export const PageEffectWrapper: React.FC<Props> = ({ 
    effect, pages, currentPage, onPageChange, themeStyles, fontSize, fontFamily, lineHeight, imageFit 
}) => {
    const EffectComponent = {
        magazine: MagazineFlip,
        book: BookFlip,
        slider: SliderView,
        coverflow: CoverflowView,
        notebook: NotebookFlip,
        cards: CardsStack,
        onepage: OnePageView,
    }[effect];

    if (!EffectComponent) {
        return null;
    }

    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 40 }}>Đang tải hiệu ứng...</div>}>
            <EffectComponent 
                pages={pages} 
                currentPage={currentPage} 
                onPageChange={onPageChange}
                themeStyles={themeStyles}
                fontSize={fontSize}
                fontFamily={fontFamily}
                lineHeight={lineHeight}
                imageFit={imageFit}
            />
        </Suspense>
    );
};
