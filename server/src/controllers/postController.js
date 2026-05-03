const { Post, User } = require('../models');
const { Op } = require('sequelize');

class PostController {
  // 发布动态
  async createPost(req, res) {
    try {
      const { content, images, is_anonymous, mood_tag } = req.body;
      const userId = req.user.id;
      
      // 生成匿名编号
      let lighthouseNo = null;
      if (is_anonymous) {
        lighthouseNo = '#' + Math.floor(100 + Math.random() * 900);
      }
      
      const post = await Post.create({
        user_id: userId,
        content,
        images: images || [],
        is_anonymous: is_anonymous || false,
        lighthouse_no: lighthouseNo,
        mood_tag,
        status: 'pending' // 默认待审核，可配置自动通过
      });
      
      res.json({
        code: 200,
        message: '发布成功，等待审核',
        data: {
          id: post.id,
          lighthouse_no: post.lighthouse_no
        }
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ code: 500, message: '发布失败' });
    }
  }
  
  // 获取广场动态列表（瀑布流分页）
  async getPosts(req, res) {
    try {
      const { cursor = 0, limit = 10, mood_tag } = req.query;
      
      const where = { 
        status: 'approved'
      };
      
      if (mood_tag) {
        where.mood_tag = mood_tag;
      }
      
      // cursor分页：基于ID
      if (parseInt(cursor) > 0) {
        where.id = { [Op.lt]: parseInt(cursor) };
      }
      
      const posts = await Post.findAll({
        where,
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'nickname', 'avatar_url']
        }],
        limit: parseInt(limit) + 1, // 多取一条判断是否还有下一页
        order: [['id', 'DESC']]
      });
      
      const hasMore = posts.length > parseInt(limit);
      const list = hasMore ? posts.slice(0, -1) : posts;
      
      // 处理匿名数据
      const formattedList = list.map(post => ({
        id: post.id,
        content: post.content,
        images: post.images,
        is_anonymous: post.is_anonymous,
        lighthouse_no: post.lighthouse_no,
        likes_count: post.likes_count,
        mood_tag: post.mood_tag,
        created_at: post.created_at,
        author: post.is_anonymous ? null : {
          id: post.author.id,
          nickname: post.author.nickname,
          avatar_url: post.author.avatar_url
        }
      }));
      
      res.json({
        code: 200,
        data: {
          list: formattedList,
          nextCursor: hasMore ? list[list.length - 1].id : null,
          hasMore
        }
      });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ code: 500, message: '获取动态失败' });
    }
  }
  
  // 点赞动态
  async likePost(req, res) {
    try {
      const { id } = req.params;
      
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ code: 404, message: '动态不存在' });
      }
      
      // 【防坑提示】实际项目中应使用独立likes表记录谁点赞了
      await post.increment('likes_count');
      
      res.json({
        code: 200,
        message: '点赞成功',
        data: {
          likes_count: post.likes_count + 1
        }
      });
    } catch (error) {
      console.error('Like post error:', error);
      res.status(500).json({ code: 500, message: '操作失败' });
    }
  }
  
  // 获取动态详情
  async getPostDetail(req, res) {
    try {
      const { id } = req.params;
      
      const post = await Post.findOne({
        where: { id, status: 'approved' },
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'nickname', 'avatar_url']
        }]
      });
      
      if (!post) {
        return res.status(404).json({ code: 404, message: '动态不存在' });
      }
      
      res.json({
        code: 200,
        data: {
          id: post.id,
          content: post.content,
          images: post.images,
          is_anonymous: post.is_anonymous,
          lighthouse_no: post.lighthouse_no,
          likes_count: post.likes_count,
          mood_tag: post.mood_tag,
          created_at: post.created_at,
          author: post.is_anonymous ? null : post.author
        }
      });
    } catch (error) {
      console.error('Get post detail error:', error);
      res.status(500).json({ code: 500, message: '获取详情失败' });
    }
  }
}

module.exports = new PostController();
