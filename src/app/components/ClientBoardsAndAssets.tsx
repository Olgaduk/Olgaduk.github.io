'use client';

import React, { useState, useCallback } from 'react';
import { fetchAssets, Clip } from '../api/clips';
import { Board } from '../api/boards';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import 'react-virtualized/styles.css';
import LoadingIndicator from './LoadingIndicator';
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer';

interface ClientBoardsAndAssetsProps {
    initialAssets: Clip[];
    initialAssetCursor: string | null;
    initialHasMoreAssets: boolean;
    totalAssets: number;
    boards: Board[];
}

const cache = new CellMeasurerCache({
    defaultHeight: 50,
    fixedWidth: true
});

const GRID_COLUMN_COUNT = 5;
const ROW_HEIGHT = 250;

export default function ClientBoardsAndAssets({
    initialAssets,
    initialAssetCursor,
    initialHasMoreAssets,
    totalAssets,
    boards,
}: ClientBoardsAndAssetsProps) {
    const [assets, setAssets] = useState<Clip[]>(initialAssets);
    const [assetCursor, setAssetCursor] = useState<string | null>(initialAssetCursor);
    const [hasMoreAssets, setHasMoreAssets] = useState(initialHasMoreAssets);
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreAssets = useCallback(async () => {
        if (!assetCursor || !hasMoreAssets || isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetchAssets({ cursor: assetCursor });
            setAssets(prev => [...prev, ...response.data.clips]);
            setAssetCursor(response.pagination.cursor);
            setHasMoreAssets(response.pagination.hasMore);
        } catch (error) {
            console.error('Error loading more assets:', error);
        }
        setIsLoading(false);
    }, [assetCursor, hasMoreAssets, isLoading]);

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const renderRow = ({ index, key, style, parent }: { index: number; key: string; style: React.CSSProperties, parent: MeasuredCellParent }) => {
        // First row is boards
        if (index === 0) {
            return (
                <CellMeasurer
                    cache={cache}
                    columnIndex={0}
                    key={key}
                    parent={parent}
                    rowIndex={index}>
                    {({ measure, registerChild }) => (
                        <div style={style} ref={registerChild} onLoad={measure} className="px-10 pt-10">
                            <h2 className="text-sm font-medium text-gray-700 mb-4">BOARDS ({boards.length})</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {boards.map((board) => (
                                    <div key={board.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                                        {board.thumbnails?.[0] && (
                                            <img
                                                src={board.thumbnails[0]}
                                                alt={board.title}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                                            <h3 className="text-white text-lg font-medium">{board.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CellMeasurer>
            );
        }

        // Calculate which assets to show in this row
        const startIdx = (index - 1) * GRID_COLUMN_COUNT;
        const rowAssets = assets.slice(startIdx, startIdx + GRID_COLUMN_COUNT);

        if (rowAssets.length === 0) {
            if (hasMoreAssets && !isLoading) {
                loadMoreAssets();
            }
            return null;
        }

        return (
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}>
                {({ measure, registerChild }) => (
                    <div style={style} ref={registerChild} onLoad={measure} className="px-10 py-2">
                        {index === 1 && <h2 className="text-sm font-medium text-gray-700 pt-10 mb-4">ASSETS ({totalAssets})</h2>}

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {rowAssets.map((asset) => (
                                <div key={asset.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                                    {asset.type === 'video' ? (
                                        <div className="relative w-full h-full">
                                            {asset.assets.image && (
                                                <img
                                                    src={asset.assets.image}
                                                    alt={asset.title || 'Video thumbnail'}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}
                                            {asset.duration && (
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-1 py-0.5 rounded text-xs text-white">
                                                    {formatDuration(asset.duration)}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        asset.assets.image && (
                                            <img
                                                src={asset.assets.image}
                                                alt={asset.title || 'Asset'}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )
                }
            </CellMeasurer>
        );
    };

    const rowCount = Math.ceil(assets.length / GRID_COLUMN_COUNT) + 1; // +1 for boards row

    return (
        <div className="h-screen w-full overflow-y-auto overflow-x-hidden">
            <AutoSizer>
                {({ width, height }) => (
                    <List
                        width={width}
                        deferredMeasurementCache={cache}
                        rowHeight={cache.rowHeight}
                        height={height}
                        rowCount={rowCount}
                        rowRenderer={renderRow}
                        onScroll={({ clientHeight, scrollHeight, scrollTop }) => {
                            if (scrollHeight - scrollTop - clientHeight < ROW_HEIGHT * 2) {
                                loadMoreAssets();
                            }
                        }}
                    />
                )}
            </AutoSizer>

            {isLoading && <LoadingIndicator />}
        </div>
    );
} 