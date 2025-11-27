import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedUser = browser ? JSON.parse(localStorage.getItem('user')) : null;

export const user = writable(storedUser);

user.subscribe((value) => {
    if (browser) {
        if (value) {
            localStorage.setItem('user', JSON.stringify(value));
        } else {
            localStorage.removeItem('user');
        }
    }
});
