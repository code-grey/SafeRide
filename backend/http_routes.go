package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/net/context"
)

// SetupRoutes configures all HTTP routes for the Gin engine.
func SetupRoutes(router *gin.Engine, redisClient *redis.Client, ctx context.Context) {

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// --- Auth Routes ---

	router.POST("/api/signup", func(c *gin.Context) {
		var newUser User
		if err := c.ShouldBindJSON(&newUser); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// Hash Password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to hash password"})
			return
		}
		newUser.Password = string(hashedPassword)

		// Store in Redis: user:{email}
		userData, _ := json.Marshal(newUser)
		err = redisClient.Set(ctx, "user:"+newUser.Email, userData, 0).Err() // 0 = No expiration
		if err != nil {
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}

		c.JSON(201, gin.H{"message": "User created", "vehicle_id": newUser.VehicleID})
	})

	router.POST("/api/login", func(c *gin.Context) {
		var creds LoginRequest
		if err := c.ShouldBindJSON(&creds); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// Fetch User
		val, err := redisClient.Get(ctx, "user:"+creds.Email).Result()
		if err == redis.Nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		} else if err != nil {
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}

		var storedUser User
		json.Unmarshal([]byte(val), &storedUser)

		// Check Password
		err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(creds.Password))
		if err != nil {
			c.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		}

		// Return Success (In prod, return JWT. Here, simple user info)
		c.JSON(200, gin.H{
			"message": "Login successful", 
			"vehicle_id": storedUser.VehicleID,
			"name": storedUser.Name,
			"email": storedUser.Email,
		})
	})

	// --- Core API ---

	router.GET("/api/status/:vehicle_id", func(c *gin.Context) {
		vehicleID := c.Param("vehicle_id")
		val, err := redisClient.Get(ctx, vehicleID).Result()
		if err == redis.Nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis error"})
			return
		}
		c.Header("Content-Type", "application/json")
		c.String(http.StatusOK, val)
	})

	router.GET("/api/history/:vehicle_id", func(c *gin.Context) {
		vehicleID := c.Param("vehicle_id")
		key := fmt.Sprintf("history:%s", vehicleID)
		vals, err := redisClient.LRange(ctx, key, 0, -1).Result()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis error"})
			return
		}
		jsonArray := "["
		for i, v := range vals {
			if i > 0 { jsonArray += "," }
			jsonArray += v
		}
		jsonArray += "]"
		c.Header("Content-Type", "application/json")
		c.String(http.StatusOK, jsonArray)
	})

	router.GET("/api/alerts/:vehicle_id", func(c *gin.Context) {
		vehicleID := c.Param("vehicle_id")
		key := fmt.Sprintf("alerts:%s", vehicleID)
		vals, err := redisClient.LRange(ctx, key, 0, -1).Result()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis error"})
			return
		}
		jsonArray := "["
		for i, v := range vals {
			if i > 0 { jsonArray += "," }
			jsonArray += v
		}
		jsonArray += "]"
		c.Header("Content-Type", "application/json")
		c.String(http.StatusOK, jsonArray)
	})

	// --- Gamification API ---

	router.GET("/api/points/:vehicle_id", func(c *gin.Context) {
		vehicleID := c.Param("vehicle_id")
		key := fmt.Sprintf("points:%s", vehicleID)
		
		pointsStr, err := redisClient.Get(ctx, key).Result()
		if err == redis.Nil {
			// No points yet, return 0
			c.JSON(200, gin.H{"vehicle_id": vehicleID, "points": 0})
			return
		} else if err != nil {
			c.JSON(500, gin.H{"error": "Redis error"})
			return
		}
		
		c.Header("Content-Type", "application/json")
		c.JSON(200, gin.H{"vehicle_id": vehicleID, "points": pointsStr}) // pointsStr is string representation of int
	})
}
