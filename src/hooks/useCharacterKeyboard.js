import { useRef, useEffect } from "react";

/**
 * Custom hook to track keyboard input and update character animation state
 * Returns a ref that holds the current animation state (Idle, Walk, Run)
 */
export const useCharacterKeyboard = () => {
    const curAnimationRef = useRef("CharacterArmature|Idle");
    const keysPressed = useRef(new Set());

    useEffect(() => {
        const handleKeyDown = (event) => {
            keysPressed.current.add(event.code);

            // Check if movement keys are pressed
            if (
                keysPressed.current.has("KeyW") ||
                keysPressed.current.has("KeyA") ||
                keysPressed.current.has("KeyS") ||
                keysPressed.current.has("KeyD")
            ) {
                // Check if shift (run) is pressed
                if (
                    keysPressed.current.has("ShiftLeft") ||
                    keysPressed.current.has("ShiftRight")
                ) {
                    curAnimationRef.current = "CharacterArmature|Run";
                } else {
                    curAnimationRef.current = "CharacterArmature|Walk";
                }
            }
        };

        const handleKeyUp = (event) => {
            keysPressed.current.delete(event.code);

            // Check if any movement keys are still pressed
            if (
                ![..."WASD"].some((key) => keysPressed.current.has(`Key${key}`))
            ) {
                curAnimationRef.current = "CharacterArmature|Idle";
            } else if (
                keysPressed.current.has("ShiftLeft") ||
                keysPressed.current.has("ShiftRight")
            ) {
                curAnimationRef.current = "CharacterArmature|Run";
            } else {
                curAnimationRef.current = "CharacterArmature|Walk";
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return curAnimationRef;
};
