"use client"

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'

interface Review {
  _id: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

interface User {
  _id: string
  username: string
  email: string
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        // Basic validation - only check for _id and username which are required for reviews
        if (parsedUser && parsedUser._id && parsedUser.username) {
          setUser({
            _id: parsedUser._id,
            username: parsedUser.username,
            email: parsedUser.email || '' // Make email optional
          })
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Error parsing user data:', err)
        setUser(null)
      }
    } else {
      setUser(null)
    }

    // Fetch reviews
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/products/${productId}/reviews`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      setReviews(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Failed to load reviews')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?._id || !user?.username) {
      router.push('/login')
      return
    }

    if (!newReview.comment.trim()) {
      setError('Please enter a review comment')
      return
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      setError('Please select a rating between 1 and 5')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          userName: user.username,
          rating: newReview.rating,
          comment: newReview.comment.trim()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      // Reset form and refresh reviews
      setNewReview({ rating: 5, comment: '' })
      await fetchReviews()
    } catch (err) {
      console.error('Error submitting review:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>
  }

  return (
    <div className="space-y-6">
      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmitReview} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= newReview.rating
                        ? 'fill-primary text-primary'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2">Your Review</label>
            <Textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview(prev => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Write your review here..."
              required
              disabled={submitting}
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-lg text-center">
          Please <Button variant="link" onClick={() => router.push('/login')} className="px-1">log in</Button> to write a review
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {reviews.length === 0 ? 'No reviews yet' : 'Customer Reviews'}
        </h3>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-primary text-primary'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.userName}</span>
                  <span className="text-muted-foreground text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
