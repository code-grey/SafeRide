<script>
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Header from "$lib/components/Header.svelte";
  import WellnessWidget from "$lib/components/WellnessWidget.svelte";
  import IncidentAlert from "$lib/components/IncidentAlert.svelte";
  import IncidentHistory from "$lib/components/IncidentHistory.svelte";
  import RoutePlanner from "$lib/components/RoutePlanner.svelte";
  import ParticleBackground from "$lib/components/ParticleBackground.svelte";
  import { isMobileMenuOpen } from "$lib/stores";
  import {
    faBed,
    faBolt,
    faHeartbeat,
  } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  let vehicleId = "v-101";
  let telemetry = $state({
    status: "Loading...",
    driver_status: "",
    vehicle_status: "",
    lat: 0,
    long: 0,
    confidence: 0,
    timestamp: 0,
    heart_rate: 0, // Initial value
  });
  /** @type {any[]} */
  let history = $state([]);
  /** @type {any[]} */
  let alerts = $state([]);
  let error = $state("");

  /** @type {any} */
  let chart;
  /** @type {any} */
  let chartCanvas;

  async function fetchData() {
    try {
      const resStatus = await fetch(
        `http://localhost:8080/api/status/${vehicleId}`,
      );
      if (resStatus.ok) {
        telemetry = await resStatus.json();
      } else {
        telemetry = {
          status: "Offline",
          driver_status: "unknown",
          vehicle_status: "unknown",
          lat: 0,
          long: 0,
          confidence: 0,
          timestamp: 0,
        };
      }

      const resHistory = await fetch(
        `http://localhost:8080/api/history/${vehicleId}`,
      );
      if (resHistory.ok) {
        const newHistory = await resHistory.json();
        if (
          newHistory.length !== history.length ||
          (newHistory.length > 0 &&
            history.length > 0 &&
            newHistory[0]?.timestamp !== history[0]?.timestamp)
        ) {
          history = newHistory;
          updateChart();
        }
      } else {
        history = [];
      }

      const resAlerts = await fetch(
        `http://localhost:8080/api/alerts/${vehicleId}`,
      );
      if (resAlerts.ok) alerts = await resAlerts.json();
      else alerts = [];

      error = "";
    } catch (e) {
      console.error("System Offline", e);
      error = "System Offline";
      telemetry = {
        status: "Offline",
        driver_status: "unknown",
        vehicle_status: "unknown",
        lat: 0,
        long: 0,
        confidence: 0,
        timestamp: 0,
      };
      history = [];
      alerts = [];
    }
  }

  function updateChart() {
    if (!chart) return;
    console.log("updateChart called. History length:", history.length); // DEBUG

    /** @type {Record<string, number>} */
    const statusMap = {
      safe: 0,
      distracted: 1,
      "harsh turn": 2,
      drowsy: 3,
      "hard braking": 4,
      fatigue: 5,
    };
    const labels = history.map((h) =>
      new Date(h.timestamp * 1000).toLocaleTimeString(),
    );

    // Driver Data (Source: ai or legacy/unknown)
    const driverData = history.map((h) => {
      const val =
        h.source === "ai" || !h.source
          ? statusMap[h.status.toLowerCase()] || 0
          : null;
      return val;
    });

    // Vehicle Data (Source: iot)
    const vehicleData = history.map((h) => {
      const val =
        h.source === "iot" ? statusMap[h.status.toLowerCase()] || 0 : null;
      return val;
    });

    console.log("Driver Data:", driverData.filter((v) => v !== null).length); // DEBUG
    console.log("Vehicle Data:", vehicleData.filter((v) => v !== null).length); // DEBUG

    chart.data.labels = labels;
    chart.data.datasets[0].label = "Driver Risk";
    chart.data.datasets[0].data = driverData;

    // Add Vehicle Dataset if missing
    if (!chart.data.datasets[1]) {
      console.log("Adding Vehicle Dataset"); // DEBUG
      chart.data.datasets.push({
        label: "Vehicle Risk",
        data: [],
        borderColor: "#a855f7", // Purple
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        tension: 0.4,
        fill: true,
        spanGaps: true, // Fix for disjointed lines
      });
    }
    chart.data.datasets[1].data = vehicleData;

    chart.update();
  }

  $effect(() => {
    // Chart Init
    if (chartCanvas && !chart) {
      const ctx = chartCanvas.getContext("2d");
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Risk Level",
              data: [],
              borderColor: "#60a5fa",
              backgroundColor: "rgba(96, 165, 250, 0.2)",
              tension: 0.4,
              fill: true,
              spanGaps: true, // Fix for disjointed lines
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                callback: function (value) {
                  const labels = [
                    "Safe",
                    "Distracted",
                    "Harsh Turn",
                    "Drowsy",
                    "Hard Braking",
                    "FATIGUE",
                  ];
                  return labels[value] || "";
                },
                color: "#9ca3af",
              },
              grid: { color: "#374151" },
            },
            x: { display: false },
          },
          plugins: { legend: { display: false } },
          animation: false,
        },
      });
    }

    // Initial Fetch
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(interval);
      if (chart) {
        chart.destroy();
        chart = null;
      }
    };
  });

  // Computed derived state
  const isFatigue = $derived(telemetry.status?.toLowerCase() === "fatigue");
  const isDistracted = $derived(
    telemetry.status?.toLowerCase() === "distracted",
  );
  const isSafe = $derived(telemetry.status?.toLowerCase() === "safe");

  const alertnessLevel = $derived(
    isSafe ? "High" : isFatigue ? "Critical Low" : "Moderate",
  );
  const fatigueLevel = $derived(
    isFatigue ? "High" : isDistracted ? "Medium" : "Low",
  );
  const healthStatus = $derived(
    telemetry.heart_rate && telemetry.heart_rate > 120
      ? `${telemetry.heart_rate} BPM`
      : isSafe
        ? "Normal"
        : "Abnormal",
  );
  const isHealthCritical = $derived(
    telemetry.heart_rate && telemetry.heart_rate > 120,
  );

  // Dynamic Background Color for "Driver Monitor" Widget
  const driverMonitorBg = $derived(
    (() => {
      const s = telemetry.driver_status
        ? telemetry.driver_status.toLowerCase()
        : "unknown";
      if (s === "fatigue") return "bg-red-600 animate-pulse";
      if (s === "drowsy") return "bg-blue-600 animate-pulse";
      if (s === "distracted") return "bg-orange-500";
      if (s === "safe") return "bg-green-500";
      return "bg-gray-700";
    })(),
  );

  // Dynamic Background Color for "Vehicle Monitor" Widget
  const vehicleMonitorBg = $derived(
    (() => {
      const s = telemetry.vehicle_status
        ? telemetry.vehicle_status.toLowerCase()
        : "unknown";
      if (s === "harsh turn") return "bg-purple-600 animate-pulse";
      if (s === "hard braking") return "bg-yellow-500 animate-pulse";
      if (s === "safe") return "bg-green-500";
      return "bg-gray-700";
    })(),
  );
</script>

<div class="flex h-screen bg-dark-background overflow-hidden relative">
  <Sidebar />
  <!-- Mobile Overlay -->
  {#if $isMobileMenuOpen}
    <button
      class="fixed inset-0 z-20 bg-black opacity-50 md:hidden w-full h-full cursor-default"
      onclick={() => isMobileMenuOpen.set(false)}
      aria-label="Close Menu"
    ></button>
  {/if}

  <div class="flex flex-col flex-1 relative z-10 w-full">
    <Header />
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative">
      <div class="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <ParticleBackground />
      </div>

      <div class="relative z-10 space-y-8">
        <!-- Header -->
        <div>
          <span
            class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2"
            >System Dashboard</span
          >
          <h1 class="text-4xl md:text-5xl font-light tracking-tight text-white">
            Driver Wellness Monitor
          </h1>
        </div>

        <!-- TOP ROW: Live Monitor + Graph -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 1. LIVE MONITOR (Split: Driver & Vehicle) -->
          <div class="lg:col-span-1 flex flex-col gap-6">
            <!-- Driver Status -->
            <div
              class={`flex-1 rounded-2xl p-8 text-center shadow-lg transition-colors duration-500 flex flex-col justify-center items-center ${driverMonitorBg}`}
            >
              <h2
                class="text-xl font-bold text-white uppercase tracking-widest mb-4"
              >
                Driver Status
              </h2>
              <div class="text-5xl font-black text-white tracking-tighter mb-4">
                {telemetry.driver_status?.toUpperCase() || "UNKNOWN"}
              </div>
              <p class="text-white/80 text-lg">
                Confidence: {(telemetry.confidence * 100).toFixed(0)}%
              </p>
            </div>

            <!-- Vehicle Status -->
            <div
              class={`rounded-2xl p-6 text-center shadow-lg transition-colors duration-500 flex flex-col justify-center items-center ${vehicleMonitorBg}`}
            >
              <h2
                class="text-sm font-bold text-white uppercase tracking-widest mb-2"
              >
                Vehicle Status
              </h2>
              <div class="text-3xl font-black text-white tracking-tighter">
                {telemetry.vehicle_status?.toUpperCase() || "UNKNOWN"}
              </div>
            </div>
          </div>
          <!-- 2. GRAPH (Behavior History) -->
          <div
            class="lg:col-span-2 bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl h-full"
          >
            <h3 class="text-xl font-bold text-white mb-4">
              Behavior Analysis (Last 50s)
            </h3>
            <div class="relative h-64 w-full">
              <canvas bind:this={chartCanvas}></canvas>
            </div>
          </div>
        </div>

        <!-- 3. Wellness Widgets -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WellnessWidget
            icon={faBed}
            label="Fatigue Level"
            value={fatigueLevel}
            color={isFatigue ? "text-red-500" : "text-green-500"}
          />
          <WellnessWidget
            icon={faBolt}
            label="Alertness"
            value={alertnessLevel}
            color={isSafe ? "text-green-500" : "text-yellow-500"}
          />
          <WellnessWidget
            icon={faHeartbeat}
            label="Health Stats"
            value={healthStatus}
            color={isHealthCritical
              ? "text-red-500"
              : isSafe
                ? "text-green-500"
                : "text-red-500"}
          />
        </div>

        <!-- 4. Incident Management -->
        <div>
          {#if !isSafe && telemetry.status !== "Loading..." && telemetry.status !== "Offline"}
            <div class="mb-6">
              <IncidentAlert />
            </div>
          {/if}
          <div class="flex justify-between items-end mb-4">
            <h3 class="text-xl font-bold text-white">Recent Activity</h3>
            <a
              href="/blockchain"
              class="text-accent-blue hover:underline text-sm"
              >View Full Blockchain Ledger →</a
            >
          </div>
          <IncidentHistory alerts={alerts.slice(0, 10)} />
        </div>

        <!-- 5. Route Planner -->
        <RoutePlanner />
      </div>
    </main>
  </div>
</div>
```
