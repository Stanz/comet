import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

export const CometAccordion = ({
  children,
  ...props
}: React.ComponentProps<typeof Accordion.Root>) => (
  <Accordion.Root {...props} className={`w-full space-y-4 ${props.className || ""}`}>
    {children}
  </Accordion.Root>
);

CometAccordion.Item = ({
  children,
  title,
  icon: Icon,
  value,
  ...props
}: React.ComponentProps<typeof Accordion.Item> & {
  title: string;
  icon?: React.ElementType;
}) => (
  <Accordion.Item
    value={value}
    className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.02]"
    {...props}
  >
    <Accordion.Trigger className="w-full flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors group">
      <span className="font-bold text-lg flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
        {title}
      </span>
      <ChevronDown className="w-5 h-5 text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
    </Accordion.Trigger>
    <Accordion.Panel className="p-4 pt-0 animate-in fade-in slide-in-from-top-2">
      {children}
    </Accordion.Panel>
  </Accordion.Item>
);
