import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <FaSpinner className="text-6xl text-orange-500 animate-spin" />
    </div>
  );
}