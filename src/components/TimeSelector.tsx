import MatrixSelect from "./MatrixSelect";

export default function TimeSelector({
  value,
  unit,
  onChange,
  onUnitChange,
}: any) {
  const handleChange = (val: number) => {
    if (isNaN(val)) return;
    onChange(Math.max(1, val)); // 🔒 clamp to minimum 1
  };

  const increase = () => handleChange(value + 1);
  const decrease = () => handleChange(value - 1);

  return (
    <div className="flex gap-2 w-full">
      {/* NUMBER INPUT */}
      <div className="flex items-center border border-(--border)/30 flex-1">
        <button
          onClick={decrease}
          className="px-3 py-2 border-r border-(--border)/30 hover:bg-(--bg-hover) hover:text-(--text-on-hover)"
        >
          -
        </button>

        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full text-center bg-black outline-none appearance-none"
        />

        <button
          onClick={increase}
          className="px-3 py-2 border-l border-(--border)/30 hover:bg-(--bg-hover) hover:text-(--text-on-hover)"
        >
          +
        </button>
      </div>

      {/* CUSTOM SELECT */}
      <MatrixSelect
        value={unit}
        onChange={onUnitChange}
        options={[
          { label: "Seconds", value: "seconds" },
          { label: "Minutes", value: "minutes" },
          { label: "Hours", value: "hours" },
          { label: "Days", value: "days" },
        ]}
      />
    </div>
  );
}