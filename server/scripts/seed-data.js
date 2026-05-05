
// 测试数据导入脚本 - 包含完整后台管理数据
const bcrypt = require('bcryptjs');
const {
  User, Keeper, Order, Post, Payment,
  ServiceCategory, Service, KeeperLevel,
  Coupon, AutoReply, CommonWord, FAQ,
  Setting, Conversation
} = require('../src/models');

// 完整测试数据
const testData = {
  // 用户数据
  users: [
    {
      openid: 'test_openid_001',
      nickname: '星河',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=star',
      role: 'seeker',
      phone: '13800138001',
      status: 'active'
    },
    {
      openid: 'test_openid_002',
      nickname: '晨曦',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunrise',
      role: 'seeker',
      phone: '13800138002',
      status: 'active'
    },
    {
      openid: 'test_openid_003',
      nickname: '晚风',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wind',
      role: 'keeper',
      phone: '13800138003',
      status: 'active'
    },
    {
      openid: 'test_openid_004',
      nickname: '月光',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moon',
      role: 'keeper',
      phone: '13800138004',
      status: 'active'
    },
    {
      openid: 'test_openid_005',
      nickname: '云端',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cloud',
      role: 'both',
      phone: '13800138005',
      status: 'active'
    }
  ],

  // 守护者数据
  keepers: [
    {
      real_name: '张雨晴',
      id_card: 'encrypted_110101199001011234',
      bio: '倾听是最好的陪伴。我是一名心理咨询师，拥有5年情感陪伴经验，擅长倾听与疏导。愿与你一起度过每一个迷茫的夜晚。',
      tags: ['情感疏导', '倾听陪伴', '压力释放'],
      hourly_rate: 600,
      level_id: 3,
      score: 1500,
      status: 'approved',
      is_online: true
    },
    {
      real_name: '李星辰',
      id_card: 'encrypted_310101198805156789',
      bio: '每一颗星星都有自己的光芒。作为一名星空爱好者，我相信每个人都有独特的价值。让我们一起寻找内心的答案。',
      tags: ['人生困惑', '职业规划', '成长陪伴'],
      hourly_rate: 500,
      level_id: 2,
      score: 800,
      status: 'approved',
      is_online: true
    },
    {
      real_name: '王云端',
      id_card: 'encrypted_440301199212123456',
      bio: '云端之上，有更广阔的天空。我热爱生活，喜欢用温暖的话语治愈心灵。在这里，你可以安心倾诉。',
      tags: ['生活感悟', '人际关系', '情绪管理'],
      hourly_rate: 450,
      level_id: 1,
      score: 300,
      status: 'approved',
      is_online: false
    }
  ],

  // 守护者等级
  keeperLevels: [
    { name: '新人守护者', icon: '🌱', min_score: 0, max_score: 500, discount: 100, color: '#94a3b8', sort: 1 },
    { name: '资深守护者', icon: '⭐', min_score: 501, max_score: 1500, discount: 95, color: '#f59e0b', sort: 2 },
    { name: '精英守护者', icon: '💎', min_score: 1501, max_score: 0, discount: 90, color: '#8b5cf6', sort: 3 }
  ],

  // 服务分类
  serviceCategories: [
    { name: '文字聊天', image: 'chat', status: 'active', is_blind_box: 0 },
    { name: '语音通话', image: 'voice', status: 'active', is_blind_box: 0 },
    { name: '树洞倾诉', image: 'treehole', status: 'active', is_blind_box: 0 },
    { name: '盲盒匹配', image: 'blindbox', status: 'active', is_blind_box: 1 }
  ],

  // 服务项目
  services: [
    { name: '15分钟聊天', category_id: 1, duration: 0.25, sort: 1 },
    { name: '30分钟聊天', category_id: 1, duration: 0.5, sort: 2 },
    { name: '60分钟聊天', category_id: 1, duration: 1, sort: 3 },
    { name: '15分钟语音', category_id: 2, duration: 0.25, sort: 1 },
    { name: '30分钟语音', category_id: 2, duration: 0.5, sort: 2 },
    { name: '树洞倾诉', category_id: 3, duration: 0.15, sort: 1 },
    { name: '盲盒15分钟', category_id: 4, duration: 0.25, sort: 1 },
    { name: '盲盒30分钟', category_id: 4, duration: 0.5, sort: 2 }
  ],

  // 优惠券
  coupons: [
    { name: '新用户专享', code: 'NEW2024', type: 'fixed', value: 100, min_amount: 200, total_count: 1000, used_count: 234, status: 'active' },
    { name: '周末特惠', code: 'WEEKEND', type: 'percentage', value: 20, min_amount: 0, total_count: 500, used_count: 123, status: 'active' },
    { name: '满减券', code: 'MAN100', type: 'fixed', value: 100, min_amount: 500, total_count: 200, used_count: 45, status: 'active' }
  ],

  // 广场动态
  posts: [
    {
      content: '今天的夕阳很美，但我却感到莫名的孤独。有时候觉得自己像一座孤岛，周围都是海水，却找不到靠岸的地方。',
      images: [],
      is_anonymous: false,
      mood_tag: '孤独',
      status: 'approved',
      likes_count: 23
    },
    {
      content: '#892 - 工作压力好大，每天都睡不着觉。不知道这样的日子还要持续多久...',
      images: [],
      is_anonymous: true,
      lighthouse_no: '#892',
      mood_tag: '焦虑',
      status: 'approved',
      likes_count: 45
    },
    {
      content: '今天和守护者聊了很久，感觉心里舒服多了。原来有人倾听也是一种幸福。感谢暖栖港湾，让我不再孤单。',
      images: [],
      is_anonymous: false,
      mood_tag: '感恩',
      status: 'approved',
      likes_count: 67
    },
    {
      content: '人生就像一场旅行，不必在乎目的地，在乎的是沿途的风景和看风景的心情。愿我们都能找到属于自己的风景。',
      images: [],
      is_anonymous: false,
      mood_tag: '感悟',
      status: 'approved',
      likes_count: 89
    },
    {
      content: '#1024 - 分手三个月了，还是放不下。每天都在想，如果当时我能做得更好...',
      images: [],
      is_anonymous: true,
      lighthouse_no: '#1024',
      mood_tag: '失恋',
      status: 'approved',
      likes_count: 156
    }
  ],

  // 订单数据
  orders: [
    {
      order_no: 'NQ202401010001',
      service_type: 'text',
      duration: 30,
      amount: 300,
      status: 'completed',
      remark: '最近工作压力很大，想找人聊聊',
      paid_at: new Date('2024-01-01 14:30:00')
    },
    {
      order_no: 'NQ202401020002',
      service_type: 'voice',
      duration: 60,
      amount: 600,
      status: 'completed',
      remark: '',
      paid_at: new Date('2024-01-02 20:00:00')
    },
    {
      order_no: 'NQ202401030003',
      service_type: 'treehole',
      duration: 15,
      amount: 150,
      status: 'completed',
      remark: '匿名倾诉',
      paid_at: new Date('2024-01-03 22:30:00')
    },
    {
      order_no: 'NQ202401050004',
      service_type: 'text',
      duration: 45,
      amount: 450,
      status: 'paid',
      remark: '情感问题咨询',
      paid_at: new Date('2024-01-05 19:00:00')
    },
    {
      order_no: 'NQ202401060005',
      service_type: 'text',
      duration: 30,
      amount: 300,
      status: 'unpaid',
      remark: '职业困惑'
    }
  ],

  // 微信自动回复
  autoReplies: [
    { keyword: '你好', reply: '你好呀，欢迎来到暖栖港湾！有什么可以帮你的吗？', type: 'keyword', status: 'active' },
    { keyword: '陪聊', reply: '我们提供文字、语音、树洞等多种陪伴服务，快来体验吧！', type: 'keyword', status: 'active' },
    { keyword: '', reply: '感谢您的关注！回复"陪聊"了解更多服务内容。', type: 'default', status: 'active' },
    { keyword: '', reply: '亲爱的朋友，关注你了！我们是你的温暖港湾～', type: 'subscribe', status: 'active' }
  ],

  // 常用语
  commonWords: [
    { name: '欢迎语', content: '你好！我是你的专属守护者，很高兴为你服务！', sort: 1, status: 'active' },
    { name: '结束语', content: '希望今天的对话能给你带来一些帮助和安慰。如果还有需要，随时可以再来找我。祝你晚安！', sort: 2, status: 'active' },
    { name: '安抚语', content: '我明白你的感受，很多时候都会有这样的情绪。没关系，我们可以慢慢聊，我会在这里陪着你。', sort: 3, status: 'active' }
  ],

  // 常见问题
  faqs: [
    { question: '如何成为守护者？', answer: '进入"我的"页面，点击"申请守护者"，填写资料并提交审核，审核通过后即可成为守护者。', sort: 1, status: 'active' },
    { question: '可以退款吗？', answer: '服务开始前可申请退款，服务开始后将根据已服务时长按比例退款。具体可查看用户协议。', sort: 2, status: 'active' },
    { question: '如何联系客服？', answer: '可通过公众号留言或邮件联系客服。工作时间：周一至周五 9:00-18:00。', sort: 3, status: 'active' }
  ],

  // 系统设置
  settings: [
    { key: 'site_name', value: '暖栖港湾', group: 'basic' },
    { key: 'site_desc', value: '一个温暖的心灵港湾', group: 'basic' },
    { key: 'service_hourly_rate', value: '600', group: 'service' },
    { key: 'min_withdraw_amount', value: '10000', group: 'finance' }
  ],

  // 会话记录
  conversations: [
    { last_message: '谢谢你的陪伴，我感觉好多了！', last_at: new Date('2024-01-05 15:30:00'), unread_count: 0 },
    { last_message: '好的，明天同一时间再见！', last_at: new Date('2024-01-04 21:00:00'), unread_count: 1 }
  ]
};

async function seedData() {
  try {
    console.log('正在导入完整测试数据...\n');

    // 1. 创建测试用户
    console.log('1. 创建测试用户...');
    const users = [];
    for (const userData of testData.users) {
      const user = await User.create(userData);
      users.push(user);
      console.log(`   ✅ 创建用户: ${user.nickname}`);
    }

    // 2. 创建守护者等级
    console.log('\n2. 创建守护者等级...');
    for (const level of testData.keeperLevels) {
      await KeeperLevel.create(level);
      console.log(`   ✅ 创建等级: ${level.name}`);
    }

    // 3. 创建守护者资料
    console.log('\n3. 创建守护者资料...');
    const keepers = [users[2], users[3], users[4]];
    for (let i = 0; i < testData.keepers.length; i++) {
      await Keeper.create({
        ...testData.keepers[i],
        user_id: keepers[i].id
      });
      console.log(`   ✅ 创建守护者: ${testData.keepers[i].real_name}`);
    }

    // 4. 创建服务分类
    console.log('\n4. 创建服务分类...');
    for (const category of testData.serviceCategories) {
      await ServiceCategory.create(category);
      console.log(`   ✅ 创建分类: ${category.name}`);
    }

    // 5. 创建服务项目
    console.log('\n5. 创建服务项目...');
    for (const service of testData.services) {
      await Service.create(service);
      console.log(`   ✅ 创建服务: ${service.name}`);
    }

    // 6. 创建优惠券
    console.log('\n6. 创建优惠券...');
    for (const coupon of testData.coupons) {
      await Coupon.create(coupon);
      console.log(`   ✅ 创建优惠券: ${coupon.name}`);
    }

    // 7. 创建广场动态
    console.log('\n7. 创建广场动态...');
    const postUsers = [users[0], users[1], users[0], users[3], users[1]];
    for (let i = 0; i < testData.posts.length; i++) {
      await Post.create({
        ...testData.posts[i],
        user_id: postUsers[i].id
      });
      console.log(`   ✅ 创建动态: ${testData.posts[i].is_anonymous ? testData.posts[i].lighthouse_no : postUsers[i].nickname}`);
    }

    // 8. 创建订单
    console.log('\n8. 创建订单...');
    const seekers = [users[0], users[1], users[0], users[1], users[0]];
    const keeperIds = [keepers[0].id, keepers[0].id, keepers[1].id, keepers[1].id, keepers[2].id];
    
    for (let i = 0; i < testData.orders.length; i++) {
      const order = await Order.create({
        ...testData.orders[i],
        seeker_id: seekers[i].id,
        keeper_id: keeperIds[i]
      });

      if (testData.orders[i].status !== 'unpaid') {
        await Payment.create({
          order_no: order.order_no,
          transaction_id: `wx${Date.now()}${i}`,
          amount: order.amount,
          status: 'success',
          prepay_id: `prepay_${Date.now()}${i}`,
          pay_time: testData.orders[i].paid_at
        });
      }
      console.log(`   ✅ 创建订单: ${order.order_no}`);
    }

    // 9. 创建微信自动回复
    console.log('\n9. 创建微信自动回复...');
    for (const reply of testData.autoReplies) {
      await AutoReply.create(reply);
      console.log(`   ✅ 创建自动回复: ${reply.type}`);
    }

    // 10. 创建常用语
    console.log('\n10. 创建常用语...');
    for (const word of testData.commonWords) {
      await CommonWord.create(word);
      console.log(`   ✅ 创建常用语: ${word.name}`);
    }

    // 11. 创建常见问题
    console.log('\n11. 创建常见问题...');
    for (const faq of testData.faqs) {
      await FAQ.create(faq);
      console.log(`   ✅ 创建FAQ: ${faq.question.substring(0, 10)}...`);
    }

    // 12. 创建系统设置
    console.log('\n12. 创建系统设置...');
    for (const setting of testData.settings) {
      await Setting.create(setting);
      console.log(`   ✅ 创建设置: ${setting.key}`);
    }

    // 13. 创建会话记录
    console.log('\n13. 创建会话记录...');
    const convPairs = [[users[0].id, keepers[0].id], [users[1].id, keepers[1].id]];
    for (let i = 0; i < testData.conversations.length; i++) {
      await Conversation.create({
        ...testData.conversations[i],
        user1_id: convPairs[i][0],
        user2_id: convPairs[i][1]
      });
      console.log(`   ✅ 创建会话 #${i+1}`);
    }

    console.log('\n🎉 完整测试数据导入完成！');
    console.log('\n测试账号信息:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ 用户（访客）                            │');
    console.log('│   openid: test_openid_001               │');
    console.log('│   昵称: 星河                           │');
    console.log('│                                         │');
    console.log('│ 用户（访客）                            │');
    console.log('│   openid: test_openid_002               │');
    console.log('│   昵称: 晨曦                           │');
    console.log('│                                         │');
    console.log('│ 守护者                                  │');
    console.log('│   openid: test_openid_003               │');
    console.log('│   昵称: 晚风（张雨晴）                  │');
    console.log('│                                         │');
    console.log('│ 守护者                                  │');
    console.log('│   openid: test_openid_004               │');
    console.log('│   昵称: 月光（李星辰）                  │');
    console.log('│                                         │');
    console.log('│ 双角色用户                              │');
    console.log('│   openid: test_openid_005               │');
    console.log('│   昵称: 云端（王云端）                  │');
    console.log('└─────────────────────────────────────────┘');
    console.log('\n后台管理:');
    console.log('   账号: admin');
    console.log('   密码: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ 导入失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedData();

