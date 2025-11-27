package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/stretchr/testify/assert"
	"golang.org/x/net/context"
)

func TestStatusEndpoint(t *testing.T) {
	// Setup
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	
	// Connect to actual Redis (Integration Test style)
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	
	SetupRoutes(router, rdb, context.Background())

	// Seed Data
	rdb.Set(context.Background(), "test-car", `{"status":"safe"}`, 0)

	// Request
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/status/test-car", nil)
	router.ServeHTTP(w, req)

	// Assert
	assert.Equal(t, 200, w.Code)
	assert.Contains(t, w.Body.String(), "safe")
}
