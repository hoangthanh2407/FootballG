import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tooltip,
  Empty,
  Tag,
  Switch
} from "antd";
import {
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getTeams, createTeam, updateTeam, toggleTeamStatus } from "../../api/team";

const { Title } = Typography;

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [form] = Form.useForm();

  // Fetch teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getTeams();
      console.log(response.data.data)
      setTeams(response.data.data);
    } catch (error) {
      message.error("Không thể tải danh sách đội bóng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Open create team modal
  const showCreateModal = () => {
    setEditMode(false);
    setSelectedTeam(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Open edit team modal
  const showEditModal = (team) => {
    setEditMode(true);
    setSelectedTeam(team);
    form.setFieldsValue({
      name: team.name,
      shortName: team.shortName,
      logo: team.logo,
      country: team.country,
    });
    setModalVisible(true);
  };

  // Show status toggle confirmation modal
  const showStatusConfirm = (team) => {
    setSelectedTeam(team);
    setStatusModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Handle status modal cancel
  const handleStatusCancel = () => {
    setStatusModalVisible(false);
    setSelectedTeam(null);
  };

  // Handle form submit
  const handleSubmit = async (values) => {
    try {
      if (editMode) {
        await updateTeam(selectedTeam._id, values);
        message.success("Cập nhật đội bóng thành công!");
      } else {
        await createTeam(values);
        message.success("Tạo đội bóng thành công!");
      }
      setModalVisible(false);
      form.resetFields();
      fetchTeams();
    } catch (error) {
      message.error(
        `${editMode ? "Cập nhật" : "Tạo"} đội bóng thất bại: ` + error.message
      );
    }
  };

  // Handle team status toggle
  const handleToggleStatus = async () => {
    try {
      if (selectedTeam) {
        await toggleTeamStatus(selectedTeam._id);
        message.success(`${selectedTeam.isActive ? "Vô hiệu hóa" : "Kích hoạt"} đội bóng thành công!`);
        fetchTeams();
        setStatusModalVisible(false);
        setSelectedTeam(null);
      }
    } catch (error) {
      message.error(`${selectedTeam.isActive ? "Vô hiệu hóa" : "Kích hoạt"} đội bóng thất bại: ` + error.message);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 80,
      render: (text) =>
        text ? (
          <img
            src={text}
            alt="Team logo"
            style={{ maxWidth: 50, maxHeight: 50 }}
          />
        ) : (
          <Empty
            description="No logo"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: 0, minHeight: "auto" }}
          />
        ),
    },
    {
      title: "Tên đội bóng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Đang hoạt động" : "Đã vô hiệu hóa"}
        </Tag>
      ),
      filters: [
        {
          text: "Đang hoạt động",
          value: true,
        },
        {
          text: "Đã vô hiệu hóa",
          value: false,
        },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Tooltip title={record.isActive ? "Vô hiệu hóa" : "Kích hoạt"}>
            <Button
              danger={record.isActive}
              type={record.isActive ? "default" : "primary"}
              onClick={() => showStatusConfirm(record)}
            >
              {record.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={2}>
                <TeamOutlined /> Quản lý đội bóng
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateModal}
              >
                Thêm đội bóng
              </Button>
            </div>

            <Divider />

            <Table
              columns={columns}
              dataSource={teams}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Team Modal */}
      <Modal
        title={editMode ? "Chỉnh sửa đội bóng" : "Thêm đội bóng mới"}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên đội bóng"
            rules={[{ required: true, message: "Vui lòng nhập tên đội bóng" }]}
          >
            <Input placeholder="Ví dụ: Manchester United" />
          </Form.Item>

          <Form.Item name="logo" label="URL Logo">
            <Input placeholder="https://example.com/logo.png" />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button onClick={handleCancel}>Huỷ</Button>
              <Button type="primary" htmlType="submit">
                {editMode ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Toggle Status Modal */}
      <Modal
        title={`Bạn có chắc chắn muốn ${selectedTeam?.isActive ? 'vô hiệu hóa' : 'kích hoạt'} đội bóng này?`}
        open={statusModalVisible}
        onCancel={handleStatusCancel}
        footer={[
          <Button key="cancel" onClick={handleStatusCancel}>
            Huỷ
          </Button>,
          <Button 
            key="confirm" 
            danger={selectedTeam?.isActive} 
            type="primary" 
            onClick={handleToggleStatus}
          >
            {selectedTeam?.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          </Button>,
        ]}
        icon={<ExclamationCircleOutlined />}
      >
        {selectedTeam && (
          <div>
            <p>
              Đội bóng: <strong>{selectedTeam.name}</strong>
            </p>
            {selectedTeam.isActive ? (
              <p>
                Đội bóng đã vô hiệu hóa sẽ không thể thêm vào trận đấu mới, nhưng vẫn giữ
                trong cơ sở dữ liệu để lưu lịch sử.
              </p>
            ) : (
              <p>
                Kích hoạt sẽ cho phép đội bóng này được sử dụng trong các trận đấu mới.
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminTeams;