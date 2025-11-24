import React, { ReactNode, ErrorInfo, Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 text-stone-900 font-serif p-4">
          <h1 className="text-3xl mb-4">Temporarily Unavailable</h1>
          <p className="text-stone-600 mb-6 text-center max-w-md">The site encountered an error. Please ensure you have a stable connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-stone-900 text-white rounded hover:bg-stone-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);