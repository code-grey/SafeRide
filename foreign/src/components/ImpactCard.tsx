import React from 'react';

interface ImpactCardProps {
  statistic: string;
  title: string;
  description: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ statistic, title, description }) => {
  return (
    <div className="bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-xl rounded-xl p-6 text-center shadow-soft border border-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
      <span className="text-5xl font-bold text-accent-violet block mb-2">{statistic}</span>
      <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">{title}</h3>
      <p className="text-light-subtle dark:text-dark-subtle">{description}</p>
    </div>
  );
};

export default ImpactCard;
