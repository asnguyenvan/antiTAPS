import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ParkingLot, OccupancyStatus } from '../types';

interface StatsChartProps {
  lots: ParkingLot[];
}

const COLORS = {
  [OccupancyStatus.AVAILABLE]: '#10B981', // Green-500
  [OccupancyStatus.FULL]: '#EF4444',      // Red-500
  [OccupancyStatus.CLOSING_SOON]: '#F59E0B' // Amber-500
};

const StatsChart: React.FC<StatsChartProps> = ({ lots }) => {
  const data = [
    { name: 'Available', value: lots.filter(l => l.status === OccupancyStatus.AVAILABLE).length },
    { name: 'Full', value: lots.filter(l => l.status === OccupancyStatus.FULL).length },
    { name: 'Closing Soon', value: lots.filter(l => l.status === OccupancyStatus.CLOSING_SOON).length },
  ].filter(d => d.value > 0);

  return (
    <div className="h-64 w-full bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold text-gray-700 mb-2">Campus Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as OccupancyStatus]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
