import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import appCss from "../styles.css?url";
import Stars from "../components/Stars";
import { SupportComet } from "../components/ui/SupportComet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { SettingsProvider, useSettings } from "../hooks/useSettings.tsx";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
      {
        title: "Comet - Stremio's fastest torrent/debrid search add-on.",
      },
      {
        name: "theme-color",
        content: "#6b6ef8",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <RootDocument>{children}</RootDocument>
    </SettingsProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { showStars } = useSettings();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col justify-center items-center min-h-screen m-0 font-sans text-white [overflow-wrap:anywhere]">
        <QueryClientProvider client={queryClient}>
          {showStars && <Stars />}
          <SupportComet />

          <div className="root">{children}</div>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: "Tanstack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: "Tanstack Form",
                render: <FormDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  );
}
