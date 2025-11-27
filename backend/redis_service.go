package main

import (
	"context"
	"fmt"
	"log"

	"github.com/go-redis/redis/v8"
)

// RedisService manages Redis connection and operations.
type RedisService struct {
	client *redis.Client
	ctx    context.Context
}

// NewRedisService creates a new RedisService instance and connects to Redis.
func NewRedisService(addr string, c context.Context) (*RedisService, error) {
	client := redis.NewClient(&redis.Options{
		Addr: addr,
	})

	_, err := client.Ping(c).Result()
	if err != nil {
		return nil, fmt.Errorf("could not connect to Redis: %v", err)
	}
	log.Println("Successfully connected to Redis.")

	return &RedisService{
		client: client,
		ctx:    c,
	}, nil
}

// Client returns the underlying Redis client.
func (s *RedisService) Client() *redis.Client {
	return s.client
}

// Context returns the Redis service's context.
func (s *RedisService) Context() context.Context {
	return s.ctx
}

