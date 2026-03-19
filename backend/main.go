package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "4071"
	}

	// Setup router
	r := mux.NewRouter()

	// API endpoints
	r.HandleFunc("/api/config", handleConfig).Methods("GET")
	r.HandleFunc("/api/health", handleHealth).Methods("GET")

	// Serve static files (built frontend)
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static")))

	// CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	log.Printf("🎲 Dice app starting on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler(r)))
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
