import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-brand-dark p-6 rounded-lg border border-neutral-800 shadow-lg flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-400 font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      {icon && <div className="text-brand-crimson opacity-80">{icon}</div>}
    </div>
  );
};
