<script>
    import { goto } from '$app/navigation';

    let name = '';
    let email = '';
    let password = '';
    let vehicleId = 'v-101'; // Default
    let error = '';

    async function handleSignup() {
        try {
            const res = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, vehicle_id: vehicleId })
            });
            const data = await res.json();
            
            if (res.ok) {
                goto('/login');
            } else {
                error = data.error;
            }
        } catch (e) {
            error = 'Server Error';
        }
    }
</script>

<div class="auth-container">
    <h2>Create Account</h2>
    {#if error} <p class="error">{error}</p> {/if}
    
    <div class="form-group">
        <label>Full Name</label>
        <input type="text" bind:value={name} />
    </div>

    <div class="form-group">
        <label>Email</label>
        <input type="email" bind:value={email} />
    </div>

    <div class="form-group">
        <label>Vehicle ID (IoT Device)</label>
        <input type="text" bind:value={vehicleId} />
    </div>
    
    <div class="form-group">
        <label>Password</label>
        <input type="password" bind:value={password} />
    </div>

    <button on:click={handleSignup}>Sign Up</button>
    
    <p class="switch">Already have an account? <a href="/login">Login</a></p>
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
