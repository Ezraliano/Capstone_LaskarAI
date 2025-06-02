import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 h-[calc(100vh-200px)] flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="btn btn-primary flex items-center gap-2"
          >
            <Home size={18} />
            Go Home
          </Link>
          <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;