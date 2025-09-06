import React from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
} from '@mui/material'
import {
  TrendingUp,
  People,
  Campaign,
  ContentCopy,
  Refresh,
  MoreVert,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import MetricsCard from '@components/dashboard/MetricsCard'
import RealtimeChart from '@components/dashboard/RealtimeChart'

// Mock data
const metricsData = [
  {
    title: 'Total Revenue',
    value: '$45,231',
    change: '+12.5%',
    trend: 'up',
    icon: <TrendingUp />,
    color: '#4caf50',
  },
  {
    title: 'Active Campaigns',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: <Campaign />,
    color: '#2196f3',
  },
  {
    title: 'Content Pieces',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: <ContentCopy />,
    color: '#ff9800',
  },
  {
    title: 'Audience Size',
    value: '12.5K',
    change: '+5.1%',
    trend: 'up',
    icon: <People />,
    color: '#9c27b0',
  },
]

const revenueData = [
  { month: 'Jan', revenue: 4000, campaigns: 12 },
  { month: 'Feb', revenue: 3000, campaigns: 8 },
  { month: 'Mar', revenue: 5000, campaigns: 15 },
  { month: 'Apr', revenue: 4500, campaigns: 18 },
  { month: 'May', revenue: 6000, campaigns: 22 },
  { month: 'Jun', revenue: 5500, campaigns: 24 },
]

const campaignPerformance = [
  { name: 'Email Campaign', value: 35, color: '#8884d8' },
  { name: 'Social Media', value: 25, color: '#82ca9d' },
  { name: 'Display Ads', value: 20, color: '#ffc658' },
  { name: 'Search Ads', value: 20, color: '#ff7300' },
]

const recentActivities = [
  {
    id: 1,
    type: 'campaign',
    title: 'Summer Sale Campaign',
    status: 'active',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'content',
    title: 'New Blog Post Published',
    status: 'published',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'analytics',
    title: 'Weekly Report Generated',
    status: 'completed',
    time: '1 day ago',
  },
]

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Box>
          <IconButton>
            <Refresh />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        {metricsData.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricsCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={4}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue & Campaign Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="campaigns"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Campaign Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Campaign Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={campaignPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {campaignPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Real-time Analytics */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Analytics
              </Typography>
              <RealtimeChart />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <Box>
                {recentActivities.map((activity) => (
                  <Box
                    key={activity.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    py={2}
                    borderBottom="1px solid"
                    borderColor="divider"
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={activity.status}
                      size="small"
                      color={
                        activity.status === 'active'
                          ? 'success'
                          : activity.status === 'published'
                          ? 'primary'
                          : 'default'
                      }
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
