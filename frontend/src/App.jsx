import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuctionList from "./components/AuctionList";
import AuctionItem from "./components/AuctionItem";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import BidForm from "./components/BidForm";
import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import CreateAuctionItem from "./components/CreateAuctionItem";
import EditAuctionItem from "./components/EditAuctionItem";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<AuthProvider>
			<Router>
				<NavBar />
				<Toaster />
				<div className="container mx-auto">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Logout />} />
						<Route path="/auctions" element={<AuctionList />} />

						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<Profile />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/auction/:id"
							element={
								<ProtectedRoute>
									<AuctionItem />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/auction/create"
							element={
								<ProtectedRoute>
									<CreateAuctionItem />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/auction/edit/:id"
							element={
								<ProtectedRoute>
									<EditAuctionItem />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/auction/bid/:id"
							element={
								<ProtectedRoute>
									<BidForm />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
