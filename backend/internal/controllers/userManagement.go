package controllers

import (
	"net/http"
	"react-login-page/internal/database"
	models "react-login-page/internal/model"

	"github.com/gin-gonic/gin"
)

func UserUpdate(c *gin.Context) {
	_, exists := c.Get("adminID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "failed",
			"message": "admin not authorized ",
		})
		return
	}

	var user models.User
	userId := c.Param("id")

	tx := database.DB.Where("id = ?", userId).First(&user)
	if tx.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "failed to fetch user information",
		})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "invalid request data",
		})
		return
	}

	database.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "User details updated successfully",
		"data":    user,
	})
}

func UserDelete(c *gin.Context) {
	_, exists := c.Get("adminID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "failed",
			"message": "admin not authorized ",
		})
		return
	}

	var user models.User
	userId := c.Param("id")

	tx := database.DB.Where("id=?", userId).Delete(&user)

	if tx.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"message": "failed to fetch user information",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "user delete successfully",
	})
}

func SearchUser(c *gin.Context) {

}
