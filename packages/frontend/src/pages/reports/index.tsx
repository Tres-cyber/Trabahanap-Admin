import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { MainLayout } from '../../components/layout/MainLayout';
import { Input } from '../../components/ui/input';

// Mock data for reports
const mockReports = [
  {
    id: 1,
    reporter: 'John Doe',
    reportedUser: 'Jane Smith',
    reason: 'Inappropriate content',
    type: 'User',
    status: 'Pending',
    date: '2024-03-15',
  },
  {
    id: 2,
    reporter: 'Alice Johnson',
    reportedUser: 'Bob Wilson',
    reason: 'Spam behavior',
    type: 'User',
    status: 'Resolved',
    date: '2024-03-14',
  },
  {
    id: 3,
    reporter: 'Mike Brown',
    reportedUser: 'Post #123',
    reason: 'Offensive language',
    type: 'User',
    status: 'Resolved',
    date: '2024-03-13',
  },
];

const ReportsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter reports based on search term and status
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      Object.values(report).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || 
      report.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">User Reports</h1>

        {/* Filters and Search */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-[#0B153C] focus:border-[#0B153C]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#0B153C] focus:border-[#0B153C]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
              <SelectItem value="all" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  All Status
                </span>
              </SelectItem>
              <SelectItem value="pending" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  Pending
                </span>
              </SelectItem>
              <SelectItem value="under review" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  Under Review
                </span>
              </SelectItem>
              <SelectItem value="resolved" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Resolved
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredReports.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reporter}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reportedUser}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.type === 'User' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View Details">
                          <Eye size={18} className="text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Approve">
                          <CheckCircle size={18} className="text-green-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Reject">
                          <XCircle size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
              <p className="text-gray-500 text-center">
                {searchTerm ? (
                  <>No reports match your search criteria. Try adjusting your filters or search terms.</>
                ) : (
                  <>No reports match your selected filters. Try adjusting your filter criteria.</>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage; 