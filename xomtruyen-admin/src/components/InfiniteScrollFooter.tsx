import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

interface Props {
    loadedCount: number;
    totalCount: number;
    onRefresh: () => void;
    onCreateClick?: () => void;
    showCreate?: boolean;
}

/** Footer with the loaded count, refresh control, and optional create action. */
export const InfiniteScrollFooter: React.FC<Props> = ({
    loadedCount,
    totalCount,
    onRefresh,
    onCreateClick,
    showCreate = true
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="jira-table-footer"
             style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', padding: '10px 16px', borderTop: 'none' }}>
            <div className="d-flex align-items-center">
                {showCreate && onCreateClick && (
                    <button className="btn-create" onClick={onCreateClick}
                        style={{ background: 'none', border: 'none', color: 'var(--jira-text-muted)', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faPlus} /> Create
                    </button>
                )}
            </div>
            <div className="d-flex align-items-center gap-2" style={{ color: 'var(--jira-text-muted)', fontSize: '12px' }}>
                <span className="infinite-scroll-counter">
                    {loadedCount} of {totalCount}
                </span>
                <button className="icon-btn" onClick={handleRefresh} title={isRefreshing ? 'Refreshing' : 'Refresh'} aria-label={isRefreshing ? 'Refreshing' : 'Refresh'} disabled={isRefreshing}
                    style={{ background: 'none', border: 'none', color: 'var(--jira-text-muted)', cursor: isRefreshing ? 'wait' : 'pointer', padding: '2px', opacity: isRefreshing ? 0.65 : 1 }}>
                    <FontAwesomeIcon icon={faSyncAlt} className={isRefreshing ? 'loading-spinner' : undefined} style={{ fontSize: '12px' }} />
                </button>
            </div>
            <div />
        </div>
    );
};
