import { useParams } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ZoomIn, ZoomOut, RotateCcw, Ban } from 'lucide-react';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';

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
  jobTags?: string[]; // Optional job tags for job-seekers
}

const VerificationProfilePage = () => {
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [confirmBan, setConfirmBan] = useState(false);
  
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
    userType: "Job-seeker",
    status: "Active",
    verificationStatus: "Pending",
    jobTags: ["Web Development", "React", "TypeScript", "Node.js", "UI/UX Design"]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetImage = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleBanUser = () => {
    if (confirmBan) {
      setToastType('error');
      setToastMessage('User has been banned successfully');
      setShowToast(true);
      setShowBanDialog(false);
      setConfirmBan(false);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="hover:bg-gray-100"
            >
              ← Back to Verification
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Verification Profile</h1>
          </div>
          <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm px-6 py-2 rounded-md transition-colors duration-200"
              >
                <Ban className="w-4 h-4" />
                Ban User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-none shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-red-600 text-xl font-semibold">Ban User Confirmation</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to ban this user? This action cannot be undone.
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confirm-ban"
                    checked={confirmBan}
                    onCheckedChange={(checked: boolean) => setConfirmBan(checked)}
                  />
                  <Label htmlFor="confirm-ban" className="text-sm text-gray-600">
                    I confirm that I want to ban this user
                  </Label>
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
                  onClick={handleBanUser}
                  disabled={!confirmBan}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                >
                  Ban User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B153C]"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
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
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.verificationStatus)}`}
                    >
                      {getStatusIcon(user.verificationStatus)}
                      {user.verificationStatus}
                    </motion.span>
                  </div>
                  {user.userType === 'Job-seeker' && user.jobTags && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Job Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.jobTags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ID Images Section */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">ID Verification</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Front ID</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                          <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-600">Click to view ID Front Image</p>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-white p-6 rounded-xl shadow-2xl">
                        <DialogHeader className="pb-4 border-b border-gray-200">
                          <DialogTitle className="text-xl font-semibold text-gray-900">ID Front Image</DialogTitle>
                        </DialogHeader>
                        <div className="relative mt-6">
                          <div className="relative aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <div 
                              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
                              style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out'
                              }}
                            >
                              <img
                                src="/placeholder-id-front.jpg"
                                alt="ID Front"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleZoomOut}
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={resetImage}
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleRotate}
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleZoomIn}
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Back ID</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                          <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-600">Click to view ID Back Image</p>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-white p-6 rounded-xl shadow-2xl">
                        <DialogHeader className="pb-4 border-b border-gray-200">
                          <DialogTitle className="text-xl font-semibold text-gray-900">ID Back Image</DialogTitle>
                        </DialogHeader>
                        <div className="relative mt-6">
                          <div className="relative aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <div 
                              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
                              style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out'
                              }}
                            >
                              <img
                                src="/placeholder-id-back.jpg"
                                alt="ID Back"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleZoomOut}
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={resetImage}
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleRotate}
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleZoomIn}
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
                toastType === 'success' ? 'bg-green-500' :
                toastType === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
              } text-white`}
            >
              {toastType === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
               toastType === 'error' ? <XCircle className="w-5 h-5" /> :
               <AlertCircle className="w-5 h-5" />}
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default VerificationProfilePage; 