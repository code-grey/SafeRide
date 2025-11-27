<script>
  import InsuranceSidebar from '$lib/components/InsuranceSidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import { isMobileMenuOpen } from '$lib/stores';
  import { faClock, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  const claims = [
    {
      id: 'CLM001',
      driverId: 'D001',
      driverName: 'John Doe',
      date: '2024-01-15',
      amount: '$2,500',
      status: 'pending',
      description: 'Minor collision - rear bumper damage'
    },
    {
      id: 'CLM002',
      driverId: 'D003',
      driverName: 'Mike Johnson',
      date: '2024-01-14',
      amount: '$5,200',
      status: 'pending',
      description: 'Side panel damage from parking incident'
    },
    {
      id: 'CLM003',
      driverId: 'D002',
      driverName: 'Jane Smith',
      date: '2024-01-10',
      amount: '$1,800',
      status: 'approved',
      description: 'Windshield replacement'
    },
  ];

  function getStatusColor(status) {
      if (status === 'pending') return 'text-yellow-500';
      if (status === 'approved') return 'text-green-500';
      if (status === 'rejected') return 'text-red-500';
      return 'text-gray-500';
  }
</script>

<div class="flex h-screen bg-dark-background overflow-hidden relative">
  <InsuranceSidebar />
  {#if $isMobileMenuOpen}
    <div class="fixed inset-0 z-20 bg-black opacity-50 md:hidden" on:click={() => isMobileMenuOpen.set(false)}></div>
  {/if}

  <div class="flex flex-col flex-1 relative z-10 w-full">
    <Header />
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative text-white">
        <!-- Header -->
        <div class="mb-12">
            <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Claims Processing</span>
            <h1 class="text-4xl md:text-5xl font-light tracking-tight">Claims Management</h1>
        </div>

        <!-- Claims List -->
        <div class="space-y-6">
            {#each claims as claim}
                <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div class="flex items-center mb-4 md:mb-0">
                            <div class="mr-4 text-2xl">
                                {#if claim.status === 'pending'}
                                    <span class="text-yellow-500"><Fa icon={faClock} /></span>
                                {:else if claim.status === 'approved'}
                                    <span class="text-green-500"><Fa icon={faCheckCircle} /></span>
                                {:else}
                                    <span class="text-red-500"><Fa icon={faTimesCircle} /></span>
                                {/if}
                            </div>
                            <div>
                                <h3 class="text-xl font-medium">Claim {claim.id}</h3>
                                <p class="text-gray-400 text-sm font-light">
                                    Driver: {claim.driverName} ({claim.driverId})
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-light mb-1">{claim.amount}</div>
                            <span class={`font-mono text-xs uppercase ${getStatusColor(claim.status)}`}>
                                {claim.status}
                            </span>
                        </div>
                    </div>

                    <div class="border-t border-white/10 pt-4 mb-4">
                        <p class="text-gray-300 mb-2">{claim.description}</p>
                        <p class="text-gray-500 text-sm font-light">Filed: {claim.date}</p>
                    </div>

                    {#if claim.status === 'pending'}
                        <div class="flex space-x-4">
                            <button class="flex-1 bg-green-500/20 border border-green-500 text-green-500 font-medium py-2 px-4 uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all duration-300">
                                Approve
                            </button>
                            <button class="flex-1 bg-red-500/20 border border-red-500 text-red-500 font-medium py-2 px-4 uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all duration-300">
                                Reject
                            </button>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </main>
  </div>
</div>
