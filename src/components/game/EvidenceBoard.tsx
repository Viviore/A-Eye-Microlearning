import { Flag } from "lucide-react";

export function EvidenceBoard({
  flaggedCount,
  requiredCount,
  children,
  toolsSlot
}: {
  flaggedCount: number;
  requiredCount: number;
  children: React.ReactNode;
  toolsSlot?: React.ReactNode;
}) {
  return (
    <div id="tutorial-evidence" className="bg-white border-[4px] border-[#0F172A] p-6 shadow-[8px_8px_0px_0px_#0F172A] flex flex-col flex-1">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-[4px] border-[#0F172A]">
        <h2 className="text-2xl font-black font-heading tracking-widest text-[#0F172A] uppercase flex items-center gap-3">
          <Flag className="w-6 h-6 text-red-500" strokeWidth={3} />
          Evidence
        </h2>
        <div className="bg-white border-[3px] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] px-3 py-1 font-black font-mono text-lg">
          {flaggedCount}/{requiredCount}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col gap-3 min-h-[200px] mb-6">
        {children}
      </div>

      {toolsSlot && (
        <div className="mt-auto pt-6 border-t-[4px] border-dashed border-[#0F172A]/20 flex flex-col gap-3">
          {toolsSlot}
        </div>
      )}
    </div>
  );
}
