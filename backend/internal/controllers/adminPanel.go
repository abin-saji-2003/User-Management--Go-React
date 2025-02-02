package controllers

import (
	"net/http"
	"react-login-page/internal/database"
	models "react-login-page/internal/model"

	"github.com/gin-gonic/gin"
)

func AdminPanelHandler(c *gin.Context) {
	adminID, exists := c.Get("adminID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "failed",
			"message": "admin not authorized ",
		})
		return
	}

	_, ok := adminID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "failed",
			"message": "failed to retrieve admin information",
		})
		return
	}
	var users []models.User

	tx := database.DB.Select("*").Find(&users)

	if tx.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "failed",
			"message": "failed to retrieve user information",
		})
		return
	}

	var userResponse []models.UserDisplay

	for _, user := range users {
		userResponse = append(userResponse, models.UserDisplay{
			Id:    user.Id,
			Name:  user.Name,
			Email: user.Email,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "successfully retrieved user information",
		"data": gin.H{
			"users": userResponse,
		},
	})

}
