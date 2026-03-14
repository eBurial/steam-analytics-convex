"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface GameChartProps {
  appId: number;
  gameName: string;
  compact?: boolean;
}

export default function GameChart({ appId, gameName, compact = false }: GameChartProps) {
  const history = useQuery(api.steam.getGameHistory, { appId, hours: 24 });

  if (!history || history.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No historical data available yet</p>
      </div>
    );
  }

  const chartData = history.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    players: point.playerCount,
    timestamp: point.timestamp,
  }));

  const maxPlayers = Math.max(...chartData.map((d) => d.players));
  const minPlayers = Math.min(...chartData.map((d) => d.players));
  const avgPlayers = Math.round(
    chartData.reduce((sum, d) => sum + d.players, 0) / chartData.length
  );

  if (compact) {
    return (
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`playerGradient-${appId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            tick={{ fill: "#6b7280", fontSize: 9 }}
            tickLine={{ stroke: "#ffffff08" }}
            interval="preserveEnd"
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: "#6b7280", fontSize: 9 }}
            tickLine={{ stroke: "#ffffff08" }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #ffffff20",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "11px",
            }}
            formatter={(value: number) => [value.toLocaleString(), "Players"]}
            labelStyle={{ color: "#9ca3af", fontSize: "10px" }}
          />
          <Area
            type="monotone"
            dataKey="players"
            stroke="#ffffff"
            strokeWidth={1.5}
            fill={`url(#playerGradient-${appId})`}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Player Count History
          </h3>
          <p className="text-sm text-gray-500">Last 24 hours</p>
        </div>
        <div className="text-sm text-gray-500">
          {chartData.length} data points
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="playerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            tickLine={{ stroke: "#ffffff08" }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            tickLine={{ stroke: "#ffffff08" }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #ffffff20",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [value.toLocaleString(), "Players"]}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Area
            type="monotone"
            dataKey="players"
            stroke="#ffffff"
            strokeWidth={2}
            fill="url(#playerGradient)"
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Peak (24h)</div>
          <div className="text-xl font-bold text-white">
            {maxPlayers.toLocaleString()}
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Average (24h)</div>
          <div className="text-xl font-bold text-gray-300">
            {avgPlayers.toLocaleString()}
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Low (24h)</div>
          <div className="text-xl font-bold text-gray-400">
            {minPlayers.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
