package handler

import (
	"encoding/json"
	"net/http"

	"github.com/basketikun/infinite-canvas/model"
	"github.com/basketikun/infinite-canvas/service"
)

// Announcements 公开接口：返回已启用的公告列表。
func Announcements(w http.ResponseWriter, r *http.Request) {
	result, err := service.ListEnabledAnnouncements()
	if err != nil {
		FailError(w, err)
		return
	}
	OK(w, result)
}

// AdminAnnouncements 管理员接口：返回所有公告列表。
func AdminAnnouncements(w http.ResponseWriter, r *http.Request) {
	result, err := service.ListAnnouncements()
	if err != nil {
		FailError(w, err)
		return
	}
	OK(w, result)
}

// AdminSaveAnnouncement 管理员接口：保存公告。
func AdminSaveAnnouncement(w http.ResponseWriter, r *http.Request) {
	var item model.Announcement
	_ = json.NewDecoder(r.Body).Decode(&item)
	result, err := service.SaveAnnouncement(item)
	if err != nil {
		FailError(w, err)
		return
	}
	OK(w, result)
}

// AdminDeleteAnnouncement 管理员接口：删除单条公告。
func AdminDeleteAnnouncement(w http.ResponseWriter, r *http.Request, id string) {
	if err := service.DeleteAnnouncement(id); err != nil {
		FailError(w, err)
		return
	}
	OK(w, true)
}

// AdminDeleteAnnouncements 管理员接口：批量删除公告。
func AdminDeleteAnnouncements(w http.ResponseWriter, r *http.Request) {
	var request struct {
		IDs []string `json:"ids"`
	}
	_ = json.NewDecoder(r.Body).Decode(&request)
	if err := service.DeleteAnnouncements(request.IDs); err != nil {
		FailError(w, err)
		return
	}
	OK(w, true)
}
