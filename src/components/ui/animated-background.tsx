/**
 * AnimatedBackground — A layered, fixed background with grid, crosshatch,
 * radial glows, floating geometric shapes, crosshair markers, and a CRT
 * scanline overlay. Renders behind all content via pointer-events-none.
 */
export function AnimatedBackground({
  theme = "light",
  className = "fixed inset-0 pointer-events-none z-0 overflow-hidden"
}: {
  theme?: "light" | "dark";
  className?: string;
}) {
  const isDark = theme === "dark";
  const lineColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.06)";
  const solidColor = isDark ? "#FAFAFA" : "#0F172A";
  const crtColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.5)";

  return (
    <div aria-hidden="true" className={className}>
      {/* Base grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(${lineColor} 1px, transparent 1px),
            linear-gradient(90deg, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Diagonal crosshatch overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, ${solidColor} 1px, transparent 1px),
            linear-gradient(-45deg, ${solidColor} 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Scanline CRT overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${crtColor} 2px, ${crtColor} 4px)`,
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
}
