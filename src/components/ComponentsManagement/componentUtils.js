export function getIconType(type) {
  if (!type) return "brain";
  const t = type.toLowerCase();
  if (t.includes("db") || t.includes("database")) return "database";
  if (t.includes("gate") || t.includes("hub") || t.includes("proxy")) return "hub";
  if (t.includes("front") || t.includes("ui") || t.includes("screen")) return "screen";
  if (t.includes("infra") || t.includes("node") || t.includes("queue")) return "terminal";
  if (t.includes("pay") || t.includes("card")) return "card";
  return "brain";
}
