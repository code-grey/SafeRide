<script>
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import { isMobileMenuOpen } from '$lib/stores';
  import { faCoins, faUtensils, faGasPump, faCoffee, faStar, faTrophy } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { onMount } from 'svelte';

  let tokenBalance = 0;
  let safetyScore = 92; // Mock or fetch
  let monthlyEarnings = 150; // Mock

  const partners = [
    {
      id: '1',
      name: "McDonald's",
      category: 'restaurant',
      icon: faUtensils,
      tokensRequired: 500,
      discount: '$10 OFF',
      description: 'Redeem at any McDonald\'s location'
    },
    {
      id: '2',
      name: 'Shell Gas Station',
      category: 'fuel',
      icon: faGasPump,
      tokensRequired: 1000,
      discount: '$20 OFF',
      description: 'Fuel discount at Shell stations'
    },
    {
      id: '3',
      name: 'Starbucks',
      category: 'cafe',
      icon: faCoffee,
      tokensRequired: 300,
      discount: '$5 OFF',
      description: 'Coffee and beverages discount'
    },
    {
      id: '4',
      name: 'BP Fuel',
      category: 'fuel',
      icon: faGasPump,
      tokensRequired: 800,
      discount: '$15 OFF',
      description: 'Fuel discount at BP stations'
    },
    {
      id: '5',
      name: 'Subway',
      category: 'restaurant',
      icon: faUtensils,
      tokensRequired: 400,
      discount: '$8 OFF',
      description: 'Fresh sandwiches and salads'
    },
    {
      id: '6',
      name: 'Dunkin\'s',
      category: 'cafe',
      icon: faCoffee,
      tokensRequired: 250,
      discount: '$5 OFF',
      description: 'Donuts and coffee discount'
    },
  ];

  onMount(async () => {
      // Fetch real points if possible
      try {
          const vehicleId = 'v-101'; // Hardcoded for demo or get from user
          const res = await fetch(`http://localhost:8080/api/points/${vehicleId}`);
          if (res.ok) {
              const data = await res.json();
              tokenBalance = parseInt(data.points || 0);
          }
      } catch (e) {
          console.error("Failed to fetch points", e);
      }
  });

  function handleRedeem(partner) {
      if (tokenBalance >= partner.tokensRequired) {
          alert(`Redeemed ${partner.tokensRequired} tokens at ${partner.name}! You received ${partner.discount}.`);
          // Ideally call backend to deduct points here
      } else {
          alert(`Insufficient tokens. You need ${partner.tokensRequired - tokenBalance} more tokens.`);
      }
  }

  function getCategoryColor(cat) {
      if (cat === 'restaurant') return 'text-orange-500';
      if (cat === 'fuel') return 'text-red-500';
      return 'text-yellow-600'; // brown ish
  }
</script>

<div class="flex h-screen bg-dark-background overflow-hidden relative">
  <Sidebar />
  {#if $isMobileMenuOpen}
    <div class="fixed inset-0 z-20 bg-black opacity-50 md:hidden" on:click={() => isMobileMenuOpen.set(false)}></div>
  {/if}

  <div class="flex flex-col flex-1 relative z-10 w-full">
    <Header />
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative text-white">
        <!-- Header -->
        <div class="mb-12">
            <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Loyalty Program</span>
            <h1 class="text-4xl md:text-5xl font-light tracking-tight">Rewards & Tokens</h1>
        </div>

        <!-- Token Balance & Safety Score -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 md:col-span-1">
                <div class="flex items-center justify-between mb-4">
                    <Fa icon={faCoins} class="text-yellow-500 text-4xl" />
                    <span class="text-gray-400 font-mono text-xs uppercase">Token Balance</span>
                </div>
                <div class="text-5xl font-light text-yellow-500">{tokenBalance.toLocaleString()}</div>
                <p class="text-gray-400 text-sm font-light mt-2">SafeRide Tokens</p>
            </div>

            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <div class="flex items-center justify-between mb-4">
                    <Fa icon={faStar} class="text-accent-blue text-4xl" />
                    <span class="text-gray-400 font-mono text-xs uppercase">Safety Score</span>
                </div>
                <div class="text-5xl font-light text-accent-blue">{safetyScore}</div>
                <p class="text-gray-400 text-sm font-light mt-2">Current Rating</p>
            </div>

            <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6">
                <div class="flex items-center justify-between mb-4">
                    <Fa icon={faTrophy} class="text-green-500 text-4xl" />
                    <span class="text-gray-400 font-mono text-xs uppercase">Tokens Earned</span>
                </div>
                <div class="text-5xl font-light text-green-500">+{monthlyEarnings}</div>
                <p class="text-gray-400 text-sm font-light mt-2">This Month</p>
            </div>
        </div>

        <!-- How It Works -->
        <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 mb-12">
            <h2 class="text-2xl font-light tracking-tight mb-4">How It Works</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <div class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">01 // Earn</div>
                    <p class="text-gray-300 font-light">Drive safely and maintain a high safety score to earn tokens automatically</p>
                </div>
                <div>
                    <div class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">02 // Accumulate</div>
                    <p class="text-gray-300 font-light">Tokens are added to your balance after each verified safe trip</p>
                </div>
                <div>
                    <div class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-2">03 // Redeem</div>
                    <p class="text-gray-300 font-light">Use tokens at our partner restaurants, fuel stations, and cafes</p>
                </div>
            </div>
        </div>

        <!-- Partner Redemption Options -->
        <div>
            <h2 class="text-2xl font-light tracking-tight mb-6">Partner Locations</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each partners as partner}
                    <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 hover:border-accent-blue/50 transition-all duration-300">
                        <div class="flex items-start justify-between mb-4">
                            <div class={`text-4xl ${getCategoryColor(partner.category)}`}>
                                <Fa icon={partner.icon} />
                            </div>
                            <span class={`font-mono text-xs uppercase px-3 py-1 border ${tokenBalance >= partner.tokensRequired
                                    ? 'border-green-500 text-green-500'
                                    : 'border-gray-600 text-gray-600'
                                }`}>
                                {partner.tokensRequired} tokens
                            </span>
                        </div>

                        <h3 class="text-xl font-medium mb-2">{partner.name}</h3>
                        <p class="text-gray-400 text-sm font-light mb-4">{partner.description}</p>

                        <div class="flex items-center justify-between mb-4">
                            <span class="text-2xl font-light text-accent-blue">{partner.discount}</span>
                        </div>

                        <button
                            on:click={() => handleRedeem(partner)}
                            disabled={tokenBalance < partner.tokensRequired}
                            class={`w-full py-3 px-6 uppercase tracking-widest font-medium transition-all duration-300 ${tokenBalance >= partner.tokensRequired
                                    ? 'bg-transparent border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-black'
                                    : 'bg-gray-800 border-2 border-gray-700 text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            {tokenBalance >= partner.tokensRequired ? 'Redeem Now' : 'Insufficient Tokens'}
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    </main>
  </div>
</div>