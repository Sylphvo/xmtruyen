import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

interface Props {
    loadedCount: number;
    totalCount: number;
    onRefresh: () => void;
    onCreateClick?: () => void;
    showCreate?: boolean;
}

/**
 * Footer hiá»ƒn thá»‹ "50 of 149" + nÃºt Refresh + nÃºt Create
 * Thay tháº¿ hoÃ n toÃ n pagination controls cÅ©.
 */
export const InfiniteScrollFooter: React.FC<Props> = ({
    loadedCount,
    totalCount,
    onRefresh,
    onCreateClick,
    showCreate = true
}) => {
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
                <button className="icon-btn" onClick={onRefresh} title="Refresh"
                    style={{ background: 'none', border: 'none', color: 'var(--jira-text-muted)', cursor: 'pointer', padding: '2px' }}>
                    <FontAwesomeIcon icon={faSyncAlt} style={{ fontSize: '12px' }} />
                </button>
            </div>
            <div />
        </div>
    );
};
