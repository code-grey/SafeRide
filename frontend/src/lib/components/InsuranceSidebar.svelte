<script>
  import { page } from '$app/stores';
  import { isMobileMenuOpen } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { faTachometerAlt, faUsers, faFileInvoiceDollar, faCog, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  function handleLogout() {
    isMobileMenuOpen.set(false);
    goto('/insurance/login');
  }

  function toggleMenu() {
    isMobileMenuOpen.update(v => !v);
  }

  const navLinks = [
    { to: '/insurance/dashboard', icon: faTachometerAlt, label: 'Dashboard' },
    { to: '/insurance/drivers', icon: faUsers, label: 'Driver Records' },
    { to: '/insurance/claims', icon: faFileInvoiceDollar, label: 'Claims' },
  ];

  function isActive(path) {
    return $page.url.pathname === path;
  }
</script>

<aside class={`fixed inset-y-0 left-0 z-30 w-64 bg-dark-surface border-r border-white/10 transform ${$isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}>
  <!-- Header -->
  <div class="flex items-center justify-between px-6 py-6 border-b border-white/10">
    <div>
      <h2 class="text-2xl font-bold tracking-tighter text-white">SAFERIDE</h2>
      <p class="text-accent-blue font-mono text-[10px] tracking-widest uppercase">Insurance</p>
    </div>
    <button on:click={toggleMenu} class="md:hidden text-gray-400 hover:text-white focus:outline-none">
      <Fa icon={faTimes} class="w-5 h-5" />
    </button>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 px-2 py-6 space-y-1">
    {#each navLinks as link}
      <a
        href={link.to}
        class={`flex items-center px-4 py-3 text-gray-400 transition-all duration-200 border-l-2 ${isActive(link.to)
          ? 'border-accent-blue text-accent-blue bg-white/5'
          : 'border-transparent hover:border-accent-blue/50 hover:text-white hover:bg-white/5'
        }`}
        on:click={() => $isMobileMenuOpen && toggleMenu()}
      >
        <Fa icon={link.icon} class="w-5 h-5" />
        <span class="mx-4 font-medium tracking-wide">{link.label}</span>
      </a>
    {/each}
  </nav>

  <!-- Bottom Actions -->
  <div class="px-2 py-4 border-t border-white/10 space-y-1">
    <a
      href="/insurance/settings"
      class={`flex items-center px-4 py-3 text-gray-400 transition-all duration-200 border-l-2 ${isActive('/insurance/settings')
        ? 'border-accent-blue text-accent-blue bg-white/5'
        : 'border-transparent hover:border-accent-blue/50 hover:text-white hover:bg-white/5'
      }`}
      on:click={() => $isMobileMenuOpen && toggleMenu()}
    >
      <Fa icon={faCog} class="w-5 h-5" />
      <span class="mx-4 font-medium tracking-wide">Settings</span>
    </a>
    <button
      on:click={handleLogout}
      class="flex items-center w-full px-4 py-3 text-gray-400 transition-all duration-200 border-l-2 border-transparent hover:border-accent-blue/50 hover:text-white hover:bg-white/5"
    >
      <Fa icon={faSignOutAlt} class="w-5 h-5" />
      <span class="mx-4 font-medium tracking-wide">Logout</span>
    </button>
  </div>
</aside>
