//DashboardLayout.jsx
import {Outlet, Link} from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors'>
            <Navbar />
            <main className='p-4 max-w-7xl mx-auto'>
                <Outlet />
            </main>
        </div>
    );
}