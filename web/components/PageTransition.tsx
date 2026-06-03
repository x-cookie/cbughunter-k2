"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.965, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1,     filter: "blur(0px)" }}
        exit={{    opacity: 0, scale: 1.025,  filter: "blur(3px)" }}
        transition={{ duration: 0.42, ease: EASE }}
        style={{ transformOrigin: "center top" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
