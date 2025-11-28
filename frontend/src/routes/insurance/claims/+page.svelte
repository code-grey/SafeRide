<script>
    import InsuranceSidebar from "$lib/components/InsuranceSidebar.svelte";
    import Header from "$lib/components/Header.svelte";
    import { isMobileMenuOpen } from "$lib/stores";
    import claimsData from "$lib/mock_claims.json";
    import { fade, fly } from "svelte/transition";
    import {
        faClock,
        faCheckCircle,
        faTimesCircle,
    } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    let selectedClaim = $state(null);
    let isDecrypting = $state(false);

    function openClaim(claim) {
        isDecrypting = true;
        selectedClaim = null;
        setTimeout(() => {
            isDecrypting = false;
            selectedClaim = claim;
        }, 1500); // Simulate decryption delay
    }

    function closeClaim() {
        selectedClaim = null;
    }

    function getStatusColor(status) {
        if (status === "Pending Review") return "text-yellow-500";
        if (status === "Approved") return "text-green-500";
        if (status === "Flagged") return "text-red-500";
        return "text-gray-500";
    }
</script>

<div class="flex h-screen bg-dark-background overflow-hidden relative">
    <InsuranceSidebar />
    {#if $isMobileMenuOpen}
        <button
            class="fixed inset-0 z-20 bg-black opacity-50 md:hidden w-full h-full cursor-default"
            onclick={() => isMobileMenuOpen.set(false)}
            aria-label="Close Menu"
        ></button>
    {/if}

    <div class="flex flex-col flex-1 relative z-10 w-full">
        <Header />
        <main class="flex-1 overflow-y-auto p-6 md:p-8 relative text-white">
            <!-- Header -->
            <div class="mb-8">
                <span
                    class="text-accent-blue font-mono text-xs tracking-[0.2em] uppercase block mb-2"
                    >Claims Processing</span
                >
                <h1 class="text-4xl md:text-5xl font-light tracking-tight">
                    Claims Investigation
                </h1>
            </div>

            {#if isDecrypting}
                <div
                    class="flex flex-col items-center justify-center h-96"
                    in:fade
                >
                    <div
                        class="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-6"
                    ></div>
                    <h2 class="text-xl font-mono text-white animate-pulse">
                        Decrypting Blockchain Record...
                    </h2>
                    <p class="text-white/40 text-sm mt-2">
                        Verifying Digital Signature & Biometric Hash
                    </p>
                </div>
            {:else if selectedClaim}
                <!-- CLAIM DETAIL VIEW -->
                <div
                    class="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    in:fly={{ y: 20, duration: 500 }}
                >
                    <!-- Left Column: Incident Report -->
                    <div class="lg:col-span-2 space-y-6">
                        <button
                            onclick={closeClaim}
                            class="text-white/60 hover:text-white flex items-center gap-2 mb-4 transition-colors"
                        >
                            ← Back to Inbox
                        </button>

                        <div
                            class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-lg"
                        >
                            <div class="flex justify-between items-start mb-6">
                                <div>
                                    <h2
                                        class="text-2xl font-bold text-white mb-2"
                                    >
                                        Claim #{selectedClaim.id}
                                    </h2>
                                    <p class="text-white/60">
                                        Policy Holder: <span
                                            class="text-white font-semibold"
                                            >{selectedClaim.policy_holder}</span
                                        >
                                    </p>
                                </div>
                                <div
                                    class={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${selectedClaim.ai_score > 80 ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
                                >
                                    {selectedClaim.ai_verdict}
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-8">
                                <div class="bg-white/5 p-4 rounded-lg">
                                    <span
                                        class="block text-xs text-white/40 uppercase tracking-wider mb-1"
                                        >Incident Type</span
                                    >
                                    <span class="text-lg text-white font-medium"
                                        >{selectedClaim.incident_type}</span
                                    >
                                </div>
                                <div class="bg-white/5 p-4 rounded-lg">
                                    <span
                                        class="block text-xs text-white/40 uppercase tracking-wider mb-1"
                                        >Amount</span
                                    >
                                    <span class="text-lg text-white font-medium"
                                        >{selectedClaim.amount}</span
                                    >
                                </div>
                            </div>

                            <h3 class="text-lg font-bold text-white mb-4">
                                Truth Timeline ™
                            </h3>
                            <div
                                class="space-y-4 relative pl-4 border-l-2 border-white/10"
                            >
                                {#each selectedClaim.timeline as event}
                                    <div class="relative pl-6">
                                        <div
                                            class={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${event.status === "safe" ? "bg-green-500 border-green-900" : event.status === "HEALTH_CRITICAL" ? "bg-red-500 border-red-900 animate-pulse" : "bg-yellow-500 border-yellow-900"}`}
                                        ></div>
                                        <span
                                            class="text-xs font-mono text-white/40 block mb-1"
                                            >{event.time}</span
                                        >
                                        <p class="text-white font-medium">
                                            {event.event}
                                        </p>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: AI Judge -->
                    <div class="lg:col-span-1">
                        <div
                            class="bg-dark-surface/50 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-lg sticky top-8"
                        >
                            <h3 class="text-xl font-bold text-white mb-6">
                                AI Confidence Score
                            </h3>

                            <div
                                class="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center"
                            >
                                <svg class="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        stroke-width="12"
                                        fill="transparent"
                                        class="text-white/10"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        stroke-width="12"
                                        fill="transparent"
                                        class={`${selectedClaim.ai_score > 80 ? "text-green-500" : "text-red-500"} transition-all duration-1000`}
                                        stroke-dasharray={2 * Math.PI * 88}
                                        stroke-dashoffset={2 *
                                            Math.PI *
                                            88 *
                                            (1 - selectedClaim.ai_score / 100)}
                                    />
                                </svg>
                                <div
                                    class="absolute inset-0 flex flex-col items-center justify-center"
                                >
                                    <span class="text-5xl font-black text-white"
                                        >{selectedClaim.ai_score}%</span
                                    >
                                    <span
                                        class="text-xs text-white/40 uppercase tracking-wider mt-1"
                                        >Confidence</span
                                    >
                                </div>
                            </div>

                            <div class="space-y-3">
                                <button
                                    class="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-wider transition-colors shadow-lg shadow-green-900/20"
                                >
                                    Approve Claim
                                </button>
                                <button
                                    class="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider transition-colors border border-white/10"
                                >
                                    Flag for Investigation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <!-- CLAIMS LIST -->
                <div class="space-y-6" in:fade>
                    {#each claimsData as claim}
                        <button
                            onclick={() => openClaim(claim)}
                            class="w-full text-left bg-dark-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-lg hover:bg-white/5 transition-all duration-300 group"
                        >
                            <div
                                class="flex flex-col md:flex-row md:items-center md:justify-between mb-4"
                            >
                                <div class="flex items-center mb-4 md:mb-0">
                                    <div class="mr-4 text-2xl">
                                        {#if claim.status === "Pending Review"}
                                            <span class="text-yellow-500"
                                                ><Fa icon={faClock} /></span
                                            >
                                        {:else if claim.status === "Approved"}
                                            <span class="text-green-500"
                                                ><Fa
                                                    icon={faCheckCircle}
                                                /></span
                                            >
                                        {:else}
                                            <span class="text-red-500"
                                                ><Fa
                                                    icon={faTimesCircle}
                                                /></span
                                            >
                                        {/if}
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-medium">
                                            Claim {claim.id}
                                        </h3>
                                        <p
                                            class="text-gray-400 text-sm font-light"
                                        >
                                            Policy Holder: {claim.policy_holder}
                                        </p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-light mb-1">
                                        {claim.amount}
                                    </div>
                                    <span
                                        class={`font-mono text-xs uppercase ${getStatusColor(claim.status)}`}
                                    >
                                        {claim.status}
                                    </span>
                                </div>
                            </div>

                            <div class="border-t border-white/10 pt-4">
                                <p class="text-gray-300 mb-2">
                                    {claim.description}
                                </p>
                                <div class="flex justify-between items-center">
                                    <p class="text-gray-500 text-sm font-light">
                                        Filed: {claim.date}
                                    </p>
                                    <span
                                        class="text-accent-blue text-sm font-bold group-hover:translate-x-1 transition-transform"
                                        >Analyze with AI →</span
                                    >
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            {/if}
        </main>
    </div>
</div>
