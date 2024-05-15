import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: This returns different colors for the Promise<User[]>, User[], and User
// Ideal is: User should be base color, User[] should be a shade of User, and Promise<User[]> should be a shade of User[]
export function generateRandomColorFromStr(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"00000".substring(0, 6 - c.length)}${c}`;
}

export function assignColorsToElements(elements: string[]) {
  return elements.map((element) => generateRandomColorFromStr(element));
}
