package main

import (
	"encoding/json"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	// Get socket path from environment
	socketPath := os.Getenv("SOCKET_PATH")
	if socketPath == "" {
		log.Fatal("SOCKET_PATH environment variable not set")
	}

	// Get static path from environment (set by Activity Hub launcher)
	staticPath := os.Getenv("STATIC_PATH")
	if staticPath == "" {
		// Fallback to ./static for local development
		staticPath = "./static"
	}

	// Setup router
	r := mux.NewRouter()

	// API endpoints
	r.HandleFunc("/api/config", handleConfig).Methods("GET")
	r.HandleFunc("/api/health", handleHealth).Methods("GET")

	// Serve static files (built frontend)
	r.PathPrefix("/").Handler(http.FileServer(http.Dir(staticPath)))

	// CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	// Remove existing socket if it exists
	os.Remove(socketPath)

	// Listen on Unix socket
	listener, err := net.Listen("unix", socketPath)
	if err != nil {
		log.Fatalf("Failed to listen on socket %s: %v", socketPath, err)
	}
	defer listener.Close()

	// Set socket permissions so activity-hub can connect
	os.Chmod(socketPath, 0777)

	log.Printf("🎲 Dice app listening on socket: %s", socketPath)
	log.Printf("📁 Serving static files from: %s", staticPath)
	log.Fatal(http.Serve(listener, corsHandler(r)))
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"appName":     "Rrroll the Dice",
		"description": "Roll up to 6 dice with smooth animations",
		"maxDice":     6,
		"version":     "1.0.0",
	})
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "ok",
		"app":    "dice",
	})
}
