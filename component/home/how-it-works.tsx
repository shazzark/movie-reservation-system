"use client";

import { Card } from "../../component/ui/card";
import { Film, Armchair, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Film,
    title: "Select Movie",
    description: "Browse through our collection of latest and upcoming movies",
  },
  {
    icon: Armchair,
    title: "Pick Seats",
    description: "Choose your favorite seats from our interactive seat map",
  },
  {
    icon: CheckCircle2,
    title: "Confirm & Book",
    description:
      "Complete your booking with secure payment and instant confirmation",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Book your tickets in just 3 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg" />
                      <Icon className="h-12 w-12 text-accent relative" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>

                  {/* Step number */}
                  <div className="text-4xl font-bold text-accent/20 mt-6">
                    {index + 1}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Arrow indicators */}
        <div className="hidden md:flex justify-between items-center mt-8 px-8">
          <div className="h-1 flex-1 bg-accent/30 mx-2" />
          <div className="h-1 flex-1 bg-accent/30 mx-2" />
        </div>
      </div>
    </section>
  );
}
