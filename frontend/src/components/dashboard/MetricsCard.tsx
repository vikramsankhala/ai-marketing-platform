import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
} from '@mui/icons-material'

interface MetricsCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
  color: string
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  color,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}30`,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {icon}
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        <Typography variant="h4" component="div" fontWeight="bold" mb={1}>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {title}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            label={change}
            size="small"
            color={trend === 'up' ? 'success' : 'error'}
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              height: 24,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            vs last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MetricsCard
