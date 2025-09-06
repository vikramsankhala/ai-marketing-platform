import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import toast from 'react-hot-toast'

import { RootState } from '@store'
import { setUser, clearUser } from '@store/authSlice'
import { authService } from '@services/auth'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state: RootState) => state.auth)

  // Login mutation
  const loginMutation = useMutation(authService.login, {
    onSuccess: (data) => {
      dispatch(setUser(data.user))
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      toast.success('Login successful!')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed')
    },
  })

  // Register mutation
  const registerMutation = useMutation(authService.register, {
    onSuccess: (data) => {
      dispatch(setUser(data.user))
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      toast.success('Registration successful!')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed')
    },
  })

  // Logout function
  const logout = () => {
    dispatch(clearUser())
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  // Get user profile
  const { data: profile, isLoading: profileLoading } = useQuery(
    'userProfile',
    authService.getProfile,
    {
      enabled: !!token,
      onError: () => {
        logout()
      },
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation(authService.updateProfile, {
    onSuccess: (data) => {
      dispatch(setUser(data.user))
      toast.success('Profile updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Profile update failed')
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation(authService.changePassword, {
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Password change failed')
    },
  })

  return {
    user: user || profile?.user,
    token,
    isLoading: loginMutation.isLoading || registerMutation.isLoading || profileLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isLoading,
    isChangingPassword: changePasswordMutation.isLoading,
  }
}
