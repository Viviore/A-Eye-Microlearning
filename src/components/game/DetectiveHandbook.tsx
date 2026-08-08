import { Lightbulb } from "lucide-react";

export function DetectiveHandbook({ tip }: { tip: string }) {
  return (
    <div className="p-5 md:p-6 bg-[#FEF3C7] border-[4px] border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] relative transition-all hover:-translate-y-1 hover:shadow-[6px_8px_0px_0px_#0F172A]">
      <h3 className="text-xl font-black font-heading uppercase tracking-wider flex items-center gap-2 text-[#0F172A] mb-3 border-b-[4px] border-dashed border-[#0F172A] pb-2">
        <Lightbulb className="w-6 h-6 text-[#0F172A]" strokeWidth={2.5} />
        Real-World Verification
      </h3>
      <p className="text-sm md:text-base font-sans font-bold text-[#0F172A]/80 leading-relaxed italic min-h-[4rem]">
        {tip ? `"${tip}"` : "..."}
      </p>
    </div>
  );
}
