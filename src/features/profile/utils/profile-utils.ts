import { User } from "@supabase/supabase-js";

export const getInitials = (user: User | null): string => {
  if (!user) return "?";

  const displayName = user.user_metadata?.display_name;
  if (displayName) {
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  const email = user.email;
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }

  return "?";
};

export const getDisplayName = (user: User | null): string => {
  if (!user) return "Anonymous";
  return user.user_metadata?.display_name || user.email?.split("@")[0] || "Anonymous";
};

export const getAvatarUrl = (user: User | null): string | null => {
  if (!user) return null;
  return user.user_metadata?.avatar_url || null;
};

export const formatLastActive = (lastActive: string | null): string => {
  if (!lastActive) return "Never";

  const date = new Date(lastActive);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than a minute
  if (diff < 60000) {
    return "Just now";
  }

  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  // Format as date
  return date.toLocaleDateString();
};

export const validateProfileData = (data: Record<string, any>): string[] => {
  const errors: string[] = [];

  if (data.display_name && (data.display_name.length < 2 || data.display_name.length > 50)) {
    errors.push("Display name must be between 2 and 50 characters");
  }

  if (data.bio && data.bio.length > 500) {
    errors.push("Bio must not exceed 500 characters");
  }

  if (data.theme_preference && !["light", "dark", "system", "cyberpunk"].includes(data.theme_preference)) {
    errors.push("Invalid theme preference");
  }

  return errors;
}; 