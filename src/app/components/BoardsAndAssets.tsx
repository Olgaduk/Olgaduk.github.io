"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { fetchAssets, Clip } from "../api/clips";
import { Board } from "../api/boards";
import {
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    List,
    ListRowProps,
} from "react-virtualized";
import "react-virtualized/styles.css";
import LoadingIndicator from "./LoadingIndicator";
import CollapsibleSectionButton from "./CollapsibleSection";
import ImageAsset from "./ImageAsset";
import BoardThumbnail from "./BoardThumbnail";
import VideoAsset from "./VideoAsset";
import { DEFAULT_COLUMNS_COUNT, ROW_HEIGHT } from "../constants";
import { calculateColumnsForWidth } from "../utils";

interface ClientBoardsAndAssetsProps {
    initialAssets: Clip[];
    initialAssetCursor: string | null;
    initialHasMoreAssets: boolean;
    totalAssets: number;
    boards: Board[];
}

const cache = new CellMeasurerCache({
    defaultHeight: 250,
    fixedWidth: true,
});

const rowColumnsCount: Record<number, number> = {};

export default function ClientBoardsAndAssets({
    initialAssets,
    initialAssetCursor,
    initialHasMoreAssets,
    totalAssets,
    boards,
}: ClientBoardsAndAssetsProps) {
    const [assets, setAssets] = useState<Clip[]>(initialAssets);
    const [assetCursor, setAssetCursor] = useState<string | null>(
        initialAssetCursor,
    );
    const [hasMoreAssets, setHasMoreAssets] = useState(initialHasMoreAssets);
    const [isLoading, setIsLoading] = useState(false);

    const [isAssetsOpen, setIsAssetsOpen] = useState(true);
    const [isBoardsOpen, setIsBoardsOpen] = useState(true);

    const loadMoreAssets = useCallback(async () => {
        if (!assetCursor || !hasMoreAssets || isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetchAssets({ cursor: assetCursor });
            setAssets((prev) => [...prev, ...response.data.clips]);
            setAssetCursor(response.pagination.cursor);
            setHasMoreAssets(response.pagination.hasMore);
        } catch (error) {
            console.error("Error loading more assets:", error);
        }
        setIsLoading(false);
    }, [assetCursor, hasMoreAssets, isLoading]);

    // Calculate which assets to show in this row
    const getRowAssets = useCallback(
        (index: number) => {
            const startAssetsIndex = index - 3;
            const startIdx = startAssetsIndex * DEFAULT_COLUMNS_COUNT;

            return assets.slice(startIdx, startIdx + DEFAULT_COLUMNS_COUNT);
        },
        [assets.length],
    );

    const toggleBoards = useCallback(() => {
        setIsBoardsOpen((prev) => !prev);
    }, [isBoardsOpen]);

    const toggleAssets = useCallback(() => {
        setIsAssetsOpen((prev) => !prev);
    }, [isAssetsOpen]);

    const renderRow = useCallback(
        ({
            index,
            style,
            ...restListRowProps
        }: ListRowProps) => {
            // First row is boards button
            if (index === 0) {
                return (
                    <CellMeasurer
                        cache={cache}
                        rowIndex={index}
                        {...restListRowProps}
                    >
                        {({ measure, registerChild }) => (
                            <div
                                style={style}
                                ref={registerChild}
                                onLoad={measure}
                                className="px-10 pt-10"
                            >
                                <CollapsibleSectionButton
                                    title={`Boards (${boards.length})`}
                                    onClick={toggleBoards}
                                />
                            </div>
                        )}
                    </CellMeasurer>
                );
            }


            // Second row is boards
            if (index === 1) {
                return (
                    <CellMeasurer
                        cache={cache}
                        rowIndex={index}
                        {...restListRowProps}
                    >
                        {({ measure, registerChild }) => (
                            <div
                                style={style}
                                ref={registerChild}
                                onLoad={measure}
                                className="px-10"
                            >
                                <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 transition-all duration-300 ${isBoardsOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                                    {boards.map((board) => (
                                        <BoardThumbnail key={board.id} board={board} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CellMeasurer>
                );
            }

            // Third row is assets button
            if (index === 2) {
                return (
                    <CellMeasurer
                        cache={cache}
                        rowIndex={index}
                        {...restListRowProps}
                    >
                        {({ measure, registerChild }) => (
                            <div
                                style={style}
                                ref={registerChild}
                                onLoad={measure}
                                className="px-10 pt-10"
                            >
                                <CollapsibleSectionButton
                                    title={`Assets (${totalAssets})`}
                                    onClick={toggleAssets}
                                />
                            </div>
                        )}
                    </CellMeasurer>
                );
            }

            const rowAssets = getRowAssets(index);

            return (
                <CellMeasurer
                    cache={cache}
                    rowIndex={index}
                    {...restListRowProps}
                >
                    {({ measure, registerChild }) => (
                        <div
                            style={style}
                            ref={registerChild}
                            onLoad={measure}
                            className="px-10 py-1"
                        >
                            <div className={`flex gap-4 justify-between transition-all duration-300 ${isAssetsOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                                {rowAssets.map((asset) =>
                                    asset.type === "video" ? (
                                        <VideoAsset key={asset.id} asset={asset} />
                                    ) : (
                                        <ImageAsset key={asset.id} asset={asset} />
                                    ),
                                )}
                            </div>
                        </div>
                    )
                    }
                </CellMeasurer >
            );
        },
        [assets.length, boards.length, isAssetsOpen, isBoardsOpen],
    );

    const handleScroll = useCallback(
        ({
            clientHeight,
            scrollHeight,
            scrollTop,
        }: {
            clientHeight: number;
            scrollHeight: number;
            scrollTop: number;
        }) => {
            if (
                scrollHeight - scrollTop - clientHeight < ROW_HEIGHT * 5 &&
                !isLoading
            ) {
                loadMoreAssets();
            }
        },
        [isLoading, loadMoreAssets],
    );

    const rowCount = useMemo(
        () => Math.ceil(assets.length / DEFAULT_COLUMNS_COUNT) + 3,
        [assets],
    ); // +1 for boards row, +1 for assets button, +1 for boards button

    return (
        <div className="h-screen w-full overflow-y-auto overflow-x-hidden">
            <AutoSizer>
                {({ width, height }) => {
                    return (
                        <List
                            width={width}
                            deferredMeasurementCache={cache}
                            overscanColumnCount={0}
                            overscanRowCount={20}
                            rowHeight={cache.rowHeight}
                            height={height}
                            rowCount={rowCount}
                            rowRenderer={renderRow}
                            onScroll={handleScroll}
                            key={`${isBoardsOpen}`}
                        />
                    )
                }}
            </AutoSizer>

            {isLoading && <LoadingIndicator />}
        </div>
    );
}
