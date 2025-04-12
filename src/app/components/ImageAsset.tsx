import { Clip } from "../api/clips";

export default function ImageAsset({ asset }: { asset: Clip }) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
      {asset.assets.image && (
        <img
          src={asset.assets.image}
          alt={asset.title}
          className="w-full h-full object-cover"
          loading="lazy"
          width={asset.width}
          height={asset.height}
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
        <h3 className="text-white text-lg font-medium">{asset.title}</h3>
      </div>
    </div>
  );
}
