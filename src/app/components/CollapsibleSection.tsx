'use client'

import { useState } from 'react';
import ArrowDown from './ArrowDown';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="relative flex flex-col gap-4 pb-4 px-10">
            <button className="flex flex-1 items-center gap-2 rounded font-semibold transition-colors hover:no-underline border-0 bg-transparent h-6 px-2 text-12 text-grey-11 hover:bg-grey-4 active:bg-grey-4 group/list-section-header -ml-2 cursor-pointer cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="relative bg-transparent text-12 font-bold uppercase text-grey-10">{title}</h2>
                <div className="pointer-events-none ml-1 group-hover/list-section-header:opacity-100 opacity-0">
                    <ArrowDown />
                </div>
            </button>
            <div className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {children}
            </div>
        </div>
    );
} 