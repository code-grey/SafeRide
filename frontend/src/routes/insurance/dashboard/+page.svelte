<script>
  import InsuranceSidebar from '$lib/components/InsuranceSidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import { isMobileMenuOpen } from '$lib/stores';
  import { faUsers, faShieldAlt, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
</script>

<div class="flex h-screen bg-dark-background overflow-hidden relative">
  <InsuranceSidebar />
  {#if $isMobileMenuOpen}
    <button
      class="fixed inset-0 z-20 bg-black opacity-50 md:hidden w-full h-full cursor-default"
      on:click={() => isMobileMenuOpen.set(false)}
      aria-label="Close Menu"
    ></button>
  {/if}

  <div class="flex flex-col flex-1 relative z-10 w-full">
    <Header />
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative text-white">
        <!-- Header -->
        <div class="mb-12">
            <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Insurance Portal</span>
            <h1 class="text-4xl md:text-5xl font-light tracking-tight">Dashboard Overview</h1>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <div class="flex items-center justify-between mb-4">
                    <Fa icon={faUsers} class="text-accent-blue text-3xl" />
                    <span class="text-gray-400 font-mono text-xs uppercase">Total Drivers</span>
                </div>
                <div class="text-4xl font-light">1,247</div>
            </div>

            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <div class="flex items-center justify-between mb-4">
                    <Fa icon={faShieldAlt} class="text-green-500 text-3xl" />
                    <span class="text-gray-400 font-mono text-xs uppercase">Active Policies</span>
                </div>
                <div class="text-4xl font-light">1,089</div>
            </div>

            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <div class="flex items-center justify-between mb-4">
                    <Fa icon={faExclamationTriangle} class="text-yellow-500 text-3xl" />
                    <span class="text-gray-400 font-mono text-xs uppercase">Pending Claims</span>
                </div>
                <div class="text-4xl font-light">23</div>
            </div>

            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <div class="flex items-center justify-between mb-4">
                    <Fa icon={faCheckCircle} class="text-accent-blue text-3xl" />
                    <span class="text-gray-400 font-mono text-xs uppercase">Avg Safety Score</span>
                </div>
                <div class="text-4xl font-light">87.3</div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Recent Claims -->
            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <h2 class="text-2xl font-light tracking-tight mb-6">Recent Claims</h2>
                <div class="space-y-4">
                    {#each [1, 2, 3] as i}
                        <div class="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                            <div>
                                <p class="text-white font-medium">Claim #{1000 + i}</p>
                                <p class="text-gray-400 text-sm font-light">Driver: John Doe</p>
                            </div>
                            <span class="text-yellow-500 font-mono text-xs uppercase">Pending</span>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- High Risk Drivers -->
            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <h2 class="text-2xl font-light tracking-tight mb-6">High Risk Alerts</h2>
                <div class="space-y-4">
                    {#each [1, 2, 3] as i}
                        <div class="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                            <div>
                                <p class="text-white font-medium">Driver #{5000 + i}</p>
                                <p class="text-gray-400 text-sm font-light">Safety Score: {65 - i * 5}</p>
                            </div>
                            <span class="text-red-500 font-mono text-xs uppercase">High Risk</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </main>
  </div>
</div>
