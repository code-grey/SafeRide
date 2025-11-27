<script>
  export let statistic;
  export let title;
  export let description;
</script>

<div class="bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-xl rounded-xl p-6 text-center shadow-soft border border-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
  <span class="text-5xl font-bold text-accent-violet block mb-2">{statistic}</span>
  <h3 class="text-xl font-bold mb-2 text-light-text dark:text-dark-text">{title}</h3>
  <p class="text-light-subtle dark:text-dark-subtle">{description}</p>
</div>
