<script>
  const mockPolicy = {
    policyId: 'SR-2023-XYZ-001',
    provider: 'SafeInsure',
    coverageType: 'Comprehensive Driver Wellness',
    status: 'Active',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    premium: '$120/month',
  };
</script>

<div class="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-lg">
  <h3 class="text-xl font-bold text-white mb-4">Policy Details</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-300">
    <div><span class="font-semibold text-white">Policy ID:</span> {mockPolicy.policyId}</div>
    <div><span class="font-semibold text-white">Provider:</span> {mockPolicy.provider}</div>
    <div><span class="font-semibold text-white">Coverage:</span> {mockPolicy.coverageType}</div>
    <div>
      <span class="font-semibold text-white">Status:</span>
      <span class="ml-2 px-2 py-1 text-xs font-semibold text-green-100 bg-green-500 rounded-full">{mockPolicy.status}</span>
    </div>
    <div><span class="font-semibold text-white">Start Date:</span> {mockPolicy.startDate}</div>
    <div><span class="font-semibold text-white">End Date:</span> {mockPolicy.endDate}</div>
    <div class="md:col-span-2"><span class="font-semibold text-white">Premium:</span> {mockPolicy.premium}</div>
  </div>
  <div class="mt-6 border-t border-gray-700 pt-6">
    <h4 class="text-lg font-bold text-white mb-4">Claims</h4>
    <p class="text-gray-400">No active claims. You can file a new claim from the button below.</p>
    <button class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
      File a New Claim
    </button>
  </div>
</div>
