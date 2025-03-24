import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const sessionKey = localStorage.getItem("session_key"); // Use session storage

    if (!sessionKey) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;