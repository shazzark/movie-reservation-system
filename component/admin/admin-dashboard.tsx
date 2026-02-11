"use client";

import { useMemo } from "react";
import { Card } from "../../component/ui/card";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Film, Users, TrendingUp, ShoppingCart } from "lucide-react";
import { useMovies } from "../../lib/hooks/useMovie";

export function AdminDashboard() {
  // Fetch real movies data using React Query
  const { data: movies = [] } = useMovies();

  // Memoized values to replace Math.random()
  const totalRevenue = useMemo(() => {
    // Example: sum 1000 per movie for demonstration
    return movies.reduce((sum, movie) => sum + 1000, 0);
  }, [movies]);

  const totalBookings = useMemo(() => {
    // Example: sum 50 per movie
    return movies.reduce((sum) => sum + 50, 0);
  }, [movies]);

  const activeMovies = movies.length;
  const totalUsers = 3456; // Keep static or fetch from API

  // Revenue & bookings data
  const revenueData = useMemo(() => {
    return movies.map((movie, idx) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx % 6],
      revenue: 1000 + idx * 200,
      bookings: 50 + idx * 10,
    }));
  }, [movies]);

  // Movies popularity data
  const moviesPopularity = useMemo(() => {
    return movies.slice(0, 6).map((movie, idx) => ({
      name: movie.title,
      value: movie.rating * 10 || 10,
    }));
  }, [movies]);

  const COLORS = [
    "#f97316",
    "#06b6d4",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f59e0b",
  ];

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: ShoppingCart,
      trend: "+12.5%",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: TrendingUp,
      trend: "+8.2%",
    },
    {
      label: "Active Movies",
      value: activeMovies,
      icon: Film,
      trend: "+2",
    },
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      trend: "+15.3%",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your business overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-green-600 font-semibold">
                  {stat.trend}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">
              Revenue & Bookings
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis stroke="var(--color-muted-foreground)" dataKey="month" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-accent)"
                  name="Revenue ($)"
                />
                <Bar
                  dataKey="bookings"
                  fill="var(--color-muted)"
                  name="Bookings"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Movies Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">
              Popular Movies
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moviesPopularity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moviesPopularity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Booking Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-6 border-border">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Booking Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis stroke="var(--color-muted-foreground)" dataKey="month" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="var(--color-accent)"
                strokeWidth={2}
                name="Bookings"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-muted)"
                strokeWidth={2}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </motion.div>
  );
}
