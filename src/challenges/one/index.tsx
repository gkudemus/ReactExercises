import { Box, Text } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";

function useMouseLocation(ref: React.RefObject<HTMLElement>) {
  // implement me!
  const [mouseLoc, setMouseLoc] = useState({ x: 0, y: 0 });

  const updateMouseCoordinates = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { left, top, width, height } = ref.current?.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    //make sure x and y are within bounds
    const newX = Math.max(0, Math.min(x, width));
    const newY = Math.max(0, Math.min(y, height));

    setMouseLoc({ x: newX, y: newY });
  };

  useEffect(() => {
    const handleMouseHoverEvent = (event) => {
      updateMouseCoordinates(event);
    };
    ref.current?.addEventListener("mousemove", handleMouseHoverEvent);
  }, [ref]);

  return mouseLoc;
}

export default function One() {
  const boxRef = useRef(null);
  // ❗ This our target API
  const { x, y } = useMouseLocation(boxRef);

  return (
    <>
      <Box
        h="350px"
        w="full"
        bg="red.200"
        rounded="xl"
        position="relative"
        mt={6}
        _hover={{
          shadow: "lg"
        }}
        ref={boxRef}
      >
        <Text
          position="absolute"
          p={2}
          background="gray.600"
          rounded="md"
          color="gray.100"
          fontSize="sm"
          fontWeight="bold"
        >
          x: {x}, y: {y}
        </Text>
      </Box>
      <Text color="gray.500" fontSize="sm" mt="4" textAlign="center">
        Display the current x and y coordinate on hover.
      </Text>
    </>
  );
}
