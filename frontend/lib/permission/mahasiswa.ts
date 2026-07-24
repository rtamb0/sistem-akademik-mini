"use client";

import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/permission/general";

type UserRole = "admin" | "operator" | "viewer" | null;

export function usePermissions() {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedRole = getUserRole() as UserRole;

    setRole(storedRole);
    setIsLoaded(true);
  }, []);

  const canCreate = role === "admin" || role === "operator";
  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";

  return {
    role,
    isLoaded,
    canCreate,
    canEdit,
    canDelete,
  };
}
