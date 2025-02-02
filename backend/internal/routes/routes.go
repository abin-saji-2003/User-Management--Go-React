package routes

import (
	"react-login-page/internal/controllers"
	"react-login-page/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "server status ok",
		})
	})

	router.POST("/user/login", controllers.UserLogin)
	router.POST("/user/signup", controllers.USerSignUp)
	router.POST("/admin/login", controllers.AdminLogin)

	userRoutes := router.Group("/user")
	userRoutes.Use(middleware.AuthRequired)
	{
		userRoutes.GET("/home", controllers.Home)
		userRoutes.PUT("/profile/:id", controllers.UpdateProfileImage)
	}

	adminRoutes := router.Group("/admin")
	adminRoutes.Use(middleware.AuthRequired)
	{
		adminRoutes.GET("/panel", controllers.AdminPanelHandler)
		adminRoutes.PUT("/user-update/:id", controllers.UserUpdate)
		adminRoutes.DELETE("/user-delete/:id", controllers.UserDelete)
	}
}
