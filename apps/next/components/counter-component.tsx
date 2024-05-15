"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

export const CounterComponent: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrementCount = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const getCountTimesFive = (): number => {
    return count * 5;
  };

  useEffect(() => {
    console.log("Count:", count);
  }, [count]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Counter Component</h1>
      <div className="flex items-center gap-x-4">
        <Button variant="outline" onClick={incrementCount}>
          Increment
        </Button>
        <Button variant="outline" onClick={decrementCount}>
          Decrement
        </Button>
      </div>
      <p className="text-lg mt-4">Count: {count}</p>
      <p className="text-lg mt-2">Count times five: {getCountTimesFive()}</p>
    </div>
  );
};
