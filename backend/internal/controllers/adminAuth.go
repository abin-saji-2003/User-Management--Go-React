package controllers

import (
	"net/http"
	"react-login-page/internal/database"
	models "react-login-page/internal/model"
	"react-login-page/internal/utils"

	"github.com/gin-gonic/gin"
)

func AdminLogin(c *gin.Context) {
	var AdminLogin models.User

	if err := c.ShouldBindJSON(&AdminLogin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": err.Error(),
		})
		return
	}

	var Admin models.Admin

	tx := database.DB.Where("email=?", AdminLogin.Email).First(&Admin)

	if tx.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "invalid email or password",
		})
		return
	}

	if Admin.Password != AdminLogin.Password {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "invalid email or password",
		})
		return
	}

	token, err := utils.GenerateJWT(Admin.Id, "admin")

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
			"token": token,
			"id":    Admin.Id,
			"email": Admin.Email,
		},
	})
}
