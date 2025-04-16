import ArrowDown from "./ArrowDown";

interface CollapsibleSectionButtonProps {
    title: string;
    onClick: () => void;
}

export default function CollapsibleSectionButton({
    title,
    onClick,
}: CollapsibleSectionButtonProps) {
    return (
        <button
            className="flex gap-4 items-center gap-1 mt-10 mb-4 rounded font-semibold transition-colors hover:no-underline border-0 bg-transparent h-6 px-2 text-12 text-grey-11 hover:bg-grey-4 active:bg-grey-4 group/list-section-header -ml-2"
            onClick={onClick}
        >
            <h2 className="bg-transparent text-12 font-bold uppercase text-grey-10">
                {title}
            </h2>
            <div className="ml-1 group-hover/list-section-header:opacity-100 opacity-0">
                <ArrowDown />
            </div>
        </button>
    );
}
