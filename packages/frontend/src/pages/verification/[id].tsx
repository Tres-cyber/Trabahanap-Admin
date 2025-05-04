import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/button';
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

const VerificationProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Mock data - replace with actual API call
  const user: User = {
    id: id || "1",
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
  };

  const handleAccept = () => {
    // TODO: Implement actual verification acceptance with API call
    console.log(`Accepting verification for user: ${user.firstName} ${user.lastName}`);
    setShowAcceptModal(true);
  };

  const handleReject = () => {
    // TODO: Implement actual verification rejection with API call
    console.log(`Rejecting verification for user: ${user.firstName} ${user.lastName}`);
    setShowRejectModal(true);
  };

  const handleConfirmAccept = () => {
    // TODO: Implement actual API call here
    setShowAcceptModal(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate('/verification');
    }, 2000);
  };

  const handleConfirmReject = () => {
    // TODO: Implement actual API call here
    setShowRejectModal(false);
    navigate('/verification');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="hover:bg-gray-100"
          >
            ← Back to Verification
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Verification Profile</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                <p className="text-base text-gray-900 mt-1">{user.firstName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Middle Name</h3>
                <p className="text-base text-gray-900 mt-1">{user.middleName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                <p className="text-base text-gray-900 mt-1">{user.lastName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Suffix</h3>
                <p className="text-base text-gray-900 mt-1">{user.suffix}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Age</h3>
                <p className="text-base text-gray-900 mt-1">{user.age}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                <p className="text-base text-gray-900 mt-1">{user.gender}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="text-base text-gray-900 mt-1">{user.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="text-base text-gray-900 mt-1">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">User Type</h3>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                  user.userType === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                  user.userType === 'Employer' ? 'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {user.userType}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                  user.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                  user.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.verificationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* ID Images Section */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">ID Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">Front ID</h3>
                <div className="aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">ID Front Image</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">Back ID</h3>
                <div className="aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">ID Back Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user.verificationStatus === 'Pending' && (
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                variant="default"
                onClick={handleAccept}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Accept Verification
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                className="hover:bg-red-700"
              >
                Reject Verification
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Verification</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to verify this user? This action cannot be undone.
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
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Rejection</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reject this user's verification? This action cannot be undone.
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Accepted</h3>
              <p className="text-gray-600">
                User has been successfully verified.
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default VerificationProfilePage; 