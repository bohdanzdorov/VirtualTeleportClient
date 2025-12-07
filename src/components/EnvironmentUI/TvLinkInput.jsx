import { useEffect, useState } from "react"
import { socket } from "../SocketManager"

const ALLOWED_PROTOCOLS = ["https:"]
const BLOCKED_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"])
const ALLOWED_HOST_PATTERNS = [
    /(?:^|\.)youtube\.com$/i,
    /(?:^|\.)youtube-nocookie\.com$/i,
    /(?:^|\.)youtu\.be$/i,
    /(?:^|\.)vimeo\.com$/i,
    /(?:^|\.)player\.vimeo\.com$/i,
    /(?:^|\.)dailymotion\.com$/i,
    /(?:^|\.)twitch\.tv$/i,
    /(?:^|\.)loom\.com$/i,
    /(?:^|\.)drive\.google\.com$/i
]

const defaultSecurityMessage = "Only HTTPS video links from trusted hosts (YouTube, Vimeo, Twitch, Loom, Dailymotion, Google Drive) are accepted. Unsafe links are blocked for everyone."

// Validate and normalize the shared TV link before broadcasting it to every client
const sanitizeTvLink = (rawValue) => {
    const trimmedValue = rawValue.trim()

    if (trimmedValue.length === 0) {
        return { sanitizedUrl: "", error: "" }
    }

    if (!trimmedValue.toLowerCase().startsWith("https://")) {
        return {
            sanitizedUrl: null,
            error: "Links must start with https:// and come from an approved video host."
        }
    }

    let parsedUrl
    try {
        parsedUrl = new URL(trimmedValue)
    } catch (error) {
        return {
            sanitizedUrl: null,
            error: "That doesn't look like a valid video URL. Double-check the address."
        }
    }

    if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
        return {
            sanitizedUrl: null,
            error: "Only secure https:// links are allowed on the shared TV."
        }
    }

    const normalizedHost = parsedUrl.hostname.toLowerCase()

    if (BLOCKED_HOSTNAMES.has(normalizedHost)) {
        return {
            sanitizedUrl: null,
            error: "Local network or loopback links are not allowed."
        }
    }

    if (parsedUrl.port) {
        return {
            sanitizedUrl: null,
            error: "Links with custom ports are blocked for safety."
        }
    }

    const hostIsAllowed = ALLOWED_HOST_PATTERNS.some((pattern) => pattern.test(normalizedHost))

    if (!hostIsAllowed) {
        return {
            sanitizedUrl: null,
            error: "This host isn't approved for the shared TV. Try YouTube, Vimeo, Twitch, Loom, Dailymotion, or Google Drive."
        }
    }

    parsedUrl.username = ""
    parsedUrl.password = ""
    parsedUrl.hash = ""

    return { sanitizedUrl: parsedUrl.toString(), error: "" }
}

/*
    Input field for the current TV link
*/
export const TvLinkInput = (props) => {

    const [localValue, setLocalValue] = useState(props.tvLink || "")
    const [warningMessage, setWarningMessage] = useState(defaultSecurityMessage)
    const [hasError, setHasError] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const handleTvLinkInput = (event) => {
        const rawValue = event.target.value

        setLocalValue(rawValue)

        const { sanitizedUrl, error } = sanitizeTvLink(rawValue)

        if (error) {
            setWarningMessage(error)
            setHasError(true)
            return
        }

        setWarningMessage(defaultSecurityMessage)
        setHasError(false)

        if (sanitizedUrl !== rawValue) {
            setLocalValue(sanitizedUrl)
        }

        if (sanitizedUrl === props.tvLink) {
            return
        }

        props.setTvLink(sanitizedUrl)
        socket.emit("tvLink", { tvLink: sanitizedUrl })
    }
    //Helper function, so that when users type in the info into textfield, its avatar is standing still
    const handleTvLinkFocus = () => {
        props.setIsMovementAllowed(false)
        setIsFocused(true)
    }
    const handleTvLinkBlur = () => {
        props.setIsMovementAllowed(true)
        setIsFocused(false)
    }

    useEffect(() => {
        setLocalValue(props.tvLink || "")
        setWarningMessage(defaultSecurityMessage)
        setHasError(false)
    }, [props.tvLink])

    const shouldShowWarning = isFocused || hasError

    return (
        <>
            <input type="text"
                value={localValue}
                onChange={handleTvLinkInput}
                onFocus={handleTvLinkFocus}
                onBlur={handleTvLinkBlur}
                className="tvLinkInput environmentUI"
                placeholder="https://..."
                inputMode="url"
                spellCheck="false"
            />
            {shouldShowWarning && (
                <div className={`tvLinkWarning environmentUI${hasError ? " isError" : ""}`}>
                    {warningMessage}
                </div>
            )}
        </>
    )
}