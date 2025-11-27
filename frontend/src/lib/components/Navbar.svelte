<script>
  import { theme, toggleTheme } from '$lib/stores';
  import { faSun, faMoon, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<nav class="fixed top-0 left-0 right-0 bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-xl border-b border-white/20 dark:border-accent-blue/20 z-50 shadow-soft dark:shadow-glow-blue transition-all duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex-shrink-0">
        <a href="/" class="text-light-text dark:text-accent-blue text-2xl font-bold tracking-wider uppercase" style:text-shadow={$theme === 'dark' ? '0 0 10px rgba(0, 243, 255, 0.5)' : 'none'}>SafeRide</a>
      </div>
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-4">
          <a href="/#overview" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Overview</a>
          <a href="/#features" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
          <a href="/#demo" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Demo</a>
          <a href="/#contact" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
          <a href="/login" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</a>
          <button on:click={toggleTheme} class="p-2 rounded-full text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue transition-colors">
            {#if $theme === 'dark'}
              <Fa icon={faSun} />
            {:else}
              <Fa icon={faMoon} />
            {/if}
          </button>
        </div>
      </div>
      <div class="md:hidden flex items-center">
        <button on:click={toggleTheme} class="p-2 rounded-full text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue transition-colors">
            {#if $theme === 'dark'}
              <Fa icon={faSun} />
            {:else}
              <Fa icon={faMoon} />
            {/if}
        </button>
        <button on:click={toggleMenu} class="p-2 rounded-full text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue transition-colors">
            {#if isMenuOpen}
              <Fa icon={faTimes} />
            {:else}
              <Fa icon={faBars} />
            {/if}
        </button>
      </div>
    </div>
  </div>
  {#if isMenuOpen}
    <div class="md:hidden bg-light-surface dark:bg-dark-surface border-t border-white/10">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="/#overview" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Overview</a>
        <a href="/#features" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Features</a>
        <a href="/#demo" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Demo</a>
        <a href="/#contact" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Contact</a>
        <a href="/login" class="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Login</a>
      </div>
    </div>
  {/if}
</nav>
