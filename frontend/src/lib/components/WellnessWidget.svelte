<script>
  import Fa from "svelte-fa";
  export let icon;
  export let label;
  export let value;
  export let color;
</script>

<div
  class={`backdrop-blur-xl border rounded-xl p-6 flex items-center shadow-lg transition-all duration-300 
  ${color.includes("red") && value.includes("BPM") ? "bg-red-900/40 border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-dark-surface/50 border-white/10 hover:bg-dark-surface/70"}`}
>
  <div class={`text-4xl md:text-5xl mr-6 ${color} drop-shadow-glow`}>
    <Fa {icon} />
  </div>
  <div>
    <span
      class="text-white/60 block text-sm font-medium uppercase tracking-wider mb-1"
      >{label}</span
    >
    <span class="text-2xl md:text-3xl font-bold text-white tracking-tight"
      >{value}</span
    >
  </div>
</div>
