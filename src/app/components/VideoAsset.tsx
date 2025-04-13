import { useRef } from "react";
import { Clip } from "../api/clips";
import { ROW_HEIGHT } from "../constants";

export default function VideoAsset({ asset }: { asset: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const width = asset.width;
  const height = asset.height;

  const aspectRatio = width / height;

  const assetHeight = ROW_HEIGHT;
  const assetWidth = assetHeight * aspectRatio;

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
      className={`relative overflow-hidden rounded-lg cursor-pointer flex-shrink-0 basis-[${assetWidth}px]`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className={`w-[${assetWidth}px] h-[${assetHeight}px]`}>
        {asset.assets.previewVideo && (
          <video
            ref={videoRef}
            src={asset.assets.previewVideo}
            className="object-cover"
            width={assetWidth}
            height={assetHeight}
          />
        )}
        {asset.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-1 py-0.5 rounded text-xs text-white">
            {formatDuration(asset.duration)}
          </div>
        )}
      </div>
    </div>
  );
}
