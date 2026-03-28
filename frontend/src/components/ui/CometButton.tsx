import { Button } from "@base-ui/react";

export const CometButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ComponentProps<typeof Button> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20",
    secondary: "bg-white/5 border border-white/10 hover:border-white/20 text-white",
    danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
  };

  return (
    <Button
      className={`px-6 py-3 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};
