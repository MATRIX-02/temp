import { Loader2 } from 'lucide-react';

const RoleLoader = ({
  message = "Hang tight! We're getting your roles ready to roll... 🚀"
}) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default RoleLoader;
