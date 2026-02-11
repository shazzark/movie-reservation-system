"use client";

import { Button } from "../../component/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// export function HeroSection() {
//   return (
//     <section className="relative min-h-150 flex items-center justify-center overflow-hidden bg-linear-to-b from-card to-background py-12 md:py-20">
//       {/* Background decoration */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
//         <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
//       </div>

//       <div className="mx-auto max-w-4xl px-4 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h1 className="text-4xl md:text-6xl font-bold text-balance text-foreground mb-6">
//             Your Favorite Movies, Just a Click Away
//           </h1>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//         >
//           <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8">
//             Browse thousands of movies, select your seats, and book your perfect
//             cinema experience in seconds.
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//         >
//           <Link href="#featured">
//             <Button size="lg" className="gap-2 cursor-pointer">
//               Browse Movies
//               <ChevronRight className="h-5 w-5" />
//             </Button>
//           </Link>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

export function HeroSection() {
  return (
    // Changed: Added a dark base color so the images have something to "fade" over
    <section className="relative min-h-150 flex items-center justify-center overflow-hidden bg-background py-12 md:py-20">
      {/* 🎬 Animation Layer: Ensure z-index is correct */}
      <div className="absolute inset-0 z-0 animate-cinema-bg pointer-events-none" />

      {/* Background decoration (Your original Glows) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-50" />
      </div>

      {/* Added a subtle dark overlay to ensure text contrast */}
      <div className="absolute inset-0 z-20 bg-background/40 pointer-events-none" />

      {/* Content Layer: Highest Z-Index */}
      <div className="relative z-30 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-balance text-foreground mb-6">
            Your Favorite Movies, Just a Click Away
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8">
            Browse thousands of movies, select your seats, and book your perfect
            cinema experience in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="#featured">
            <Button size="lg" className="gap-2 cursor-pointer">
              Browse Movies
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
