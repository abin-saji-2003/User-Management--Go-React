package main

import (
	"fmt"
	"log"
	"os"
	"react-login-page/internal/database"
	"react-login-page/internal/routes"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()

	config := cors.Config{
		AllowOrigins:     []string{"http://127.0.0.1:5173", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	router := gin.Default()
	router.Use(cors.New(config))
	routes.RegisterRoutes(router)

	port := os.Getenv("PORT")

	fmt.Println("Server is running on http://localhost" + port)

	// Start the server
	if err := router.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

	if port == "" {
		port = "8080"
	}
}
