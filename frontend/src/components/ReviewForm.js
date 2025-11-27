import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Rating } from '@mui/material'
import axiosClient from '@/lib/axios'

export default function ReviewForm({
    addReview,
    onSubmit,
    movieId,
    reviewToEdit,
}) {
    const [reviewText, setReviewText] = useState('')
    const [rating, setRating] = useState(0)
    const [error, setError] = useState('')

    // 編集モードの初期値セット
    useEffect(() => {
        if (reviewToEdit) {
            setReviewText(reviewToEdit.review_text)
            setRating(reviewToEdit.rating)
        }
    }, [reviewToEdit])

    const handleSubmit = async () => {
        if (reviewText.trim() === '' || rating === 0) {
            setError('レビューと評価は必須です')
            return
        }

        try {
            let response

            if (reviewToEdit) {
                // --- 編集モード ---
                response = await axiosClient.put(`/api/reviews/${reviewToEdit.id}`, {
                    review_text: reviewText,
                    rating: rating,
                })
            } else {
                // --- 新規投稿 ---
                response = await axiosClient.post(`/api/reviews`, {
                    review_text: reviewText,
                    rating: rating,
                    movie_id: movieId,
                })
            }

            const newReview = response.data.review
            addReview(newReview)

            // リセット
            setReviewText('')
            setRating(0)

            onSubmit() // モーダル閉じ
        } catch (error) {
            console.error(error)
            setError('エラーが発生しました')
        }
    }

    return (
        <Box
            sx={{
                my: 4,
                p: 4,
                width: '80%',
                maxWidth: '800px',
                mx: 'auto',
            }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {reviewToEdit ? 'レビューを編集する' : 'レビューを投稿する'}
            </Typography>

            <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                sx={{ fontSize: '40px' }}
            />

            <TextField
                label="レビュー"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="ここにレビューを入力してください"
                sx={{ mt: 1 }}
            />

            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}

            <Button
                variant="outlined"
                onClick={handleSubmit}
                sx={{
                    mt: 2,
                    border: '1px solid #B5B5B5',
                    color: '#333333',
                    '&:hover': {
                        backgroundColor: '#A0A0A0',
                    },
                }}>
                {reviewToEdit ? '更新する' : '投稿する'}
            </Button>
        </Box>
    )
}
