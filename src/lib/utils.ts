import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting(name: string) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name}`;
  if (hour < 18) return `Good Afternoon, ${name}`;
  return `Good Evening, ${name}`;
}
