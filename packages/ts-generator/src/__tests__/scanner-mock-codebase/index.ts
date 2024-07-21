export const getRandomNumber = () => Math.random();

export const getRandomName = () => {
  const names = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
    "Kate",
    "Luke",
    "Mary",
  ];
  return names[Math.floor(Math.random() * names.length)];
};

export interface User {
  name: string;
  id: number;
}
