import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { log } from 'console';

const RoleErrorScreen = ({
  error,
  onRetry,
  onGoHome
}: {
  error?: object;
  onRetry: () => void;
  onGoHome: () => void;
}) => {
  console.log(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md p-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <AlertCircle className="h-20 w-20 text-red-500" />
            <div className="absolute -right-2 -top-2 animate-ping rounded-full bg-red-100 p-4" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Oops! Something went wrong
        </h1>

        <p className="mb-4 text-gray-600">
          We encountered an error while loading the roles. This might be due to:
        </p>

        <ul className="mb-6 space-y-2 text-left text-sm text-gray-500">
          <li className="flex items-center">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500" />
            Network connectivity issues
          </li>
          <li className="flex items-center">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500" />
            Server temporary unavailability
          </li>
          <li className="flex items-center">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500" />
            Authentication timeout
          </li>
        </ul>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Error details: {error.message}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="default"
            onClick={onRetry}
            className="flex items-center justify-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={onGoHome}
            className="flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RoleErrorScreen;
