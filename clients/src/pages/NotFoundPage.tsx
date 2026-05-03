import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl text-gray-900 mb-4">404</h1>
        <h2 className="text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#14b8a6] text-white rounded-lg hover:bg-[#14b8a6]/90 transition-colors"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
