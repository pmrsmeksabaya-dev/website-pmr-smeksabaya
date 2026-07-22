export const ActivitySkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

export const StatSkeleton = () => (
  <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-pulse">
    <div className="w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16 mx-auto mb-2" />
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mx-auto" />
  </div>
);