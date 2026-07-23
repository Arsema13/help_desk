"use client";

import { logout } from "@/actions/auth";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
    >
      Logout
    </button>
  );
}
