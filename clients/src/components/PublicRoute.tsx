import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();

    // Still checking localStorage? Show nothing to prevent flickering
    if (loading) {
        return null; 
    }

    // If user is ALREADY logged in, send them to the Home page
    if (user) {
        return <Navigate to="/" replace />;
    }

    // If not logged in, allow them to see the Landing/Login/Signup pages
    return children;
};

export default PublicRoute;
