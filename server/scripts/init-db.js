
// 数据库初始化脚本 - 用于创建表并插入默认管理员
const bcrypt = require('bcryptjs');
const { sequelize, AdminUser } = require('../src/models');

async function initDB() {
  try {
    console.log('正在连接数据库...');
    await sequelize.authenticate();
    console.log('数据库连接成功！');

    // 同步模型
    console.log('正在同步数据库模型...');
    await sequelize.sync({ alter: true });
    console.log('模型同步成功！');

    // 检查是否已有管理员
    const existingAdmin = await AdminUser.findOne({ where: { username: 'admin' } });

    if (!existingAdmin) {
      console.log('正在创建默认管理员...');
      // 生成密码哈希 (密码: admin123)
      const hashedPassword = bcrypt.hashSync('admin123', 10);

      await AdminUser.create({
        username: 'admin',
        password: hashedPassword,
        role: 'super_admin',
        nickname: '超级管理员',
        status: 'active'
      });

      console.log('✅ 管理员创建成功！');
      console.log('   账号: admin');
      console.log('   密码: admin123');
    } else {
      console.log('管理员已存在，跳过创建。');
    }

    console.log('\n✅ 数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  }
}

initDB();

