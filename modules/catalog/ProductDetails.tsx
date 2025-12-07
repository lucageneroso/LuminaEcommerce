import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProductService, ReviewService } from '../../services/mockApi';
import { Product, Review } from '../../types';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { Star, ShoppingCart, Heart, ArrowLeft, Truck, ShieldCheck, User as UserIcon, MessageSquare } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      
      const productRes = await ProductService.getById(id);
      if (productRes.success && productRes.data) {
        setProduct(productRes.data);
        
        // Load reviews only if product exists
        const reviewsRes = await ReviewService.getByProductId(id);
        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    };
    loadData();
  }, [id, navigate]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    setSubmittingReview(true);
    const res = await ReviewService.addReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: rating,
      comment: comment
    });

    if (res.success && res.data) {
      setReviews(prev => [res.data!, ...prev]);
      setComment('');
      setRating(5);
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) return null;

  const isWishlisted = wishlist.some(w => w.id === product.id);

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Catalog
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Section */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-8 lg:mb-0 shadow-sm border border-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-accent mb-2 uppercase tracking-wide">{product.category}</span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-500">
                <Star fill="currentColor" size={20} />
                <span className="ml-1 text-sm font-medium text-gray-900">{product.rating}</span>
                <span className="mx-2 text-gray-300">•</span>
                <a href="#reviews" className="text-sm text-gray-500 hover:text-primary cursor-pointer">{reviews.length} reviews</a>
              </div>
              <div className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>

            <p className="text-4xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>

            <div className="prose prose-slate text-gray-500 mb-8 leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="flex gap-4 mb-8 border-b border-gray-100 pb-8">
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`flex-1 px-8 py-4 rounded-full font-medium text-lg flex items-center justify-center gap-2 shadow-lg transform active:scale-95 transition-all ${
                  product.stock > 0
                    ? 'bg-primary text-white hover:bg-slate-800 hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={24} />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-full border transition-all ${
                  isWishlisted 
                    ? 'border-red-200 bg-red-50 text-red-500' 
                    : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                }`}
                title="Add to Wishlist"
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Truck size={24} className="text-gray-400" />
                <div>
                  <span className="font-medium text-gray-900 block">Free delivery</span>
                  <span>On orders over $100</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <ShieldCheck size={24} className="text-gray-400" />
                <div>
                  <span className="font-medium text-gray-900 block">2 year warranty</span>
                  <span>Full coverage included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-8">
              {reviews.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white pb-6 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <UserIcon size={14} />
                        </div>
                        <span className="font-medium text-gray-900">{review.userName}</span>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                
                {user ? (
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="text-yellow-500 hover:scale-110 transition-transform focus:outline-none"
                          >
                            <Star 
                              size={24} 
                              fill={star <= rating ? "currentColor" : "none"} 
                              className={star <= rating ? "" : "text-gray-300"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                      <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-3 border"
                        placeholder="Share your thoughts about this product..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Posting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">Please log in to share your experience.</p>
                    <Link 
                      to="/login"
                      className="inline-block bg-white text-primary border border-gray-300 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};