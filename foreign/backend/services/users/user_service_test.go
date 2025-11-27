package users

import (
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"safen/backend/pkg/models"
)

func newMockDB(t *testing.T) (*gorm.DB, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{})
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a gorm database", err)
	}

	return gormDB, mock
}

func TestCreateUser(t *testing.T) {
	db, mock := newMockDB(t)
	userService := &UserService{DB: db}

	name := "Test User"
	email := "test@example.com"
	phone := "1234567890"
	password := "password"

	rows := sqlmock.NewRows([]string{"id"}).AddRow(1)

	mock.ExpectBegin()
	mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "users" ("name","email","phone","password","role") VALUES ($1,$2,$3,$4,$5) RETURNING "id"`)).
		WithArgs(name, email, phone, sqlmock.AnyArg(), models.Rider).
		WillReturnRows(rows)
	mock.ExpectCommit()

	user, err := userService.CreateUser(name, email, phone, password)

	assert.NoError(t, err)
	assert.NotNil(t, user)
	assert.Equal(t, email, user.Email)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestAuthenticateUser(t *testing.T) {
	db, mock := newMockDB(t)
	userService := &UserService{DB: db}

	email := "test@example.com"
	password := "password"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	rows := sqlmock.NewRows([]string{"id", "email", "password", "role"}).
		AddRow(1, email, string(hashedPassword), models.Rider)
	mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users" WHERE email = $1 ORDER BY "users"."id" LIMIT $2`)).
		WithArgs(email, 1).
		WillReturnRows(rows)

	token, err := userService.AuthenticateUser(email, "password")

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
	assert.NoError(t, mock.ExpectationsWereMet())
}
