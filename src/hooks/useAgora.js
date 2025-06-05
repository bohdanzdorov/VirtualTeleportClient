// useAgora.js
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = '';
const CHANNEL = '';

//Get channel(room) token for the client, that wants to connect
const fetchToken = async (channelName, userId) => {
    const res = await fetch(`${import.meta.env.VITE_SOCKET_URL}/rtc-token?channelName=${channelName}&uid=${userId}`);
    const data = await res.json();
    return data.token;
};

export const createAgoraClient = async ({ userId, onUserPublished, onUserLeft }) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const TOKEN = await fetchToken(import.meta.env.VITE_AGORA_CHANNEL, userId);

    await client.join(import.meta.env.VITE_AGORA_APP_ID, import.meta.env.VITE_AGORA_CHANNEL, TOKEN, userId);

    // Create and publish your local video/audio tracks
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await client.publish([localAudioTrack, localVideoTrack]);

    //Subscribe to all users, that are already in the room and get their media tracks
    client.remoteUsers.forEach(async (user) => {
        await client.subscribe(user, "video");
        if (user.videoTrack) {
            onUserPublished(user, user.videoTrack);
        }
        await client.subscribe(user, "audio");
        if (user.audioTrack) {
            user.audioTrack.play();
        }
    });

    //Subscribe to users, that enter the room after current user and get their media tracks
    client.on("user-published", async (user, mediaType) => { 
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            onUserPublished(user, remoteVideoTrack);
        }

        if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack.play();
        }
    });

    //If session token expires - refresh
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

export const createAgoraSpectator = async ({ userId, onUserPublished, onUserLeft }) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const TOKEN = await fetchToken(CHANNEL, userId);

    await client.join(APP_ID, CHANNEL, TOKEN, userId);

    //Subscribe to all users, that are already in the room and get their media tracks
    client.remoteUsers.forEach(async (user) => {
        await client.subscribe(user, "video");
        if (user.videoTrack) {
            onUserPublished(user, user.videoTrack);
        }
        await client.subscribe(user, "audio");
        if (user.audioTrack) {
            user.audioTrack.play();
        }
    });

    //Subscribe to users, that enter the room after current user and get their media tracks
    client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            onUserPublished(user, remoteVideoTrack);
        }

        if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack.play();
        }
    });

    //If session token expires - refresh
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
