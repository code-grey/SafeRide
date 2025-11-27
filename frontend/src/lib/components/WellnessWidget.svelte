<script>
  import Fa from 'svelte-fa';
  export let icon;
  export let label;
  export let value;
  export let color;
</script>

<div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 md:p-6 flex items-center">
  <div class={`text-4xl md:text-5xl mr-4 ${color}`}>
    <Fa {icon} />
  </div>
  <div>
    <span class="text-gray-300 block text-sm md:text-base">{label}</span>
    <span class="text-xl md:text-2xl font-bold">{value}</span>
  </div>
</div>
