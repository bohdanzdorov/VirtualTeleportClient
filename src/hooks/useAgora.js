// useAgora.js
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = 'b07864edb6d844bbb5ff369b094ef130';
const TOKEN = '007eJxTYLjpcIDb09UzZLrlv+KHW30XB5wpfDQpZlLZzRTVhg2X+KYrMCQZmFuYmaSmJJmlWJiYJCUlmaalGZtZJhlYmqSmGRobGLaxZTQEMjIE+T1iYIRCEJ+foSyzqKQ0MSckNSe1IL+ohIEBAO83JDA=';
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
