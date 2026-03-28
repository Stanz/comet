import { Dialog } from "@base-ui/react/dialog";
import { Heart, X } from "lucide-react";
import { SiGithub, SiKofi } from "@icons-pack/react-simple-icons";
import { CometButton } from "./CometButton";

export const SupportComet = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="fixed top-5 right-5 z-[1000] bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-[45px] h-[45px] flex items-center justify-center cursor-pointer transition-all hover:bg-white/20 hover:scale-110 active:scale-95 group shadow-lg shadow-black/20 focus:outline-none focus:ring-2 focus:ring-red-500/50">
        <Heart className="w-5.5 h-5.5 text-[#ff4757] fill-current group-hover:drop-shadow-[0_0_8px_rgba(255,71,87,0.5)] transition-all" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1002] w-full max-w-[400px] bg-[#1e2227] border border-white/10 rounded-2xl shadow-2xl p-6 focus:outline-none animate-in zoom-in-95 fade-in duration-300">
          <div className="flex flex-col items-center text-center gap-4">
            <Dialog.Close className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors focus:outline-none">
              <X className="w-5 h-5" />
            </Dialog.Close>

            <div className="text-4xl animate-heartbeat">❤️</div>

            <div className="space-y-1.5">
              <Dialog.Title className="text-xl font-bold text-white leading-tight">
                Support Comet
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-400 leading-relaxed px-4">
                Comet is a passion project fueled by late nights and coffee. Your support helps keep
                the lights on and the updates rolling!
              </Dialog.Description>
            </div>

            <div className="w-full flex flex-col gap-3 mt-4">
              <a
                href="https://github.com/sponsors/g0ldyy"
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <CometButton variant="secondary" className="w-full py-2.5 text-sm">
                  <SiGithub className="w-4 h-4" />
                  GitHub Sponsors
                </CometButton>
              </a>
              <a
                href="https://ko-fi.com/g0ldyy"
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <CometButton
                  variant="secondary"
                  className="w-full py-2.5 text-sm border-[#ff5e5b]/30 hover:border-[#ff5e5b]/60 text-[#ff5e5b] hover:bg-[#ff5e5b]/10"
                >
                  <SiKofi className="w-4 h-4" />
                  Ko-fi
                </CometButton>
              </a>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
