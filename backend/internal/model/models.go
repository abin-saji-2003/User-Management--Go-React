package models

type User struct {
	Id           uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name         string `gorm:"type:varchar(255)" validate:"required" json:"name"`
	Email        string `gorm:"type:varchar(255);unique" validate:"email" json:"email"`
	Password     string `gorm:"type:varchar(255)" validate:"required" json:"password"`
	ProfileImage string `json:"profile_image"`
}

type Admin struct {
	Id       uint   `gorm:"primaryKey"`
	Email    string `gorm:"size:50"`
	Password string `gorm:"size:255"`
}
