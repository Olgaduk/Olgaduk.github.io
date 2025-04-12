'use client'

import { Board } from "../api/boards"
import CollapsibleSection from "./CollapsibleSection"

export default async function BoardsList({ boards }: { boards: Board[] }) {
    return (
        <CollapsibleSection title={`Boards (${boards.length})`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <div key={board.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                        {Boolean(board.thumbnails?.length) && (
                            <img
                                src={board.thumbnails?.[0]}
                                alt={board.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                            <h3 className="text-white text-lg font-medium">{board.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </CollapsibleSection>
    )
}