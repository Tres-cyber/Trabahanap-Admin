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
import { useState, ChangeEvent } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Search, Users, CheckCircle2, XCircle, Eye, Ban } from 'lucide-react';
import { Checkbox } from "../../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";

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
type UserTypeFilter = 'All' | 'Job-seeker' | 'Employer';

const VerificationPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
  const [userTypeFilter, setUserTypeFilter] = useState<UserTypeFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [confirmBan, setConfirmBan] = useState(false);
  const [isBanMode, setIsBanMode] = useState(false);
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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleBanUsers = () => {
    if (confirmBan && selectedUsers.length > 0) {
      // TODO: Implement actual ban functionality with API call
      console.log('Banning users:', selectedUsers);
      setShowBanDialog(false);
      setConfirmBan(false);
      setSelectedUsers([]);
      setIsBanMode(false);
      // Show success message
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleCancelBanMode = () => {
    setIsBanMode(false);
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter(user => {
    const matchesStatus = activeFilter === 'All' ? true : user.verificationStatus === activeFilter;
    const matchesUserType = userTypeFilter === 'All' ? true : user.userType === userTypeFilter;
    const matchesSearch = searchQuery === '' || 
      `${user.firstName} ${user.middleName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesUserType && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">User Verification</h1>
          <div className="flex gap-2">
            {isBanMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelBanMode}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowBanDialog(true)}
                  disabled={selectedUsers.length === 0}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm"
                >
                  <Ban className="w-4 h-4" />
                  Ban Selected ({selectedUsers.length})
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setIsBanMode(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm px-6 py-2 rounded-md transition-colors duration-200"
              >
                <Ban className="w-4 h-4" />
                Ban Users
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Select value={activeFilter} onValueChange={(value: FilterStatus) => setActiveFilter(value)}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
              <SelectItem value="All" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  All
                </span>
              </SelectItem>
              <SelectItem value="Pending" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending
                </span>
              </SelectItem>
              <SelectItem value="Verified" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              </SelectItem>
              <SelectItem value="Rejected" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Rejected
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={userTypeFilter} onValueChange={(value: UserTypeFilter) => setUserTypeFilter(value)}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
              <SelectItem value="All" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  All Users
                </span>
              </SelectItem>
              <SelectItem value="Job-seeker" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Job Seekers
                </span>
              </SelectItem>
              <SelectItem value="Employer" className="hover:bg-gray-50 cursor-pointer">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Employers
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                {isBanMode && (
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  </TableRow>
                )}
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
                    {isBanMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                        />
                      </TableCell>
                    )}
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
                    <TableCell className="text-right space-x-3">
                      <div className="flex space-x-3">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                          title="View Details"
                          onClick={() => handleViewProfile(user)}
                        >
                          <Eye size={24} className="text-blue-600" />
                        </button>
                        {user.verificationStatus === 'Pending' && (
                          <>
                            <button 
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                              title="Approve"
                              onClick={() => handleAccept(user)}
                            >
                              <CheckCircle2 size={24} className="text-green-600" />
                            </button>
                            <button 
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
                              title="Reject"
                              onClick={() => handleReject(user)}
                            >
                              <XCircle size={24} className="text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
              <p className="text-gray-500 text-center">
                {searchQuery ? (
                  <>No users match your search criteria. Try adjusting your filters or search terms.</>
                ) : (
                  <>No users match your selected filters. Try adjusting your filter criteria.</>
                )}
              </p>
            </div>
          )}
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

      {/* Ban Confirmation Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="bg-white border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-red-600 text-xl font-semibold">Ban Users Confirmation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Are you sure you want to ban {selectedUsers.length} selected user{selectedUsers.length > 1 ? 's' : ''}? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirm-ban"
                checked={confirmBan}
                onCheckedChange={(checked: boolean) => setConfirmBan(checked)}
              />
              <label htmlFor="confirm-ban" className="text-sm text-gray-600">
                I confirm that I want to ban these users
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBanDialog(false);
                setConfirmBan(false);
              }}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanUsers}
              disabled={!confirmBan}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Ban Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {selectedUsers.length > 0 
            ? `Successfully banned ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}!`
            : 'User verification has been accepted successfully!'}
        </div>
      )}
    </MainLayout>
  );
};

export default VerificationPage; 