import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunkBy<T>(arr: T[], size: number): T[][] {
  if (!arr.length) return [];
  return arr.reduce(
    (arr, item, idx) => (arr[Math.floor(idx / size)] ??= []).push(item) && arr,
    []
  );
}
