import { useRef, useState } from "react";
import { Clip } from "../api/clips";
import { getAssetDimensions } from "../utils";

export default function VideoAsset({ asset }: { asset: Clip }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { width: assetWidth, height: assetHeight } = getAssetDimensions(asset);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseOver = () => {
    videoRef.current?.play();
  };

  const handleMouseOut = () => {
    videoRef.current?.pause();
  };

  return (
    <div
      className={`relative p-2 overflow-hidden rounded-lg cursor-pointer flex-shrink-0 basis-[${assetWidth}px] ${isHovered ? "bg-black/10" : ""} transition-border-color duration-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative w-[${assetWidth}px] h-[${assetHeight}px]`}>
        {asset.assets.previewVideo && (
          <video
            ref={videoRef}
            src={asset.assets.previewVideo}
            className="object-cover rounded-sm"
            width={assetWidth}
            height={assetHeight}
            muted
          />
        )}

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-linear from-black/0 from-50% to-black/60 flex items-end p-4">
            <h3 className="text-white text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap">
              {asset.assets.image}
            </h3>
          </div>
        )}

        {asset.duration && !isHovered && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-1 py-0.5 rounded text-xs text-white">
            {formatDuration(asset.duration)}
          </div>
        )}
      </div>
    </div>
  );
}
