import ArrowDown from "./ArrowDown";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isVisible: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function CollapsibleSection({
  title,
  children,
  isVisible,
  isOpen,
  setIsOpen,
}: CollapsibleSectionProps) {
  return (
    <div className="relative flex-1 flex-col gap-4 pb-4 px-10">
      {isVisible && (
        <button
          className="flex items-center gap-1 mt-10 mb-4 rounded font-semibold transition-colors hover:no-underline border-0 bg-transparent h-6 px-2 text-12 text-grey-11 hover:bg-grey-4 active:bg-grey-4 group/list-section-header -ml-2 cursor-pointer cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="relative bg-transparent text-12 font-bold uppercase text-grey-10">
            {title}
          </h2>
          <div className="pointer-events-none ml-1 group-hover/list-section-header:opacity-100 opacity-0">
            <ArrowDown />
          </div>
        </button>
      )}
      <div
        className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
      >
        {children}
      </div>
    </div>
  );
}
