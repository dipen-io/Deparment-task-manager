// src/pages/RouteErrorPage.tsx
import { useRouteError, useNavigate } from "react-router";

export function RouteErrorPage() {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  console.error("Caught by Route Error Boundary:", error);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800">Something went wrong</h1>
        <p className="text-gray-500 mt-2 text-sm">
          {error?.statusText || error?.message || "An unexpected rendering error occurred."}
        </p>
        
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            Reload Page
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
