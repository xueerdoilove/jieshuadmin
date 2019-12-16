class Config {
  constructor() {

  }
}
var ce = 'https://91huidu.com/' // 正式域名
Config.restUrls = {
  // 获取用户id token
  'userlogin': ce + 'book/api/user',
  // 查询用户信息
  'userdata': ce + 'book/api/myprofile',



  // 书列表
  'booklist': ce + 'book/api/bookcip',
  // 搜索书
  'searchbooklist': ce + 'book/api/bookcipsearch',
  // 所有分类
  'catlist': ce + 'book/api/cat',
  // 根据分类查询书列表
  'bookcipbycat': ce + 'book/api/bookcipbycat',
  // 书详情
  'bookdetail': ce + 'book/api/bookcip/',
  // 收藏书
  'favor': ce + 'book/api/bookcip/',
  // 我的收藏
  'myfavor': ce + 'book/api/myfavorbookcip',
  // 附近的店
  'nearShoplist': ce + 'book/api/bookstorenearby',
  // 书店图片 list 
  'shopimglist': ce + 'book/api/bookstore/',
  // 书店详情
  'shopdetail': ce + 'book/api/bookstore/',
  // 查询指定书店的书
  'bookofshop': ce + 'book/api/bookcipbystore',

  // 运费价格
  'sendprice': ce + 'book/api/baseconfig/1',

  // 书单列表
  'shudanlist': ce + 'book/api/recommendlist/',
  // 根据 书单 查询书单书籍
  'bookbyshudan': ce + 'book/api/recommendlist/',
  // 收藏本书单 所以书 {id}/favor
  'scshudanallbook': ce + 'book/api/recommendlist/',



  // 加入线上书袋
  'onlinebookbag': ce + 'book/api/onlinebookbag',
  // 删除书袋
  'deletebookbag': ce + 'book/api/bookbag/',
  // 线下书袋 "qrCode": 3
  'offlinebookbag':ce + 'book/api/offlinebookbag',

  // 收货地址
  'adddizhi': ce + 'book/api/deliveryaddress',
  'dizhi': ce + 'book/api/deliveryaddress',

  // 下单
  'creatorder': ce + 'book/api/onlineordersum',
  'searchorder': ce + 'book/api/myordersum',
  'deleteorder': ce + 'book/api/ordersum/',
  'mydeleteorder': ce + 'book/api/myordersum/',
  'oneorder': ce + 'book/api/myordersum/',

  // 线下 下单
  'offlinecreatorder': ce + 'book/api/offlineordersum',
  // 通过 订单id 过去 二维码 店员确认
  "qrpath":ce + 'book/api/myordersum/',
  // 用户查询自己的 待归还的书(待归还(0),归还中(1),已归还(2)
  'mybookorder':ce + 'book/api/mybookorder',
  // 未支付订单 拉起支付
  'prepay':ce + 'book/api/myordersum/',
  // 查询快递
  'tracktrace': ce + 'book/api/ordersum/',
  // 搜不到书 提示 加书
  'extrabook' : ce + 'book/api/extrabook',
  
  // 书店详情弹框
  // 手机注册
  'verifycode':ce + 'book/api/verifycode',
  'phonebind': ce + 'book/api/phonebind',

  // 会员列表
  'membership':ce + 'book/api/membership',
  'membershiporder':ce + 'book/api/membershiporder',



  // 添加标签
  'myfavorcate': ce + 'book/api/myfavorcate',
  // 批量
  "batchfavorcategory": ce + 'book/api/batchfavorcategory',
  

  // 快递公司列表
  'expresslist':ce +'book/api/express',

  // 线上还书
  'onlinereturnordersum':ce +'book/api/onlinereturnordersum',
  // 线下还书
  'offlinereturnordersum':ce + 'book/api/offlinereturnordersum',
  // 我的还书订单列表
  'myreturnorder':ce + 'book/api/myreturnorder',
  // 我度过的书list
  'myreadbook': ce + 'book/api/myreadbook',
  // 附近的 点 搜索
  // 店铺详情 搜索书
  // 店铺进入的 书的详情 要可以扫码
  // 收货地址 编辑功能

}

export {
  Config
};
