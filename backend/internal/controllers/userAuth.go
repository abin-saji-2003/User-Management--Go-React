package controllers

import (
	"net/http"
	"react-login-page/internal/database"
	models "react-login-page/internal/model"
	"react-login-page/internal/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func USerSignUp(c *gin.Context) {
	var SignUp models.UserSignUpRequest

	if err := c.ShouldBindJSON(&SignUp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		return
	}

	hashpassword, err := HashPassword(SignUp.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "error in password hashing" + err.Error(),
		})
		return
	}

	User := models.User{
		Name:     SignUp.Name,
		Email:    SignUp.Email,
		Password: hashpassword,
	}

	tx := database.DB.Create(&User)

	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "failed to create a new user",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Email login successful, please login to complete your email verification",
		"data": gin.H{
			"id":    User.Id,
			"name":  User.Name,
			"email": User.Email,
		},
	})
}

func UserLogin(c *gin.Context) {

	var LoginRequest models.UserLoginRequest

	if err := c.ShouldBindJSON(&LoginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		return
	}

	var User models.User

	tx := database.DB.Where("email = ?", LoginRequest.Email).First(&User)
	if tx.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "invalid email or password",
		})
		return
	}

	err := CheckPassword(User.Password, LoginRequest.Password)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "failed",
			"message": "Incorrect password",
		})
		return
	}

	token, err := utils.GenerateJWT(User.Id, "user")

	if token == "" || err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "failed to generate token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Login successful",
		"data": gin.H{
			"token":       token,
			"id":          User.Id,
			"name":        User.Name,
			"email":       User.Email,
			"profile_img": User.ProfileImage,
		},
	})

}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func CheckPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
