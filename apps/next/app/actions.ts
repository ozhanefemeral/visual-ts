/**
 * Represents a user object.
 */
interface User {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * Represents a todo object.
 */
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

/**
 * Fetches user data from an API.
 * @returns A promise that resolves to an array of User objects.
 */
export async function fetchData(): Promise<User[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data: User[] = await response.json();
  return data;
}

/**
 * Fetches extra data from an API.
 * @returns A promise that resolves to an array of Todo objects.
 */
export async function fetchExtraData(): Promise<Todo[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data: Todo[] = await response.json();
  return data;
}

/**
 * Parses user data and modifies the title property to be in uppercase.
 * @param data - An array of User objects.
 * @returns An array of User objects with modified title property.
 */
export function parseData(data: User[]): User[] {
  return data.map((user) => {
    return {
      ...user,
      title: user.title.toUpperCase(),
    };
  });
}

/**
 * Dummy function that returns a string
 */
export function X(): string {
  return "X";
}

/**
 * Dummy async function that returns a string after 1 second.
 */
export async function Y(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "Y";
}

/**
 * Dummy function that returns nothing
 */
export function Z(): void {
  return;
}
