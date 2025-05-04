import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { MainLayout } from '../../components/layout/MainLayout';
import { useState } from 'react';

interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  age: number;
  gender: string;
  address: string;
  email: string;
  userType: 'Admin' | 'Employer' | 'Job-seeker';
  status: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
}

type FilterStatus = 'All' | 'Pending' | 'Verified' | 'Rejected';

const VerificationPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const users: User[] = [
    {
      id: "1",
      firstName: "John",
      middleName: "Smith",
      lastName: "Doe",
      suffix: "Jr.",
      age: 28,
      gender: "Male",
      address: "123 Main Street, City, Country",
      email: "john@example.com",
      userType: "Employer",
      status: "Active",
      verificationStatus: "Pending"
    },
    {
      id: "2",
      firstName: "Jane",
      middleName: "Marie",
      lastName: "Smith",
      suffix: "",
      age: 32,
      gender: "Female",
      address: "456 Oak Avenue, Town, Country",
      email: "jane@example.com",
      userType: "Job-seeker",
      status: "Active",
      verificationStatus: "Pending"
    },
    {
      id: "3",
      firstName: "Mike",
      middleName: "",
      lastName: "Johnson",
      suffix: "",
      age: 35,
      gender: "Male",
      address: "789 Pine Road, City, Country",
      email: "mike@example.com",
      userType: "Employer",
      status: "Active",
      verificationStatus: "Verified"
    },
    {
      id: "4",
      firstName: "Sarah",
      middleName: "Lee",
      lastName: "Wilson",
      suffix: "",
      age: 29,
      gender: "Female",
      address: "321 Elm Street, Town, Country",
      email: "sarah@example.com",
      userType: "Job-seeker",
      status: "Active",
      verificationStatus: "Rejected"
    },
  ];

  const handleAccept = (user: User) => {
    setSelectedUser(user);
    setShowAcceptModal(true);
  };

  const handleReject = (user: User) => {
    setSelectedUser(user);
    setShowRejectModal(true);
  };

  const handleConfirmAccept = () => {
    if (selectedUser) {
      // TODO: Implement actual verification acceptance with API call
      console.log(`Accepting verification for user: ${selectedUser.firstName} ${selectedUser.lastName}`);
      setShowAcceptModal(false);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
    }
  };

  const handleConfirmReject = () => {
    if (selectedUser) {
      // TODO: Implement actual verification rejection with API call
      console.log(`Rejecting verification for user: ${selectedUser.firstName} ${selectedUser.lastName}`);
      setShowRejectModal(false);
    }
  };

  const handleViewProfile = (user: User) => {
    navigate(`/verification/${user.id}`);
  };

  const filteredUsers = users.filter(user => 
    activeFilter === 'All' ? true : user.verificationStatus === activeFilter
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Verification</h1>
        </div>

        <div className="mb-6 flex space-x-4">
          <Button
            variant={activeFilter === 'All' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('All')}
            className={activeFilter === 'All' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
          >
            All
          </Button>
          <Button
            variant={activeFilter === 'Pending' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('Pending')}
            className={activeFilter === 'Pending' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}
          >
            Pending
          </Button>
          <Button
            variant={activeFilter === 'Verified' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('Verified')}
            className={activeFilter === 'Verified' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
          >
            Verified
          </Button>
          <Button
            variant={activeFilter === 'Rejected' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('Rejected')}
            className={activeFilter === 'Rejected' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
          >
            Rejected
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Full Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Age</TableHead>
                <TableHead className="font-semibold text-gray-700">Gender</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">User Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Address</TableHead>
                <TableHead className="font-semibold text-gray-700">Verification Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {`${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}${user.suffix ? ' ' + user.suffix : ''}`}
                  </TableCell>
                  <TableCell className="text-gray-600">{user.age}</TableCell>
                  <TableCell className="text-gray-600">{user.gender}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.userType === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                      user.userType === 'Employer' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.userType}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.address}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                      user.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.verificationStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {user.verificationStatus === 'Pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(user)}
                          className="hover:bg-gray-100"
                        >
                          View Profile
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAccept(user)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(user)}
                          className="hover:bg-red-700"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Verification</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to verify {selectedUser.firstName} {selectedUser.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowAcceptModal(false)}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleConfirmAccept}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Verification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Rejection</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reject {selectedUser.firstName} {selectedUser.lastName}'s verification? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmReject}
                className="hover:bg-red-700"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          User verification has been accepted successfully!
        </div>
      )}
    </MainLayout>
  );
};

export default VerificationPage; 