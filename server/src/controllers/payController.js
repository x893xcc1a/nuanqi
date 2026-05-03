const { Order, Payment } = require('../models');
const { generatePaySign } = require('../utils/wechat');
const { generateNonceStr, generateTimestamp } = require('../utils/crypto');
const wechatConfig = require('../config/wechat');
const crypto = require('crypto');

class PayController {
  // 【微信H5专用】获取JSAPI支付配置
  async getJsapiConfig(req, res) {
    try {
      const { order_no } = req.body;
      const openid = req.user.openid;
      
      const order = await Order.findOne({
        where: { order_no, seeker_id: req.user.id, status: 'unpaid' }
      });
      
      if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在或已支付' });
      }
      
      // 生成预支付参数
      const nonceStr = generateNonceStr();
      const timeStamp = generateTimestamp();
      const prepayId = await this.unifiedOrder(order, openid, nonceStr);
      
      // 保存支付记录
      await Payment.create({
        order_no: order.order_no,
        amount: order.amount,
        status: 'pending',
        prepay_id: prepayId
      });
      
      // 【微信H5专用】生成前端调起支付所需参数
      const payParams = {
        appId: wechatConfig.appId,
        timeStamp,
        nonceStr,
        package: `prepay_id=${prepayId}`,
        signType: 'RSA'
      };
      
      // 使用商户私钥签名（实际项目中需配置）
      const paySign = this.generatePaySign(payParams);
      
      res.json({
        code: 200,
        data: {
          ...payParams,
          paySign
        }
      });
    } catch (error) {
      console.error('Get jsapi config error:', error);
      res.status(500).json({ code: 500, message: '获取支付配置失败' });
    }
  }
  
  // 统一下单（调用微信支付API）
  async unifiedOrder(order, openid, nonceStr) {
    // 【防坑提示】实际项目中需调用微信统一下单API
    // 此处为模拟实现，真实环境需按微信文档构造XML请求
    
    const params = {
      appid: wechatConfig.appId,
      mch_id: wechatConfig.mchId,
      nonce_str: nonceStr,
      body: `暖栖港湾-${this.getServiceName(order.service_type)}`,
      out_trade_no: order.order_no,
      total_fee: order.amount,
      spbill_create_ip: '127.0.0.1',
      notify_url: wechatConfig.notifyUrl,
      trade_type: 'JSAPI',
      openid
    };
    
    // 模拟返回prepay_id
    return `wx${Date.now()}${Math.random().toString(36).substr(2, 10)}`;
  }
  
  // 【微信H5专用】支付回调通知
  async payNotify(req, res) {
    try {
      const xmlData = req.body;
      
      // 【防坑提示】务必验证签名，防止伪造回调
      // 实际项目中需解析XML并验证签名
      
      // 模拟处理
      const { out_trade_no, transaction_id, result_code } = xmlData;
      
      if (result_code === 'SUCCESS') {
        // 更新订单状态
        await Order.update(
          { status: 'paid', paid_at: new Date() },
          { where: { order_no: out_trade_no } }
        );
        
        // 更新支付记录
        await Payment.update(
          { 
            status: 'success', 
            transaction_id,
            pay_time: new Date(),
            notify_data: xmlData
          },
          { where: { order_no: out_trade_no } }
        );
      }
      
      // 【微信H5专用】必须返回成功XML，否则微信会重复通知
      res.set('Content-Type', 'application/xml');
      res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>');
    } catch (error) {
      console.error('Pay notify error:', error);
      res.set('Content-Type', 'application/xml');
      res.send('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[处理失败]]></return_msg></xml>');
    }
  }
  
  // 查询订单支付状态
  async queryOrder(req, res) {
    try {
      const { order_no } = req.params;
      
      const payment = await Payment.findOne({
        where: { order_no }
      });
      
      res.json({
        code: 200,
        data: {
          status: payment?.status || 'unknown',
          payTime: payment?.pay_time
        }
      });
    } catch (error) {
      console.error('Query order error:', error);
      res.status(500).json({ code: 500, message: '查询失败' });
    }
  }
  
  // 生成支付签名
  generatePaySign(params) {
    // 【防坑提示】微信V3支付使用RSA签名，非MD5
    // 此处为简化示例，实际需使用商户私钥签名
    const stringA = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return crypto.createHash('sha256').update(stringA).digest('hex');
  }
  
  getServiceName(type) {
    const map = { text: '文字陪伴', voice: '语音通话', treehole: '树洞倾诉' };
    return map[type] || '陪伴服务';
  }
}

module.exports = new PayController();
