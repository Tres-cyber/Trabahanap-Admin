import { useParams } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/button';

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

const UserProfilePage = () => {
  const { id } = useParams();
  
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
    userType: "Admin",
    status: "Active"
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
            ← Back to Users
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
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
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage; 