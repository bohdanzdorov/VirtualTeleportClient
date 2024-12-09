import { Html, useGLTF } from "@react-three/drei"

export default function TV() {
    const tv = useGLTF(
        "/models/model2.glb"
    )
    return (
        <>
            <primitive object={tv.scene} position={[0.5, -0.25, -0.83]} scale={0.15}>
                <Html
                    position={[-0.45, 0.35, 0]}
                    distanceFactor={1.2}
                    transform
                >
                    <iframe style={{width: "1350px", height: "760px", border:"none", borderRadius: "10px",position: "relative" ,zIndex: "0"}} 
                    src={import.meta.env.VITE_TV_URL}/>
                </Html>
            </primitive>   
        </>
    );
}