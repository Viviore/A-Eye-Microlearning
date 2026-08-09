import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

export function MockBrowserWindow({ 
  id, 
  children,
  className = ""
}: { 
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="relative h-full flex flex-col">
      <Card 
        id={id}
        className={`overflow-visible p-0 bg-white border-[4px] border-[#0F172A] rounded-none transition-all duration-500 shadow-[12px_12px_0px_0px_#0F172A] flex flex-col h-full ${className}`}
      >
        {/* Post Header Bar */}
        <div className="h-8 bg-[#0F172A] w-full flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-[#0F172A]"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-[#0F172A]"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-[#0F172A]"></div>
        </div>
        
        <div className="p-6 md:p-8 md:pt-10 flex flex-col flex-1">
          {children}
        </div>
      </Card>
    </div>
  );
}
