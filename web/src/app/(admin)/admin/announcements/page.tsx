"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Switch, Tag, Tooltip, Typography, InputNumber } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { useEffect, useState } from "react";

import { useAdminAnnouncements } from "./use-admin-announcements";
import type { AdminAnnouncement } from "@/services/api/admin";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

type AnnouncementFormValues = Partial<AdminAnnouncement>;

const levelLabels: Record<string, { text: string; color: string }> = {
    default: { text: "默认", color: "blue" },
    warning: { text: "警告", color: "orange" },
    error: { text: "紧急", color: "red" },
    success: { text: "成功", color: "green" },
};

export default function AdminAnnouncementsPage() {
    const { announcements, isLoading, refreshAnnouncements, saveAnnouncement, deleteAnnouncement, deleteAnnouncements } = useAdminAnnouncements();
    const [form] = Form.useForm<AnnouncementFormValues>();
    const [editingItem, setEditingItem] = useState<Partial<AdminAnnouncement> | null>(null);
    const [deletingItem, setDeletingItem] = useState<AdminAnnouncement | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    useEffect(() => {
        if (editingItem) form.setFieldsValue({ level: "default", enabled: true, sort: 0, ...editingItem });
    }, [editingItem, form]);

    const handleSave = async () => {
        const value = await form.validateFields();
        await saveAnnouncement({ ...editingItem, ...value });
        setEditingItem(null);
    };

    const handleBatchDelete = async () => {
        if (selectedRowKeys.length === 0) return;
        await deleteAnnouncements(selectedRowKeys);
        setSelectedRowKeys([]);
    };

    const columns: ProColumns<AdminAnnouncement>[] = [
        {
            title: "内容",
            dataIndex: "content",
            ellipsis: true,
            render: (_, item) => (
                <Typography.Paragraph style={{ marginBottom: 0, maxWidth: 400 }} ellipsis={{ rows: 2 }}>
                    {item.content || "-"}
                </Typography.Paragraph>
            ),
        },
        {
            title: "发布时间",
            dataIndex: "createdAt",
            width: 160,
            render: (_, item) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text strong style={{ fontSize: 13 }}>
                        {dayjs(item.createdAt).fromNow()}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: "类型",
            dataIndex: "level",
            width: 80,
            render: (_, item) => {
                const info = levelLabels[item.level] || levelLabels.default;
                return <Tag color={info.color}>{info.text}</Tag>;
            },
        },
        {
            title: "说明",
            dataIndex: "sort",
            width: 80,
            render: (_, item) => <Typography.Text type="secondary">{item.sort}</Typography.Text>,
        },
        {
            title: "操作",
            key: "actions",
            width: 120,
            align: "right",
            render: (_, item) => (
                <Space size={4}>
                    <Tooltip title="编辑">
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setEditingItem(item)} />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button danger type="text" size="small" icon={<DeleteOutlined />} onClick={() => setDeletingItem(item)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <main style={{ padding: 24 }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <ProTable<AdminAnnouncement>
                    rowKey="id"
                    columns={columns}
                    dataSource={announcements}
                    loading={isLoading}
                    search={false}
                    defaultSize="middle"
                    tableLayout="fixed"
                    cardProps={{ variant: "borderless" }}
                    headerTitle={
                        <Space direction="vertical" size={0}>
                            <Space>
                                <Typography.Text strong>公告管理</Typography.Text>
                            </Space>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                系统公告管理，可以发布系统通知和重要消息（最多100个，前端显示最新20条）
                            </Typography.Text>
                        </Space>
                    }
                    options={{ density: true, setting: true, reload: () => void refreshAnnouncements() }}
                    toolBarRender={() => [
                        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setEditingItem({ level: "default", enabled: true, sort: 0 })}>
                            添加公告
                        </Button>,
                        selectedRowKeys.length > 0 ? (
                            <Button key="batch-delete" danger icon={<DeleteOutlined />} onClick={() => void handleBatchDelete()}>
                                批量删除
                            </Button>
                        ) : null,
                    ]}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys) => setSelectedRowKeys(keys as string[]),
                    }}
                    pagination={false}
                />
            </Space>

            <Modal title={editingItem?.id ? "编辑公告" : "添加公告"} open={Boolean(editingItem)} width={600} onCancel={() => setEditingItem(null)} onOk={() => void handleSave()} okText="保存" cancelText="取消" destroyOnHidden>
                <Form form={form} layout="vertical" requiredMark={false}>
                    <Row gutter={14}>
                        <Col span={24}>
                            <Form.Item name="content" label="内容" rules={[{ required: true, message: "请输入公告内容" }]}>
                                <Input.TextArea rows={4} placeholder="输入公告内容" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="level" label="类型">
                                <Select
                                    options={[
                                        { value: "default", label: "默认" },
                                        { value: "warning", label: "警告" },
                                        { value: "error", label: "紧急" },
                                        { value: "success", label: "成功" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="sort" label="排序">
                                <InputNumber min={0} precision={0} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="enabled" label="启用" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title="删除公告"
                open={Boolean(deletingItem)}
                onCancel={() => setDeletingItem(null)}
                onOk={async () => {
                    if (!deletingItem) return;
                    await deleteAnnouncement(deletingItem.id);
                    setDeletingItem(null);
                }}
                okText="删除"
                okButtonProps={{ danger: true }}
                cancelText="取消"
            >
                确定删除这条公告吗？
            </Modal>
        </main>
    );
}
