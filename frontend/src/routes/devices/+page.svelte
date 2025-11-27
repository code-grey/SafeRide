<script>
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import { isMobileMenuOpen } from '$lib/stores';
  import { faMobileAlt, faClock, faMicrochip, faWifi } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  const devices = [
    {
      id: 1,
      name: "Driver's Smartphone",
      type: "Mobile",
      icon: faMobileAlt,
      status: "Connected",
      battery: "85%",
      lastSync: "Just now",
      details: "Samsung Galaxy S23 - GPS & Accelerometer Active"
    },
    {
      id: 2,
      name: "Fitness Band",
      type: "Wearable",
      icon: faClock,
      status: "Connected",
      battery: "62%",
      lastSync: "1 min ago",
      details: "Xiaomi Mi Band 7 - Heart Rate Monitoring Active"
    },
    {
      id: 3,
      name: "SafeRide IoT Hub",
      type: "Vehicle Unit",
      icon: faMicrochip,
      status: "Online",
      battery: "Direct Power",
      lastSync: "Live",
      details: "Raspberry Pi Pico W - Telemetry Uplink Active"
    },
    {
      id: 4,
      name: "OBD-II Scanner",
      type: "Vehicle Sensor",
      icon: faWifi,
      status: "Disconnected",
      battery: "--",
      lastSync: "2 days ago",
      details: "Vehicle Diagnostics Interface"
    }
  ];
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
            <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Hardware Ecosystem</span>
            <h1 class="text-4xl md:text-5xl font-light tracking-tight">Connected Devices</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each devices as device}
                <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl hover:border-accent-blue/50 transition-all duration-300 group">
                    <div class="flex justify-between items-start mb-4">
                        <div class={`w-12 h-12 rounded-full flex items-center justify-center ${device.status === 'Connected' || device.status === 'Online' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                            <Fa icon={device.icon} size="1.5x" />
                        </div>
                        <div class={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${device.status === 'Connected' || device.status === 'Online' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}>
                            {device.status}
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-bold mb-1 group-hover:text-accent-blue transition-colors">{device.name}</h3>
                    <p class="text-sm text-gray-400 mb-4">{device.type}</p>
                    
                    <div class="border-t border-white/10 pt-4 text-sm text-gray-300 space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-500">Battery</span>
                            <span>{device.battery}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Last Sync</span>
                            <span>{device.lastSync}</span>
                        </div>
                        <div class="pt-2 text-xs text-gray-500">
                            {device.details}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </main>
  </div>
</div>
