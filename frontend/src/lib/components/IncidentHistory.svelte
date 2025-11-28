<script>
  export let alerts = [];
</script>

<div
  class="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 md:p-6 shadow-lg"
>
  <h3 class="text-xl font-bold text-white mb-4">Activity Log</h3>
  <!-- Table for medium and larger screens -->
  <div class="hidden md:block overflow-x-auto">
    <table class="min-w-full text-left text-sm text-gray-300">
      <thead class="bg-gray-700/50">
        <tr>
          <th class="px-4 py-2">Type</th>
          <th class="px-4 py-2">Timestamp</th>
          <th class="px-4 py-2">Verification</th>
        </tr>
      </thead>
      <tbody>
        {#each alerts as alert, index (alert.tx_hash || index)}
          <tr
            class={`border-t border-gray-700 ${index % 2 === 0 ? "bg-gray-800/40" : "bg-gray-900/40"}`}
          >
            <td
              class="px-4 py-2 uppercase font-bold"
              class:text-red-500={alert.status === "fatigue"}
              class:text-purple-500={alert.status === "rash driving"}
              class:text-blue-500={alert.status === "drowsy" ||
                alert.status === "PERIODIC_SAFE_ATTESTATION"}
              class:text-yellow-500={alert.status === "stress" ||
                alert.status === "distracted"}
              class:text-green-500={alert.status === "safe" ||
                alert.status === "SAFE_STREAK_ATTESTATION"}
            >
              {alert.status}
            </td>
            <td class="px-4 py-2"
              >{new Date(alert.timestamp * 1000).toLocaleString()}</td
            >
            <td
              class="px-4 py-2 font-mono text-xs text-blue-400 truncate max-w-xs"
            >
              <a
                href={`https://explorer.solana.com/tx/${alert.tx_hash}?cluster=devnet`}
                target="_blank"
              >
                {alert.tx_hash}
              </a>
            </td>
          </tr>
        {/each}
        {#if alerts.length === 0}
          <tr
            ><td colspan="3" class="px-4 py-4 text-center text-gray-500"
              >No incidents recorded.</td
            ></tr
          >
        {/if}
      </tbody>
    </table>
  </div>

  <!-- Card layout for small screens -->
  <div class="md:hidden space-y-4">
    {#each alerts as alert}
      <div class="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
        <div class="flex justify-between items-center mb-2">
          <span
            class="font-bold uppercase"
            class:text-red-500={alert.status === "fatigue"}
            class:text-green-500={alert.status === "safe"}>{alert.status}</span
          >
        </div>
        <p class="text-sm text-gray-300 mb-1">
          <span class="font-semibold">Time:</span>
          {new Date(alert.timestamp * 1000).toLocaleTimeString()}
        </p>
        <p class="text-xs text-blue-400 truncate">
          <a
            href={`https://explorer.solana.com/tx/${alert.tx_hash}?cluster=devnet`}
            target="_blank">{alert.tx_hash}</a
          >
        </p>
      </div>
    {/each}
  </div>
</div>
