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
go run main.go
# Runs on http://localhost:4071
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

### Run
```bash
cd backend
PORT=4071 ./dice-app
```

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

## Port Mapping

- **Frontend Dev**: 3000
- **Backend**: 4071
- **Activity Hub Shell**: 3001

## Testing

### Unit Tests
```bash
cd frontend
npm test
```

### Integration Test
1. Start activity-hub shell on port 3001
2. Start dice backend on port 4071
3. Navigate to dice app from shell
4. Test rolling dice and total calculation

## Socket.io Launching

This is the first app tested with Activity Hub's Unix socket launching mechanism:

- Activity Hub launcher initiates connection via Unix socket
- App detects environment and connects to parent
- Health check endpoint: `/api/health`

## Contributing

See Activity Hub documentation for contribution guidelines.

## License

Same as Activity Hub project
