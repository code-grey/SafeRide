<script>
  import { faMapMarkerAlt, faRoute } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
</script>

<div class="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
  <h3 class="text-xl font-bold text-white mb-4">Route Planner</h3>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Map Placeholder -->
    <div class="lg:col-span-2 bg-gray-900 rounded-lg h-64 lg:h-auto flex items-center justify-center">
      <div class="text-gray-500 text-6xl">
        <Fa icon={faMapMarkerAlt} />
      </div>
      <p class="text-gray-500 ml-4">Map API Placeholder</p>
    </div>

    <!-- Route Controls -->
    <div class="lg:col-span-1">
      <form>
        <div class="mb-4">
          <label for="start" class="block text-sm font-medium text-gray-300 mb-2">Starting Point</label>
          <input type="text" id="start" name="start" class="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., City Hall" />
        </div>
        <div class="mb-4">
          <label for="destination" class="block text-sm font-medium text-gray-300 mb-2">Destination</label>
          <input type="text" id="destination" name="destination" class="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Central Station" />
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition duration-300">
          <Fa icon={faRoute} class="mr-2" />
          <span>Plan Route</span>
        </button>
      </form>
    </div>
  </div>
</div>
