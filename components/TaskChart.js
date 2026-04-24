"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function TaskChart({ tasks }) {
  
  const data = [
    {
      name: "Todo",
      value: tasks.filter((t) => t.status === "todo").length,
    },
    {
      name: "Done",
      value: tasks.filter((t) => t.status === "done").length,
    },
    {
      name: "Progress",
      value: tasks.filter((t) => t.status === "progress").length,
    },
  ].filter((item) => item.value > 0); 

  const COLORS = ["#facc15", "#22c55e", "#3b82f6"];

  return (
    <div className="mt-8 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">📊 Task Analytics</h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No data to display</p>
      ) : (
        <PieChart width={350} height={350}>
          
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label={({ name, value }) => `${name}: ${value}`} 
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* HOVER TOOLTIP */}
          <Tooltip />

          {/*  LEGEND */}
          <Legend />
        </PieChart>
      )}
    </div>
  );
}