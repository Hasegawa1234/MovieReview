import React, { useState } from 'react'
import { TextField, InputAdornment, Button, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router'


export default function Search({ onSearch }) {
    const [query, setQuery] = useState('')
    const router = useRouter()
   // const [movies, setMovies] = useState([])

    const handleInputChange = event => {
        setQuery(event.target.value)
    }

    const handleSearchClick = e => {
        e.preventDefault()
        if (query) {
            router.push(`/search/${query}`)
        }
    }

   // const fetchMovies = async () => {
   //      if (query) {
   //         try {
   //             const response = await fetch(
   //                 `/api/getSearchResults?query=${query}`,
   //            )
   //             if (!response.ok) {
   //                 throw new Error('Network response was not ok')
   //             }
   //             const data = await response.json()
   //             setMovies(data.results)
   //             console.log(data)
   //         } catch (error) {
   //             console.error('Error fetching movies:', error)
   //         }
   //     }
   // }

   return (
    <div
        style={{
            width: '100%',
            display: 'flex',
            marginTop: '50px',
            justifyContent: 'center',
        }}>
        <Box
            sx={{
                width: '80%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                maxWidth: '500px',
            }}>
            <TextField
                variant="outlined"
                fullWidth
                placeholder="映画タイトルを検索"
                value={query}
                onChange={handleInputChange}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#e1e1e1ff',
                        borderRadius: '8px',
                        color: '#2e2e2eff',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#777',
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: '#252323ff',
                    },
                    '& .MuiSvgIcon-root': {
                        color: '#2b2a2aff',
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                variant="contained"
                sx={{
                    padding: '10px 20px',
                    minWidth: '80px', // ← これで横書き固定！
                    backgroundColor: '#e4e6eb', // 淡いグレー
                    color: '#333',
                    borderRadius: '10px',
                    textTransform: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    '&:hover': {
                        backgroundColor: '#dcdfe3',
                    },
                }}
                onClick={handleSearchClick}
            >
                検索
            </Button>
        </Box>
    </div>
   )
}
