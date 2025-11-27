<script>
  import { faBell } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  let isOpen = false;

  const mockNotifications = [
    { id: 1, message: 'Your weekly safety report is ready.', time: '2h ago', type: 'info' },
    { id: 2, message: 'High fatigue detected - take a break!', time: '5h ago', type: 'warning' },
    { id: 3, message: 'You earned 50 tokens for safe driving!', time: '1d ago', type: 'success' },
  ];
</script>

<div class="relative">
  <button
    on:click={() => isOpen = !isOpen}
    class="relative text-gray-400 hover:text-accent-blue transition-colors focus:outline-none"
  >
    <Fa icon={faBell} class="w-6 h-6" />
    {#if mockNotifications.length > 0}
      <span class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-accent-blue rounded-full">
        {mockNotifications.length}
      </span>
    {/if}
  </button>

  {#if isOpen}
    <div class="absolute right-0 mt-2 w-80 bg-dark-surface border border-white/10 rounded-lg shadow-xl z-50">
      <div class="p-4 border-b border-white/10">
        <h3 class="text-lg font-medium text-white">Notifications</h3>
      </div>
      <div class="max-h-96 overflow-y-auto">
        {#each mockNotifications as notification (notification.id)}
          <div class="p-4 hover:bg-white/5 transition-colors border-b border-white/10 last:border-0">
            <p class="text-sm text-gray-300">{notification.message}</p>
            <p class="text-xs text-gray-500 mt-1">{notification.time}</p>
          </div>
        {/each}
      </div>
      <div class="p-3 border-t border-white/10 text-center">
        <button class="text-accent-blue text-sm hover:text-white transition-colors">View All Notifications</button>
      </div>
    </div>
  {/if}
</div>
