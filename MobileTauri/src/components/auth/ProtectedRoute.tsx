import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children, allowedRoles }: any) => {
	const location = useLocation()

	const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
	const userRole = localStorage.getItem("userRole")

	if (!isAuthenticated) {
		return <Navigate to="/" state={{ from: location }} replace />
	}

	if (allowedRoles && !allowedRoles.includes(userRole)) {
		switch (userRole) {
			case "student":
				return <Navigate to="/dashboard" replace />
			default:
				return <Navigate to="/" replace />
		}
	}

	return children
}

export default ProtectedRoute
