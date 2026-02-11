"use client";

import React from "react";

import { useState } from "react";
import { Navigation } from "../../component/navigation";
import { Footer } from "../../component/footer";
import { Card } from "../../component/ui/card";
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import { Badge } from "../../component/ui/badge";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsLoading(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

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
              <Badge className="mb-4">Contact Us</Badge>
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Have questions? We&apos;d love to hear from you. Send us a
                message and we&apos;ll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {/* Email */}
                  <Card className="p-6 border-border">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <Mail className="h-6 w-6 text-accent mt-1" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Email
                        </h3>
                        <p className="text-muted-foreground">
                          support@cinebook.com
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          We&apos;ll respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Phone */}
                  <Card className="p-6 border-border">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <Phone className="h-6 w-6 text-accent mt-1" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Phone
                        </h3>
                        <p className="text-muted-foreground">
                          +1 (555) 123-4567
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mon - Fri, 9 AM - 6 PM EST
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Address */}
                  <Card className="p-6 border-border">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <MapPin className="h-6 w-6 text-accent mt-1" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Address
                        </h3>
                        <p className="text-muted-foreground">
                          123 Cinema District
                        </p>
                        <p className="text-muted-foreground">
                          Downtown, CA 90210
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Visit our office by appointment
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-8 border-border">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-12"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                          <CheckCircle2 className="h-16 w-16 text-green-500 relative" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We&apos;ll get back to you
                        soon.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Name
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="bg-muted border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="bg-muted border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us what you think..."
                          required
                          rows={6}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-card">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "How do I reset my password?",
                  a: 'You can reset your password by clicking "Forgot Password" on the login page. Follow the instructions sent to your email.',
                },
                {
                  q: "Can I cancel my booking?",
                  a: "Yes, you can cancel bookings up to 2 hours before the showtime. Go to your profile and select the booking you want to cancel.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, debit cards, and digital payment methods like PayPal and Apple Pay.",
                },
                {
                  q: "Is my data secure?",
                  a: "Yes, we use industry-standard encryption and security protocols to protect all your personal information.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
