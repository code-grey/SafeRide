package main

// --- Data Structures ---

type Telemetry struct {
	VehicleID  string  `json:"vehicle_id"`
	Timestamp  int64   `json:"timestamp"`
	Status     string  `json:"status"` // "safe", "fatigue", "distracted", "rash driving", "stress"
	Lat        float64 `json:"lat"`
	Long       float64 `json:"long"`
	Confidence float64 `json:"confidence"`
	Source     string  `json:"source,omitempty"`  // "ai" or "iot"
	TxHash     string  `json:"tx_hash,omitempty"` // The Solana Proof
}

type User struct {
	Email     string `json:"email"`
	Password  string `json:"password"` // Hashed
	VehicleID string `json:"vehicle_id"`
	Name      string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RedeemRequest struct {
	VehicleID string `json:"vehicle_id"`
	Points    int    `json:"points"`
}
