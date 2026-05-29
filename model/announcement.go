package model

// Announcement 系统公告。
type Announcement struct {
	ID        string `json:"id" gorm:"primaryKey"`
	Content   string `json:"content" gorm:"type:text"`
	Level     string `json:"level"`
	Enabled   bool   `json:"enabled"`
	Sort      int    `json:"sort"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

// AnnouncementList 公告列表结果。
type AnnouncementList struct {
	Items   []Announcement `json:"items"`
	Total   int            `json:"total"`
	Enabled bool           `json:"enabled"`
}
