import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Theme Store
const initialTheme = browser ? localStorage.getItem('theme') || 'dark' : 'dark';
export const theme = writable(initialTheme);

theme.subscribe((value) => {
    if (browser) {
        localStorage.setItem('theme', value);
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(value);
    }
});

export const toggleTheme = () => {
    theme.update(t => (t === 'light' ? 'dark' : 'light'));
};

// Feedback Store
export const isFeedbackModalOpen = writable(false);

// Mobile Menu Store
export const isMobileMenuOpen = writable(false);
