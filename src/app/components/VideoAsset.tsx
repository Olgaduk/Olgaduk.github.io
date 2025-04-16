import { useRef, useState } from "react";
import { Clip } from "../api/clips";
import { getAssetDimensions } from "../utils";

export default function VideoAsset({ asset }: { asset: Clip }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { height: assetHeight, width: assetWidth } = getAssetDimensions(asset);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseOver = () => {
    setIsHovered(true);
    videoRef.current?.play();
  };

  const handleMouseOut = () => {
    setIsHovered(false);
    videoRef.current?.pause();
  };

  return (
    <div
      className={`relative p-2 overflow-hidden rounded-lg cursor-pointer ${isHovered ? "bg-black/10" : ""} transition-border-color duration-200`}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      <div className={`relative flex-1 h-[${assetHeight}px]`}>
        {asset.assets.previewVideo && (
          <video
            ref={videoRef}
            src={asset.assets.previewVideo}
            className="object-cover rounded-sm basis-[${assetWidth}px]"
            muted
            width={assetWidth}
            height={assetHeight}
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
