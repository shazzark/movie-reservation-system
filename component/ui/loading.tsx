"use client";

import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Glows to match your login design */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
        />

        {/* Animated Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-medium text-slate-400 tracking-widest uppercase"
        >
          CineBook Loading
        </motion.p>
      </div>
    </div>
  );
}
