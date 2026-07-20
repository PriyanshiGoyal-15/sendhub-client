export const getTagColor = (str) => {
  if (!str) return "bg-gray-100 text-gray-700";

  const colors = [
    "bg-red-50 text-red-700",
    "bg-orange-50 text-orange-700",
    "bg-amber-50 text-amber-700",
    "bg-green-50 text-green-700",
    "bg-emerald-50 text-emerald-700",
    "bg-teal-50 text-teal-700",
    "bg-cyan-50 text-cyan-700",
    "bg-sky-50 text-sky-700",
    "bg-blue-50 text-blue-700",
    "bg-indigo-50 text-indigo-700",
    "bg-violet-50 text-violet-700",
    "bg-purple-50 text-purple-700",
    "bg-fuchsia-50 text-fuchsia-700",
    "bg-pink-50 text-pink-700",
    "bg-rose-50 text-rose-700",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Get positive index
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const getStatusColor = (status) => {
  if (!status) return "bg-gray-50 text-gray-700";

  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "active") return "bg-green-50 text-green-700";
  if (lowerStatus === "inactive") return "bg-red-100 text-red-700";
  if (lowerStatus === "lead") return "bg-blue-50 text-blue-700";
  if (lowerStatus === "trial") return "bg-orange-50 text-orange-700";
  if (lowerStatus === "enterprise") return "bg-indigo-50 text-indigo-700";

  return getTagColor(status);
};
