import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
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
                <div style={{ padding: "20px", textAlign: "center", color: "#333", fontFamily: "sans-serif" }}>
                    <h2 style={{ color: "#e53e3e" }}>Oops, there was an error!</h2>
                    <p>Something went wrong. Please try refreshing the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: "10px 20px", background: "#38a169", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
