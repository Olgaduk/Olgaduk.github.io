import { Clip } from "../api/clips";

export default function VideoAsset({ asset }: { asset: Clip }) {
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
      <div className="relative w-full h-full">
        {asset.assets.video && (
          <video
            src={asset.assets.previewVideo}
            className="w-full h-full object-cover"
            width={asset.width}
            height={asset.height}
            muted
            loop
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
