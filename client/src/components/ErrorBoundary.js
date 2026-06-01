import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export class ErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { error: null }
        });
        Object.defineProperty(this, "reset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => this.setState({ error: null })
        });
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, info) {
        // Surface in console so dev can see the real stack.
        // eslint-disable-next-line no-console
        console.error("ErrorBoundary caught:", error, info);
    }
    render() {
        if (this.state.error) {
            if (this.props.fallback)
                return this.props.fallback(this.state.error, this.reset);
            return (_jsxs("div", { className: "rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-6 text-sm", children: [_jsx("p", { className: "font-semibold text-red-700 dark:text-red-300", children: "Something went wrong." }), _jsx("p", { className: "mt-1 text-red-600 dark:text-red-400", children: this.state.error.message }), _jsx("button", { type: "button", onClick: this.reset, className: "mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold", children: "Retry" })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
