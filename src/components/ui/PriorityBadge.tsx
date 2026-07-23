import { Badge } from "./Badge";
import { getPriorityColor } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <Badge className={getPriorityColor(priority)}>{priority}</Badge>;
}
