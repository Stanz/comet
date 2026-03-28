import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: unknown;
}

/** Generic error boundary — renders a simple error card on any uncaught render error. */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const msg = this.props.fallbackMessage ?? "Something went wrong rendering this section.";
      const errorMsg =
        this.state.error instanceof Error ? this.state.error.message : String(this.state.error);

      return (
        <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-200 mb-2">Error</h2>
          <p className="text-gray-400 max-w-md">{msg}</p>
          {errorMsg && (
            <div className="mt-4 text-xs font-mono text-red-500/70 p-4 bg-red-500/10 rounded-lg max-w-xl text-left overflow-auto break-all">
              {errorMsg}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
