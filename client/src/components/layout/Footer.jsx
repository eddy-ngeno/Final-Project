import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link to="/about" className="text-gray-400 hover:text-gray-300">
            About
          </Link>
          <Link to="/privacy" className="text-gray-400 hover:text-gray-300">
            Privacy
          </Link>
          <Link to="/terms" className="text-gray-400 hover:text-gray-300">
            Terms
          </Link>
          <Link to="/support" className="text-gray-400 hover:text-gray-300">
            Support
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FD</span>
            </div>
            <span className="font-bold text-xl text-white">FarmDirect</span>
          </div>
          <p className="mt-2 text-center text-xs leading-5 text-gray-400 md:text-left">
            &copy; 2024 FarmDirect. Connecting farmers with buyers across Kenya.
          </p>
        </div>
      </div>
    </footer>
  );
}