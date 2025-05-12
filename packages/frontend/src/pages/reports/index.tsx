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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

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
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

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

  const handleViewReport = (report: typeof mockReports[0]) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleAcceptReport = (report: typeof mockReports[0]) => {
    setSelectedReport(report);
    setShowAcceptModal(true);
  };

  const handleRejectReport = (report: typeof mockReports[0]) => {
    setSelectedReport(report);
    setShowRejectModal(true);
  };

  const handleConfirmAccept = () => {
    // TODO: Implement accept logic
    setShowAcceptModal(false);
  };

  const handleConfirmReject = () => {
    // TODO: Implement reject logic
    setShowRejectModal(false);
  };

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
              <SelectItem value="all" className="hover:bg-gray-50 cursor-pointer bg-white">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  All Status
                </span>
              </SelectItem>
              <SelectItem value="pending" className="hover:bg-gray-50 cursor-pointer bg-white">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  Pending
                </span>
              </SelectItem>
              <SelectItem value="under review" className="hover:bg-gray-50 cursor-pointer bg-white">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  Under Review
                </span>
              </SelectItem>
              <SelectItem value="resolved" className="hover:bg-gray-50 cursor-pointer bg-white">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Resolved
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredReports.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                          title="View Details"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye size={24} className="text-blue-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                          title="Approve"
                          onClick={() => handleAcceptReport(report)}
                        >
                          <CheckCircle size={24} className="text-green-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                          title="Reject"
                          onClick={() => handleRejectReport(report)}
                        >
                          <XCircle size={24} className="text-red-600" />
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

      {/* View Report Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="bg-white border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="py-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reporter</h3>
                <p className="text-base text-gray-900 mt-1">{selectedReport.reporter}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reason</h3>
                <p className="text-base text-gray-900 mt-1">{selectedReport.reason}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date Reported</h3>
                <p className="text-base text-gray-900 mt-1">{selectedReport.date}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Accept Report Modal */}
      <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
        <DialogContent className="bg-white border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Accept Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="py-4 space-y-4">
              <p className="text-gray-600">
                Are you sure you want to accept this report? This action will mark the report as resolved and may take appropriate action against the reported user/content.
              </p>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Report Details</h3>
                <p className="text-sm text-gray-900">Reporter: {selectedReport.reporter}</p>
                <p className="text-sm text-gray-900">Reason: {selectedReport.reason}</p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAcceptModal(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAccept}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Accept Report
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Report Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="bg-white border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Reject Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="py-4 space-y-4">
              <p className="text-gray-600">
                Are you sure you want to reject this report? This action will mark the report as resolved and no action will be taken against the reported user/content.
              </p>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Report Details</h3>
                <p className="text-sm text-gray-900">Reporter: {selectedReport.reporter}</p>
                <p className="text-sm text-gray-900">Reason: {selectedReport.reason}</p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Reject Report
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ReportsPage; 