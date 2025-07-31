export const getCurrentUserPhone = () => {
  if (typeof window === "undefined") return null;
  try {
    const auth = JSON.parse(localStorage.getItem("authState"));
    return auth?.user?.phone || null;
  } catch {
    return null;
  }
};
