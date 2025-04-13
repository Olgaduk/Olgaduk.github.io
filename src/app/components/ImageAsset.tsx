import { Clip } from "../api/clips";
import { ROW_HEIGHT } from "../constants";

export default function ImageAsset({ asset }: { asset: Clip }) {
  const width = asset.width;
  const height = asset.height;

  const aspectRatio = width / height;

  const assetHeight = ROW_HEIGHT;
  const assetWidth = assetHeight * aspectRatio;

  return (
    <div className={`relative overflow-hidden rounded-lg cursor-pointer`}>
      {asset.assets.image && (
        <img
          src={asset.assets.image}
          alt={asset.title}
          className="object-cover"
          loading="lazy"
          width={assetWidth}
          height={assetHeight}
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
        <h3 className="text-white text-lg font-medium">{asset.title}</h3>
      </div>
    </div>
  );
}
