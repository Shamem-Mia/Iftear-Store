// components/RatingModal.jsx
import { useState } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import { X, Star, User, MessageCircle } from "lucide-react";

const RatingModal = ({ product, onClose, onRatingAdded }) => {
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState({
    user: "",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/products/${product._id}/ratings`
      );
      setRatings(data.ratings);
    } catch (error) {
      toast.error("Failed to fetch ratings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!newRating.user || !newRating.comment || newRating.rating === 0) {
      toast.error("Please fill all fields and select a rating");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post(`/products/${product._id}/ratings`, newRating);
      toast.success("Rating added successfully");
      setNewRating({ user: "", rating: 0, comment: "" });
      fetchRatings();
      onRatingAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            Ratings & Reviews - {product.name}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Add Rating Form */}
          <form
            onSubmit={handleSubmitRating}
            className="mb-6 p-4 border rounded-lg"
          >
            <h3 className="font-semibold mb-3">Add Your Rating</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <User size={16} />
                  Your Name
                </label>
                <input
                  type="text"
                  value={newRating.user}
                  onChange={(e) =>
                    setNewRating({ ...newRating, user: e.target.value })
                  }
                  className="w-full p-2 border rounded mt-1"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Star size={16} />
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewRating({ ...newRating, rating: star })
                      }
                      className={`p-1 ${
                        star <= newRating.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <Star
                        size={24}
                        className={
                          star <= newRating.rating ? "fill-yellow-400" : ""
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <MessageCircle size={16} />
                  Comment
                </label>
                <textarea
                  value={newRating.comment}
                  onChange={(e) =>
                    setNewRating({ ...newRating, comment: e.target.value })
                  }
                  className="w-full p-2 border rounded mt-1"
                  rows={3}
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </form>

          {/* Ratings List */}
          <div>
            <h3 className="font-semibold mb-3">
              Customer Reviews ({ratings.length})
            </h3>
            {loading ? (
              <div className="text-center py-4">Loading ratings...</div>
            ) : ratings.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No ratings yet
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {ratings.map((rating, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{rating.user}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= rating.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{rating.comment}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
