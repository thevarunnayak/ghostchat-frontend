export default function TimeSelector({
  value,
  unit,
  onChange,
  onUnitChange,
}: any) {
  const increase = () => onChange(value + 1);
  const decrease = () => {
    if (value > 1) onChange(value - 1);
  };

  return (
    <div className="flex gap-2 w-full">
      
      {/* NUMBER INPUT */}
      <div className="flex items-center border border-green-500/30 flex-1">
        
        <button
          onClick={decrease}
          className="px-3 py-2 border-r border-green-500/30 hover:bg-green-500 hover:text-black"
        >
          -
        </button>

        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full text-center bg-black outline-none appearance-none"
        />

        <button
          onClick={increase}
          className="px-3 py-2 border-l border-green-500/30 hover:bg-green-500 hover:text-black"
        >
          +
        </button>
      </div>

      {/* SELECT */}
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="flex-1 bg-black border border-green-500/30 outline-none px-2"
      >
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
      </select>
    </div>
  );
}