<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	let vehicleId = 'v-101';
	
	// State
	let telemetry = { status: 'loading...', lat: 0, long: 0, confidence: 0, timestamp: 0 };
	let history = [];
	let alerts = [];
	let error = '';

	// Chart instance
	let chart;
	let chartCanvas;

	// Polling Functions
	async function fetchData() {
		try {
			// 1. Hot State
			const resStatus = await fetch(`http://localhost:8080/api/status/${vehicleId}`);
			if (resStatus.ok) telemetry = await resStatus.json();

			// 2. History (Graph)
			const resHistory = await fetch(`http://localhost:8080/api/history/${vehicleId}`);
			if (resHistory.ok) {
				const newHistory = await resHistory.json();
				// Only update if data changed (simple check)
				if (newHistory.length !== history.length || newHistory[0]?.timestamp !== history[0]?.timestamp) {
					history = newHistory;
					updateChart();
				}
			}

			// 3. Alerts (Tx List)
			const resAlerts = await fetch(`http://localhost:8080/api/alerts/${vehicleId}`);
			if (resAlerts.ok) alerts = await resAlerts.json();

			error = '';
		} catch (e) {
			error = 'System Offline';
		}
	}

	function updateChart() {
		if (!chart) return;

		// Map status to numerical value for graph
		// Safe=0, Distracted=1, Stress=2, Drowsy=3, Rash=4, Fatigue=5
		const statusMap = {
			'safe': 0,
			'distracted': 1,
			'stress': 2,
			'drowsy': 3,
			'rash driving': 4,
			'fatigue': 5
		};

		const labels = history.map(h => new Date(h.timestamp * 1000).toLocaleTimeString());
		const dataPoints = history.map(h => statusMap[h.status.toLowerCase()] || 0);

		chart.data.labels = labels;
		chart.data.datasets[0].data = dataPoints;
		chart.update('none'); // 'none' mode for performance
	}

	onMount(() => {
		// Init Chart
		const ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [],
				datasets: [{
					label: 'Risk Level',
					data: [],
					borderColor: '#60a5fa',
					backgroundColor: 'rgba(96, 165, 250, 0.2)',
					tension: 0.4,
					fill: true
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true,
						max: 5,
						ticks: {
							callback: function(value) {
								const labels = ['Safe', 'Distr', 'Stress', 'Drowsy', 'Rash', 'FATIGUE'];
								return labels[value] || '';
							},
							color: '#9ca3af'
						},
						grid: { color: '#374151' }
					},
					x: {
						ticks: { display: false }, // Hide timestamps to avoid clutter
						grid: { display: false }
					}
				},
				plugins: {
					legend: { display: false }
				},
				animation: false
			}
		});

		const interval = setInterval(fetchData, 1000);
		return () => {
			clearInterval(interval);
			if (chart) chart.destroy();
		};
	});

	// Computed BG for Monitor Widget
	$: bgColor = (() => {
		const s = telemetry.status ? telemetry.status.toLowerCase() : '';
		if (s === 'fatigue') return 'background-color: #ef4444;'; 
		if (s === 'distracted') return 'background-color: #f97316;'; 
		if (s === 'rash driving') return 'background-color: #a855f7;'; 
		if (s === 'stress') return 'background-color: #eab308;'; 
		if (s === 'drowsy') return 'background-color: #3b82f6;'; 
		if (s === 'safe') return 'background-color: #22c55e;'; 
		return 'background-color: #374151;'; 
	})();
</script>

<div class="dashboard-container">
	<!-- Header -->
	<header>
		<h1>SafeRide Commander</h1>
		<div class="live-indicator">
			<span class="dot"></span> Live System
		</div>
	</header>

	<div class="grid-layout">
		<!-- Widget 1: Monitor -->
		<div class="card monitor-card" style={bgColor}>
			<h2>Live Monitor</h2>
			<div class="monitor-content">
				<div class="big-status">{telemetry.status?.toUpperCase()}</div>
				<div class="monitor-details">
					<p>Vehicle: {vehicleId}</p>
					<p>Confidence: {(telemetry.confidence * 100).toFixed(0)}%</p>
				</div>
			</div>
		</div>

		<!-- Widget 2: Graph -->
		<div class="card graph-card">
			<h2>Behavior History</h2>
			<div class="chart-container">
				<canvas bind:this={chartCanvas}></canvas>
			</div>
		</div>

		<!-- Widget 3: Blockchain Logs -->
		<div class="card logs-card">
			<h2>Blockchain Verification Log</h2>
			<div class="logs-list">
				{#if alerts.length === 0}
					<div class="empty-logs">No incidents recorded yet.</div>
				{/if}
				{#each alerts.slice().reverse() as alert}
					<div class="log-item">
						<div class="log-status" 
							class:red={alert.status === 'fatigue'} 
							class:purple={alert.status === 'rash driving'} 
							class:orange={alert.status === 'distracted'}
							class:yellow={alert.status === 'stress'}
							class:blue={alert.status === 'drowsy'}
							class:green={alert.status === 'safe'}
							class:attestation-streak={alert.status === 'SAFE_STREAK_ATTESTATION'}
							class:attestation-periodic={alert.status === 'PERIODIC_SAFE_ATTESTATION'}
						>
							{alert.status}
						</div>
						<div class="log-hash">
							<a href="https://explorer.solana.com/tx/{alert.tx_hash}?cluster=devnet" target="_blank">
								{alert.tx_hash.slice(0, 12)}...{alert.tx_hash.slice(-8)} ↗
							</a>
						</div>
						<div class="log-time">
							{new Date(alert.timestamp * 1000).toLocaleTimeString()}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background-color: #111827;
		color: white;
		font-family: 'Inter', sans-serif;
	}

	.dashboard-container {
		padding: 2rem;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #374151;
		padding-bottom: 1rem;
	}

	h1 { margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.5px; }

	.live-indicator {
		color: #22c55e;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }

	.grid-layout {
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-template-rows: 300px 1fr;
		gap: 1.5rem;
		height: 100%;
	}

	.card {
		background: #1f2937;
		border-radius: 1rem;
		padding: 1.5rem;
		border: 1px solid #374151;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	h2 { margin: 0 0 1rem 0; font-size: 1.1rem; color: #9ca3af; font-weight: 500; }

	/* Monitor Widget */
	.monitor-card {
		color: white;
		transition: background-color 0.5s ease;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.monitor-content { margin-top: 1rem; }
	.big-status { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: 1px; }
	.monitor-details p { margin: 0.25rem 0; opacity: 0.8; }

	/* Graph Widget */
	.graph-card { grid-column: 2; }
	.chart-container { position: relative; flex: 1; }

	/* Logs Widget */
	.logs-card {
		grid-column: 1 / span 2;
		overflow: hidden;
	}
	.logs-list {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.log-item {
		background: #111827;
		padding: 0.75rem;
		border-radius: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: monospace;
		font-size: 0.9rem;
	}
	.log-status {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		background: #374151;
		color: #d1d5db;
		text-transform: uppercase;
		font-weight: bold;
		font-size: 0.8rem;
	}
	.log-status.red { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
	.log-status.purple { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
	.log-status.orange { background: rgba(249, 115, 22, 0.2); color: #f97316; }

	.log-status.yellow { background: rgba(234, 179, 8, 0.2); color: #eab308; } /* stress */
	.log-status.blue { background: rgba(59, 130, 246, 0.2); color: #3b82f6; } /* drowsy */
	.log-status.green { background: rgba(34, 197, 94, 0.2); color: #22c55e; } /* safe */
	.log-status.attestation-streak { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid #22c55e; } /* SAFE_STREAK_ATTESTATION - lighter green */
	.log-status.attestation-periodic { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid #3b82f6; } /* PERIODIC_SAFE_ATTESTATION - lighter blue */

	.log-hash a { color: #60a5fa; text-decoration: none; }
	.log-hash a:hover { text-decoration: underline; }
	
	.log-time { color: #6b7280; }
	.empty-logs { text-align: center; color: #6b7280; padding: 2rem; font-style: italic; }
</style>