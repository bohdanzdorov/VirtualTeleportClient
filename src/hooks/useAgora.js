// useAgora.js
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = 'b07864edb6d844bbb5ff369b094ef130';
const TOKEN = '007eJxTYJAJbVMNzYg+f6Hy9e+OP8yXZx9pcb6zzF/0oFXG/uWVMasUGJIMzC3MTFJTksxSLExMkpKSTNPSjM0skwwsTVLTDI0NNp35n94QyMjAWRLEwAiFID4/Q1lmUUlpYk5Iak5qQX5RCQMDAFicJdg=';
const CHANNEL = 'virtualTeleport';

export const createAgoraClient = async ({ userId, onUserPublished, onUserLeft }) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

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

    client.on("user-left", user => {
        onUserLeft(user);
    });

    return {
        client,
        localVideoTrack,
        localAudioTrack
    };
};
