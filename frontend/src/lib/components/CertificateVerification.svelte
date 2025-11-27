<script>
  import { faUpload, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  let isVerified = false;

  function handleVerification(e) {
    e.preventDefault();
    isVerified = true;
  }
</script>

<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-lg">
  <h3 class="text-xl font-bold text-white mb-4">Insurance Certificate Verification</h3>
  <p class="text-gray-400 mb-6">
    Verify your insurance certificate using its unique blockchain hash or by uploading the document.
  </p>

  {#if isVerified}
    <div class="text-center p-6 bg-green-500/20 border border-green-500 rounded-lg">
      <div class="w-12 h-12 mx-auto mb-4 text-green-400">
        <Fa icon={faCheckCircle} size="3x" />
      </div>
      <h4 class="text-lg font-semibold text-white">Certificate Verified Successfully</h4>
      <p class="text-gray-300">Hash: 0x123...abc | Timestamp: 2023-10-27 15:00:00</p>
    </div>
  {:else}
    <form on:submit={handleVerification}>
      <div class="mb-4">
        <label for="hash" class="block text-sm font-medium text-gray-300 mb-2">Verify with Blockchain Hash</label>
        <input type="text" id="hash" name="hash" class="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter certificate hash" />
      </div>

      <div class="text-center my-4 text-gray-500">OR</div>

      <div class="mb-6">
        <label for="file-upload" class="block text-sm font-medium text-gray-300 mb-2">Upload Document</label>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
          <div class="space-y-1 text-center">
            <div class="mx-auto h-12 w-12 text-gray-500">
                <Fa icon={faUpload} size="2x" />
            </div>
            <div class="flex text-sm text-gray-400 justify-center">
              <label for="file-upload" class="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>
      </div>

      <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
        Verify Certificate
      </button>
    </form>
  {/if}
</div>
