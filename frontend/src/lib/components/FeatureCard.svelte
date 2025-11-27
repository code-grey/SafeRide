<script>
  import Fa from 'svelte-fa';
  export let icon;
  export let title;
  export let description;
</script>

<div class="bg-light-surface dark:bg-dark-surface p-6 rounded-xl shadow-soft dark:shadow-none border border-transparent dark:border-white/10 hover:border-accent-blue dark:hover:border-accent-blue transition-all duration-300 group">
  <div class="w-12 h-12 bg-brand-primary/10 dark:bg-accent-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
    <span class="text-2xl text-brand-primary dark:text-accent-blue">
        <Fa {icon} />
    </span>
  </div>
  <h3 class="text-lg font-bold mb-3 text-light-text dark:text-white group-hover:text-brand-primary dark:group-hover:text-accent-blue transition-colors duration-300">{title}</h3>
  <p class="text-sm text-light-subtle dark:text-gray-400 leading-relaxed">
    {description}
  </p>
</div>
