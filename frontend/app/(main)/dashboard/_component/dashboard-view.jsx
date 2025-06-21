"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart as LineChartIcon,
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  IndianRupee,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardView = ({ insights }) => {
  const [chartType, setChartType] = useState("bar");

  // Transform salary data for the chart (values in Rupees)
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min,
    max: range.max,
    median: range.median,
  }));

  // Format Rupees with Indian numbering system
  const formatRupees = (value) => {
    if (isNaN(value)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Shorten Rupees for display (in lakhs)
  const formatRupeesShort = (value) => {
    if (isNaN(value)) return "₹0";
    const inLakhs = value / 100000;
    return `₹${inLakhs.toFixed(1)}L`;
  };

  const pieData = salaryData.map((item) => ({
    name: item.name,
    value: item.median,
    formattedValue: formatRupeesShort(item.median),
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-emerald-400/90";
      case "medium":
        return "bg-amber-400/90";
      case "low":
        return "bg-rose-400/90";
      default:
        return "bg-gray-400/90";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return {
          icon: TrendingUp,
          color: "text-emerald-400",
          bg: "bg-emerald-400/10",
        };
      case "neutral":
        return {
          icon: LineChartIcon,
          color: "text-amber-400",
          bg: "bg-amber-400/10",
        };
      case "negative":
        return {
          icon: TrendingDown,
          color: "text-rose-400",
          bg: "bg-rose-400/10",
        };
      default:
        return {
          icon: LineChartIcon,
          color: "text-gray-400",
          bg: "bg-gray-400/10",
        };
    }
  };

  const {
    icon: OutlookIcon,
    color: outlookColor,
    bg: outlookBg,
  } = getMarketOutlookInfo(insights.marketOutlook);

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "PP");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  // Custom colors for charts
  const chartColors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  // Custom tooltip for Pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 backdrop-blur-md">
          <p className="font-medium text-white">{payload[0].name}</p>
          <p className="text-emerald-400">{formatRupees(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend formatter
  const renderLegend = (value, entry, index) => {
    return (
      <span className="text-gray-300 text-sm">
        {pieData[index]?.name}: {pieData[index]?.formattedValue}
      </span>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-4"
    >
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center"
      >
        <Badge
          variant="outline"
          className="bg-gray-900/50 backdrop-blur-md border-gray-700/50 text-gray-300 hover:bg-gray-800/60"
        >
          Last updated: {lastUpdatedDate}
        </Badge>
      </motion.div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="relative bg-gray-900/50 backdrop-blur-md border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-200">
                Market Outlook
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${outlookBg} backdrop-blur-sm group-hover:bg-gray-700/30 transition-all`}
              >
                <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">
                {insights.marketOutlook}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Next update {nextUpdateDistance}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="relative bg-gray-900/50 backdrop-blur-md border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-200">
                Industry Growth
              </CardTitle>
              <div className="p-2 rounded-lg bg-emerald-400/10 backdrop-blur-sm group-hover:bg-gray-700/30 transition-all">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">
                {insights.growthRate.toFixed(1)}%
              </div>
              <Progress
                value={insights.growthRate}
                className="mt-2 h-2 bg-gray-800/50 [&>div]:bg-emerald-400/90"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="relative bg-gray-900/50 backdrop-blur-md border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-200">
                Demand Level
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-400/10 backdrop-blur-sm group-hover:bg-gray-700/30 transition-all">
                <BriefcaseIcon className="h-4 w-4 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">
                {insights.demandLevel}
              </div>
              <div
                className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                  insights.demandLevel
                )}`}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Salary Ranges Chart */}
      <motion.div variants={itemVariants} whileHover="hover">
        <Card className="relative bg-gray-900/50 backdrop-blur-md border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          <CardHeader className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">
                  Salary Ranges by Role
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Displaying salary data in Indian Rupees
                </CardDescription>
              </div>
              <Tabs
                value={chartType}
                onValueChange={setChartType}
                className="w-[200px]"
              >
                <TabsList className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                  <TabsTrigger value="bar" className="flex items-center gap-1">
                    <BarChart2 className="h-3 w-3" /> Bar
                  </TabsTrigger>
                  <TabsTrigger value="pie" className="flex items-center gap-1">
                    <PieChartIcon className="h-3 w-3" /> Pie
                  </TabsTrigger>
                  <TabsTrigger value="line" className="flex items-center gap-1">
                    <LineChartIcon className="h-3 w-3" /> Line
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart
                    data={salaryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#4B5563" }}
                    />
                    <YAxis
                      tick={{ fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#4B5563" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderColor: "#4B5563",
                        borderRadius: "0.5rem",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        backdropFilter: "blur(4px)",
                      }}
                      itemStyle={{ color: "#F3F4F6" }}
                      labelStyle={{ color: "#9CA3AF", fontWeight: "bold" }}
                      formatter={(value) => [formatRupees(value), ""]}
                    />
                    <Bar dataKey="min" name="Min Salary">
                      {salaryData.map((entry, index) => (
                        <Cell
                          key={`min-${index}`}
                          fill={chartColors[0]}
                          radius={[4, 4, 0, 0]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="median" name="Median Salary">
                      {salaryData.map((entry, index) => (
                        <Cell
                          key={`median-${index}`}
                          fill={chartColors[1]}
                          radius={[4, 4, 0, 0]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="max" name="Max Salary">
                      {salaryData.map((entry, index) => (
                        <Cell
                          key={`max-${index}`}
                          fill={chartColors[2]}
                          radius={[4, 4, 0, 0]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      formatter={renderLegend}
                      wrapperStyle={{ color: "#F3F4F6" }}
                    />
                  </PieChart>
                ) : (
                  <LineChart
                    data={salaryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#4B5563" }}
                    />
                    <YAxis
                      tick={{ fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#4B5563" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderColor: "#4B5563",
                        borderRadius: "0.5rem",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        backdropFilter: "blur(4px)",
                      }}
                      itemStyle={{ color: "#F3F4F6" }}
                      labelStyle={{ color: "#9CA3AF", fontWeight: "bold" }}
                      formatter={(value) => [formatRupees(value), ""]}
                    />
                    <Line
                      type="monotone"
                      dataKey="min"
                      stroke={chartColors[0]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Min Salary"
                    />
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke={chartColors[1]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Median Salary"
                    />
                    <Line
                      type="monotone"
                      dataKey="max"
                      stroke={chartColors[2]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Max Salary"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="relative bg-gray-900/50 backdrop-blur-md border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-white">Key Industry Trends</CardTitle>
              <CardDescription className="text-gray-400">
                Current trends shaping the industry
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <ul className="space-y-3">
                {insights.keyTrends.map((trend, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-400 group-hover:bg-blue-300 transition-colors" />
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {trend}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover">
          <Card className="relative bg-gray-900/50 backdrop-blur-md border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-white">Recommended Skills</CardTitle>
              <CardDescription className="text-gray-400">
                Skills to consider developing
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2">
                {insights.recommendedSkills.map((skill) => (
                  <motion.div key={skill} whileHover={{ scale: 1.05 }}>
                    <Badge
                      variant="outline"
                      className="bg-gray-800/30 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:text-white hover:border-gray-400 transition-all"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
