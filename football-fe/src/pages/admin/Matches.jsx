import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, 
  Typography, message, Card, Row, Col, 
  Divider, Select, DatePicker, Tabs, InputNumber 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, 
  ScheduleOutlined, TrophyOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getMatches, createMatch, updateMatchResult } from '../../api/match';
import { getTeams } from '../../api/team';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  // Fetch matches and teams
  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesResponse, teamsResponse] = await Promise.all([
        getMatches(),
        getTeams()
      ]);
      console.log(matchesResponse?.data?.data)
      setMatches(matchesResponse?.data?.data);
      setTeams(teamsResponse?.data?.data);
    } catch (error) {
      message.error('Không thể tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle create match
  const handleCreateMatch = () => {
    createForm.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCreateModalCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateMatchSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      
      // Format the date
      const formattedValues = {
        ...values,
        startTime: values.startTime.format('YYYY-MM-DDTHH:mm'),
        endTime: values.endTime.format('YYYY-MM-DDTHH:mm')
      };
      
      await createMatch(formattedValues);
      message.success('Tạo trận đấu thành công!');
      setIsCreateModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Tạo trận đấu thất bại: ' + error.message);
    }
  };

  // Handle update match result
  const handleUpdateMatchResult = (match) => {
    setSelectedMatch(match);
    updateForm.setFieldsValue({
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0
    });
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalCancel = () => {
    setIsUpdateModalVisible(false);
    setSelectedMatch(null);
  };

  const handleUpdateMatchResultSubmit = async () => {
    try {
      const values = await updateForm.validateFields();
      await updateMatchResult(selectedMatch._id, values);
      message.success('Cập nhật kết quả trận đấu thành công!');
      setIsUpdateModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Cập nhật kết quả trận đấu thất bại: ' + error.message);
    }
  };

  // Table columns for upcoming matches
  const upcomingColumns = [
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => { return dayjs(record?.startTime).format('DD/MM/YYYY HH:mm') },
      sorter: (a, b) => new Date(a.date) - new Date(b.date)
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => { return dayjs(record?.endTime).format('DD/MM/YYYY HH:mm') },
      sorter: (a, b) => new Date(a.date) - new Date(b.date)
    },
    {
      title: 'Điểm số',
      dataIndex: 'homeScore',
      key: 'homeScore',
      render: (_, record) => {
        if (record?.homeScore !== null && record?.awayScore !== null) {
          return `${record.homeScore} - ${record.awayScore}`;
        }
        return 'Chưa có kết quả';
      }
    },    
    {
      title: 'Đội nhà',
      dataIndex: 'homeTeam',
      key: 'homeTeam',
      render: (_, record) => {
        console.log(record)
        const homeTeam = teams.find(team => team._id === record?.homeTeam?.teamId);
        return homeTeam ? homeTeam.name : 'N/A';
      }
    },
    {
      title: 'Đội khách',
      dataIndex: 'awayTeam',
      key: 'awayTeam',
      render: (_, record) => {
        const awayTeam = teams.find(team => team._id === record?.awayTeam?.teamId);
        return awayTeam ? awayTeam.name : 'N/A';
      }
    },
    {
      title: 'Giải đấu',
      dataIndex: 'competition',
      key: 'competition',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleUpdateMatchResult(record)}
          >
            Cập nhật kết quả
          </Button>
        </Space>
      ),
    },
  ];

  // Table columns for completed matches
  const completedColumns = [
    ...upcomingColumns.slice(0, -1),
    {
      title: 'Kết quả',
      key: 'result',
      render: (_, record) => `${record?.homeScore || 0} - ${record?.awayScore || 0}`
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleUpdateMatchResult(record)}
          >
            Cập nhật kết quả
          </Button>
        </Space>
      ),
    },
  ];

  // Filter matches
  const upcomingMatches = matches.filter(match => match?.status == "upcoming");
  const completedMatches = matches.filter(match => match?.status == "finished");

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={2}><TrophyOutlined /> Quản lý trận đấu</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateMatch}
                size="large"
              >
                Tạo trận đấu mới
              </Button>
            </div>
            
            <Divider />
            
            <Tabs defaultActiveKey="upcoming">
              <TabPane 
                tab={<span><ScheduleOutlined /> Trận đấu sắp diễn ra</span>} 
                key="upcoming"
              >
                <Table
                  columns={upcomingColumns}
                  dataSource={upcomingMatches}
                  rowKey="_id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </TabPane>
              <TabPane 
                tab={<span><TrophyOutlined /> Trận đấu đã kết thúc</span>} 
                key="completed"
              >
                <Table
                  columns={completedColumns}
                  dataSource={completedMatches}
                  rowKey="_id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Create Match Modal */}
      <Modal
        title="Tạo trận đấu mới"
        open={isCreateModalVisible}
        onCancel={handleCreateModalCancel}
        onOk={handleCreateMatchSubmit}
        okText="Tạo"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="homeTeamId"
                label="Đội nhà"
                rules={[{ required: true, message: 'Vui lòng chọn đội nhà!' }]}
              >
                <Select placeholder="Chọn đội nhà">
                  {teams.map(team => (
                    <Option key={team._id} value={team._id}>{team.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="awayTeamId"
                label="Đội khách"
                rules={[{ required: true, message: 'Vui lòng chọn đội khách!' }]}
              >
                <Select placeholder="Chọn đội khách">
                  {teams.map(team => (
                    <Option key={team._id} value={team._id}>{team.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="startTime"
            label="Ngày giờ thi đấu bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày giờ thi đấu bắt đầu!' }]}
          >
            <DatePicker 
              showTime 
              format="DD/MM/YYYY HH:mm" 
              style={{ width: '100%' }}
              placeholder="Chọn ngày giờ thi đấu"
            />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="Ngày giờ dự kiến kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày giờ thi đấu kết thúc!' }]}
          >
            <DatePicker 
              showTime 
              format="DD/MM/YYYY HH:mm" 
              style={{ width: '100%' }}
              placeholder="Chọn ngày giờ thi đấu"
            />
          </Form.Item>
          <Form.Item
            name="competition"
            label="Giải đấu"
            rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu!' }]}
          >
            <Input placeholder="Nhập tên giải đấu" />
          </Form.Item>
          <Form.Item
            name="venue"
            label="Sân vận động"
          >
            <Input placeholder="Nhập tên sân vận động" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Match Result Modal */}
      <Modal
        title="Cập nhật kết quả trận đấu"
        open={isUpdateModalVisible}
        onCancel={handleUpdateModalCancel}
        onOk={handleUpdateMatchResultSubmit}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        {selectedMatch && (
          <Form
            form={updateForm}
            layout="vertical"
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Typography.Text strong>
                {teams.find(team => team._id === selectedMatch.homeTeamId)?.name || 'Đội nhà'} vs {teams.find(team => team._id === selectedMatch.awayTeamId)?.name || 'Đội khách'}
              </Typography.Text>
              <br />
              <Typography.Text>
                {dayjs(selectedMatch.date).format('DD/MM/YYYY HH:mm')}
              </Typography.Text>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="homeScore"
                  label="Bàn thắng đội nhà"
                  rules={[{ required: true, message: 'Vui lòng nhập số bàn thắng!' }]}
                >
                  <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="awayScore"
                  label="Bàn thắng đội khách"
                  rules={[{ required: true, message: 'Vui lòng nhập số bàn thắng!' }]}
                >
                  <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="isCompleted"
              initialValue={true}
              hidden
            >
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default AdminMatches;