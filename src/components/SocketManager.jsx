import { useEffect } from "react"
import { io } from "socket.io-client"

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true
})

export const SocketManager = (props) => {

    useEffect(() => {
        
        function onConnect() {
            console.log("connected")
        }

        function onDisconnect() {
            console.log("disconnected")
        }

        function onUsers(value) {
            props.setUsers(value)
        }

        function onOccupyWebCamTV(value) {
            props.setOccupiedWebCamTvs(value)
        }

        function onTvLinkChange(tvlinkInput){
            props.setTvLink(tvlinkInput.tvLink)
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("users", onUsers)
        socket.on("occupyWebCamTV", onOccupyWebCamTV)
        socket.on("tvLink", (tvLinkInput)=>{onTvLinkChange(tvLinkInput)})

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("users", onUsers)
            socket.off("occupyWebCamTV", onOccupyWebCamTV)
            socket.off("tvLink", (tvLinkInput)=>{onTvLinkChange(tvLinkInput)})
        }

    }, [props.setUsers])
}
