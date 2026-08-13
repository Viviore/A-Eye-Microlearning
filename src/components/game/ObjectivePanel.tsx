import { Search } from "lucide-react";

export function ObjectivePanel({ children }: { children: React.ReactNode }) {
  return (
    <div id="tutorial-objective" className="bg-[#FFB800] bg-polka border-[4px] border-[#0F172A] p-6 shadow-[8px_8px_0px_0px_#0F172A] relative">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#0F172A] text-[#FFB800] p-1.5 shrink-0">
          <Search className="w-6 h-6" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-black font-heading tracking-widest text-[#0F172A] uppercase">
          Objective
        </h2>
      </div>
      <p className="text-base font-bold font-sans text-[#0F172A]/90 leading-relaxed">
        {children}
      </p>
    </div>
  );
}
