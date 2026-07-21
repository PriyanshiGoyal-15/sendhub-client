import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDashboardStore } from "../../../store/DashboardStore";

export default function MessageStatusChart() {
  const { messageStatus } = useDashboardStore();

  const data = useMemo(() => {
    if (!messageStatus) return [];
    
    return [
      { name: "Delivered", value: messageStatus.delivered || 0, color: "#22c55e" },
      { name: "Failed", value: messageStatus.failed || 0, color: "#ef4444" },
      { name: "Pending", value: messageStatus.pending || 0, color: "#9ca3af" },
      { name: "Read", value: messageStatus.read || 0, color: "#eab308" },
    ].filter(item => item.value > 0); // Hide segments with 0 value
  }, [messageStatus]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col min-w-0 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Message Status</h2>
        <p className="text-sm text-gray-500">Overall delivery breakdown</p>
      </div>

      <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              itemStyle={{ color: "#374151" }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", color: "#6b7280" }}
              verticalAlign="bottom"
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
