import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { MainLayout } from '../../components/layout/MainLayout';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock data - replace with actual API call
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Active"
    },
  ];

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(user)}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Name</h3>
                  <p>{selectedUser.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Role</h3>
                  <p>{selectedUser.role}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>{selectedUser.status}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default UsersPage; 