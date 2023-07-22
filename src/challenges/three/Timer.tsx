import { Button, HStack, Text } from "@chakra-ui/react";
import React, { useState, useEffect, createContext, useContext } from "react";

type TimerProps = {
  children: JSX.Element;
};

const TimerContext = createContext();

export default function Timer({ children }: TimerProps) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 4);
      });
    }
    return () => clearInterval(interval);
  }, [running]);

  const handleReset = () => {
    setTime(0);
  };

  const toggleRunning = () => {
    setRunning((prevState) => !prevState);
  };

  return (
    <TimerContext.Provider
      value={{ time, running, handleReset, toggleRunning }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function TimerDisplay() {
  const { time } = useContext(TimerContext);

  const minutes = String(Math.floor(time / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, "0");

  return (
    <Text
      fontSize="7xl"
      color="gray.600"
      sx={{
        fontVariantNumeric: "tabular-nums"
      }}
    >
      {minutes}:{seconds}:{milliseconds}
    </Text>
  );
}

export function TimerControls() {
  const { running, handleReset, toggleRunning, time } = useContext(TimerContext);
  return (
    <HStack>
      {running ? (
        <Button colorScheme="red" onClick={toggleRunning}>
          Pause
        </Button>
      ) : (
        <Button colorScheme="green" onClick={toggleRunning}>
          Play
        </Button>
      )}
      {time > 0 && <Button onClick={handleReset}>Reset</Button>}
    </HStack>
  );
}
