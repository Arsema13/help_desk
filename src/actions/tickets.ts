"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, getCurrentUser } from "@/lib/auth";
import {
  createTicketSchema,
  updateStatusSchema,
  updatePrioritySchema,
  assignTicketSchema,
} from "@/schemas";

async function generateTicketNumber(): Promise<string> {
  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { createdAt: "desc" },
    select: { ticketNumber: true },
  });

  if (!lastTicket) return "TKT-0001";

  const num = parseInt(lastTicket.ticketNumber.split("-")[1], 10);
  return `TKT-${String(num + 1).padStart(4, "0")}`;
}

export async function createTicket(_prevState: unknown, formData: FormData) {
  const user = await requireAuth();

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    priority: formData.get("priority") as string,
  };

  const parsed = createTicketSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const ticketNumber = await generateTicketNumber();

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category as any,
        priority: parsed.data.priority as any,
        status: "OPEN",
        createdById: user.id,
      },
    });

    await prisma.activity.create({
      data: {
        ticketId: ticket.id,
        userId: user.id,
        action: "STATUS_CHANGED",
        newValue: "OPEN",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/tickets");
  } catch {
    return { error: "Failed to create ticket. Please try again." };
  }

  const { redirect } = await import("next/navigation");
  redirect("/tickets");
}

export async function assignTicket(_prevState: unknown, formData: FormData) {
  const user = await requireRole("MANAGER");

  const rawData = {
    ticketId: formData.get("ticketId") as string,
    assignedToId: formData.get("assignedToId") as string,
  };

  const parsed = assignTicketSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  let assignedName: string | null = null;

  try {
    const previous = await prisma.ticket.findUnique({
      where: { id: parsed.data.ticketId },
      select: { status: true, assignedToId: true },
    });

    if (!previous) return { error: "Ticket not found" };

    await prisma.ticket.update({
      where: { id: parsed.data.ticketId },
      data: {
        assignedToId: parsed.data.assignedToId,
        status: previous.status === "OPEN" ? "ASSIGNED" : previous.status,
      },
    });

    const assignedUser = await prisma.user.findUnique({
      where: { id: parsed.data.assignedToId },
      select: { name: true },
    });

    assignedName = assignedUser?.name || null;

    await prisma.activity.create({
      data: {
        ticketId: parsed.data.ticketId,
        userId: user.id,
        action: "ASSIGNED",
        oldValue: previous.assignedToId || null,
        newValue: parsed.data.assignedToId,
      },
    });

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${parsed.data.ticketId}`);
    revalidatePath("/dashboard");
  } catch {
    return { error: "Failed to assign ticket. Please try again." };
  }

  return { success: `Ticket assigned to ${assignedName}` };
}

export async function updateStatus(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const rawData = {
    ticketId: formData.get("ticketId") as string,
    status: formData.get("status") as string,
  };

  const parsed = updateStatusSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parsed.data.ticketId },
    });

    if (!ticket) return { error: "Ticket not found" };

    const allowedStatuses: Record<string, string[]> = {
      MANAGER: ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      TECHNICAL: ["IN_PROGRESS", "RESOLVED"],
      EMPLOYEE: ["CLOSED"],
    };

    if (!allowedStatuses[user.role]?.includes(parsed.data.status)) {
      return { error: "Unauthorized: cannot set this status" };
    }

    if (user.role === "TECHNICAL") {
      if (ticket.assignedToId !== user.id) {
        return { error: "Unauthorized: you are not assigned to this ticket" };
      }
      if (parsed.data.status === "IN_PROGRESS" && ticket.status !== "ASSIGNED") {
        return { error: "Ticket must be assigned before starting work" };
      }
      if (parsed.data.status === "RESOLVED" && ticket.status !== "IN_PROGRESS") {
        return { error: "Ticket must be in progress before resolving" };
      }
    }

    if (user.role === "EMPLOYEE") {
      if (ticket.createdById !== user.id) {
        return { error: "Unauthorized: you can only close your own tickets" };
      }
      if (ticket.status !== "RESOLVED") {
        return { error: "Ticket must be resolved before closing" };
      }
    }

    await prisma.ticket.update({
      where: { id: parsed.data.ticketId },
      data: { status: parsed.data.status as any },
    });

    await prisma.activity.create({
      data: {
        ticketId: parsed.data.ticketId,
        userId: user.id,
        action: "STATUS_CHANGED",
        oldValue: ticket.status,
        newValue: parsed.data.status,
      },
    });

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${parsed.data.ticketId}`);
    revalidatePath("/dashboard");
  } catch {
    return { error: "Failed to update status. Please try again." };
  }

  return { success: "Status updated successfully" };
}

export async function updatePriority(_prevState: unknown, formData: FormData) {
  const user = await requireRole("MANAGER");

  const rawData = {
    ticketId: formData.get("ticketId") as string,
    priority: formData.get("priority") as string,
  };

  const parsed = updatePrioritySchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parsed.data.ticketId },
    });

    if (!ticket) return { error: "Ticket not found" };

    await prisma.ticket.update({
      where: { id: parsed.data.ticketId },
      data: { priority: parsed.data.priority as any },
    });

    await prisma.activity.create({
      data: {
        ticketId: parsed.data.ticketId,
        userId: user.id,
        action: "PRIORITY_CHANGED",
        oldValue: ticket.priority,
        newValue: parsed.data.priority,
      },
    });

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${parsed.data.ticketId}`);
    revalidatePath("/dashboard");
  } catch {
    return { error: "Failed to update priority. Please try again." };
  }

  return { success: "Priority updated successfully" };
}

export async function addComment(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const ticketId = formData.get("ticketId") as string;
  const message = formData.get("message") as string;

  if (!message || message.trim().length === 0) {
    return { error: "Message cannot be empty" };
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) return { error: "Ticket not found" };

    if (
      user.role === "TECHNICAL" &&
      ticket.assignedToId !== user.id
    ) {
      return {
        error: "Unauthorized: you can only comment on assigned tickets",
      };
    }

    if (
      user.role === "EMPLOYEE" &&
      ticket.createdById !== user.id
    ) {
      return {
        error: "Unauthorized: you can only comment on your own tickets",
      };
    }

    await prisma.comment.create({
      data: {
        ticketId,
        userId: user.id,
        message: message.trim(),
      },
    });

    await prisma.activity.create({
      data: {
        ticketId,
        userId: user.id,
        action: "COMMENT_ADDED",
      },
    });

    revalidatePath(`/tickets/${ticketId}`);
  } catch {
    return { error: "Failed to add comment. Please try again." };
  }

  return { success: "Comment added" };
}

export async function deleteTicket(ticketId: string) {
  const user = await requireRole("MANAGER");

  try {
    await prisma.comment.deleteMany({ where: { ticketId } });
    await prisma.activity.deleteMany({ where: { ticketId } });
    await prisma.ticket.delete({ where: { id: ticketId } });

    revalidatePath("/tickets");
    revalidatePath("/dashboard");
  } catch {
    return { error: "Failed to delete ticket" };
  }

  const { redirect } = await import("next/navigation");
  redirect("/tickets");
}
