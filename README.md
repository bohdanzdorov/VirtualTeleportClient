## Virtual Teleport Client

Virtual Teleport is a browser-based telepresence experience that mixes real-time audio/video conferencing with a shared 3D environment. The client application, built with React 19 and Vite, renders an interactive lobby where users can create or join rooms, customise their avatar, and teleport into a virtual office populated by other participants.

### Highlights
- Create or join shared rooms backed by Socket.IO signalling.
- Customise avatars in a dedicated editor and preview them in real time.
- Immerse in a three.js powered environment with physics, first-person controls, and spatial webcams.
- Stream audio/video via Agora RTC, including dynamic token renewal.
- Share a sanitised video link on a virtual TV that updates for every attendee.

### Tech Stack
- React 19 + Vite 5 (fast refresh, modern JSX runtime)
- react-three-fiber, drei, rapier, ecctrl (3D scene, helpers, physics, character movement)
- Socket.IO client (low-latency room state sync)
- Agora RTC SDK (media streaming)
- Jotai, html2canvas, Leva (state utilities and tooling)

### Project Layout
```
src/
	App.jsx                 # Application shell and route definitions
	components/
		Pages/                # Routed pages (Main menu, Character editor, Teleport)
		Environment/          # 3D scene, models, shared TV logic
		EnvironmentUI/        # Overlay UI components rendered inside the teleport view
		CharacterControllers/ # Player movement and animation controller
		SocketManager.jsx     # Socket.IO bootstrap and event wiring
	hooks/                  # Custom hooks (Agora integration, input handling)
	styles/                 # Page-level stylesheets
```

### Prerequisites
- Node.js 18 or newer (LTS recommended)
- npm 9+ or yarn/pnpm equivalent
- Running instance of the Virtual Teleport Server (provides Socket.IO and Agora token endpoints)

### Environment Configuration
Create a `.env` (or `.env.local`) file at the project root with the variables below:

```
VITE_SOCKET_URL=http://localhost:4000    # Base URL of the backend Socket.IO/REST server
VITE_AGORA_APP_ID=your_agora_app_id      # Agora project App ID
VITE_AGORA_CHANNEL=teleport              # Optional default channel name when roomId is missing
```

> Tip: All values must include the URL protocol. When deploying, point `VITE_SOCKET_URL` to your HTTPS backend origin.

### Getting Started
1. Install dependencies
	 ```powershell
	 npm install
	 ```
2. Launch the development server
	 ```powershell
	 npm run dev
	 ```
	 Vite will display a local URL (default `http://localhost:5173`).
3. Ensure the backend server is running with matching CORS configuration.

### Available Scripts
- `npm run dev` – start Vite in development mode with hot module replacement.
- `npm run build` – produce a production bundle in `dist/`.
- `npm run preview` – serve the production build locally for smoke testing.
- `npm run lint` – run ESLint with the configured React ruleset.

### Key Workflows
- **Room creation & joining** – the main menu validates user and room IDs before emitting `roomConnect` via Socket.IO.
- **Avatar customisation** – the character editor page edits a shared `profileDraft` state and streams updates into the 3D preview.
- **Teleport experience** – `TeleportPage` wraps the scene in `KeyboardControls`, renders the map, synchronises other players, and handles Agora media tracks.
- **Shared video panel** – `TvLinkInput` sanitises URLs (HTTPS-only, allow-list of hosts) before broadcasting them to the server and all clients.

### Testing Notes
- Resize the browser window to verify responsive layouts on both the main menu and character editor pages.
- Use two browser windows (or devices) to confirm Socket.IO user synchronisation and shared TV behaviour.
- Validate Agora connectivity by joining the same room from multiple sessions and checking audio/video playback.

### Deployment Checklist
- Build the frontend (`npm run build`) and deploy the `dist/` directory behind a static host or CDN.
- Serve over HTTPS to satisfy Agora and browser media requirements.
- Update environment variables to point at the deployed backend and production Agora credentials.

### Further Improvements
- Harden authentication by issuing signed room invites.
- Persist room state in a database for resilience across server restarts.
- Provide localisation support for UI strings.

For backend setup and socket event details, see the companion [Virtual Teleport Server](../VirtualTeleportServer/README.md).
