import { MainLayout } from '../../components/layout/MainLayout';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const HomePage = () => {
  // Sample data for the charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const applicationsData = {
    labels: months,
    datasets: [
      {
        label: 'Applications',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 85, 90],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const usersData = {
    labels: months,
    datasets: [
      {
        label: 'Users',
        data: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-indigo-50 to-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Total Users</dt>
                    <dd className="text-3xl font-bold text-gray-900">1,234</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-gradient-to-br from-emerald-50 to-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-100 p-3 rounded-lg">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Active Jobs</dt>
                    <dd className="text-3xl font-bold text-gray-900">567</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Applications */}
          <div className="bg-gradient-to-br from-purple-50 to-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 truncate">Total Applications</dt>
                    <dd className="text-3xl font-bold text-gray-900">2,345</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Applications Chart */}
          <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Applications</h3>
            <div className="h-[300px]">
              <Line options={chartOptions} data={applicationsData} />
            </div>
          </div>

          {/* Users Chart */}
          <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Users</h3>
            <div className="h-[300px]">
              <Line options={chartOptions} data={usersData} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}; 