<script>
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Header from "$lib/components/Header.svelte";
  import { isMobileMenuOpen } from "$lib/stores";
  import { faUser, faBell, faLock, faGlobe } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  let activeTab = 'profile';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: faUser },
    { id: 'notifications', label: 'Notifications', icon: faBell },
    { id: 'security', label: 'Security', icon: faLock },
    { id: 'language', label: 'Language', icon: faGlobe },
  ];
</script>

<div class="flex h-screen bg-dark-background overflow-hidden relative">
  <Sidebar />
  
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
        
        <div class="max-w-4xl mx-auto">
            <!-- Page Header -->
            <div class="mb-8">
                <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">System Preferences</span>
                <h1 class="text-4xl md:text-5xl font-light tracking-tight">Settings</h1>
            </div>

            <!-- Tabs -->
            <div class="flex space-x-1 bg-dark-surface/50 p-1 rounded-xl mb-8 border border-white/10 w-full md:w-auto inline-flex">
                {#each tabs as tab}
                    <button 
                        class={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-accent-blue text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        on:click={() => activeTab = tab.id}
                    >
                        <Fa icon={tab.icon} class="mr-2" />
                        {tab.label}
                    </button>
                {/each}
            </div>

            <!-- Content Area -->
            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                {#if activeTab === 'profile'}
                    <h3 class="text-xl font-bold mb-6">Profile Settings</h3>
                    <div class="space-y-6 max-w-lg">
                        <div>
                            <label class="block text-sm font-mono text-gray-400 uppercase mb-2">Full Name</label>
                            <input type="text" value="John Doe" class="w-full bg-dark-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-blue focus:outline-none transition-colors" />
                        </div>
                        <div>
                            <label class="block text-sm font-mono text-gray-400 uppercase mb-2">Email Address</label>
                            <input type="email" value="john.doe@example.com" class="w-full bg-dark-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-blue focus:outline-none transition-colors" />
                        </div>
                        <button class="bg-accent-blue hover:bg-accent-blue/80 text-white font-bold py-3 px-6 rounded-lg transition-all">Save Changes</button>
                    </div>
                {:else if activeTab === 'notifications'}
                     <h3 class="text-xl font-bold mb-6">Notification Preferences</h3>
                     <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 bg-dark-background rounded-lg border border-white/5">
                            <div>
                                <h4 class="font-bold">Email Alerts</h4>
                                <p class="text-sm text-gray-400">Receive updates about your driving score.</p>
                            </div>
                            <input type="checkbox" checked class="toggle checkbox-accent" />
                        </div>
                        <div class="flex items-center justify-between p-4 bg-dark-background rounded-lg border border-white/5">
                            <div>
                                <h4 class="font-bold">Push Notifications</h4>
                                <p class="text-sm text-gray-400">Get real-time alerts on your device.</p>
                            </div>
                            <input type="checkbox" checked class="toggle checkbox-accent" />
                        </div>
                     </div>
                {:else}
                    <div class="text-center py-12 text-gray-400">
                        <Fa icon={faLock} class="text-4xl mb-4 mx-auto opacity-50" />
                        <p>This section is currently under development.</p>
                    </div>
                {/if}
            </div>
        </div>

    </main>
  </div>
</div>
