<script>
    import { user } from '$lib/auth';
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let error = '';

    async function handleLogin() {
        try {
            const res = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                user.set({
                    email: data.email,
                    name: data.name,
                    vehicle_id: data.vehicle_id
                });
                goto('/commander');
            } else {
                error = data.error;
            }
        } catch (e) {
            error = 'Server Error. Is Backend running?';
        }
    }
</script>

<div class="auth-container">
    <h2>Login to SafeRide</h2>
    {#if error} <p class="error">{error}</p> {/if}
    
    <div class="form-group">
        <label>Email</label>
        <input type="email" bind:value={email} />
    </div>
    
    <div class="form-group">
        <label>Password</label>
        <input type="password" bind:value={password} />
    </div>

    <button on:click={handleLogin}>Login</button>
    
    <p class="switch">Don't have an account? <a href="/signup">Signup</a></p>
</div>

<style>
    .auth-container { 
        max-width: 400px; 
        margin: 4rem auto; 
        padding: 2rem; 
        background: #1f2937; 
        border-radius: 1rem; 
        border: 1px solid #374151;
        display: flex; 
        flex-direction: column; 
        gap: 1.5rem; 
    }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    label { color: #d1d5db; font-size: 0.9rem; }
    input { padding: 0.75rem; background: #111827; border: 1px solid #374151; color: white; border-radius: 0.5rem; outline: none; }
    input:focus { border-color: #22c55e; }
    button { padding: 0.75rem; background: #22c55e; border: none; border-radius: 0.5rem; color: black; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
    button:hover { opacity: 0.9; }
    .error { color: #ef4444; text-align: center; margin: 0; }
    h2 { text-align: center; margin-top: 0; }
    .switch { text-align: center; color: #9ca3af; font-size: 0.9rem; }
    .switch a { color: #22c55e; }
</style>
