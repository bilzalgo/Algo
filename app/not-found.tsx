import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">404 - Page Not Found</h2>
      <p className="text-neutral-600 mb-6 max-w-sm">
        The page or asset you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
