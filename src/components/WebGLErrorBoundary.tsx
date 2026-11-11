import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGLErrorBoundary caught error in 3D canvas stage:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      const isWebGLError = this.state.error?.message?.includes('WebGL') || this.state.error?.message?.includes('context');

      return (
        <div className={`flex flex-col items-center justify-center p-6 text-center observatory-panel rounded-2xl ${this.props.className || 'w-full h-full min-h-[300px]'}`}>
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-1">
            {this.props.fallbackTitle || (isWebGLError ? '3D Graphics Acceleration Paused' : 'Stage Visualizer Offline')}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mb-5 leading-relaxed">
            {this.props.fallbackMessage || (isWebGLError
              ? 'Your browser temporarily ran out of hardware WebGL graphics channels or experienced a GPU driver reload. You can retry activating 3D mode below.'
              : 'An unexpected display error occurred while rendering the interactive 3D visualization.')}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 observatory-control min-h-11 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restore 3D Stage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
