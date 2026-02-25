export default function JobCardSkeleton() {
  return (
    <div className="card-glass p-5 animate-pulse">
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-1/2 mb-2" />
      <div className="skeleton h-3 w-full mb-2" />
      <div className="flex gap-2 mt-3">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-20" />
        <div className="skeleton h-6 w-14" />
      </div>
    </div>
  );
}
