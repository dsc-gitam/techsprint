"use client";

import { Info } from "@mui/icons-material";

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-lg font-bold uppercase text-blue-500 mb-2">
            Milestone 8
          </h3>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Documentation & Deployment
          </h2>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <Info className="text-blue-600 dark:text-blue-400 mt-1" fontSize="large" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Manual Grading Milestone
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This milestone will be evaluated manually by our judges. No file submission is required at this stage.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Continue working on your project and be ready to demonstrate your progress to the judges when they visit your team.
              </p>
              <div className="bg-white dark:bg-[#0a0a0a] rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Expected Progress:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Complete project documentation</li>
                  <li>README with setup instructions</li>
                  <li>Application deployed and accessible</li>
                  <li>Demo environment ready</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
