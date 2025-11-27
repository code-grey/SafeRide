<script>
	import { user } from '$lib/auth';
	import { goto } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

    function logout() {
        user.set(null);
        goto('/');
    }
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
    <title>SafeRide</title>
</svelte:head>

<nav>
    <div class="logo">
        <a href="/">🛡️ SafeRide</a>
    </div>
    <div class="links">
        {#if $user}
            <a href="/commander">Commander</a>
            <a href="/rewards">Rewards</a>
            <span class="welcome">Hi, {$user.name}</span>
            <button on:click={logout}>Logout</button>
        {:else}
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
        {/if}
    </div>
</nav>

{@render children()}

<style>
    :global(body) {
        margin: 0;
        background-color: #111827;
        color: white;
        font-family: 'Inter', sans-serif;
    }
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: #1f2937;
        border-bottom: 1px solid #374151;
    }
    .logo a {
        font-size: 1.5rem;
        font-weight: bold;
        color: #22c55e;
        text-decoration: none;
    }
    .links {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }
    a {
        color: #d1d5db;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }
    a:hover {
        color: white;
    }
    button {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: bold;
    }
    button:hover {
        background: #dc2626;
    }
    .welcome {
        color: #9ca3af;
        font-size: 0.9rem;
    }
</style>