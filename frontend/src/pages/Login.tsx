import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router-dom'

import { useAuth } from '@hooks/useAuth'

interface LoginForm {
  email: string
  password: string
}

const Login: React.FC = () => {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>()

  const onSubmit = (data: LoginForm) => {
    if (isLogin) {
      login(data)
    } else {
      // Handle registration
      console.log('Register:', data)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    reset()
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              AI Marketing Platform
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {!isLogin && (
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                {...register('confirmPassword', {
                  required: !isLogin ? 'Please confirm your password' : false,
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={<LoginIcon />}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link
                  component="button"
                  type="button"
                  onClick={toggleMode}
                  sx={{ textDecoration: 'none' }}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
