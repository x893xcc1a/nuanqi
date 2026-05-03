/**
 * 表单验证工具函数
 */

// 手机号验证 (中国手机号)
export const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/;
  if (!phone || phone.trim() === '') {
    return { valid: false, message: '请输入手机号' };
  }
  if (!reg.test(phone)) {
    return { valid: false, message: '请输入正确的手机号' };
  }
  return { valid: true, message: '' };
};

// 身份证号验证 (支持15位和18位)
export const validateIdCard = (idCard) => {
  if (!idCard || idCard.trim() === '') {
    return { valid: false, message: '请输入身份证号' };
  }
  
  const reg15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/;
  const reg18 = /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  
  if (!reg15.test(idCard) && !reg18.test(idCard)) {
    return { valid: false, message: '请输入正确的身份证号' };
  }
  
  // 如果是18位身份证，校验校验码
  if (idCard.length === 18) {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * weights[i];
    }
    
    const checkCode = checkCodes[sum % 11];
    if (idCard[17].toUpperCase() !== checkCode) {
      return { valid: false, message: '身份证号校验码错误' };
    }
  }
  
  return { valid: true, message: '' };
};

// 真实姓名验证
export const validateRealName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, message: '请输入真实姓名' };
  }
  
  const reg = /^[\u4e00-\u9fa5]{2,10}$/; // 2-10个中文汉字
  if (!reg.test(name)) {
    return { valid: false, message: '请输入真实姓名（2-10个汉字）' };
  }
  
  return { valid: true, message: '' };
};

// 昵称验证
export const validateNickname = (nickname) => {
  if (!nickname || nickname.trim() === '') {
    return { valid: false, message: '请输入昵称' };
  }
  
  if (nickname.length < 2 || nickname.length > 20) {
    return { valid: false, message: '昵称长度为2-20个字符' };
  }
  
  return { valid: true, message: '' };
};

// 个人简介验证
export const validateBio = (bio) => {
  if (!bio || bio.trim() === '') {
    return { valid: false, message: '请填写个人简介' };
  }
  
  if (bio.length < 10) {
    return { valid: false, message: '个人简介至少需要10个字符' };
  }
  
  if (bio.length > 500) {
    return { valid: false, message: '个人简介最多500个字符' };
  }
  
  return { valid: true, message: '' };
};

// 价格验证
export const validatePrice = (price) => {
  if (!price || isNaN(price)) {
    return { valid: false, message: '请输入价格' };
  }
  
  const num = parseFloat(price);
  if (num < 0 || num > 10000) {
    return { valid: false, message: '价格范围是0-10000元' };
  }
  
  return { valid: true, message: '' };
};

// 不能为空验证
export const validateRequired = (value, name = '此项') => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, message: `${name}不能为空` };
  }
  return { valid: true, message: '' };
};

// 守护者申请表单完整验证
export const validateKeeperApplication = (data) => {
  const errors = {};
  
  // 真实姓名
  const nameCheck = validateRealName(data.realName);
  if (!nameCheck.valid) {
    errors.realName = nameCheck.message;
  }
  
  // 身份证号
  const idCardCheck = validateIdCard(data.idCard);
  if (!idCardCheck.valid) {
    errors.idCard = idCardCheck.message;
  }
  
  // 个人简介
  const bioCheck = validateBio(data.bio);
  if (!bioCheck.valid) {
    errors.bio = bioCheck.message;
  }
  
  // 技能标签
  if (!data.tags || data.tags.length === 0) {
    errors.tags = '请至少选择一个技能标签';
  }
  
  // 价格
  const priceCheck = validatePrice(data.hourlyRate);
  if (!priceCheck.valid) {
    errors.hourlyRate = priceCheck.message;
  }
  
  // 认证图片
  if (!data.certificationImgs || data.certificationImgs.length === 0) {
    errors.certificationImgs = '请上传认证图片';
  }
  
  const valid = Object.keys(errors).length === 0;
  
  return { valid, errors };
};

// 动态发布验证
export const validatePost = (data) => {
  const errors = {};
  
  if (!data.content || data.content.trim().length < 5) {
    errors.content = '请输入至少5个字符的内容';
  } else if (data.content.length > 500) {
    errors.content = '内容最多500个字符';
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};
