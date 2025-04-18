import { Board } from "../api/boards";

export default function BoardThumbnail({ board }: { board: Board }) {
  return (
    <div className="relative flex-1 aspect-square rounded-sm overflow-hidden group cursor-pointer">
      {board.thumbnails?.[0] && (
        <img
          src={board.thumbnails[0]}
          alt={board.title}
          className="object-cover"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
        <h3 className="text-white text-lg font-medium">{board.title}</h3>
      </div>
    </div>
  );
}
