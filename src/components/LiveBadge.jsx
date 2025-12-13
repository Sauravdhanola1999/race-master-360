export default function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-green-600 px-2.5 py-1 rounded-md shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-lg"></span>
      </span>
      LIVE
    </span>
  );
}
