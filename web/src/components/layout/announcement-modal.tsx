"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Modal, Space, Timeline, Tooltip, Typography } from "antd";
import { Bell } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

import { fetchAnnouncements, type Announcement } from "@/services/api/announcements";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const DISMISS_TODAY_KEY = "infinite-canvas-announcement-dismiss-today";
const DISMISS_FOREVER_KEY = "infinite-canvas-announcement-dismiss";

type AnnouncementModalProps = {
    className?: string;
    style?: React.CSSProperties;
};

// 获取今天的日期字符串
function todayStr() {
    return dayjs().format("YYYY-MM-DD");
}

// 判断是否应该自动弹出
function shouldAutoShow(): boolean {
    const dismissForever = localStorage.getItem(DISMISS_FOREVER_KEY);
    if (dismissForever === "true") return false;
    const dismissToday = localStorage.getItem(DISMISS_TODAY_KEY);
    if (dismissToday === todayStr()) return false;
    return true;
}

export function AnnouncementModal({ className, style }: AnnouncementModalProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const loadAnnouncements = useCallback(async () => {
        try {
            const data = await fetchAnnouncements();
            setAnnouncements(data.items || []);
            return data.items || [];
        } catch {
            setAnnouncements([]);
            return [];
        }
    }, []);

    // 首次加载公告，如果有公告且未关闭则自动弹出
    useEffect(() => {
        if (loaded) return;
        setLoaded(true);
        void loadAnnouncements().then((items) => {
            if (items.length > 0 && shouldAutoShow()) {
                setOpen(true);
            }
        });
    }, [loaded, loadAnnouncements]);

    // 今日关闭
    const handleDismissToday = () => {
        localStorage.setItem(DISMISS_TODAY_KEY, todayStr());
        localStorage.removeItem(DISMISS_FOREVER_KEY);
        setOpen(false);
    };

    // 关闭公告（不再自动弹出，直到有新公告）
    const handleDismissForever = () => {
        localStorage.setItem(DISMISS_FOREVER_KEY, "true");
        setOpen(false);
    };

    // 手动打开时清除关闭标记
    const handleOpen = () => {
        void loadAnnouncements();
        setOpen(true);
    };

    const levelColor = (level: string) => {
        switch (level) {
            case "warning":
                return "orange";
            case "error":
                return "red";
            case "success":
                return "green";
            default:
                return "blue";
        }
    };

    const naturalIconClass = "inline-flex size-8 shrink-0 items-center justify-center text-stone-600 transition hover:text-stone-950 dark:text-stone-300 dark:hover:text-white [&_svg]:size-4";

    return (
        <>
            <Tooltip title="系统公告" placement="bottom">
                <Badge count={announcements.length} size="small" offset={[-4, 4]}>
                    <button type="button" className={cn(naturalIconClass, className)} style={style} onClick={handleOpen} aria-label="系统公告">
                        <Bell className="size-4" />
                    </button>
                </Badge>
            </Tooltip>

            <Modal
                title="系统公告"
                open={open}
                onCancel={() => setOpen(false)}
                width={600}
                footer={
                    <Space>
                        <Button onClick={handleDismissToday}>今日关闭</Button>
                        <Button type="primary" onClick={handleDismissForever}>
                            关闭公告
                        </Button>
                    </Space>
                }
                destroyOnHidden
            >
                {announcements.length === 0 ? (
                    <Typography.Text type="secondary">暂无公告</Typography.Text>
                ) : (
                    <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 8 }}>
                        <Timeline
                            items={announcements.map((item) => ({
                                color: levelColor(item.level),
                                children: (
                                    <div key={item.id}>
                                        <Typography.Paragraph style={{ marginBottom: 4, whiteSpace: "pre-wrap" }}>{item.content}</Typography.Paragraph>
                                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                            {dayjs(item.createdAt).fromNow()} {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                                        </Typography.Text>
                                    </div>
                                ),
                            }))}
                        />
                    </div>
                )}
            </Modal>
        </>
    );
}
