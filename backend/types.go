package main

// --- Data Structures ---

type Telemetry struct {
	VehicleID  string  `json:"vehicle_id"`
	Timestamp  int64   `json:"timestamp"`
	Status     string  `json:"status"` // "safe", "fatigue", "distracted"
	Lat        float64 `json:"lat"`
	Long       float64 `json:"long"`
	Confidence float64 `json:"confidence"`
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
