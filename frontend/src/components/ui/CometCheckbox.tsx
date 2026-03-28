import { Checkbox } from "@base-ui/react/checkbox";

export const CometCheckbox = ({
  label,
  description,
  error = false,
  autoFocus,
  checked,
  onCheckedChange,
  className = "",
}: {
  id?: string;
  label?: string;
  description?: string;
  error?: string | false;
  autoFocus?: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) => (
  <label className={`flex items-start gap-3 group cursor-pointer ${className}`}>
    <Checkbox.Root
      autoFocus={autoFocus}
      checked={checked}
      onCheckedChange={(val) => onCheckedChange(!!val)}
      className="w-5 h-5 border-2 border-white/20 rounded-lg flex items-center justify-center transition-all group-hover:border-indigo-500/50 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
    >
      <Checkbox.Indicator className="text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="w-3 h-3"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </Checkbox.Indicator>
    </Checkbox.Root>
    <div className="flex flex-col">
      {label && (
        <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
          {label}
        </span>
      )}
      {description && (
        <span className="text-xs text-gray-500 leading-relaxed max-w-[280px]">{description}</span>
      )}
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  </label>
);
