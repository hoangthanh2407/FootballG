import React, { useState, useEffect } from 'react';
import { 
  Table, Typography, Card, Row, Col, 
  Divider, Space, Button, Modal, 
  message, Tooltip, Input, Form 
} from 'antd';
import { UserOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getUsers, updateUser } from '../../api/user';

const { Title } = Typography;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Show edit modal
  const showEditModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({ ...user });
    setEditModalVisible(true);
  };

  // Handle update user info
  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(selectedUser._id, values);
      message.success('Thông tin người dùng đã được cập nhật!');
      setEditModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('Cập nhật thông tin thất bại: ' + error.message);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      ellipsis: true,
      width: 220,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Số dự đoán',
      dataIndex: 'predictionCount',
      key: 'predictionCount',
      render: (text) => text || 0,
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      render: (text) => text || 0,
      sorter: (a, b) => (a.points || 0) - (b.points || 0),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Cập nhật thông tin tài khoản">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)}
            />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={2}><UserOutlined /> Quản lý người dùng</Title>
            </div>
            <Divider />
            <Table
              columns={columns}
              dataSource={users}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Edit User Modal */}
      <Modal
        title="Cập nhật thông tin tài khoản"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdateUser}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên người dùng" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminUsers;
