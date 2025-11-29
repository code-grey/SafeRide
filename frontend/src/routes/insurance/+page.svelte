<script>
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Header from "$lib/components/Header.svelte";
  import PolicyDetails from "$lib/components/PolicyDetails.svelte";
  import { isMobileMenuOpen } from "$lib/stores";
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
                <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2">Driver Protection</span>
                <h1 class="text-4xl md:text-5xl font-light tracking-tight">My Insurance Policy</h1>
            </div>

            <!-- Policy Component -->
            <PolicyDetails />

        </div>

    </main>
  </div>
</div>
