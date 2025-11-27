import React from 'react';
import { IconType } from 'react-icons';

interface WellnessWidgetProps {
  icon: IconType;
  label: string;
  value: string;
  color: string;
}

const WellnessWidget: React.FC<WellnessWidgetProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 md:p-6 flex items-center">
      <Icon className={`text-4xl md:text-5xl mr-4 ${color}`} />
      <div>
        <span className="text-gray-300 block text-sm md:text-base">{label}</span>
        <span className="text-xl md:text-2xl font-bold">{value}</span>
      </div>
    </div>
  );
};

export default WellnessWidget;
