"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

import { deleteAdminAnnouncement, deleteAdminAnnouncements, fetchAdminAnnouncements, saveAdminAnnouncement, type AdminAnnouncement } from "@/services/api/admin";
import { useUserStore } from "@/stores/use-user-store";

export function useAdminAnnouncements() {
    const { message } = App.useApp();
    const queryClient = useQueryClient();
    const token = useUserStore((state) => state.token);
    const clearSession = useUserStore((state) => state.clearSession);

    const query = useQuery({
        queryKey: ["admin", "announcements", token],
        queryFn: () => fetchAdminAnnouncements(token),
        enabled: Boolean(token),
        retry: false,
    });

    const saveMutation = useMutation({
        mutationFn: (item: Partial<AdminAnnouncement>) => saveAdminAnnouncement(token, item),
        onSuccess: async (_, item) => {
            await queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
            message.success(item.id ? "公告已保存" : "公告已添加");
        },
        onError: (error) => message.error(error instanceof Error ? error.message : "保存失败"),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAdminAnnouncement(token, id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
            message.success("公告已删除");
        },
        onError: (error) => message.error(error instanceof Error ? error.message : "删除失败"),
    });

    const batchDeleteMutation = useMutation({
        mutationFn: (ids: string[]) => deleteAdminAnnouncements(token, ids),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
            message.success("公告已批量删除");
        },
        onError: (error) => message.error(error instanceof Error ? error.message : "删除失败"),
    });

    useEffect(() => {
        if (query.isError) {
            const errorMessage = query.error instanceof Error ? query.error.message : "读取公告失败";
            message.error(errorMessage);
            if (errorMessage.includes("未登录") || errorMessage.includes("权限不足") || errorMessage.includes("登录状态无效")) clearSession();
        }
    }, [clearSession, message, query.error, query.isError]);

    const data = query.data;

    return {
        announcements: data?.items || [],
        total: data?.total || 0,
        isLoading: query.isFetching || saveMutation.isPending || deleteMutation.isPending || batchDeleteMutation.isPending,
        refreshAnnouncements: () => query.refetch(),
        saveAnnouncement: (item: Partial<AdminAnnouncement>) => saveMutation.mutateAsync(item),
        deleteAnnouncement: (id: string) => deleteMutation.mutateAsync(id),
        deleteAnnouncements: (ids: string[]) => batchDeleteMutation.mutateAsync(ids),
    };
}
