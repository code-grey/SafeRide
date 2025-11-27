<script>
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import IncidentHistory from '$lib/components/IncidentHistory.svelte';
  import { isMobileMenuOpen } from '$lib/stores';
  import { onMount } from 'svelte';

  let vehicleId = 'v-101';
  let alerts = [];

  async function fetchData() {
    try {
      const resAlerts = await fetch(`http://localhost:8080/api/alerts/${vehicleId}`);
      if (resAlerts.ok) alerts = await resAlerts.json();
    } catch (e) {
      console.error("Fetch error", e);
    }
  }

  onMount(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Poll slower for history
    return () => clearInterval(interval);
  });
</script>

<div class="flex h-screen bg-dark-background overflow-hidden relative">
  <Sidebar />
  {#if $isMobileMenuOpen}
    <div class="fixed inset-0 z-20 bg-black opacity-50 md:hidden" on:click={() => isMobileMenuOpen.set(false)}></div>
  {/if}

  <div class="flex flex-col flex-1 relative z-10 w-full">
    <Header />
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative text-white">
        <div class="mb-12">
            <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Immutable Ledger</span>
            <h1 class="text-4xl md:text-5xl font-light tracking-tight">Blockchain Records</h1>
            <p class="text-gray-400 mt-4 max-w-3xl">
                This is the complete, tamper-proof history of all safety events recorded for Vehicle {vehicleId}.
                Every entry below is cryptographically signed and stored on the Solana Devnet.
            </p>
        </div>

        <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl">
            <IncidentHistory {alerts} />
        </div>
    </main>
  </div>
</div>
