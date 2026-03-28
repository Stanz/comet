import { SiDiscord } from "@icons-pack/react-simple-icons";

export const DiscordInviteButton = () => {
  return (
    <a
      href="https://discord.com/invite/UJEqpT42nb"
      target="_blank"
      rel="noreferrer"
      className="px-4 py-1.5 rounded-full bg-[#5865f2] border border-[#5865f2] hover:bg-[#4752c4] hover:border-[#4752c4] text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-[#5865f2]/20 active:scale-95 whitespace-nowrap"
    >
      <SiDiscord className="w-4 h-4 flex-shrink-0" />
      Discord
    </a>
  );
};
