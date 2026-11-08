import React, { useState, useEffect } from 'react';

export const CountdownTimer = ({ targetDate = '2026-11-20T10:00:00' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-3xl mx-auto w-full px-4">
      {units.map((unit, idx) => (
        <div
          key={idx}
          className="relative group overflow-hidden rounded-2xl p-4 md:p-6 text-center bg-navy-850/80 border border-cobalt-500/20 backdrop-blur-xl shadow-glass transition-all duration-300 hover:border-cobalt-400/50 hover:shadow-glow-cobalt"
        >
          {/* Subtle top glow bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cobalt-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cobalt-300 font-display tracking-tight">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-xs md:text-sm font-semibold tracking-widest text-cobalt-400 uppercase">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
