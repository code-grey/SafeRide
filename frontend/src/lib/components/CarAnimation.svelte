<script>
  import './CarAnimation.css';
  import CarSvg from './CarSvg.svelte';

  const cars = [
    { id: 1, style: "bottom: 10%; animation-duration: 15s; animation-delay: 0s; width: 6rem;" },
    { id: 2, style: "bottom: 30%; animation-duration: 20s; animation-delay: 5s; width: 4rem; opacity: 0.8;" },
    { id: 3, style: "bottom: 50%; animation-duration: 12s; animation-delay: 8s; width: 8rem; opacity: 0.6;" },
    { id: 4, style: "bottom: 70%; animation-duration: 18s; animation-delay: 12s; width: 5rem; opacity: 0.7;" },
  ];
</script>

<div class="car-animation">
  {#each cars as car (car.id)}
    <div class="car" style={car.style}>
      <CarSvg />
    </div>
  {/each}
</div>
