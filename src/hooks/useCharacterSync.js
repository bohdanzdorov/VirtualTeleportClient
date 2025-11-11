import { useRef, useEffect } from "react";
import { socket } from "../components/SocketManager";

/**
 * Custom hook to handle character position/rotation/animation synchronization
 * Sends updates to other players at fixed intervals with optimizations
 * @param {React.RefObject} rigidBodyRef - Reference to the character's rigid body
 * @param {React.RefObject} curAnimationRef - Reference to current animation state
 * @param {number} emitInterval - Interval in ms to send updates (default: 100ms)
 * @param {Object} thresholds - Movement/rotation thresholds for optimization
 */
export const useCharacterSync = (
    rigidBodyRef,
    curAnimationRef,
    emitInterval = 100,
    thresholds = { movement: 0.1, rotation: 0.1 }
) => {
    const characterGroupRef = useRef(null);
    const lastPositionRef = useRef([0, 0, 0]);
    const lastRotationRef = useRef([0, 0, 0]);
    const lastAnimationRef = useRef("CharacterArmature|Idle");

    // Set up character group reference once
    useEffect(() => {
        if (rigidBodyRef.current && !characterGroupRef.current) {
            try {
                characterGroupRef.current = rigidBodyRef.current.parent?.parent?.parent;
            } catch (e) {
                // Silent fail, will try again next frame
            }
        }
    });

    // Socket emission in separate interval
    useEffect(() => {
        const interval = setInterval(() => {
            // Try to establish reference if not already set
            if (!characterGroupRef.current) {
                if (rigidBodyRef.current) {
                    try {
                        characterGroupRef.current = rigidBodyRef.current.parent?.parent?.parent;
                    } catch (e) {
                        return;
                    }
                } else {
                    return;
                }
            }

            // Get current position and rotation
            const newPos = [
                characterGroupRef.current.position.x ?? 0,
                characterGroupRef.current.position.y ?? 0,
                characterGroupRef.current.position.z ?? 0,
            ];

            const newRot = [
                characterGroupRef.current.rotation.x ?? 0,
                characterGroupRef.current.rotation.y ?? 0,
                characterGroupRef.current.rotation.z ?? 0
            ];

            const newAnimation = curAnimationRef.current;

            // Check if values changed enough to warrant sending an update
            const positionChanged = newPos.some(
                (val, i) => Math.abs(val - lastPositionRef.current[i]) > thresholds.movement
            );
            const rotationChanged = newRot.some(
                (val, i) => Math.abs(val - lastRotationRef.current[i]) > thresholds.rotation
            );
            const animationChanged = newAnimation !== lastAnimationRef.current;

            // Send update only if something significant changed
            if (positionChanged || rotationChanged || animationChanged) {
                socket.emit("move", {
                    position: newPos,
                    animation: newAnimation,
                    rotation: newRot,
                });

                lastPositionRef.current = [...newPos];
                lastRotationRef.current = [...newRot];
                lastAnimationRef.current = newAnimation;
            }
        }, emitInterval);

        return () => clearInterval(interval);
    }, [emitInterval, curAnimationRef]);

    return characterGroupRef;
};
