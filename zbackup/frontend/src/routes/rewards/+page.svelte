<script>
    import { user } from '$lib/auth';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let points = 0;
    let loading = true;

    onMount(async () => {
        if (!$user) {
            goto('/login');
            return;
        }
        
        try {
            const res = await fetch(`http://localhost:8080/api/points/${$user.vehicle_id}`);
            if (res.ok) {
                const data = await res.json();
                points = parseInt(data.points || 0);
            }
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="rewards-container">
    <header>
        <h1>SafeRide Rewards</h1>
        <p>Redeem your safe driving points for real-world value.</p>
    </header>

    <div class="balance-card">
        <span class="label">Current Balance</span>
        <div class="amount">{points} <span class="unit">PTS</span></div>
    </div>

    <h2>Redeem</h2>
    <div class="grid">
        <div class="card">
            <div class="icon">⛽</div>
            <h3>Fuel Discount</h3>
            <p>Get 10% off at Shell Stations</p>
            <button disabled={points < 500}>Redeem (500 PTS)</button>
        </div>
        <div class="card">
            <div class="icon">⚡</div>
            <h3>EV Charging</h3>
            <p>Free 30 mins supercharging</p>
            <button disabled={points < 1000}>Redeem (1000 PTS)</button>
        </div>
        <div class="card">
            <div class="icon">☕</div>
            <h3>Starbucks</h3>
            <p>Free Grande Latte</p>
            <button disabled={points < 200}>Redeem (200 PTS)</button>
        </div>
    </div>
</div>

<style>
    .rewards-container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    header { text-align: center; margin-bottom: 3rem; }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    p { color: #9ca3af; }
    
    .balance-card { 
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        margin-bottom: 3rem;
        color: white;
        box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.4);
    }
    .balance-card .label { font-size: 1rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; }
    .balance-card .amount { font-size: 4rem; font-weight: 800; line-height: 1; margin-top: 0.5rem; }
    .balance-card .unit { font-size: 1.5rem; opacity: 0.8; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    .card { background: #1f2937; padding: 1.5rem; border-radius: 1rem; border: 1px solid #374151; text-align: center; display: flex; flex-direction: column; align-items: center; }
    .icon { font-size: 3rem; margin-bottom: 1rem; }
    h3 { margin: 0; margin-bottom: 0.5rem; }
    .card p { font-size: 0.9rem; margin-bottom: 1.5rem; }
    button { 
        margin-top: auto; 
        background: #374151; 
        color: white; 
        border: none; 
        padding: 0.75rem 1.5rem; 
        border-radius: 0.5rem; 
        cursor: pointer; 
        width: 100%;
        transition: background 0.2s;
    }
    button:not(:disabled):hover { background: #22c55e; color: black; font-weight: bold; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
