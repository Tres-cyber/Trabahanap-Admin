import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';

export const JobsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Jobs</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Jobs content will go here */}
          <p>Jobs management page content</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage; 