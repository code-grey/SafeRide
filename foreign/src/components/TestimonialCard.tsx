import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  company: string;
  avatar: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, company, avatar }) => {
  return (
    <div className="bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-xl rounded-xl p-6 shadow-soft border border-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
      <p className="text-light-subtle dark:text-dark-subtle mb-4">"{quote}"</p>
      <div className="flex items-center">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="font-bold text-light-text dark:text-dark-text">{author}</p>
          <p className="text-sm text-light-subtle dark:text-dark-subtle">{company}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
