import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface JobRequestDetails {
  id: string;
  jobSeeker: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  jobTag: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  description: string;
  scheduledDate: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

const JobRequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const jobRequest: JobRequestDetails = {
    id: '1',
    jobSeeker: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+63 912 345 6789',
      address: '123 Main St, Manila, Philippines',
    },
    client: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+63 987 654 3210',
      address: '456 Oak St, Manila, Philippines',
    },
    jobTag: 'Plumbing',
    status: 'Pending',
    createdAt: '2024-03-20',
    description: 'Emergency plumbing repair needed for leaking pipe in the kitchen. Water is starting to damage the floor.',
    scheduledDate: '2024-03-21 14:00',
    location: {
      address: '456 Oak St, Manila, Philippines',
      coordinates: {
        lat: 14.5995,
        lng: 120.9842,
      },
    },
  };

  const getStatusColor = (status: JobRequestDetails['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/job-request')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Requests
          </Button>
          <h1 className="text-3xl font-bold">Job Request Details</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Job Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Job Information</h2>
            <div className="space-y-4">
              <p className="text-gray-600">{jobRequest.description}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Created: {jobRequest.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Job Tag</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {jobRequest.jobTag}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(jobRequest.status)}`}>
                  {jobRequest.status}
                </span>
              </div>
            </div>
          </div>

          {/* Job Seeker Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Job Seeker</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{jobRequest.jobSeeker.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{jobRequest.jobSeeker.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Phone className="h-4 w-4" />
                  <span>{jobRequest.jobSeeker.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{jobRequest.jobSeeker.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Client Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{jobRequest.client.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{jobRequest.client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Phone className="h-4 w-4" />
                  <span>{jobRequest.client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{jobRequest.client.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{jobRequest.location.address}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default JobRequestDetailsPage; 