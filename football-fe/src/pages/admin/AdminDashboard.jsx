// Completing the AdminDashboard.jsx file

import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Typography, 
  Divider, Table, List, Tag, Space, Progress 
} from 'antd';
import { 
  UserOutlined, TeamOutlined, TrophyOutlined, 
  BarChartOutlined, DashboardOutlined, 
  CalendarOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { getUsers } from '../../api/user';
import { getTeams } from '../../api/team';
import { getMatches } from '../../api/match';
import { getUserRankings } from '../../api/prediction';

const { Title } = Typography;

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);
  const [matches, setMatches] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [usersResponse, teamsResponse, matchesResponse, rankingsResponse] = await Promise.all([
          getUsers(),
          getTeams(),
          getMatches(),
          getUserRankings()
        ]);
        console.log(usersResponse, teamsResponse, matchesResponse, rankingsResponse);
        setUsersCount(usersResponse.data.data.length);
        setTeamsCount(teamsResponse.data.data.filter(team => team.isActive === true).length);
        setMatches(matchesResponse.data.data);
        setTopUsers(rankingsResponse.data.data.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Calculate match statistics
  const upcomingMatches = matches.filter(match => !match.isCompleted);
  const completedMatches = matches.filter(match => match.isCompleted);
  const matchesToday = matches.filter(match => 
    dayjs(match.date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  );

  // Columns for upcoming matches
  const upcomingMatchesColumns = [
    {
      title: 'Ngày giờ',
      dataIndex: 'date',
      key: 'date',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Đội nhà',
      dataIndex: 'homeTeamName',
      key: 'homeTeamName',
    },
    {
      title: 'Đội khách',
      dataIndex: 'awayTeamName',
      key: 'awayTeamName',
    },
    {
      title: 'Giải đấu',
      dataIndex: 'competition',
      key: 'competition',
    },
  ];

  return (
    <>
      <Title level={2}><DashboardOutlined /> Tổng quan hệ thống</Title>
      <Divider />
      
      <Row gutter={[16, 16]}>
        {/* Statistics Cards */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={usersCount}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đội bóng"
              value={teamsCount}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Trận đấu sắp diễn ra"
              value={upcomingMatches.length}
              prefix={<CalendarOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Trận đấu đã hoàn thành"
              value={completedMatches.length}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Upcoming Matches */}
        <Col xs={24} md={16}>
          <Card title="Trận đấu sắp diễn ra" loading={loading}>
            <Table 
              columns={upcomingMatchesColumns}
              dataSource={upcomingMatches.slice(0, 5)}
              rowKey="_id"
              pagination={false}
              size="small"
            />
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Link to="/admin/matches">Xem tất cả trận đấu</Link>
            </div>
          </Card>
        </Col>

        {/* Top Users */}
        <Col xs={24} md={8}>
          <Card title="Người dùng điểm cao nhất" loading={loading}>
            <List
              size="small"
              dataSource={topUsers}
              renderItem={(user, index) => (
                <List.Item>
                  <Space>
                    <Tag color={index < 3 ? 'gold' : 'blue'}>{index + 1}</Tag>
                    {user.username}
                  </Space>
                  <span>{user.points || 0} điểm</span>
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Link to="/admin/predictions">Xem bảng xếp hạng</Link>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Matches Today */}
        <Col span={24}>
          <Card title="Danh sách trận đấu" loading={loading}>
            {matchesToday.length > 0 ? (
              <List
                dataSource={matchesToday}
                renderItem={match => (
                  <List.Item>
                    <Space size="large">
                      <span>{dayjs(match?.startTime).format('YYYY-MM-DDTHH:mm')}</span>
                      <Space>
                        <span>{match?.homeTeam?.name}</span>
                        <strong>vs</strong>
                        <span>{match?.awayTeam?.name}</span>
                      </Space>
                      <Tag color="blue">{match.competition}</Tag>
                    </Space>
                    <Tag color={match?.status == 'finished' ? 'green' : 'orange'}>
                      {match?.status == 'finished' ? 'Đã kết thúc' : 'Sắp diễn ra'}
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                Không có trận đấu nào diễn ra hôm nay
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;