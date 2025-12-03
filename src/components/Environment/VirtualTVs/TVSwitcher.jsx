// Simple clickable cube that toggles TV visibility.
// `isOn` controls cube color (green when TV is visible, red otherwise).
// `onToggle` is called when the cube is clicked.
const TVSwitcher = (props) => {
  const { position, rotation, scale, isOn, onToggle } = props;

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onToggle}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={isOn ? "green" : "red"} />
    </mesh>
  );
};

export default TVSwitcher;
