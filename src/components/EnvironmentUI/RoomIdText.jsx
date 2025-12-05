import { useState } from "react";

export const RoomIdText = (props) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!props.roomId) return;
        try {
            await navigator.clipboard.writeText(props.roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (err) {
            console.error("Failed to copy room id", err);
        }
    };

    return (
        <div className="roomIdText environmentUI">
            <span>Room: {props.roomId}</span>
            <button
                onClick={handleCopy}
                title="Copy room ID"
                style={{
                    marginLeft: "8px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #555",
                    background: "#1f1f1f",
                    color: "#fff",
                    cursor: "pointer"
                }}
            >
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    )
}