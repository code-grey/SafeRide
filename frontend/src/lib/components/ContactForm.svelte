<script>
</script>

<div class="max-w-xl mx-auto bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-xl rounded-xl p-8 shadow-soft border border-white/20">
  <form>
    <div class="mb-4">
      <label for="name" class="block text-light-subtle dark:text-dark-subtle text-sm font-bold mb-2">
        Name
      </label>
      <input
        type="text"
        id="name"
        class="w-full bg-light-surface/50 dark:bg-dark-surface/50 text-light-text dark:text-dark-text border border-white/20 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all duration-300"
      />
    </div>
    <div class="mb-4">
      <label for="email" class="block text-light-subtle dark:text-dark-subtle text-sm font-bold mb-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        class="w-full bg-light-surface/50 dark:bg-dark-surface/50 text-light-text dark:text-dark-text border border-white/20 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all duration-300"
      />
    </div>
    <div class="mb-6">
      <label for="message" class="block text-light-subtle dark:text-dark-subtle text-sm font-bold mb-2">
        Message
      </label>
      <textarea
        id="message"
        rows="4"
        class="w-full bg-light-surface/50 dark:bg-dark-surface/50 text-light-text dark:text-dark-text border border-white/20 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all duration-300"
      ></textarea>
    </div>
    <div class="text-center">
      <button
        type="submit"
        class="bg-gradient-to-r from-accent-blue to-accent-violet text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline shadow-lg transform hover:-translate-y-1 transition-all duration-300"
      >
        Send Message
      </button>
    </div>
  </form>
</div>
