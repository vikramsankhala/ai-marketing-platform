import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  ContentCopy as ContentIcon,
  Campaign as CampaignIcon,
  Analytics as AnalyticsIcon,
  Social as SocialIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  TrendingUp,
  People,
  Chat,
  DynamicFeed,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

interface SidebarProps {
  onClose?: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    title: 'Content Hub',
    icon: <ContentIcon />,
    path: '/content',
    subItems: [
      { title: 'All Content', path: '/content' },
      { title: 'Blog Posts', path: '/content/blog' },
      { title: 'Social Media', path: '/content/social' },
      { title: 'Email Campaigns', path: '/content/email' },
      { title: 'Ads', path: '/content/ads' },
    ],
  },
  {
    title: 'Campaigns',
    icon: <CampaignIcon />,
    path: '/campaigns',
    subItems: [
      { title: 'All Campaigns', path: '/campaigns' },
      { title: 'Email Marketing', path: '/campaigns/email' },
      { title: 'Social Media', path: '/campaigns/social' },
      { title: 'Display Ads', path: '/campaigns/display' },
      { title: 'Search Ads', path: '/campaigns/search' },
    ],
  },
  {
    title: 'Analytics',
    icon: <AnalyticsIcon />,
    path: '/analytics',
    subItems: [
      { title: 'Overview', path: '/analytics' },
      { title: 'Performance', path: '/analytics/performance' },
      { title: 'Audience', path: '/analytics/audience' },
      { title: 'ROI Analysis', path: '/analytics/roi' },
      { title: 'Predictive', path: '/analytics/predictive' },
    ],
  },
  {
    title: 'Social Listening',
    icon: <SocialIcon />,
    path: '/social',
    subItems: [
      { title: 'Mentions', path: '/social' },
      { title: 'Sentiment', path: '/social/sentiment' },
      { title: 'Trends', path: '/social/trends' },
      { title: 'Influencers', path: '/social/influencers' },
    ],
  },
  {
    title: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
  },
]

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])

  const handleItemClick = (path: string) => {
    navigate(path)
    if (onClose) {
      onClose()
    }
  }

  const handleExpandClick = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <Box sx={{ width: 280, height: '100%' }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          AI Marketing
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Platform
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.subItems) {
                    handleExpandClick(item.title)
                  } else {
                    handleItemClick(item.path)
                  }
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                  color: isActive(item.path) ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive(item.path) 
                      ? 'primary.dark' 
                      : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'primary.contrastText' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
                {item.subItems && (
                  expandedItems.includes(item.title) ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>

            {/* Sub Items */}
            {item.subItems && (
              <Collapse 
                in={expandedItems.includes(item.title)} 
                timeout="auto" 
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.title} disablePadding>
                      <ListItemButton
                        onClick={() => handleItemClick(subItem.path)}
                        sx={{
                          pl: 4,
                          borderRadius: 2,
                          mb: 0.5,
                          backgroundColor: isActive(subItem.path) ? 'primary.main' : 'transparent',
                          color: isActive(subItem.path) ? 'primary.contrastText' : 'text.primary',
                          '&:hover': {
                            backgroundColor: isActive(subItem.path) 
                              ? 'primary.dark' 
                              : 'action.hover',
                          },
                        }}
                      >
                        <ListItemText 
                          primary={subItem.title}
                          primaryTypographyProps={{
                            fontSize: '0.8rem',
                            fontWeight: isActive(subItem.path) ? 600 : 400,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* Quick Stats */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Quick Stats
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp color="success" fontSize="small" />
            <Typography variant="caption">
              Revenue: +12.5%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People color="primary" fontSize="small" />
            <Typography variant="caption">
              Audience: 12.5K
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chat color="warning" fontSize="small" />
            <Typography variant="caption">
              Active Chats: 8
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DynamicFeed color="info" fontSize="small" />
            <Typography variant="caption">
              New Mentions: 24
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
