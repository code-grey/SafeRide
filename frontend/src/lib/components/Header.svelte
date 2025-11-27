<script>
  import { isMobileMenuOpen } from '$lib/stores';
  import { user } from '$lib/auth';
  import { faBars, faEnvelope, faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import NotificationCenter from './NotificationCenter.svelte';
  import { goto } from '$app/navigation';

  let showProfileMenu = false;
  let showMessages = false;

  const mockMessages = [
    { id: 1, from: 'Fleet Manager', message: 'Great job on maintaining your safety score!', time: '1h ago', unread: true },
    { id: 2, from: 'System', message: 'Your monthly report is ready', time: '3h ago', unread: true },
    { id: 3, from: 'Support', message: 'Thank you for your feedback', time: '1d ago', unread: false },
  ];

  $: unreadCount = mockMessages.filter(m => m.unread).length;

  function toggleMenu() {
    isMobileMenuOpen.update(v => !v);
  }

  function logout() {
      user.set(null);
      goto('/');
  }
</script>

<header class="bg-dark-surface/50 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center relative z-50">
  <button on:click={toggleMenu} class="md:hidden text-gray-400 hover:text-accent-blue transition-colors">
    <Fa icon={faBars} class="w-6 h-6" />
  </button>

  <div class="ml-auto flex items-center space-x-4">
    <!-- Messages -->
    <div class="relative">
      <button
        on:click={() => showMessages = !showMessages}
        class="relative text-gray-400 hover:text-accent-blue transition-colors focus:outline-none"
      >
        <Fa icon={faEnvelope} class="w-6 h-6" />
        {#if unreadCount > 0}
          <span class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-accent-blue rounded-full">
            {unreadCount}
          </span>
        {/if}
      </button>

      {#if showMessages}
        <div class="absolute right-0 mt-2 w-80 bg-dark-surface border border-white/10 rounded-lg shadow-xl z-50">
          <div class="p-4 border-b border-white/10">
            <h3 class="text-lg font-medium text-white">Messages</h3>
          </div>
          <div class="max-h-96 overflow-y-auto">
            {#each mockMessages as msg (msg.id)}
              <div class={`p-4 hover:bg-white/5 transition-colors border-b border-white/10 ${msg.unread ? 'bg-accent-blue/5' : ''}`}>
                <div class="flex justify-between items-start mb-1">
                  <p class="text-sm font-medium text-white">{msg.from}</p>
                  <span class="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p class="text-sm text-gray-400">{msg.message}</p>
              </div>
            {/each}
          </div>
          <div class="p-3 border-t border-white/10 text-center">
            <button class="text-accent-blue text-sm hover:text-white transition-colors">View All Messages</button>
          </div>
        </div>
      {/if}
    </div>

    <!-- Notifications -->
    <NotificationCenter />

    <!-- Profile Dropdown -->
    <div class="relative">
      <button
        on:click={() => showProfileMenu = !showProfileMenu}
        class="flex items-center space-x-2 text-gray-400 hover:text-accent-blue transition-colors focus:outline-none"
      >
        <div class="w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue flex items-center justify-center">
          <Fa icon={faUser} class="w-4 h-4 text-accent-blue" />
        </div>
      </button>

      {#if showProfileMenu}
        <div class="absolute right-0 mt-2 w-56 bg-dark-surface border border-white/10 rounded-lg shadow-xl z-50">
          <div class="p-4 border-b border-white/10">
            <p class="text-white font-medium">{$user ? $user.name : 'User'}</p>
            <p class="text-gray-400 text-sm">{$user ? $user.email : 'user@example.com'}</p>
          </div>
          <div class="py-2">
            <a
              href="/settings"
              class="flex items-center px-4 py-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              on:click={() => showProfileMenu = false}
            >
              <Fa icon={faCog} class="w-4 h-4 mr-3" />
              Settings
            </a>
            <button
              on:click={() => {
                showProfileMenu = false;
                logout();
              }}
              class="flex items-center w-full px-4 py-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Fa icon={faSignOutAlt} class="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>
