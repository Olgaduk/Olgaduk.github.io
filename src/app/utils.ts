import { Clip } from "./api/clips";
import { DEFAULT_COLUMNS_COUNT, ROW_HEIGHT } from "./constants";

export const getAssetDimensions = (asset: Clip) => {
  const { width, height } = asset;
  const aspectRatio = width / height;

  const newWidth = ROW_HEIGHT * aspectRatio;

  return { width: newWidth, height: ROW_HEIGHT };
};

export function calculateColumnsForWidth(
  assets: Clip[],
  startIdx: number,
  availableWidth: number,
): number {
  let currentWidth = 0;
  let columns = 0;
  let index = startIdx;

  while (currentWidth < availableWidth && index < assets.length) {
    const { width: assetWidth } = getAssetDimensions(assets[index]);
    const totalWidth = currentWidth + assetWidth;

    if (totalWidth > availableWidth) break;

    currentWidth = totalWidth;
    columns++;
    index++;
  }

  return Math.min(columns, DEFAULT_COLUMNS_COUNT);
}
