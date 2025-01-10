import { useEffect, useRef } from "react"
import { io } from "socket.io-client"
import { TvLinkInput } from "./UI/TvLinkInput";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true
})

export const SocketManager = (props) => {
    const micStateRef = useRef(props.micState); 

    useEffect(() => {
        micStateRef.current = props.micState; 
    }, [props.micState]);

    useEffect(() => {
        
        function onConnect() {
            console.log("connected")

            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then((stream) => {
                    var madiaRecorder = new MediaRecorder(stream);
                    var audioChunks = [];

                    madiaRecorder.addEventListener("dataavailable", function (event) {
                        console.log(micStateRef.current); // Access the latest micState from the ref
                        if (micStateRef.current) {
                            audioChunks.push(event.data);
                        }
                    });

                    madiaRecorder.addEventListener("stop", function () {
                        //console.log("Data available")
                        var audioBlob = new Blob(audioChunks);
                        audioChunks = [];
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(audioBlob);
                        fileReader.onloadend = function () {
                            var base64String = fileReader.result;
                            socket.emit("audioStream", base64String);
                        };

                        madiaRecorder.start();
                        setTimeout(function () {
                            madiaRecorder.stop();
                        }, 1000);
                    });

                    madiaRecorder.start();

                    setTimeout(function () {
                        madiaRecorder.stop();
                    }, 1000);
                })
                .catch((error) => {
                    console.error('Error capturing audio.', error);
                });
        }

        function onDisconnect() {
            console.log("disconnected")
        }

        function onUsers(value) {
            //console.log("Received users from server:", value);
            props.setUsers(value)
        }

        function onAudioStream(audioData) {
            //console.log("Audio Data playing...")
            var newData = audioData.split(";");
            newData[0] = "data:audio/ogg;";
            newData = newData[0] + newData[1];

            var audio = new Audio(newData);
            if (!audio || document.hidden) {
                return;
            }
            audio.play();
        }

        function onTvLinkChange(tvlinkInput){
            console.log(tvlinkInput)
            props.setTvLink(tvlinkInput.tvLink)
        }

        socket.on("connect", onConnect)
        socket.on('audioStream', (audioData) => { onAudioStream(audioData) });
        socket.on("disconnect", onDisconnect)
        socket.on("users", onUsers)
        socket.on("tvLink", (tvLinkInput)=>{onTvLinkChange(tvLinkInput)})


        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("users", onUsers)
            socket.off("audioStream", (audioData) => { onAudioStream(audioData) })
        }
    }, [props.setUsers, props.micState])

    useEffect(()=> {
    }, [props.micState])
}
