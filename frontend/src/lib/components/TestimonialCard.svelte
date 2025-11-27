<script>
  export let quote;
  export let author;
  export let company;
  export let avatar;
</script>

<div class="bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-xl rounded-xl p-6 shadow-soft border border-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
  <p class="text-light-subtle dark:text-dark-subtle mb-4">"{quote}"</p>
  <div class="flex items-center">
    <img src={avatar} alt={author} class="w-12 h-12 rounded-full mr-4" />
    <div>
      <p class="font-bold text-light-text dark:text-dark-text">{author}</p>
      <p class="text-sm text-light-subtle dark:text-dark-subtle">{company}</p>
    </div>
  </div>
</div>
