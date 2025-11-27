<script>
  import { user } from '$lib/auth';
  import { goto } from '$app/navigation';
  import ParticleBackground from '$lib/components/ParticleBackground.svelte';
  import { theme } from '$lib/stores';

  function handleSubmit() {
    user.set({ name: 'John Doe', email: 'john@example.com' });
    goto('/dashboard');
  }
</script>

<div class="min-h-screen bg-dark-background text-white flex items-center justify-center relative overflow-hidden">
  <!-- Particle Background -->
  <div class="absolute inset-0 z-0">
    {#key $theme}
      <ParticleBackground />
    {/key}
  </div>

  <!-- Gradient Overlay -->
  <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80 z-0"></div>

  <!-- Login Form Container -->
  <div class="relative z-10 w-full max-w-md px-6">
    <!-- Logo/Brand -->
    <div class="text-center mb-12">
      <a href="/" class="inline-block">
        <h1 class="text-4xl font-bold tracking-tighter text-white mb-2">SAFERIDE</h1>
      </a>
      <p class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase">Access Portal</p>
    </div>

    <!-- Form Card -->
    <div class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-8 relative overflow-hidden">
      <!-- Decorative Corner -->
      <div class="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent-blue/30"></div>
      <div class="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent-blue/30"></div>

      <h2 class="text-2xl font-light tracking-tight mb-8 text-center">Sign In</h2>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            class="w-full bg-black/50 text-white border border-white/20 px-4 py-3 leading-tight focus:outline-none focus:border-accent-blue transition-colors duration-300"
            placeholder="your@email.com"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            class="w-full bg-black/50 text-white border border-white/20 px-4 py-3 leading-tight focus:outline-none focus:border-accent-blue transition-colors duration-300"
            placeholder="••••••••"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-transparent border-2 border-accent-blue text-accent-blue font-medium py-3 px-6 uppercase tracking-widest hover:bg-accent-blue hover:text-black transition-all duration-300 mt-8"
        >
          Access System
        </button>
      </form>

      <!-- Links -->
      <div class="mt-8 space-y-3 text-center text-sm">
        <div>
          <a href="/forgot-password" class="text-gray-400 hover:text-accent-blue transition-colors font-light">
            Forgot password?
          </a>
        </div>
        <div class="pt-4 border-t border-white/10">
          <span class="text-gray-500 font-light">New to SafeRide? </span>
          <a href="/signup" class="text-accent-blue hover:text-white transition-colors font-medium">
            Create Account
          </a>
        </div>
      </div>
    </div>

    <!-- Back to Home -->
    <div class="text-center mt-8">
      <a href="/" class="text-gray-500 hover:text-white transition-colors text-sm font-light">
        ← Back to Home
      </a>
    </div>
  </div>
</div>