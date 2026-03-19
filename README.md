# 🎲 Rrroll the Dice

A utility app for rolling up to 6 dice with smooth animations and styling. Part of the Activity Hub ecosystem.

## Features

- Roll 1-6 dice with smooth animations
- Visual dice display with PNG images (emoji fallback)
- Instant total calculation
- Responsive design for all screen sizes
- Built with activity-hub SDK for seamless integration

## Project Structure

```
activity-hub-dice/
├── frontend/                    React application
│   ├── src/
│   │   ├── components/
│   │   │   └── DiceRoller.tsx   Main dice component
│   │   ├── styles/
│   │   │   └── dice-board.css   Animations and styling
│   │   ├── App.tsx              App wrapper
│   │   └── index.tsx            Entry point
│   ├── public/
│   │   ├── index.html
│   │   └── dice/                Dice PNG images (1-6)
│   └── package.json
├── backend/                     Go server
│   ├── main.go
│   └── go.mod
├── MANIFEST.json                App registration manifest
└── README.md
```

## Local Development

### Prerequisites
- Node.js 18+
- Go 1.25+

### Frontend

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Backend

```bash
cd backend
SOCKET_PATH=/tmp/dice.sock go run main.go
# Listens on Unix socket /tmp/dice.sock
```

## Building for Activity Hub

### Build Frontend
```bash
cd frontend
npm install
npm run build
# Output: frontend/build/
```

### Copy to Backend
```bash
cp -r frontend/build/* backend/static/
```

### Build Backend
```bash
cd backend
go build -o dice-app .
```

### Run with Unix Socket (Activity Hub)
```bash
cd backend
SOCKET_PATH=/tmp/dice.sock ./dice-app
```

The activity-hub launcher will:
1. Create a Unix socket at the specified path
2. Pass SOCKET_PATH environment variable to the app
3. Launch the app and connect via the socket
4. Route HTTP requests to the app through the socket
5. Handle app lifecycle and monitoring

## Integration with Activity Hub

The app is registered in Activity Hub via the MANIFEST.json file:

```bash
# Register the app
curl -X POST http://localhost:3001/api/admin/apps/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d @MANIFEST.json
```

## SDK Integration

This app uses the **activity-hub-sdk** for:

- User context (`useActivityHubContext()`)
- Navigation (`navigateTo()`)
- Shared CSS styling
- Shared UI components

## Development Notes

### Animation System
- Rolling animation: 2 seconds with 100ms frame updates
- Dice shake-rotate effect for visual feedback
- Settle animation when rolling completes

### Image Handling
- Primary: PNG images from `/dice/dice-1.png` through `/dice/dice-6.png`
- Fallback: Unicode dice emoji (⚀⚁⚂⚃⚄⚅) if images don't load

### Responsive Design
- Desktop: Full-size 120x120px dice
- Mobile: 100x100px dice with adjusted spacing

## Architecture

### Development (Local)
- **Frontend Dev**: http://localhost:3000
- **Backend Socket**: `/tmp/dice.sock`
- **Activity Hub Shell**: http://localhost:3001

### Production (Activity Hub)
- **Frontend**: Bundled in backend/static/
- **Backend**: Launched via Unix socket by activity-hub launcher
- **Communication**: HTTP-over-Unix-socket through activity-hub proxy

## Testing

### Unit Tests
```bash
cd frontend
npm test
```

### Integration Test with Activity Hub
1. Start activity-hub shell (port 3001)
2. App is launched by activity-hub via Unix socket
3. Navigate to dice app from shell
4. Test rolling dice and total calculation
5. Monitor health check at `/api/health`

## Unix Socket Launching

This is the first app tested with Activity Hub's Unix socket launching mechanism:

**How it works:**
1. Activity Hub launcher creates a Unix socket at path `SOCKET_PATH`
2. Launcher passes `SOCKET_PATH` env var to the app process
3. App listens on the socket using `net.Listen("unix", socketPath)`
4. Activity Hub connects to the socket and proxies HTTP requests
5. App responds through the socket connection
6. Launcher monitors `/api/health` for app lifecycle

**Benefits:**
- No port conflicts
- More secure (local filesystem permissions)
- Better isolation between apps
- Activity Hub full control over app lifecycle

## Contributing

See Activity Hub documentation for contribution guidelines.

## License

Same as Activity Hub project
