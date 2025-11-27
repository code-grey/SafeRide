import React from 'react';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-xl shadow-soft dark:shadow-none border border-transparent dark:border-white/10 hover:border-accent-blue dark:hover:border-accent-blue transition-all duration-300 group">
      <div className="w-12 h-12 bg-brand-primary/10 dark:bg-accent-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-2xl text-brand-primary dark:text-accent-blue" />
      </div>
      <h3 className="text-lg font-bold mb-3 text-light-text dark:text-white group-hover:text-brand-primary dark:group-hover:text-accent-blue transition-colors duration-300">{title}</h3>
      <p className="text-sm text-light-subtle dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
