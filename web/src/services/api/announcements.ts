import { apiGet } from "@/services/api/request";

export type Announcement = {
    id: string;
    content: string;
    level: string;
    enabled: boolean;
    sort: number;
    createdAt: string;
    updatedAt: string;
};

export type AnnouncementListResponse = {
    items: Announcement[];
    total: number;
    enabled: boolean;
};

export async function fetchAnnouncements() {
    return apiGet<AnnouncementListResponse>("/api/announcements");
}
