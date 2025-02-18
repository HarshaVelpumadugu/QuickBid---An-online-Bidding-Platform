import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 3;

function Profile() {
	const [user, setUser] = useState(null);
	const [auctions, setAuctions] = useState([]);
	const [bids, setBids] = useState([]);
	const [wonAuctions, setWonAuctions] = useState([]);
	const [currentPageAuctions, setCurrentPageAuctions] = useState(1);
	const [currentPageBids, setCurrentPageBids] = useState(1);
	const [currentPageWon, setCurrentPageWon] = useState(1);
	const [totalPagesAuctions, setTotalPagesAuctions] = useState(1);
	const [totalPagesBids, setTotalPagesBids] = useState(1);
	const [totalPagesWon, setTotalPagesWon] = useState(1);

	useEffect(() => {
		const fetchUser = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/users/profile",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setUser(res.data);
				} catch (error) {
					console.log(error.message);
				}
			}
		};

		const fetchAuctions = async () => {
			const token = document.cookie
			.split("; ")
			.find((row) => row.startsWith("jwt="))
			?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/auctions/user",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setAuctions(res.data.auctionItems);
					setTotalPagesAuctions(
						Math.ceil(res.data.auctionItems.length / ITEMS_PER_PAGE)
					);
				} catch (error) {
					console.error(error);
				}
			}
		};

		const fetchBids = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/bids/user",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setBids(res.data.bids);
					setTotalPagesBids(
						Math.ceil(res.data.bids.length / ITEMS_PER_PAGE)
					);
				} catch (error) {
					console.error(error);
				}
			}
		};

		const fetchWonAuctions = async () => {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			if (token) {
				try {
					const res = await axios.post(
						"/api/auctions/won",
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					setWonAuctions(res.data.wonAuctions);
					setTotalPagesWon(
						Math.ceil(res.data.wonAuctions.length / ITEMS_PER_PAGE)
					);
				} catch (error) {
					console.error(error);
				}
			}
		};

		fetchUser();
		fetchAuctions();
		fetchBids();
		fetchWonAuctions();
	}, []);

	const handlePageChange = (page, type) => {
		if (page > 0) {
			if (type === "auctions") {
				if (page <= totalPagesAuctions) setCurrentPageAuctions(page);
			} else if (type === "bids") {
				if (page <= totalPagesBids) setCurrentPageBids(page);
			} else if (type === "won") {
				if (page <= totalPagesWon) setCurrentPageWon(page);
			}
		}
	};

	const startIndexAuctions = (currentPageAuctions - 1) * ITEMS_PER_PAGE;
	const endIndexAuctions = startIndexAuctions + ITEMS_PER_PAGE;
	const paginatedAuctions = auctions.slice(
		startIndexAuctions,
		endIndexAuctions
	);

	const startIndexBids = (currentPageBids - 1) * ITEMS_PER_PAGE;
	const endIndexBids = startIndexBids + ITEMS_PER_PAGE;
	const paginatedBids = bids.slice(startIndexBids, endIndexBids);

	const startIndexWon = (currentPageWon - 1) * ITEMS_PER_PAGE;
	const endIndexWon = startIndexWon + ITEMS_PER_PAGE;
	const paginatedWon = wonAuctions.slice(startIndexWon, endIndexWon);

	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-900">
				<div className="w-32 h-32 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen px-4 py-12 text-gray-300 bg-gray-900 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="overflow-hidden bg-gray-800 rounded-lg shadow-xl">
					<div className="p-6 sm:p-10">
						<h2 className="mb-6 text-3xl font-extrabold text-white">
							Profile
						</h2>
						<div className="p-6 mb-8 bg-gray-700 rounded-lg">
							<p className="mb-2 text-lg">
								<span className="font-semibold text-purple-400">
									Username:
								</span>{" "}
								{user.username}
							</p>
							<p className="mb-2 text-lg">
								<span className="font-semibold text-purple-400">
									Email:
								</span>{" "}
								{user.email}
							</p>
						</div>

						<div className="flex items-center justify-between mb-8">
							<h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 animate-pulse">
								Your Auctions 
							</h2>
							<Link
								to="/auction/create"
								className="inline-block px-6 py-3 text-lg font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-1"
							>
								Create Auction 
							</Link>
						</div>

						{paginatedAuctions.length ? (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{paginatedAuctions.map((auction) => (
									<div
										key={auction._id}
										className="overflow-hidden transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-xl hover:scale-105"
									>
										<div className="p-6">
											<h3 className="mb-3 text-2xl font-bold text-white">
												{auction.title}
											</h3>
											<p className="mb-4 text-gray-300">
												{auction.description}
											</p>
											<p className="mb-2 text-lg">
												<span className="font-semibold text-teal-400">
													Starting Bid:
												</span>{" "}
												<span className="font-bold text-green-400">
													${auction.startingBid}
												</span>
											</p>
											<p className="mb-4">
												<span className="font-semibold text-teal-400">
													End Date:
												</span>{" "}
												<span className="text-blue-300">
													{new Date(
														auction.endDate
													).toLocaleString()}
												</span>
											</p>
											<Link
												to={`/auction/${auction._id}`}
												className="inline-block px-6 py-3 text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 hover:shadow-md hover:-translate-y-1"
											>
												View Auction 🔍
											</Link>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-2xl text-gray-400 animate-pulse">
								No active auctions. Ready to start selling? 💼
							</p>
						)}

						<div className="flex items-center justify-between mt-6">
							<button
								onClick={() =>
									handlePageChange(
										currentPageAuctions - 1,
										"auctions"
									)
								}
								className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
									currentPageAuctions === 1
										? "cursor-not-allowed opacity-50"
										: ""
								}`}
								disabled={currentPageAuctions === 1}
							>
								Previous
							</button>
							<span className="text-gray-400">
								Page {currentPageAuctions} of{" "}
								{totalPagesAuctions === 0
									? 1
									: totalPagesAuctions}
							</span>
							<button
								onClick={() =>
									handlePageChange(
										currentPageAuctions + 1,
										"auctions"
									)
								}
								className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
									currentPageAuctions ===
										totalPagesAuctions ||
									totalPagesAuctions === 0
										? "cursor-not-allowed opacity-50"
										: ""
								}`}
								disabled={
									currentPageAuctions ===
										totalPagesAuctions ||
									totalPagesAuctions === 0
								}
							>
								Next
							</button>
						</div>

						<div className="mt-12">
							<h2 className="mb-8 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 animate-pulse">
								Your Bids
							</h2>

							{paginatedBids.length ? (
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{paginatedBids.map((bid) => (
										<div
											key={bid._id}
											className="overflow-hidden transition-all duration-300 rounded-lg shadow-md bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-xl hover:scale-105"
										>
											<div className="p-6">
												<h3 className="mb-3 text-2xl font-bold text-white">
													{bid.auctionItem.title}
												</h3>
												<p className="mb-4 text-gray-300">
													{
														bid.auctionItem
															.description
													}
												</p>
												<p className="mb-2 text-lg">
													<span className="font-semibold text-cyan-400">
														Bid Amount:
													</span>{" "}
													<span className="font-bold text-green-400">
														${bid.bidAmount}
													</span>
												</p>
												<p className="mb-4">
													<span className="font-semibold text-cyan-400">
														Bid Date:
													</span>{" "}
													<span className="text-blue-300">
														{new Date(
															bid.createdAt
														).toLocaleString()}
													</span>
												</p>
												<Link
													to={`/auction/${bid.auctionItem._id}`}
													className="inline-block px-6 py-3 text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-md hover:-translate-y-1"
												>
													View Auction 🔍
												</Link>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-2xl text-gray-400 animate-pulse">
									No active bids. Ready to join the
									excitement? 🚀
								</p>
							)}

							<div className="flex items-center justify-between mt-6">
								<button
									onClick={() =>
										handlePageChange(
											currentPageBids - 1,
											"bids"
										)
									}
									className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
										currentPageBids === 1
											? "cursor-not-allowed opacity-50"
											: ""
									}`}
									disabled={currentPageBids === 1}
								>
									Previous
								</button>
								<span className="text-gray-400">
									Page {currentPageBids} of{" "}
									{totalPagesBids === 0 ? 1 : totalPagesBids}
								</span>
								<button
									onClick={() =>
										handlePageChange(
											currentPageBids + 1,
											"bids"
										)
									}
									className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
										currentPageBids === totalPagesBids ||
										totalPagesBids === 0
											? "cursor-not-allowed opacity-50"
											: ""
									}`}
									disabled={
										currentPageBids === totalPagesBids ||
										totalPagesBids === 0
									}
								>
									Next
								</button>
							</div>
						</div>

						<div className="mt-12">
							<h2 className="mb-8 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
								🏆 Auctions won by you 
							</h2>

							{paginatedWon.length ? (
								<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
									{paginatedWon.map((auction) => (
										<div
											key={auction.auctionId}
											className="overflow-hidden transition-all duration-300 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500"
										>
											<div className="p-6 bg-gray-900 bg-opacity-80">
												<h3 className="mb-3 text-2xl font-bold text-white">
													{auction.title}
												</h3>
												<p className="mb-4 text-gray-300">
													{auction.description}
												</p>
												<p className="mb-2 text-lg">
													<span className="font-semibold text-yellow-300">
														Winning Bid:
													</span>{" "}
													<span className="font-bold text-green-400">
														${auction.winningBid}
													</span>
												</p>
												<p className="mb-4">
													<span className="font-semibold text-yellow-300">
														End Date:
													</span>{" "}
													<span className="text-blue-400">
														{new Date(
															auction.endDate
														).toLocaleString()}
													</span>
												</p>
												<Link
													to={`/auction/${auction.auctionId}`}
													className="inline-block px-6 py-3 text-lg font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 hover:shadow-md hover:-translate-y-1"
												>
													View Your Auction Item 
												</Link>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-2xl text-gray-400 animate-bounce">
									No wins yet,but your moment of victory is just around the corner!
								</p>
							)}

							<div className="flex items-center justify-between mt-6">
								<button
									onClick={() =>
										handlePageChange(
											currentPageWon - 1,
											"won"
										)
									}
									className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
										currentPageWon === 1
											? "cursor-not-allowed opacity-50"
											: ""
									}`}
									disabled={currentPageWon === 1}
								>
									Previous
								</button>
								<span className="text-gray-400">
									Page {currentPageWon} of{" "}
									{totalPagesWon === 0 ? 1 : totalPagesWon}
								</span>
								<button
									onClick={() =>
										handlePageChange(
											currentPageWon + 1,
											"won"
										)
									}
									className={`bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
										currentPageWon === totalPagesWon ||
										totalPagesWon === 0
											? "cursor-not-allowed opacity-50"
											: ""
									}`}
									disabled={
										currentPageWon === totalPagesWon ||
										totalPagesWon === 0
									}
								>
									Next
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;