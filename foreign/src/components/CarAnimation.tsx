import React from 'react';
import './CarAnimation.css';
import { ReactComponent as CarSvg } from '../assets/car.svg';

const CarAnimation = () => {
  const cars = [
    { id: 1, style: { bottom: '10%', animationDuration: '15s', animationDelay: '0s', width: '6rem' } },
    { id: 2, style: { bottom: '30%', animationDuration: '20s', animationDelay: '5s', width: '4rem', opacity: 0.8 } },
    { id: 3, style: { bottom: '50%', animationDuration: '12s', animationDelay: '8s', width: '8rem', opacity: 0.6 } },
    { id: 4, style: { bottom: '70%', animationDuration: '18s', animationDelay: '12s', width: '5rem', opacity: 0.7 } },
  ];

  return (
    <div className="car-animation">
      {cars.map((car) => (
        <div key={car.id} className="car" style={car.style}>
          <CarSvg />
        </div>
      ))}
    </div>
  );
};

export default CarAnimation;
