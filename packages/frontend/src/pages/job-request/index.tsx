import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobRequest {
  id: string;
  jobSeeker: {
    name: string;
    email: string;
  };
  client: {
    name: string;
    email: string;
  };
  jobTag: string;
  status: 'Pending' | 'Completed';
  createdAt: string;
}

const JobRequestPage = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const [jobRequests] = useState<JobRequest[]>([
    {
      id: '1',
      jobSeeker: {
        name: 'John Doe',
        email: 'john@example.com',
      },
      client: {
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      jobTag: 'Plumbing',
      status: 'Pending',
      createdAt: '2024-03-20',
    },
    {
      id: '2',
      jobSeeker: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
      },
      client: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
      },
      jobTag: 'Electrical',
      status: 'Completed',
      createdAt: '2024-03-19',
    },
    {
      id: '3',
      jobSeeker: {
        name: 'Emily Brown',
        email: 'emily@example.com',
      },
      client: {
        name: 'David Lee',
        email: 'david@example.com',
      },
      jobTag: 'Cleaning',
      status: 'Pending',
      createdAt: '2024-03-18',
    },
  ]);

  const handleViewDetails = (id: string) => {
    navigate(`/job-request/${id}`);
  };

  const getStatusColor = (status: JobRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Job Requests</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Seeker</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Job Tag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.jobSeeker.name}</p>
                      <p className="text-sm text-gray-500">{request.jobSeeker.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.client.name}</p>
                      <p className="text-sm text-gray-500">{request.client.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {request.jobTag}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>{request.createdAt}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewDetails(request.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5 text-blue-600" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default JobRequestPage; 