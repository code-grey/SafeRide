<script>
  import InsuranceSidebar from '$lib/components/InsuranceSidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import { isMobileMenuOpen } from '$lib/stores';
  import { faCheckCircle, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  let searchTerm = '';

  const drivers = [
    { id: 'D001', name: 'John Doe', safetyScore: 92, totalTrips: 145, incidents: 2, status: 'active' },
    { id: 'D002', name: 'Jane Smith', safetyScore: 88, totalTrips: 203, incidents: 5, status: 'active' },
    { id: 'D003', name: 'Mike Johnson', safetyScore: 65, totalTrips: 89, incidents: 12, status: 'active' },
    { id: 'D004', name: 'Sarah Williams', safetyScore: 95, totalTrips: 267, incidents: 1, status: 'active' },
  ];

  $: filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    driver.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
            <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Driver Management</span>
            <h1 class="text-4xl md:text-5xl font-light tracking-tight">Driver Records</h1>
        </div>

        <!-- Search -->
        <div class="mb-8">
            <div class="relative max-w-md">
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Fa icon={faSearch} />
                </div>
                <input
                    type="text"
                    placeholder="Search drivers..."
                    bind:value={searchTerm}
                    class="w-full bg-dark-surface/50 text-white border border-white/20 pl-12 pr-4 py-3 leading-tight focus:outline-none focus:border-accent-blue transition-colors duration-300"
                />
            </div>
        </div>

        <!-- Drivers Table -->
        <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 overflow-hidden rounded-lg">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="border-b border-white/10 bg-white/5">
                        <tr>
                            <th class="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Driver ID</th>
                            <th class="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Name</th>
                            <th class="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Safety Score</th>
                            <th class="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Total Trips</th>
                            <th class="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Incidents</th>
                            <th class="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Status</th>
                            <th class="text-left p-4 text-gray-400 font-mono text-xs uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each filteredDrivers as driver (driver.id)}
                            <tr class="border-b border-white/10 hover:bg-white/5 transition-colors">
                                <td class="p-4 font-mono text-accent-blue">{driver.id}</td>
                                <td class="p-4">{driver.name}</td>
                                <td class="p-4">
                                    <div class="flex items-center">
                                        <div class={`mr-2 ${driver.safetyScore >= 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                                            <Fa icon={driver.safetyScore >= 80 ? faCheckCircle : faExclamationTriangle} />
                                        </div>
                                        <span class={driver.safetyScore >= 80 ? 'text-green-500' : 'text-yellow-500'}>
                                            {driver.safetyScore}
                                        </span>
                                    </div>
                                </td>
                                <td class="p-4">{driver.totalTrips}</td>
                                <td class="p-4">{driver.incidents}</td>
                                <td class="p-4">
                                    <span class={`font-mono text-xs uppercase ${driver.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                                        {driver.status}
                                    </span>
                                </td>
                                <td class="p-4">
                                    <button class="text-accent-blue hover:text-white transition-colors text-sm font-medium">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </main>
  </div>
</div>
