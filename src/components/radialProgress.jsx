export const RadialProgress = ({ value, label }) => {
    const degree = `${(value / 100) * 360}deg`;
    return (
      <div className="relative w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-green-400 to-green-600" style={{ clipPath: `polygon(50% 50%, 100% 0, 100% 100%)`, transform: `rotate(${degree})` }} />
        <div className="z-10 text-center">
          <div className="text-sm font-bold text-gray-800">{label}</div>
          <div className="text-xs text-gray-500">{value}%</div>
        </div>
      </div>
    );
  };
  