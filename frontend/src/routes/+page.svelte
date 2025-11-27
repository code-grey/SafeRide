<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import ParticleBackground from '$lib/components/ParticleBackground.svelte';
  import CarAnimation from '$lib/components/CarAnimation.svelte';
  import { theme } from '$lib/stores';
  import { faShieldAlt, faBrain, faRoute } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
</script>

<div class="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text transition-colors duration-300 font-sans overflow-x-hidden">
  <Navbar />

  <!-- 1. Hero Section -->
  <section class="h-screen w-full relative overflow-hidden flex flex-col justify-end pb-20">
    <div class="absolute inset-0 z-0">
      {#key $theme}
        <ParticleBackground />
      {/key}
    </div>
    <div class="absolute inset-0 z-10 pointer-events-none">
      <CarAnimation />
    </div>

    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80"></div>

    <div class="relative z-20 max-w-7xl mx-auto px-6 w-full">
      <h1 class="text-6xl md:text-9xl font-bold mb-4 tracking-tighter text-white opacity-90">
        SAFERIDE
      </h1>
      <div class="flex flex-col md:flex-row justify-between items-end border-t border-white/30 pt-6">
        <p class="text-xl md:text-2xl text-gray-300 max-w-xl font-light tracking-wide">
          The future of driver wellness. <br />
          <span class="text-accent-blue">AI-Powered. Blockchain-Secured.</span>
        </p>
        <div class="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4">
          <a href="/signup" class="inline-flex items-center justify-center px-10 py-4 border border-white text-white text-lg font-medium tracking-widest hover:bg-white hover:text-black transition-all duration-300 uppercase">
            Driver Portal
          </a>
          <a href="/insurance/login" class="inline-flex items-center justify-center px-10 py-4 border border-accent-blue text-accent-blue text-lg font-medium tracking-widest hover:bg-accent-blue hover:text-black transition-all duration-300 uppercase">
            Insurance Portal
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. Overview -->
  <section id="overview" class="py-24 px-6 bg-dark-surface">
    <div class="max-w-7xl mx-auto">
      <div class="grid md:grid-cols-12 gap-12">
        <div class="md:col-span-4">
          <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-4">01 // Overview</span>
          <h2 class="text-4xl font-light tracking-tight text-white mb-6">
            Intelligent.<br />
            Intuitive.<br />
            Immutable.
          </h2>
          <p class="text-gray-400 font-light leading-relaxed">
            SafeRide revolutionizes driver safety through cutting-edge technology and blockchain verification.
          </p>
        </div>
        <div class="md:col-span-8">
          <p class="text-2xl font-light text-gray-300 leading-relaxed mb-8">
            SafeRide isn't just an app; it's your intelligent co-pilot. By merging advanced AI monitoring with the immutable trust of blockchain, we've created a comprehensive safety ecosystem that protects drivers, reduces accidents, and rewards safe behavior.
          </p>

          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="bg-black/30 p-6 border border-white/10">
              <h3 class="text-white font-medium mb-3 text-lg">🚗 For Fleet Managers</h3>
              <p class="text-gray-400 font-light leading-relaxed">
                Optimize operations and reduce liability with real-time driver health analytics. Monitor fatigue levels, track safety scores, and ensure compliance with automated reporting.
              </p>
            </div>
            <div class="bg-black/30 p-6 border border-white/10">
              <h3 class="text-white font-medium mb-3 text-lg">👤 For Individual Drivers</h3>
              <p class="text-gray-400 font-light leading-relaxed">
                Drive with confidence knowing your safety data is securely verified on blockchain. Earn rewards for safe driving and get instant alerts when fatigue is detected.
              </p>
            </div>
          </div>

          <div class="border-t border-white/10 pt-8">
            <h3 class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase mb-4">What SafeRide Does</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div class="text-white font-medium mb-2">Real-Time Monitoring</div>
                <p class="text-gray-400 text-sm font-light">
                  IoT sensors and wearables track vital signs, eye movement, and brain activity to detect fatigue before it becomes dangerous.
                </p>
              </div>
              <div>
                <div class="text-white font-medium mb-2">AI-Powered Analysis</div>
                <p class="text-gray-400 text-sm font-light">
                  Machine learning algorithms analyze patterns and predict potential safety risks, providing instant alerts to drivers and fleet managers.
                </p>
              </div>
              <div>
                <div class="text-white font-medium mb-2">Blockchain Verification</div>
                <p class="text-gray-400 text-sm font-light">
                  All safety data is cryptographically secured and stored on blockchain, creating tamper-proof records for insurance and compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Features -->
  <section id="features" class="py-24 px-6 bg-black text-white">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-16">
        <h2 class="text-4xl font-light tracking-tight">Specifications</h2>
        <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase">02 // Features</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        <div class="bg-dark-background p-12 hover:bg-white/5 transition-colors duration-500 group border-r border-b border-white/10">
          <span class="text-4xl text-accent-blue mb-8 block group-hover:scale-110 transition-transform duration-500">
            <Fa icon={faBrain} />
          </span>
          <h3 class="text-xl font-medium mb-4">Neural Monitoring</h3>
          <p class="text-gray-400 font-light leading-relaxed">Real-time fatigue detection using computer vision and biometric analysis.</p>
        </div>
        <div class="bg-dark-background p-12 hover:bg-white/5 transition-colors duration-500 group border-r border-b border-white/10">
          <span class="text-4xl text-accent-blue mb-8 block group-hover:scale-110 transition-transform duration-500">
            <Fa icon={faShieldAlt} />
          </span>
          <h3 class="text-xl font-medium mb-4">Ledger Security</h3>
          <p class="text-gray-400 font-light leading-relaxed">Trip data hashed and stored on a decentralized network for absolute proof.</p>
        </div>
        <div class="bg-dark-background p-12 hover:bg-white/5 transition-colors duration-500 group border-b border-white/10">
          <span class="text-4xl text-accent-blue mb-8 block group-hover:scale-110 transition-transform duration-500">
            <Fa icon={faRoute} />
          </span>
          <h3 class="text-xl font-medium mb-4">Predictive Routing</h3>
          <p class="text-gray-400 font-light leading-relaxed">AI-driven route suggestions based on safety scores and traffic patterns.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. How it Works -->
  <section id="how-it-works" class="py-24 px-6 bg-light-surface dark:bg-dark-surface">
    <div class="max-w-7xl mx-auto">
      <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-12 text-center">03 // Integration</span>
      <div class="grid md:grid-cols-3 gap-12 text-center">
        <div class="relative">
          <div class="text-6xl font-thin text-white/10 absolute -top-8 left-1/2 transform -translate-x-1/2">01</div>
          <h3 class="text-xl font-medium mb-4 relative z-10 dark:text-white">Connect</h3>
          <p class="text-gray-400 font-light">Sync with vehicle telemetry.</p>
        </div>
        <div class="relative">
          <div class="text-6xl font-thin text-white/10 absolute -top-8 left-1/2 transform -translate-x-1/2">02</div>
          <h3 class="text-xl font-medium mb-4 relative z-10 dark:text-white">Analyze</h3>
          <p class="text-gray-400 font-light">AI processes driver state.</p>
        </div>
        <div class="relative">
          <div class="text-6xl font-thin text-white/10 absolute -top-8 left-1/2 transform -translate-x-1/2">03</div>
          <h3 class="text-xl font-medium mb-4 relative z-10 dark:text-white">Secure</h3>
          <p class="text-gray-400 font-light">Data verified on blockchain.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Impact -->
  <section id="impact" class="py-32 px-6 bg-accent-blue text-black">
    <div class="max-w-7xl mx-auto">
      <div class="grid md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-black/20">
        <div class="py-8 md:py-0">
          <div class="text-6xl md:text-8xl font-bold mb-2 tracking-tighter">40%</div>
          <div class="text-sm font-bold uppercase tracking-widest">Accident Reduction</div>
        </div>
        <div class="py-8 md:py-0">
          <div class="text-6xl md:text-8xl font-bold mb-2 tracking-tighter">60%</div>
          <div class="text-sm font-bold uppercase tracking-widest">Wellness Increase</div>
        </div>
        <div class="py-8 md:py-0">
          <div class="text-6xl md:text-8xl font-bold mb-2 tracking-tighter">100%</div>
          <div class="text-sm font-bold uppercase tracking-widest">Data Integrity</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. Contact -->
  <section id="contact" class="py-24 px-6 bg-light-surface dark:bg-dark-surface">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <span class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-4">05 // Get In Touch</span>
        <h2 class="text-4xl font-light tracking-tight dark:text-white mb-4">Contact Us</h2>
        <p class="text-gray-400 font-light max-w-2xl mx-auto">Have questions about SafeRide? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>
      <div class="max-w-3xl mx-auto">
        <ContactForm />
      </div>
    </div>
  </section>

  <Footer />
</div>