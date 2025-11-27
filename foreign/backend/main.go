package main

import (
	"log"
	"net/http"
	"os"

	"safen/backend/pkg/database"
	"safen/backend/services/users"
)

func main() {
	db := database.Connect()
	userService := &users.UserService{DB: db}
	userHandler := &users.UserHandler{Service: userService}

	http.HandleFunc("/api/v1/auth/register", userHandler.RegisterHandler)
	http.HandleFunc("/api/v1/auth/login", userHandler.LoginHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Println("Starting server on :" + port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
