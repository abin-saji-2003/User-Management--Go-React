package controllers

import (
	"net/http"
	"react-login-page/internal/database"
	models "react-login-page/internal/model"
	"react-login-page/internal/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

func AdminLogin(c *gin.Context) {
	var AdminLogin models.AdminLoginRequest

	// Bind JSON request to struct
	if err := c.ShouldBindJSON(&AdminLogin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		return
	}

	var Admin models.Admin

	// Trim spaces from email before querying the database
	AdminLogin.Email = strings.TrimSpace(AdminLogin.Email)

	// Query the database using trimmed email
	tx := database.DB.Where("LOWER(email) = LOWER(?)", AdminLogin.Email).First(&Admin)

	// Check if the email exists
	if tx.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "invalid email or password",
		})
		return
	}

	// Check for plain text password match
	if strings.TrimSpace(Admin.Password) != strings.TrimSpace(AdminLogin.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "invalid email or password",
		})
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(Admin.Id, "admin")
	if token == "" || err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "failed to generate token",
		})
		return
	}

	// Send successful login response
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Login successful",
		"data": gin.H{
			"token": token,
			"id":    Admin.Id,
			"email": Admin.Email,
		},
	})
}
