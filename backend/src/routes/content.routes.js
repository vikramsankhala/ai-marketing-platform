const express = require('express');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const logger = require('../utils/logger');
const { validateContent, validateContentUpdate, validateId, validatePagination, validateSearch } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/errorHandler.middleware');

const router = express.Router();

// Get all content with pagination and search
router.get('/', validatePagination, validateSearch, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, q, type } = req.query;
  const offset = (page - 1) * limit;
  const userId = req.user.id;

  let whereClause = 'WHERE user_id = $1';
  let queryParams = [userId];
  let paramCount = 1;

  if (q) {
    paramCount++;
    whereClause += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
    queryParams.push(`%${q}%`);
  }

  if (type) {
    paramCount++;
    whereClause += ` AND type = $${paramCount}`;
    queryParams.push(type);
  }

  // Get total count
  const countQuery = `SELECT COUNT(*) FROM content ${whereClause}`;
  const countResult = await database.query(countQuery, queryParams);
  const totalCount = parseInt(countResult.rows[0].count);

  // Get content
  const contentQuery = `
    SELECT id, title, content, type, status, tags, created_at, updated_at, published_at
    FROM content 
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
  `;
  
  queryParams.push(limit, offset);
  const result = await database.query(contentQuery, queryParams);

  res.json({
    success: true,
    data: {
      content: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        type: row.type,
        status: row.status,
        tags: row.tags || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        publishedAt: row.published_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  });
}));

// Get content by ID
router.get('/:id', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await database.query(
    `SELECT id, title, content, type, status, tags, created_at, updated_at, published_at
     FROM content 
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Content not found'
    });
  }

  const content = result.rows[0];

  res.json({
    success: true,
    data: {
      content: {
        id: content.id,
        title: content.title,
        content: content.content,
        type: content.type,
        status: content.status,
        tags: content.tags || [],
        createdAt: content.created_at,
        updatedAt: content.updated_at,
        publishedAt: content.published_at
      }
    }
  });
}));

// Create new content
router.post('/', validateContent, asyncHandler(async (req, res) => {
  const { title, content, type, status = 'draft', tags = [] } = req.body;
  const userId = req.user.id;
  const contentId = uuidv4();

  const result = await database.query(
    `INSERT INTO content (id, user_id, title, content, type, status, tags, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING id, title, content, type, status, tags, created_at, updated_at`,
    [contentId, userId, title, content, type, status, JSON.stringify(tags)]
  );

  const newContent = result.rows[0];

  logger.logBusinessEvent('content_created', {
    userId,
    contentId: newContent.id,
    type: newContent.type,
    status: newContent.status
  });

  res.status(201).json({
    success: true,
    message: 'Content created successfully',
    data: {
      content: {
        id: newContent.id,
        title: newContent.title,
        content: newContent.content,
        type: newContent.type,
        status: newContent.status,
        tags: newContent.tags || [],
        createdAt: newContent.created_at,
        updatedAt: newContent.updated_at
      }
    }
  });
}));

// Update content
router.put('/:id', validateId, validateContentUpdate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, status, tags } = req.body;
  const userId = req.user.id;

  // Check if content exists and belongs to user
  const existingContent = await database.query(
    'SELECT id FROM content WHERE id = $1 AND user_id = $2',
    [id, userId]
  );

  if (existingContent.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Content not found'
    });
  }

  // Build update query dynamically
  const updateFields = [];
  const updateValues = [];
  let paramCount = 0;

  if (title !== undefined) {
    paramCount++;
    updateFields.push(`title = $${paramCount}`);
    updateValues.push(title);
  }

  if (content !== undefined) {
    paramCount++;
    updateFields.push(`content = $${paramCount}`);
    updateValues.push(content);
  }

  if (status !== undefined) {
    paramCount++;
    updateFields.push(`status = $${paramCount}`);
    updateValues.push(status);
    
    // Set published_at if status is being changed to published
    if (status === 'published') {
      paramCount++;
      updateFields.push(`published_at = $${paramCount}`);
      updateValues.push(new Date());
    }
  }

  if (tags !== undefined) {
    paramCount++;
    updateFields.push(`tags = $${paramCount}`);
    updateValues.push(JSON.stringify(tags));
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update'
    });
  }

  updateFields.push(`updated_at = NOW()`);
  paramCount++;
  updateValues.push(id);
  paramCount++;
  updateValues.push(userId);

  const result = await database.query(
    `UPDATE content 
     SET ${updateFields.join(', ')}
     WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
     RETURNING id, title, content, type, status, tags, created_at, updated_at, published_at`,
    updateValues
  );

  const updatedContent = result.rows[0];

  logger.logBusinessEvent('content_updated', {
    userId,
    contentId: updatedContent.id,
    status: updatedContent.status
  });

  res.json({
    success: true,
    message: 'Content updated successfully',
    data: {
      content: {
        id: updatedContent.id,
        title: updatedContent.title,
        content: updatedContent.content,
        type: updatedContent.type,
        status: updatedContent.status,
        tags: updatedContent.tags || [],
        createdAt: updatedContent.created_at,
        updatedAt: updatedContent.updated_at,
        publishedAt: updatedContent.published_at
      }
    }
  });
}));

// Delete content
router.delete('/:id', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await database.query(
    'DELETE FROM content WHERE id = $1 AND user_id = $2 RETURNING id, title, type',
    [id, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Content not found'
    });
  }

  const deletedContent = result.rows[0];

  logger.logBusinessEvent('content_deleted', {
    userId,
    contentId: deletedContent.id,
    title: deletedContent.title,
    type: deletedContent.type
  });

  res.json({
    success: true,
    message: 'Content deleted successfully',
    data: {
      content: {
        id: deletedContent.id,
        title: deletedContent.title,
        type: deletedContent.type
      }
    }
  });
}));

// Publish content
router.post('/:id/publish', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await database.query(
    `UPDATE content 
     SET status = 'published', published_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, type, status, published_at`,
    [id, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Content not found'
    });
  }

  const content = result.rows[0];

  logger.logBusinessEvent('content_published', {
    userId,
    contentId: content.id,
    title: content.title,
    type: content.type
  });

  res.json({
    success: true,
    message: 'Content published successfully',
    data: {
      content: {
        id: content.id,
        title: content.title,
        type: content.type,
        status: content.status,
        publishedAt: content.published_at
      }
    }
  });
}));

// Archive content
router.post('/:id/archive', validateId, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await database.query(
    `UPDATE content 
     SET status = 'archived', updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, type, status`,
    [id, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Content not found'
    });
  }

  const content = result.rows[0];

  logger.logBusinessEvent('content_archived', {
    userId,
    contentId: content.id,
    title: content.title,
    type: content.type
  });

  res.json({
    success: true,
    message: 'Content archived successfully',
    data: {
      content: {
        id: content.id,
        title: content.title,
        type: content.type,
        status: content.status
      }
    }
  });
}));

// Get content statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const statsQuery = `
    SELECT 
      COUNT(*) as total_content,
      COUNT(CASE WHEN status = 'published' THEN 1 END) as published_content,
      COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_content,
      COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_content,
      COUNT(CASE WHEN type = 'blog' THEN 1 END) as blog_posts,
      COUNT(CASE WHEN type = 'social' THEN 1 END) as social_posts,
      COUNT(CASE WHEN type = 'email' THEN 1 END) as email_content,
      COUNT(CASE WHEN type = 'ad' THEN 1 END) as ad_content
    FROM content 
    WHERE user_id = $1
  `;

  const result = await database.query(statsQuery, [userId]);
  const stats = result.rows[0];

  res.json({
    success: true,
    data: {
      stats: {
        totalContent: parseInt(stats.total_content),
        publishedContent: parseInt(stats.published_content),
        draftContent: parseInt(stats.draft_content),
        archivedContent: parseInt(stats.archived_content),
        blogPosts: parseInt(stats.blog_posts),
        socialPosts: parseInt(stats.social_posts),
        emailContent: parseInt(stats.email_content),
        adContent: parseInt(stats.ad_content)
      }
    }
  });
}));

module.exports = router;
