import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ========== ERROR BOUNDARY ==========
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Application Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <div className="text-6xl mb-4">💀</div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Terjadi Kesalahan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Maaf, terjadi kesalahan pada aplikasi. Tim kami telah diberitahu.
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

// ========== PERFORMANCE MONITORING ==========
const reportWebVitals = (metric) => {
  // Kirim ke analytics (opsional)
  console.log('📊 Web Vitals:', metric);
  
  // Kalo pake Vercel Analytics, udah otomatis
  if (window.gtag) {
    window.gtag('event', 'web_vitals', {
      metric_name: metric.name,
      metric_value: metric.value,
    });
  }
};

// ========== RENDER ==========
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// ========== REPORT WEB VITALS (Opsional) ==========
// reportWebVitals(console.log);