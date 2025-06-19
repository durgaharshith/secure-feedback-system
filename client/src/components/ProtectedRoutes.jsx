//protectRoutes.js
import {Navigate, Outlet} from "react-router-dom";
import useAuth from '../hooks/useAuth';

const ProtectRoute = () => {
    const {auth } = useAuth();
    console.log('Auth status:', auth);

    return auth.accessToken ? <Outlet/> : <Navigate to='/login' replace />
}

export default ProtectRoute;