export function PostAuthorHeader({
  authorName,
  handle,
  time,
  avatarColor = "bg-[#2563EB]",
  children
}: {
  authorName: string;
  handle: string;
  time?: string;
  avatarColor?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start md:items-center gap-4 md:gap-5 mb-6 md:mb-8 border-b-[4px] border-dashed border-[#0F172A]/30 pb-4 md:pb-6">
      <div 
        className={`w-10 h-10 md:w-16 md:h-16 ${avatarColor} border-[3px] md:border-[4px] border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] md:shadow-[4px_4px_0px_0px_#0F172A] flex items-center justify-center overflow-hidden shrink-0`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://api.dicebear.com/10.x/critters/svg?seed=${encodeURIComponent(authorName)}`} alt="avatar" className="w-full h-full object-cover bg-white" />
      </div>
      <div>
        <h4 className="font-heading font-black text-lg md:text-3xl leading-tight text-[#0F172A] uppercase tracking-wide">{authorName}</h4>
        <p className="text-xs md:text-base font-mono font-bold text-[#0F172A]/70 mt-0.5 md:mt-1">
          {handle}
          {time && (
            <> • <span className="bg-[#FFB800]/30 px-2 py-0.5">{time}</span></>
          )}
        </p>
      </div>
      
      {children && (
        <div className="ml-auto flex items-center gap-4 transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
}
