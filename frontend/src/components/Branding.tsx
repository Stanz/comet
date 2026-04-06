import { DiscordInviteButton } from "./ui/DiscordInviteButton";

export default function Branding({
  title,
  subtitle,
  customHtml,
  className,
}: {
  title?: string;
  subtitle?: string;
  customHtml?: string;
  className?: string;
}) {
  return (
    <div className={className || "text-center w-full mb-7 mt-12 mx-auto"}>
      <div
        className={`flex items-center gap-[15px] mb-2.5 ${!className || className.includes("text-center") ? "justify-center" : "justify-start"}`}
      >
        <h1 className="text-[calc(1.375rem+1.5vw)] font-medium m-0 flex items-center leading-none text-gray-900 dark:text-white whitespace-nowrap">
          <img
            className="w-[1em] h-[1em] align-middle mr-2.5"
            src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f4ab/512.gif"
            alt="Comet Emoji"
            width={512}
            height={512}
            fetchPriority="high"
          />
          {title || "Comet"}
        </h1>
        {!subtitle && <DiscordInviteButton />}
      </div>
      {subtitle && <p className="text-[1.1rem] text-gray-900 dark:text-white m-0">{subtitle}</p>}
      {customHtml && <div dangerouslySetInnerHTML={{ __html: customHtml }} />}
    </div>
  );
}
