import { Badge } from "./Badge";
import { getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge className={getStatusColor(status)}>{status.replace("_", " ")}</Badge>;
}
