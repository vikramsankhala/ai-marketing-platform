import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  LinearProgress,
  Alert,
} from '@mui/material'
import {
  AutoAwesome,
  ContentCopy,
  Refresh,
  Download,
} from '@mui/icons-material'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'

interface ContentRequest {
  prompt: string
  type: string
  tone: string
  length: string
  keywords: string[]
}

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [type, setType] = useState('blog')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')

  const generateContentMutation = useMutation(
    async (data: ContentRequest) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      return {
        content: `# ${data.prompt}\n\nThis is a ${data.tone} ${data.type} about ${data.prompt}. The content is ${data.length} length and includes the following keywords: ${data.keywords.join(', ')}.\n\n## Introduction\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n## Main Content\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n## Conclusion\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
        title: data.prompt,
        type: data.type,
        tone: data.tone,
      }
    },
    {
      onSuccess: (data) => {
        setGeneratedContent(data.content)
        toast.success('Content generated successfully!')
      },
      onError: () => {
        toast.error('Failed to generate content')
      },
    }
  )

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    generateContentMutation.mutate({
      prompt,
      type,
      tone,
      length,
      keywords,
    })
  }

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent)
    toast.success('Content copied to clipboard!')
  }

  const handleDownloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prompt.replace(/\s+/g, '-').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        AI Content Generator
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Generate high-quality content using AI. Describe what you want to create and let our AI do the rest.
      </Typography>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Settings
              </Typography>

              <TextField
                fullWidth
                label="What do you want to write about?"
                multiline
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Write a blog post about sustainable marketing practices"
                sx={{ mb: 3 }}
              />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Content Type</InputLabel>
                    <Select
                      value={type}
                      label="Content Type"
                      onChange={(e) => setType(e.target.value)}
                    >
                      <MenuItem value="blog">Blog Post</MenuItem>
                      <MenuItem value="social">Social Media</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="ad">Advertisement</MenuItem>
                      <MenuItem value="landing">Landing Page</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tone</InputLabel>
                    <Select
                      value={tone}
                      label="Tone"
                      onChange={(e) => setTone(e.target.value)}
                    >
                      <MenuItem value="professional">Professional</MenuItem>
                      <MenuItem value="casual">Casual</MenuItem>
                      <MenuItem value="friendly">Friendly</MenuItem>
                      <MenuItem value="authoritative">Authoritative</MenuItem>
                      <MenuItem value="conversational">Conversational</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Length</InputLabel>
                <Select
                  value={length}
                  label="Length"
                  onChange={(e) => setLength(e.target.value)}
                >
                  <MenuItem value="short">Short (100-300 words)</MenuItem>
                  <MenuItem value="medium">Medium (300-800 words)</MenuItem>
                  <MenuItem value="long">Long (800+ words)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Keywords (optional)
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <TextField
                    size="small"
                    placeholder="Add keyword"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddKeyword}
                    disabled={!keywordInput.trim()}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {keywords.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      onDelete={() => handleRemoveKeyword(keyword)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<AutoAwesome />}
                onClick={handleGenerate}
                disabled={generateContentMutation.isLoading}
              >
                {generateContentMutation.isLoading ? 'Generating...' : 'Generate Content'}
              </Button>

              {generateContentMutation.isLoading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    AI is crafting your content...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Content */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Generated Content
                </Typography>
                {generatedContent && (
                  <Box>
                    <Button
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={handleCopyContent}
                      sx={{ mr: 1 }}
                    >
                      Copy
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Download />}
                      onClick={handleDownloadContent}
                    >
                      Download
                    </Button>
                  </Box>
                )}
              </Box>

              {generatedContent ? (
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 1,
                    maxHeight: 400,
                    overflow: 'auto',
                  }}
                >
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {generatedContent}
                  </Typography>
                </Paper>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    color: 'text.secondary',
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2">
                    Generated content will appear here
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ContentGenerator
