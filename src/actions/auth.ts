"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  signToken,
  createSessionCookie,
  clearSessionCookie,
  getCurrentUser,
} from "@/lib/auth";
import { loginSchema, registerSchema } from "@/schemas";

export async function login(_prevState: unknown, formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const valid = await verifyPassword(parsed.data.password, user.password);
    if (!valid) {
      return { error: "Invalid email or password" };
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(createSessionCookie(token));

    revalidatePath("/");
  } catch {
    return { error: "An unexpected error occurred. Please try again." };
  }

  redirect("/dashboard");
}

export async function register(_prevState: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return { error: "Email already in use" };
    }

    const hashed = await hashPassword(parsed.data.password);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashed,
        role: parsed.data.role as "MANAGER" | "TECHNICAL" | "EMPLOYEE",
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(createSessionCookie(token));

    revalidatePath("/");
  } catch {
    return { error: "An unexpected error occurred. Please try again." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(clearSessionCookie());
  redirect("/login");
}
