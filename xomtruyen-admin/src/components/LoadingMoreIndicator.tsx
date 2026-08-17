import React from 'react';

interface Props {
    isVisible: boolean;
    colSpan?: number;
}

/**
 * Hiá»ƒn thá»‹ tooltip "Loading more" á»Ÿ cuá»‘i báº£ng khi Ä‘ang fetch thÃªm dá»¯ liá»‡u.
 * Style giá»‘ng Jira â€” tooltip ná»•i giá»¯a dÃ²ng cuá»‘i.
 */
export const LoadingMoreIndicator: React.FC<Props> = ({ isVisible, colSpan = 11 }) => {
    if (!isVisible) return null;

    return (
        <tr className="loading-more-row">
            <td colSpan={colSpan} style={{ border: 0, padding: '12px 0', background: 'transparent' }}>
                <div className="loading-more-indicator">
                    <div className="loading-more-tooltip">
                        <span className="loading-spinner">&#x27F3;</span>
                        Loading more
                    </div>
                </div>
            </td>
        </tr>
    );
};
