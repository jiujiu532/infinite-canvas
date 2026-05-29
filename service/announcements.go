package service

import (
	"time"

	"github.com/basketikun/infinite-canvas/model"
	"github.com/basketikun/infinite-canvas/repository"
)

// ListAnnouncements 返回所有公告（管理员用）。
func ListAnnouncements() (model.AnnouncementList, error) {
	items, err := repository.ListAnnouncements()
	if err != nil {
		return model.AnnouncementList{}, err
	}
	if items == nil {
		items = []model.Announcement{}
	}
	return model.AnnouncementList{Items: items, Total: len(items), Enabled: true}, nil
}

// ListEnabledAnnouncements 返回已启用的公告（用户端用）。
func ListEnabledAnnouncements() (model.AnnouncementList, error) {
	items, err := repository.ListEnabledAnnouncements()
	if err != nil {
		return model.AnnouncementList{}, err
	}
	if items == nil {
		items = []model.Announcement{}
	}
	return model.AnnouncementList{Items: items, Total: len(items), Enabled: true}, nil
}

// SaveAnnouncement 保存公告。
func SaveAnnouncement(item model.Announcement) (model.Announcement, error) {
	now := time.Now().Format(time.RFC3339)
	if item.Level == "" {
		item.Level = "default"
	}
	if item.ID == "" {
		item.ID = newID("ann")
		item.CreatedAt = now
	}
	item.UpdatedAt = now
	return repository.SaveAnnouncement(item)
}

// DeleteAnnouncement 删除指定公告。
func DeleteAnnouncement(id string) error {
	return repository.DeleteAnnouncement(id)
}

// DeleteAnnouncements 批量删除公告。
func DeleteAnnouncements(ids []string) error {
	if len(ids) == 0 {
		return nil
	}
	return repository.DeleteAnnouncements(ids)
}
