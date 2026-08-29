/**
 * Splits a long text (potentially containing HTML tags) into an array of pages
 * based on an approximate word count per page.
 */
export function splitTextIntoPages(htmlContent: string, wordsPerPage: number = 250): string[] {
    if (!htmlContent) return [];
    
    // Create a temporary element to safely extract text and keep html tags intact if we were to do advanced splitting.
    // For a simple implementation, we can just split by words or paragraphs.
    // If it's HTML, splitting blindly by words might break tags.
    // Let's do a safe but basic split: break by paragraphs if possible, otherwise by words.
    
    // 1. Try to split by block-level HTML tags
    const blocks = htmlContent.split(/(<\/?p>|<\/?div>|<br\s*\/?>)/i).filter(Boolean);
    
    const pages: string[] = [];
    let currentPage = '';
    let currentWordCount = 0;

    const countWords = (str: string) => {
        // Strip html tags just for counting
        const textOnly = str.replace(/<[^>]*>?/gm, '');
        return textOnly.trim().split(/\s+/).filter(Boolean).length;
    };

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const blockWordCount = countWords(block);
        
        if (currentWordCount + blockWordCount > wordsPerPage && currentPage.length > 0) {
            pages.push(currentPage);
            currentPage = block;
            currentWordCount = blockWordCount;
        } else {
            currentPage += block;
            currentWordCount += blockWordCount;
        }
    }
    
    if (currentPage.length > 0) {
        pages.push(currentPage);
    }
    
    return pages.length > 0 ? pages : [htmlContent];
}
