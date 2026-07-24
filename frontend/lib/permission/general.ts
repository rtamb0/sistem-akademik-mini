import { getUser } from "@/lib/auth";

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};
