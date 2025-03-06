
// Or create a simple NotFound component if it doesn't exist yet:
// Create a file at src/pages/NotFound.jsx with:

import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
      extra={
        <Button type="primary">
          <Link to="/">Về trang chủ</Link>
        </Button>
      }
    />
  );
};

export default NotFound;