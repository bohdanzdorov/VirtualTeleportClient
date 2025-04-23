// useAgora.js
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = 'b07864edb6d844bbb5ff369b094ef130';
const CHANNEL = 'virtualTeleport';

const fetchToken = async (channelName, userId) => {
    const res = await fetch(`http://localhost:3000/rtc-token?channelName=${channelName}&uid=${userId}`);
    const data = await res.json();
    console.log(data)
    return data.token;
};

export const createAgoraClient = async ({ userId, onUserPublished, onUserLeft }) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const TOKEN = await fetchToken(CHANNEL, userId);

    await client.join(APP_ID, CHANNEL, TOKEN, userId);

    // Create and publish your local video/audio tracks
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await client.publish([localAudioTrack, localVideoTrack]);

    client.remoteUsers.forEach(async (user) => {
        await client.subscribe(user, "video");
        console.log("TRACK; ", user.videoTrack)
        if (user.videoTrack) {
            onUserPublished(user, user.videoTrack);
        }
    });

    client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            onUserPublished(user, remoteVideoTrack);
        }
    });

    client.on("token-privilege-will-expire", async () => {
        const newToken = await fetchToken(CHANNEL, userId);
        await client.renewToken(newToken);
        console.log("Token renewed");
    });

    client.on("user-left", user => {
        onUserLeft(user);
    });

    return {
        client,
        localVideoTrack,
        localAudioTrack
    };
};
