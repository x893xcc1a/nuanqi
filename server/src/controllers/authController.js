const { User } = require('../models');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { getOpenidByCode, getUserInfo } = require('../utils/wechat');
const wechatConfig = require('../config/wechat');

class AuthController {
  // 【微信H5专用】微信登录 - 用code换取token
  async wechatLogin(req, res) {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ code: 400, message: '缺少code参数' });
      }
      
      // 1. 用code换取openid和access_token
      const oauthData = await getOpenidByCode(code);
      
      if (oauthData.errcode) {
        return res.status(400).json({ 
          code: 400, 
          message: '微信授权失败：' + oauthData.errmsg 
        });
      }
      
      const { openid, access_token, unionid } = oauthData;
      
      // 2. 查找或创建用户
      let user = await User.findOne({ where: { openid } });
      let isNewUser = false;
      
      if (!user) {
        // 新用户，创建基础记录
        user = await User.create({
          openid,
          unionid: unionid || null,
          role: 'seeker',
          status: 'active'
        });
        isNewUser = true;
      }
      
      // 3. 更新最后登录时间
      await user.update({ last_login_at: new Date() });
      
      // 4. 生成JWT token
      const token = generateToken({ 
        userId: user.id, 
        openid: user.openid,
        role: user.role 
      });
      
      const refreshToken = generateRefreshToken({ 
        userId: user.id 
      });
      
      res.json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          refreshToken,
          expiresIn: 7 * 24 * 60 * 60,
          user: {
            id: user.id,
            nickname: user.nickname,
            avatar_url: user.avatar_url,
            role: user.role,
            isNewUser
          }
        }
      });
    } catch (error) {
      console.error('Wechat login error:', error);
      res.status(500).json({ code: 500, message: '登录失败，请重试' });
    }
  }
  
  // 【微信H5专用】获取用户信息（需用户同意授权）
  async getUserInfo(req, res) {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ code: 400, message: '缺少code参数' });
      }
      
      const oauthData = await getOpenidByCode(code);
      
      if (oauthData.scope !== 'snsapi_userinfo') {
        return res.status(400).json({ 
          code: 400, 
          message: '未获得用户信息授权' 
        });
      }
      
      const userInfo = await getUserInfo(oauthData.access_token, oauthData.openid);
      
      // 更新用户信息
      await User.update(
        {
          nickname: userInfo.nickname,
          avatar_url: userInfo.headimgurl
        },
        { where: { openid: oauthData.openid } }
      );
      
      res.json({
        code: 200,
        data: {
          nickname: userInfo.nickname,
          avatar_url: userInfo.headimgurl
        }
      });
    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({ code: 500, message: '获取用户信息失败' });
    }
  }
  
  // 刷新token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const { verifyToken, generateToken } = require('../utils/jwt');
      
      const decoded = verifyToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({ code: 401, message: '刷新token无效' });
      }
      
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(404).json({ code: 404, message: '用户不存在' });
      }
      
      const newToken = generateToken({ 
        userId: user.id, 
        openid: user.openid,
        role: user.role 
      });
      
      res.json({
        code: 200,
        data: {
          token: newToken,
          expiresIn: 7 * 24 * 60 * 60
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ code: 500, message: '刷新失败' });
    }
  }
  
  // 【微信H5专用】生成微信授权URL
  getWechatAuthUrl(req, res) {
    const { redirectUri, scope = 'snsapi_base', state = '' } = req.query;
    
    // 【防坑提示】state参数用于防止CSRF攻击，必须校验
    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatConfig.appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
    
    res.json({
      code: 200,
      data: { authUrl }
    });
  }
}

module.exports = new AuthController();
