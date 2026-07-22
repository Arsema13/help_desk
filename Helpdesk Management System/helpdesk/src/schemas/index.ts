import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["MANAGER", "TECHNICAL", "EMPLOYEE"]),
});

export const createTicketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["IT_SUPPORT", "FACILITIES", "HR", "OTHER"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export const updateStatusSchema = z.object({
  ticketId: z.string(),
  status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export const updatePrioritySchema = z.object({
  ticketId: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export const assignTicketSchema = z.object({
  ticketId: z.string(),
  assignedToId: z.string().min(1, "Please select a user"),
});

export const addCommentSchema = z.object({
  ticketId: z.string(),
  message: z.string().min(1, "Message cannot be empty"),
});

export type LoginInput = z.output<typeof loginSchema>;
export type RegisterInput = z.output<typeof registerSchema>;
export type CreateTicketInput = z.output<typeof createTicketSchema>;
export type UpdateStatusInput = z.output<typeof updateStatusSchema>;
export type UpdatePriorityInput = z.output<typeof updatePrioritySchema>;
export type AssignTicketInput = z.output<typeof assignTicketSchema>;
export type AddCommentInput = z.output<typeof addCommentSchema>;
