
// 重置管理员密码脚本
const bcrypt = require('bcryptjs');
const { AdminUser } = require('../src/models');

async function resetAdmin() {
  try {
    console.log('正在重置管理员密码...');

    // 查找管理员
    let admin = await AdminUser.findOne({ where: { username: 'admin' } });

    const hashedPassword = bcrypt.hashSync('admin123', 10);

    if (admin) {
      // 更新密码
      admin.password = hashedPassword;
      await admin.save();
      console.log('✅ 管理员密码重置成功！');
    } else {
      // 创建新管理员
      await AdminUser.create({
        username: 'admin',
        password: hashedPassword,
        role: 'super_admin',
        nickname: '超级管理员',
        status: 'active'
      });
      console.log('✅ 管理员创建成功！');
    }

    console.log('\n登录信息:');
    console.log('   账号: admin');
    console.log('   密码: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ 重置失败:', error.message);
    process.exit(1);
  }
}

resetAdmin();

