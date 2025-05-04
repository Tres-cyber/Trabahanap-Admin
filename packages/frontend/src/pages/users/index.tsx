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

  const handleBanUser = (user: User) => {
    // TODO: Implement actual ban functionality with API call
    console.log(`Banning user: ${user.firstName} ${user.lastName}`);
    // Update user status to "Banned"
    // This is just a mock implementation
    alert(`User ${user.firstName} ${user.lastName} has been banned.`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
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
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
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
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(user)}
                      className="hover:bg-gray-100"
                    >
                      View Profile
                    </Button>
                    {user.userType !== 'Admin' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBanUser(user)}
                        className="hover:bg-red-700"
                      >
                        Ban User
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default UsersPage; 