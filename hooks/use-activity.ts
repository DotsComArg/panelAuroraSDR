"use client";

import { useCallback } from "react";

type ActivityPayload = {
  userId?: string;
  clientId?: string;
  type: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

export function useActivityLogger() {
  const logActivity = useCallback(async (payload: ActivityPayload) => {
    try {
      const res = await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("Error registrando actividad", await res.text());
      }
    } catch (err) {
      console.error("Error de red al registrar actividad", err);
    }
  }, []);

  return { logActivity };
}


