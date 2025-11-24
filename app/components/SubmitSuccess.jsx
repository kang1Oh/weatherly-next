import { CheckCircle } from "lucide-react";

export function SubmitSuccess({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dim background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Toast Container */}
      <div className="relative p-6 bg-white/25 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 
                      dark:bg-black/20 dark:border-white/20 w-[90%] max-w-sm text-center z-10 animate-fadeIn">
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle className="text-emerald-400 animate-bounce mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
            Thank you for your suggestion!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
            We'll check it out and show it soon!
          </p>
          <button
            onClick={onClose}
            className="w-32 px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-500/30 text-white font-medium rounded-lg 
                       hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
