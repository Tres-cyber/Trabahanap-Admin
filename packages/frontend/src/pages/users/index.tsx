import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      {/* Add your users list content here */}
    </div>
  );
};

export default UsersPage; 