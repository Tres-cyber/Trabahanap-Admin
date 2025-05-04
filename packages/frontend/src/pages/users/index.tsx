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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

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
}

const UsersPage = () => {
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isBanMode, setIsBanMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      userType: "Admin",
      status: "Active"
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
      userType: "Employer",
      status: "Active"
    },
  ];

  const handleViewProfile = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const handleBanUsers = () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to ban.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmBanUsers = () => {
    // TODO: Implement actual ban functionality with API call
    console.log(`Banning users with IDs: ${selectedUsers.join(', ')}`);
    alert(`Selected users have been banned.`);
    setSelectedUsers([]);
    setIsBanMode(false);
    setShowConfirmModal(false);
  };

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleBanMode = () => {
    setIsBanMode(!isBanMode);
    if (!isBanMode) {
      setSelectedUsers([]);
    }
  };

  const getSelectedUsersNames = () => {
    return users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => `${user.firstName} ${user.lastName}`)
      .join(', ');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <div className="space-x-2">
            {isBanMode && (
              <Button
                variant="destructive"
                onClick={handleBanUsers}
                disabled={selectedUsers.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Ban
              </Button>
            )}
            <Button
              variant={isBanMode ? "outline" : "destructive"}
              onClick={toggleBanMode}
              className={!isBanMode ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            >
              {isBanMode ? "Cancel" : "Ban Users"}
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {isBanMode && <TableHead className="w-12"></TableHead>}
                <TableHead className="font-semibold text-gray-700">Full Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Age</TableHead>
                <TableHead className="font-semibold text-gray-700">Gender</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">User Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  {isBanMode && (
                    <TableCell>
                      {user.userType !== 'Admin' && (
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleCheckboxChange(user.id)}
                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                      )}
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
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(user)}
                      className="hover:bg-gray-100"
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Ban Users</DialogTitle>
              <DialogDescription>
                Are you sure you want to ban the following users? This action cannot be undone.
                <div className="mt-2 p-2 bg-red-50 rounded-md">
                  <p className="text-sm text-red-600">{getSelectedUsersNames()}</p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                variant="destructive"
                onClick={confirmBanUsers}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Ban Users
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default UsersPage; 