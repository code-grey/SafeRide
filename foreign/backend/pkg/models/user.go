package models

type Role string

const (
	Rider Role = "RIDER"
	Driver Role = "DRIVER"
	Admin Role = "ADMIN"
)

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string
	Email    string `gorm:"unique"`
	Phone    string `gorm:"unique"`
	Password string
	Role     Role
}
