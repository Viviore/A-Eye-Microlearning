import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export function DecoyWarning() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-3 bg-[#FFB800] border-[3px] border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] flex items-start gap-2 text-sm text-[#0F172A] font-medium"
    >
      <ShieldAlert className="w-5 h-5 text-[#0F172A] shrink-0 mt-0.5" />
      <p>
        <strong>Careful!</strong> You flagged something that looks suspicious
        but is actually natural. That&apos;s a decoy. Keep searching.
      </p>
    </motion.div>
  );
}
