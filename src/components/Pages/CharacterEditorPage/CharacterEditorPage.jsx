import "./CharacterEditorPage.css";

import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import { Man } from "../../Environment/Models/Man";
import { Woman } from "../../Environment/Models/Woman";

export const CharacterEditorPage = (props) => {
    const navigate = useNavigate();

    const { profileDraft, setProfileDraft } = props;
    const draft = profileDraft ?? {
        gender: "male",
        hairColor: "#553211",
        suitColor: "#000000",
        trousersColor: "#000000",
    };
    const { gender, hairColor, suitColor, trousersColor } = draft;

    const handleGenderChange = (event) => {
        const value = event.target.value;
        setProfileDraft?.((prev) => ({ ...prev, gender: value }));
    };

    const handleHairColorChange = (event) => {
        const value = event.target.value;
        setProfileDraft?.((prev) => ({ ...prev, hairColor: value }));
    };

    const handleSuitColorChange = (event) => {
        const value = event.target.value;
        setProfileDraft?.((prev) => ({ ...prev, suitColor: value }));
    };

    const handleTrousersColorChange = (event) => {
        const value = event.target.value;
        setProfileDraft?.((prev) => ({ ...prev, trousersColor: value }));
    };

    return (
        <div className="characterEditorRoot">
            <div className="characterEditorHeaderBar">
                <div>
                    <h2>Character editor</h2>
                    <p>Personalise every detail before you step into the teleport.</p>
                </div>
                <button
                    type="button"
                    className="editorBackButton"
                    onClick={() => navigate("/")}
                >
                    ← Back to main menu
                </button>
            </div>

            <div className="characterEditorLayout">
                <div className="editorFormColumn">
                    <section className="editorSection">
                        <h3>Avatar silhouette</h3>
                        <div className="genderOptions">
                            <label className={`genderOptionCard ${gender === "male" ? "isSelected" : ""}`}>
                                <input
                                    type="radio"
                                    value="male"
                                    checked={gender === "male"}
                                    onChange={handleGenderChange}
                                />
                                Male
                            </label>
                            <label className={`genderOptionCard ${gender === "female" ? "isSelected" : ""}`}>
                                <input
                                    type="radio"
                                    value="female"
                                    checked={gender === "female"}
                                    onChange={handleGenderChange}
                                />
                                Female
                            </label>
                        </div>
                    </section>

                    <section className="editorSection">
                        <h3>Palette</h3>
                        <div className="colorGrid">
                            <label className="colorSwatch">
                                <span>Hair</span>
                                <input type="color" value={hairColor} onChange={handleHairColorChange} />
                            </label>
                            <label className="colorSwatch">
                                <span>Suit</span>
                                <input type="color" value={suitColor} onChange={handleSuitColorChange} />
                            </label>
                            <label className="colorSwatch">
                                <span>Bottoms</span>
                                <input type="color" value={trousersColor} onChange={handleTrousersColorChange} />
                            </label>
                        </div>
                    </section>
                </div>

                <div className="editorPreviewColumn">
                    <div className="editorPreviewCard">
                        <Canvas style={{ width: "100%", height: "100%" }}>
                            <Environment preset="dawn" />
                            <OrbitControls minDistance={2} maxDistance={3} />
                            {gender === "male" ? (
                                <Man
                                    scale={1.75}
                                    position={[0, -1.5, 0]}
                                    animation="idle"
                                    hairColor={hairColor}
                                    suitColor={suitColor}
                                    trousersColor={trousersColor}
                                />
                            ) : (
                                <Woman
                                    scale={1.75}
                                    position={[0, -1.5, 0]}
                                    animation="idle"
                                    hairColor={hairColor}
                                    suitColor={suitColor}
                                    trousersColor={trousersColor}
                                />
                            )}
                        </Canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};
