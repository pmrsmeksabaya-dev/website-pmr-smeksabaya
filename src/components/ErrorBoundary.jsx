import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔥 ErrorBoundary caught:', error, errorInfo);
    // Kirim ke analytics / monitoring
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Oops! Ada yang error
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Maaf, terjadi kesalahan. Tim kami sudah diberitahu.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-pmi text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}