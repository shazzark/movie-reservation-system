"use client";

import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-border border-t-primary"
        />

        {/* Animated Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-medium text-muted-foreground tracking-widest uppercase"
        >
          CineBook Loading
        </motion.p>
      </div>
    </div>
  );
}
