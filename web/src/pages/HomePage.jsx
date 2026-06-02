
import { Navigate } from 'react-router-dom';

const HomePage = () => {
    // Redirect the root route to the admin login page as requested
    return <Navigate to="/admin/login" replace />;
};

export default HomePage;