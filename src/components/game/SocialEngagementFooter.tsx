import { MessageCircle, Repeat2, Heart, Eye, Share } from "lucide-react";

export function SocialEngagementFooter({ seed }: { seed: number }) {
  return (
    <div className="mt-auto pt-6 flex items-center justify-between text-[#0F172A]/50 font-bold font-mono text-sm sm:text-base border-t-[3px] border-dashed border-[#0F172A]/20">
      <div className="flex items-center gap-2 hover:text-[#2563EB] cursor-pointer transition-colors group">
        <div className="p-2 rounded-full group-hover:bg-[#2563EB]/10 transition-colors">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </div>
        <span>{124 + (seed * 17) % 500}</span>
      </div>
      <div className="flex items-center gap-2 hover:text-[#10B981] cursor-pointer transition-colors group">
        <div className="p-2 rounded-full group-hover:bg-[#10B981]/10 transition-colors">
          <Repeat2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </div>
        <span>{(2.1 + (seed * 0.3) % 15).toFixed(1)}K</span>
      </div>
      <div className="flex items-center gap-2 hover:text-[#FF3366] cursor-pointer transition-colors group">
        <div className="p-2 rounded-full group-hover:bg-[#FF3366]/10 transition-colors">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </div>
        <span>{(18.4 + (seed * 2.7) % 80).toFixed(1)}K</span>
      </div>
      <div className="flex items-center gap-2 hover:text-[#2563EB] cursor-pointer transition-colors group hidden sm:flex">
        <div className="p-2 rounded-full group-hover:bg-[#2563EB]/10 transition-colors">
          <Eye className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </div>
        <span>{(142 + (seed * 31) % 900).toFixed(1)}K</span>
      </div>
      <div className="flex items-center hover:text-[#0F172A] cursor-pointer transition-colors group">
        <div className="p-2 rounded-full group-hover:bg-[#0F172A]/10 transition-colors">
          <Share className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
