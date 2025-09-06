import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
} from '@mui/material'
import {
  Search,
  Add,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Share,
  ContentCopy,
  Schedule,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'

import ContentGenerator from '@components/content/ContentGenerator'
import ContentEditor from '@components/content/ContentEditor'
import ContentLibrary from '@components/content/ContentLibrary'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const ContentHub: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const queryClient = useQueryClient()

  // Mock data - replace with actual API calls
  const { data: contentData, isLoading } = useQuery('content', async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      content: [
        {
          id: '1',
          title: '10 AI Marketing Strategies for 2024',
          type: 'blog',
          status: 'published',
          createdAt: '2024-01-15',
          tags: ['AI', 'Marketing', 'Strategy'],
          views: 1250,
        },
        {
          id: '2',
          title: 'Social Media Campaign: Summer Sale',
          type: 'social',
          status: 'draft',
          createdAt: '2024-01-14',
          tags: ['Social Media', 'Campaign', 'Sale'],
          views: 0,
        },
        {
          id: '3',
          title: 'Email Newsletter: Weekly Update',
          type: 'email',
          status: 'published',
          createdAt: '2024-01-13',
          tags: ['Email', 'Newsletter', 'Update'],
          views: 890,
        },
      ],
      total: 3,
    }
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, content: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedContent(content)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedContent(null)
  }

  const handleCreateContent = () => {
    setIsCreateDialogOpen(true)
  }

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false)
  }

  const filteredContent = contentData?.content.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  }) || []

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Content Hub
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateContent}
        >
          Create Content
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="blog">Blog Posts</MenuItem>
                  <MenuItem value="social">Social Media</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="ad">Ads</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="title">Title A-Z</MenuItem>
                  <MenuItem value="views">Most Views</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Content" />
          <Tab label="AI Generator" />
          <Tab label="Editor" />
          <Tab label="Library" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filteredContent.map((content: any) => (
            <Grid item xs={12} sm={6} md={4} key={content.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      label={content.type}
                      size="small"
                      color={
                        content.type === 'blog' ? 'primary' :
                        content.type === 'social' ? 'secondary' :
                        content.type === 'email' ? 'success' : 'warning'
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, content)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" component="h3" gutterBottom>
                    {content.title}
                  </Typography>

                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {content.tags.map((tag: string) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {content.views} views
                    </Typography>
                    <Chip
                      label={content.status}
                      size="small"
                      color={
                        content.status === 'published' ? 'success' :
                        content.status === 'draft' ? 'warning' : 'default'
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ContentGenerator />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ContentEditor />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ContentLibrary />
      </TabPanel>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ContentCopy sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Schedule sx={{ mr: 1 }} />
          Schedule
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Content Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Content</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Content Type</InputLabel>
            <Select
              label="Content Type"
              defaultValue="blog"
            >
              <MenuItem value="blog">Blog Post</MenuItem>
              <MenuItem value="social">Social Media Post</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="ad">Advertisement</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseCreateDialog}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ContentHub
