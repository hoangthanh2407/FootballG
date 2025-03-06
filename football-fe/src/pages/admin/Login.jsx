import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Layout, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;
const { Content } = Layout;

const AdminLogin = () => {
  const { login, isAuthenticated, isAdmin, loading, initialCheckDone } = useAuth();
  const navigate = useNavigate();

  // Only redirect after initial auth check is complete
  useEffect(() => {
    if (initialCheckDone && isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate, initialCheckDone]);

  // Show loading state during initial auth check
  if (!initialCheckDone) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" tip="Đang kiểm tra xác thực..." />
        </Content>
      </Layout>
    );
  }

  const onFinish = async (values) => {
    try {
      const success = await login({
        ...values,
        role: 'admin' 
      });
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        message.error('Đăng nhập thất bại: Email hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      message.error('Đăng nhập thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ width: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2}>Đăng nhập Admin</Title>
          </div>
          
          <Form
            name="admin_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                style={{ width: '100%' }}
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default AdminLogin;