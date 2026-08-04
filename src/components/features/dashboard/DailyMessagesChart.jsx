import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDashboardStore } from "../../../store/DashboardStore";

export default function DailyMessagesChart() {
  const { dailyMessages } = useDashboardStore();

  const data = useMemo(() => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);

      const formattedDate = targetDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const utcDateStr = targetDate.toISOString().split("T")[0];

      const found = dailyMessages?.find(
        (item) => item._id?.date === utcDateStr,
      );

      last7Days.push({
        name: formattedDate,
        sent: found ? found.sent : 0,
        delivered: found ? found.delivered : 0,
      });
    }

    return last7Days;
  }, [dailyMessages]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 min-w-0">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Daily Messages</h2>
          <p className="text-sm text-gray-500">Last 7 days performance</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                color: "#6b7280",
                paddingTop: "20px",
              }}
            />
            <Line
              type="monotone"
              dataKey="sent"
              name="sent"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="delivered"
              name="delivered"
              stroke="#eab308"
              strokeWidth={2}
              dot={{ r: 3, fill: "#eab308", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
