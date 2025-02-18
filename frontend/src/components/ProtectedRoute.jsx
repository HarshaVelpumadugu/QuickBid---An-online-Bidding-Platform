import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const location = useLocation();
	const token = document.cookie
		.split("; ")
		.find((row) => row.startsWith("jwt="))
		?.split("=")[1];
	return token ? (
		<Component {...rest} />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

ProtectedRoute.propTypes = {
	component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;