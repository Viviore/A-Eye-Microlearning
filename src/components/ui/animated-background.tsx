/**
 * AnimatedBackground — A layered, fixed background with grid, crosshatch,
 * radial glows, floating geometric shapes, crosshair markers, and a CRT
 * scanline overlay. Renders behind all content via pointer-events-none.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="contents">
      {/* Base grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Diagonal crosshatch overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #0F172A 1px, transparent 1px),
            linear-gradient(-45deg, #0F172A 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Radial gradient hotspots for depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,184,0,0.06)_0%,transparent_70%)] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,184,0,0.04)_0%,transparent_70%)] translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(15,23,42,0.03)_0%,transparent_60%)] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Large slow-spinning square */}
        <div className="absolute top-[15%] right-[8%] w-64 h-64 border-[3px] border-[#0F172A]/[0.04] animate-[spin_45s_linear_infinite] hidden lg:block" />
        {/* Small fast-spinning diamond */}
        <div className="absolute bottom-[20%] left-[12%] w-32 h-32 border-[3px] border-[#FFB800]/[0.08] rotate-45 animate-[spin_25s_linear_infinite_reverse] hidden md:block" />
        {/* Medium pulsing circle */}
        <div className="absolute top-[60%] right-[15%] w-48 h-48 rounded-full border-[2px] border-[#0F172A]/[0.04] animate-[pulse_8s_ease-in-out_infinite] hidden lg:block" />
        {/* Tiny accent dots */}
        <div className="absolute top-[30%] left-[5%] w-4 h-4 bg-[#FFB800]/[0.15] animate-[pulse_4s_ease-in-out_infinite] hidden md:block" />
        <div className="absolute bottom-[35%] right-[5%] w-3 h-3 bg-[#0F172A]/[0.08] animate-[pulse_6s_ease-in-out_infinite_1s] hidden md:block" />
        {/* Large dashed circle */}
        <div className="absolute top-[10%] left-[60%] w-96 h-96 rounded-full border-[2px] border-dashed border-[#0F172A]/[0.03] animate-[spin_60s_linear_infinite] hidden xl:block" />
        {/* Cross-hair markers */}
        <div className="absolute top-[40%] left-[25%] hidden lg:block opacity-[0.06]">
          <div className="w-8 h-[2px] bg-[#0F172A] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="h-8 w-[2px] bg-[#0F172A] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="absolute bottom-[15%] right-[30%] hidden lg:block opacity-[0.06]">
          <div className="w-6 h-[2px] bg-[#FFB800] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="h-6 w-[2px] bg-[#FFB800] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Scanline CRT overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(15, 23, 42, 0.5) 2px, rgba(15, 23, 42, 0.5) 4px)",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
}
