"use client";

import { Navigation } from "../navigation";
import { Footer } from "../footer";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Zap, Users, Globe, Award } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Book your tickets in seconds with our optimized platform",
  },
  {
    icon: Users,
    title: "User Friendly",
    description: "Intuitive interface designed for everyone",
  },
  {
    icon: Globe,
    title: "Worldwide",
    description: "Access thousands of theaters across the globe",
  },
  {
    icon: Award,
    title: "Trusted",
    description: "Over 1 million satisfied customers trust us",
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    initials: "SJ",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    initials: "MC",
  },
  {
    name: "Emma Williams",
    role: "Head of Operations",
    initials: "EW",
  },
  {
    name: "David Martinez",
    role: "Lead Designer",
    initials: "DM",
  },
];

export function AboutClient() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-linear-to-b from-card to-background">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4">About CineBook</Badge>
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Revolutionizing Movie Booking
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                CineBook is dedicated to making movie ticket reservations
                simple, fast, and accessible for everyone worldwide.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  At CineBook, we believe that going to the movies should be an
                  effortless and enjoyable experience from start to finish. Our
                  mission is to eliminate the hassles of ticket booking and let
                  you focus on what matters most—enjoying great cinema.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded in 2020, we have served millions of movie enthusiasts
                  across the globe, enabling them to reserve their favorite
                  seats in their favorite theaters with just a few clicks.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-accent/10 rounded-lg p-8 border border-accent/20"
              >
                <div className="space-y-6">
                  <div>
                    <p className="text-4xl font-bold   text-foreground ">1M+</p>
                    <p className="text-muted-foreground">Happy Customers</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold  text-foreground">5K+</p>
                    <p className="text-muted-foreground">Theaters Worldwide</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-foreground">50M+</p>
                    <p className="text-muted-foreground">Bookings Completed</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-card">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-4xl font-bold text-foreground text-center mb-12">
              Why Choose CineBook
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-6 border-border h-full">
                      <Icon className="h-10 w-10 text-accent mb-4" />
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-4xl font-bold text-foreground text-center mb-12">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 text-center border-border">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-accent">
                        {member.initials}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {member.role}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-card">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-4xl font-bold text-foreground text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Customer First
                </h3>
                <p className="text-muted-foreground">
                  Everything we do is designed with our customers in mind
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Innovation
                </h3>
                <p className="text-muted-foreground">
                  We continuously improve our technology and services
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Reliability
                </h3>
                <p className="text-muted-foreground">
                  Our platform is built for uptime and security
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
