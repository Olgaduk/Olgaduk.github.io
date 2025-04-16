import { useState } from "react";
import { Clip } from "../api/clips";
import { getAssetDimensions } from "../utils";

export default function ImageAsset({ asset }: { asset: Clip }) {
  const [isHovered, setIsHovered] = useState(false);

  const { width: assetWidth } = getAssetDimensions(asset);

  return (
    <div
      className={`overflow-hidden rounded-sm cursor-pointer p-2 ${isHovered ? "bg-black/10" : ""} transition-border-color duration-200 basis-[${assetWidth}px]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative w-[${assetWidth}px]`}>
        {asset.assets.image && (
          <img
            src={asset.assets.image}
            alt={asset.title}
            className="object-cover rounded-sm"
            loading="lazy"
            width={assetWidth}
          />
        )}

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-linear from-black/0 from-50% to-black/60 flex items-end p-4">
            <h3 className="text-white text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap">
              {asset.assets.image}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
