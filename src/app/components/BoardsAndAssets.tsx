"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { fetchAssets, Clip } from "../api/clips";
import { Board } from "../api/boards";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import "react-virtualized/styles.css";
import LoadingIndicator from "./LoadingIndicator";
import { MeasuredCellParent } from "react-virtualized/dist/es/CellMeasurer";
import CollapsibleSection from "./CollapsibleSection";
import ImageAsset from "./ImageAsset";
import BoardThumbnail from "./BoardThumbnail";
import VideoAsset from "./VideoAsset";
import { GRID_COLUMN_COUNT, ROW_HEIGHT } from "../constants";

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

  const renderRow = useCallback(
    ({
      index,
      key,
      style,
      parent,
    }: {
      index: number;
      key: string;
      style: React.CSSProperties;
      parent: MeasuredCellParent;
    }) => {
      // First row is boards
      if (index === 0) {
        return (
          <BoardsRow
            isOpen={isBoardsOpen}
            setIsOpen={setIsBoardsOpen}
            boardsRow={boards}
            index={index}
            key={key}
            style={style}
            parent={parent}
          />
        );
      }

      return (
        <AssetsRow
          isOpen={isAssetsOpen}
          setIsOpen={setIsAssetsOpen}
          totalAssets={totalAssets}
          index={index}
          key={key}
          style={style}
          parent={parent}
          assets={assets}
        />
      );
    },
    [assets, isAssetsOpen, isBoardsOpen, loadMoreAssets],
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
    () => Math.ceil(assets.length / GRID_COLUMN_COUNT) + 1,
    [assets],
  ); // +1 for boards row

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden">
      <AutoSizer>
        {({ width, height }) => (
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
          />
        )}
      </AutoSizer>

      {isLoading && <LoadingIndicator />}
    </div>
  );
}

const BoardsRow = ({
  index,
  key,
  style,
  parent,
  boardsRow,
  isOpen,
  setIsOpen,
}: {
  index: number;
  key: string;
  style: React.CSSProperties;
  parent: MeasuredCellParent;
  boardsRow: Board[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ measure, registerChild }) => (
        <div
          style={style}
          ref={registerChild}
          onLoad={measure}
          className="px-10 pt-10"
        >
          <CollapsibleSection
            title={`Boards (${boardsRow.length})`}
            isVisible={true}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {boardsRow.map((board) => (
                <BoardThumbnail key={board.id} board={board} />
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}
    </CellMeasurer>
  );
};

const AssetsRow = ({
  index,
  key,
  style,
  parent,
  assets,
  totalAssets,
  isOpen,
  setIsOpen,
}: {
  index: number;
  key: string;
  style: React.CSSProperties;
  parent: MeasuredCellParent;
  assets: Clip[];
  totalAssets: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  // Calculate which assets to show in this row
  const startIdx = (index - 1) * GRID_COLUMN_COUNT;
  const rowAssets = assets.slice(startIdx, startIdx + GRID_COLUMN_COUNT);

  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ measure, registerChild }) => (
        <div
          style={style}
          ref={registerChild}
          onLoad={measure}
          className="px-10 py-1"
        >
          <CollapsibleSection
            title={`Assets (${totalAssets})`}
            isVisible={index === 1}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          >
            <div className="flex gap-4 justify-between">
              {rowAssets.map((asset) =>
                asset.type === "video" ? (
                  <VideoAsset key={asset.id} asset={asset} />
                ) : (
                  <ImageAsset key={asset.id} asset={asset} />
                ),
              )}
            </div>
          </CollapsibleSection>
        </div>
      )}
    </CellMeasurer>
  );
};
