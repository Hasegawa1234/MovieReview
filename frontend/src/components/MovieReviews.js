import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Modal,
    Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import ReviewForm from './ReviewForm'
import axiosClient from '@/lib/axios'
import { useAuth } from '@/hooks/auth'

export default function MovieReviews({ movieId }) {
    const [reviews, setReviews] = useState([])
    const [open, setOpen] = useState(false)
    const { user } = useAuth({ middleware: 'auth' })
    const [editingReview, setEditingReview] = useState(null)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/reviews?movie_id=${movieId}`,
                )
                const data = await response.json()
                setReviews(data)
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        }
        fetchReviews()
    }, [movieId])

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setEditingReview(null)
        setOpen(false)
    }

    const addReview = newReview => {
        if (editingReview) {
            // 編集モード、レビューを更新
            setReviews(
                reviews.map(review =>
                    review.id === newReview.id ? newReview : review,
                ),
            )
        } else {
            // レビューを追加
            setReviews([...reviews, newReview])
        }
        setEditingReview(null) // 編集モードを解除
    }

    // ★ 削除機能
    const handleDelete = async id => {
        if (window.confirm('このレビューを削除しますか？')) {
            try {
                const response = await axiosClient.delete(
                    `api/reviews/${id}`
                )
                const filteredReviews = reviews.filter(
                    review => review.id !== id,
                )
                setReviews(filteredReviews)
            } catch (error) {
                console.log(error)
            }
        }
    }

     const handleEdit = review => {
        setEditingReview(review)
        setOpen(true)
    }


    return (
        <div
            style={{
                backgroundColor: '#FFF',
                padding: '50px',
            }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{
                        border: '1px solid #B5B5B5',
                        borderRadius: '50px',
                        color: '#333333',
                        '&:hover': {
                            backgroundColor: '#A0A0A0',
                        },
                        fontWeight: 'bold',
                    }}>
                    レビューを投稿する
                </Button>
            </div>

            {/* モーダル */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '800px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '10px',
                    }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            padding: '10px',
                            '& .MuiSvgIcon-root': {
                                fontSize: '2rem',
                            },
                        }}>
                        <CloseIcon />
                    </IconButton>

                    <ReviewForm
                        addReview={addReview}
                        onSubmit={handleClose}
                        movieId={movieId}
                        reviewToEdit={editingReview}
                    />
                </Box>
            </Modal>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 4,
                }}>
                {reviews.map(review => (
                    <Card
                        key={review.id}
                        sx={{
                            maxWidth: 800,
                            margin: 'auto',
                            width: '80%',
                            p: '10px',
                        }}>
                        <CardContent>
                            <Typography variant="h6">
                                {review.user.name}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: 1,
                                }}>
                                {[...Array(review.rating)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        color="primary"
                                        sx={{ fontSize: '40px' }}
                                    />
                                ))}
                                {[...Array(5 - review.rating)].map(
                                    (_, index) => (
                                        <StarIcon
                                            key={index}
                                            color="disabled"
                                            sx={{ fontSize: '40px' }}
                                        />
                                    ),
                                )}
                                <Typography sx={{ marginLeft: 1 }}>
                                    ({review.rating}/5)
                                </Typography>
                            </Box>

                            <Typography sx={{ fontSize: '20px', mt: '10px' }}>
                                {review.review_text}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ marginBottom: 1, textAlign: 'right' }}>
                                {new Date(review.created_at).toLocaleString()}
                            </Typography>

                             {user && user.id === review.user.id && (
                                <>
                                    <Button      
                                        variant="outlined"
                                        sx={{ mt: 1, mr: 1 }}
                                        onClick={() => handleEdit(review)}>
                                        編集
                                    </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleDelete(review.id)}>
                                    削除
                                </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </div>
    )
}
