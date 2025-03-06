import React, { useState, useEffect } from 'react';
import { 
  Table, Typography, Card, Row, Col, 
  Tabs, Tag, Space, Divider 
} from 'antd';
import { 
  TrophyOutlined, HistoryOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getUserRankings, getPredictions } from '../../api/prediction';
import { getTeams } from '../../api/team';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminPredictions = () => {
  const [rankings, setRankings] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [rankingsResponse, predictionsResponse, teamsResponse] = await Promise.all([
        getUserRankings(),
        getPredictions(),
        getTeams()
      ]);
      
      setRankings(rankingsResponse?.data?.data);
      setPredictions(predictionsResponse?.data?.data);
      setTeams(teamsResponse?.data?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Find team name by ID
  const getTeamName = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  // Rankings table columns
  const rankingsColumns = [
    {
      title: 'Xếp hạng',
      key: 'rank',
      render: (_, __, index) => index + 1,
      width: 100,
    },
    {
      title: 'Người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Điểm số',
      dataIndex: 'points',
      key: 'points',
      sorter: (a, b) => a.points - b.points,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Dự đoán đúng',
      dataIndex: 'correctPredictions',
      key: 'correctPredictions',
    },
    {
      title: 'Tổng dự đoán',
      dataIndex: 'totalPredictions',
      key: 'totalPredictions',
    },
    {
      title: 'Tỷ lệ chính xác',
      key: 'accuracy',
      render: (_, record) => {
        const accuracy = record.totalPredictions ? Math.round((record.correctPredictions / record.totalPredictions) * 100) : 0;
        let color = 'green';
        
        if (accuracy < 30) {
          color = 'red';
        } else if (accuracy < 60) {
          color = 'orange';
        }
        
        return <Tag color={color}>{accuracy}%</Tag>;
      },
    },
  ];

  // Predictions table columns
  const predictionsColumns = [
    {
      title: 'Ngày dự đoán',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Trận đấu',
      key: 'match',
      render: (_, record) => (
        <Space>
          <Text strong>{getTeamName(record?.match?.homeTeam?.name)}</Text>
          <Text>vs</Text>
          <Text strong>{getTeamName(record?.match?.awayTeam?.name)}</Text>
        </Space>
      ),
    },
    {
      title: 'Dự đoán',
      key: 'prediction',
      render: (_, record) => `${record.homeScore} - ${record.awayScore}`,
    },
    {
      title: 'Kết quả thực tế',
      key: 'actual',
      render: (_, record) => {
        if (record.match?.status != "finished") {
          return <Tag color="blue">Chưa diễn ra</Tag>;
        }
        return `${record?.match?.homeScore} - ${record.match.awayScore}`;
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        if (record.match?.status != "finished") {
          return <Tag color="blue">Chưa diễn ra</Tag>;
        }
        
        const isCorrect = 
          record.homeScore === record.match.homeScore && 
          record.awayScore === record.match.awayScore;
          
        return isCorrect 
          ? <Tag color="green">Dự đoán đúng</Tag> 
          : <Tag color="red">Dự đoán sai</Tag>;
      },
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      render: (points) => points || 0,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2}><TrophyOutlined /> Quản lý dự đoán</Title>
          </div>
          
          <Divider />
          
          <Tabs defaultActiveKey="rankings">
            <TabPane 
              tab={<span><UserOutlined /> Bảng xếp hạng người dùng</span>} 
              key="rankings"
            >
              <Table
                columns={rankingsColumns}
                dataSource={rankings}
                rowKey="userId"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane 
              tab={<span><HistoryOutlined /> Lịch sử dự đoán</span>} 
              key="predictions"
            >
              <Table
                columns={predictionsColumns}
                dataSource={predictions}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminPredictions;