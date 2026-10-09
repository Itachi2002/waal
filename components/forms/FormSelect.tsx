"use client";

type Option = { value: string; label: string };

export function FormSelect({
  id,
  label,
  value,
  onChange,
  options,
  error,
  hint,
  emptyLabel = "Nog niet ingevuld",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  error?: string;
  hint?: string;
  emptyLabel?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="w-full min-h-[44px] rounded border border-[#c5ced6] bg-white px-3"
      >
        <option value="">{emptyLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-[#555]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
