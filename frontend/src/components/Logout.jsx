import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function Logout() {
	const navigate = useNavigate();
	const { logout: signout } = useAuth();
	const hasLoggedOut = useRef(false); // Prevent multiple calls

	useEffect(() => {
		if (hasLoggedOut.current) return; // Prevent duplicate execution
		hasLoggedOut.current = true;

		const logout = async () => {
			try {
				await axios.post("https://quickbid-backend.onrender.com/api/users/logout", {});
				document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				signout();
				toast.success("Logged out Successfully!");
				navigate("/login");
			} catch (err) {
				console.error(err);
				toast.error(err.message);
			}
		};

		logout();
	}, [navigate, signout]);
}

export default Logout;

