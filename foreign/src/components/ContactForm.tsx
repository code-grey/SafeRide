import React from 'react';

const ContactForm = () => {
  return (
    <div className="max-w-xl mx-auto bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-xl rounded-xl p-8 shadow-soft border border-white/20">
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-light-subtle dark:text-dark-subtle text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full bg-light-surface/50 dark:bg-dark-surface/50 text-light-text dark:text-dark-text border border-white/20 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all duration-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-light-subtle dark:text-dark-subtle text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full bg-light-surface/50 dark:bg-dark-surface/50 text-light-text dark:text-dark-text border border-white/20 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all duration-300"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-light-subtle dark:text-dark-subtle text-sm font-bold mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full bg-light-surface/50 dark:bg-dark-surface/50 text-light-text dark:text-dark-text border border-white/20 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all duration-300"
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-accent-blue to-accent-violet text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
