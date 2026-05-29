package repository

import (
	"github.com/basketikun/infinite-canvas/model"
)

// ListAnnouncements 返回所有公告（按 sort 升序、创建时间降序）。
func ListAnnouncements() ([]model.Announcement, error) {
	db, err := DB()
	if err != nil {
		return nil, err
	}
	var items []model.Announcement
	err = db.Order("sort asc, created_at desc").Find(&items).Error
	return items, err
}

// ListEnabledAnnouncements 返回已启用的公告（按 sort 升序、创建时间降序）。
func ListEnabledAnnouncements() ([]model.Announcement, error) {
	db, err := DB()
	if err != nil {
		return nil, err
	}
	var items []model.Announcement
	err = db.Where("enabled = ?", true).Order("sort asc, created_at desc").Find(&items).Error
	return items, err
}

// SaveAnnouncement 保存公告。
func SaveAnnouncement(item model.Announcement) (model.Announcement, error) {
	db, err := DB()
	if err != nil {
		return item, err
	}
	return item, db.Save(&item).Error
}

// DeleteAnnouncement 删除指定公告。
func DeleteAnnouncement(id string) error {
	db, err := DB()
	if err != nil {
		return err
	}
	return db.Delete(&model.Announcement{}, "id = ?", id).Error
}

// DeleteAnnouncements 批量删除公告。
func DeleteAnnouncements(ids []string) error {
	db, err := DB()
	if err != nil {
		return err
	}
	return db.Delete(&model.Announcement{}, "id IN ?", ids).Error
}
