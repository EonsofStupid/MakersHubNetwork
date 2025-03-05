
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 text-center border border-destructive/20 rounded-md bg-background/40 backdrop-blur-md">
          <h2 className="text-lg font-bold text-destructive">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            {this.state.error?.message || "Please try again later"}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
