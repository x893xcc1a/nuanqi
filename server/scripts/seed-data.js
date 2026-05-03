
// 测试数据导入脚本
const bcrypt = require('bcryptjs');
const { User, Keeper, Order, Post, Payment } = require('../src/models');

// 测试数据
const testData = {
  users: [
    {
      openid: 'test_openid_001',
      nickname: '星河',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=star',
      role: 'seeker',
      status: 'active'
    },
    {
      openid: 'test_openid_002',
      nickname: '晨曦',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunrise',
      role: 'seeker',
      status: 'active'
    },
    {
      openid: 'test_openid_003',
      nickname: '晚风',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wind',
      role: 'keeper',
      status: 'active'
    },
    {
      openid: 'test_openid_004',
      nickname: '月光',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moon',
      role: 'keeper',
      status: 'active'
    },
    {
      openid: 'test_openid_005',
      nickname: '云端',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cloud',
      role: 'both',
      status: 'active'
    }
  ],
  keepers: [
    {
      real_name: '张雨晴',
      id_card: 'encrypted_110101199001011234',
      bio: '倾听是最好的陪伴。我是一名心理咨询师，拥有5年情感陪伴经验，擅长倾听与疏导。愿与你一起度过每一个迷茫的夜晚。',
      tags: ['情感疏导', '倾听陪伴', '压力释放'],
      hourly_rate: 600,
      status: 'approved',
      is_online: true
    },
    {
      real_name: '李星辰',
      id_card: 'encrypted_310101198805156789',
      bio: '每一颗星星都有自己的光芒。作为一名星空爱好者，我相信每个人都有独特的价值。让我们一起寻找内心的答案。',
      tags: ['人生困惑', '职业规划', '成长陪伴'],
      hourly_rate: 500,
      status: 'approved',
      is_online: true
    },
    {
      real_name: '王云端',
      id_card: 'encrypted_440301199212123456',
      bio: '云端之上，有更广阔的天空。我热爱生活，喜欢用温暖的话语治愈心灵。在这里，你可以安心倾诉。',
      tags: ['生活感悟', '人际关系', '情绪管理'],
      hourly_rate: 450,
      status: 'approved',
      is_online: false
    }
  ],
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
  ]
};

async function seedData() {
  try {
    console.log('正在导入测试数据...\n');

    // 1. 创建测试用户
    console.log('1. 创建测试用户...');
    const users = [];
    for (const userData of testData.users) {
      const user = await User.create(userData);
      users.push(user);
      console.log(`   ✅ 创建用户: ${user.nickname}`);
    }

    // 2. 创建守护者资料
    console.log('\n2. 创建守护者资料...');
    const keepers = [users[2], users[3], users[4]];
    for (let i = 0; i < testData.keepers.length; i++) {
      await Keeper.create({
        ...testData.keepers[i],
        user_id: keepers[i].id
      });
      console.log(`   ✅ 创建守护者: ${testData.keepers[i].real_name}`);
    }

    // 3. 创建广场动态
    console.log('\n3. 创建广场动态...');
    const postUsers = [users[0], users[1], users[0], users[3], users[1]];
    for (let i = 0; i < testData.posts.length; i++) {
      await Post.create({
        ...testData.posts[i],
        user_id: postUsers[i].id
      });
      console.log(`   ✅ 创建动态: ${testData.posts[i].is_anonymous ? testData.posts[i].lighthouse_no : postUsers[i].nickname}`);
    }

    // 4. 创建订单
    console.log('\n4. 创建订单...');
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

    console.log('\n🎉 测试数据导入完成！');
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

    process.exit(0);
  } catch (error) {
    console.error('❌ 导入失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedData();

