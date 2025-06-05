import { useState, useEffect } from "react";
/*
  Helper hook, that assists in getting the users's avatar animation
*/
export const useCharacterAnimation = () => {
  const [curAnimation, setCurAnimation] = useState("CharacterArmature|Idle");
  const keysPressed = new Set();

  useEffect(() => {
    const handleKeyDown = (event) => {
      keysPressed.add(event.code);

      if (keysPressed.has("KeyW") || keysPressed.has("KeyA") || keysPressed.has("KeyS") || keysPressed.has("KeyD")) {
        if (keysPressed.has("ShiftLeft") || keysPressed.has("ShiftRight")) {
          setCurAnimation("CharacterArmature|Run");
        } else {
          setCurAnimation("CharacterArmature|Walk");
        }
      }
    };

    const handleKeyUp = (event) => {
      keysPressed.delete(event.code);

      if (![..."WASD"].some((key) => keysPressed.has(`Key${key}`))) {
        setCurAnimation("CharacterArmature|Idle");
      } else if (keysPressed.has("ShiftLeft") || keysPressed.has("ShiftRight")) {
        setCurAnimation("CharacterArmature|Run");
      } else {
        setCurAnimation("CharacterArmature|Walk");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return curAnimation;
};
