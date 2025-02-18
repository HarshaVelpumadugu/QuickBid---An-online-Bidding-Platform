import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BidForm = () => {
	const { id } = useParams();
	const [auctionItem, setAuctionItem] = useState(null);
	const [bidAmount, setBidAmount] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAuctionItem = async () => {
			const res = await axios.get(`/api/auctions/${id}`);
			setAuctionItem(res.data);
			setBidAmount(res.data.startingBid || "");
		};

		fetchAuctionItem();
	}, [id]);

	const handleBid = async (e) => {
		e.preventDefault();
		try {
			const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("jwt="))
				?.split("=")[1];
			await axios.post(
				"/api/bids",
				{ auctionItemId: id, bidAmount },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Bid placed Successfully!");
			navigate(`/auction/${id}`);
		} catch (err) {
			console.error(err);
			toast.error("Error in facing Bid");
		}
	};

	//if (!auctionItem) return <div>Loading...</div>;

	return (
		<div className="max-w-lg p-6 mx-auto mt-12 bg-white rounded-lg shadow-md">
			<h2 className="mb-6 text-3xl font-extrabold text-gray-800">
				Place a Bid
			</h2>
			<div className="p-4 mb-6 bg-gray-100 border border-gray-200 rounded-lg">
				<p className="text-lg font-medium text-gray-700">
					Starting Bid Amount:
				</p>
				<p className="text-2xl font-bold text-gray-900">
                     ${auctionItem?.startingBid ? auctionItem.startingBid.toFixed(2) : "N/A"}
                </p>

			</div>
			<form onSubmit={handleBid} className="space-y-4">
				<div>
					<label className="block mb-2 text-lg font-medium text-gray-700">
						Bid Amount
					</label>
					<input
						type="number"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						value={bidAmount}
						onChange={(e) => setBidAmount(e.target.value)}
						min={auctionItem?.startingBid || 0}
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				>
					Place Bid
				</button>
			</form>
		</div>
	);
};

export default BidForm;