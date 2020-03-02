<template>
  <div class="container">
    <el-row class="tiaojian_item">
      <el-col :span="10" :offset="1">
        <el-select
          class="riqi"
          v-model="bookStoreId"
          :disabled="ismendian"
          @change="getordersum"
          placeholder="请选择门店"
        >
          <el-option
            v-for="store in storelist"
            :key="store.id"
            :label="store.name"
            :value="store.id"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="5" :offset="1">
        <el-input v-model="internalNoOfSearch" placeholder="请输入订单号"></el-input>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-button @click="getordersumapprove">查询</el-button>
      </el-col>
    </el-row>
    <el-row class="tiaojian_item">
      <el-col :span="6" :offset="1">
        <el-radio-group v-model="ordertype" @change="changetiaojian">
          <el-radio :label="1">借阅订单</el-radio>
          <el-radio :label="2">还书订单</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="tiaojian_item">
      <el-col :span="22" :offset="1" v-show="ordertype==1">
        <el-radio-group v-model="state" @change="changetiaojian">
          <el-radio :label="-1">全部</el-radio>
          <el-radio :label="0">待店员确认</el-radio>
          <el-radio :label="2">待发货</el-radio>
          <el-radio :label="3">待确认收货</el-radio>
          <el-radio :label="4">待归还</el-radio>
          <el-radio :label="5">已完成</el-radio>
          <el-radio :label="6">已取消</el-radio>
          <el-radio :label="7">交易关闭</el-radio>
        </el-radio-group>
      </el-col>
      <!-- 状态：0待确认,1待退款,2完成,3取消,4关闭    -->
      <el-col :span="22" :offset="1" v-show="ordertype==2">
        <el-radio-group v-model="returnstate" @change="changetiaojian">
          <el-radio :label="0">待确认是否归还</el-radio>
          <el-radio :label="1">待退款</el-radio>
          <el-radio :label="2">完成</el-radio>
          <el-radio :label="3">取消</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <div class="order_item">
      <div v-for="item in orderlist" v-bind:key="item.id" class="order-block">
        <div class="order-block-top">
          <div class="order-block-number">订单编号:{{item.internalNo}}</div>
        </div>
        <div class="order-block-mid" bindtap="gotoorderdetail">
          <bookItem v-for="book in item.bookOrderList" v-bind:key="book.id" :bookData="book"></bookItem>
        </div>
        <div class="order-block-foot">
          <div
            v-if="ordertype==1"
            class="order-block-foot-total"
          >共{{item.bookCount}}本书 合计：¥{{item.totalCost/100}}（含运费¥{{item.freight/100}}）</div>
          <div
            v-if="ordertype==2"
            class="order-block-foot-total"
          >共{{item.bookCount}}本书 押金：¥{{item.deposit/100}}元</div>

          <div v-if="ordertype==1" class="order-block-foot-btns">
            <div
              v-if="item.state==0"
              class="btn"
              bindtap="dianyuanqueren"
              style="border:none;background-color:#f9f9f9;"
            >待店员确认</div>
            <div
              v-if="item.state==1"
              class="btn"
              style="border:none;background-color:#f9f9f9;"
              bindtap="prepay"
            >待支付订单</div>
            <div
              v-if="item.state==2"
              class="btn"
              @click="showchuku(item.internalNo)"
              style="border:none;background-color:#1f7872;color:#fff;"
            >出库</div>
            <div v-if="item.state==3" class="btn"  style="border:none;background-color:#1f7872;color:#fff;" @click="wuliuxinxi(item.id)">查看物流</div>
            <div v-if="item.state==3" class="btn" style="border:none;background-color:#f9f9f9;">已出库</div>
            <div
              v-if="item.state==4"
              class="btn"
              bindtap="gotoguihuan"
              style="border:none;background-color:#f9f9f9;"
            >待归还图书</div>
            <div
              v-if="item.state==6"
              class="btn"
              style="border:none;background-color:#f9f9f9;"
            >订单已取消</div>
          </div>
          <!-- 状态：0待确认,1待退款,2完成,3取消,4关闭    -->
          <div v-if="ordertype==2" class="order-block-foot-btns">
            <div
              v-if="item.state==0"
              class="btn"
              @click="queren(item.internalNo)"
              style="border:none;background-color:#1f7872;color:#fff;"
            >确认还书</div>
            <div
              v-if="item.state==1"
              class="btn"
              @click="tuikuan(item.internalNo)"
              style="border:none;background-color:#1f7872;color:#fff;"
            >退款</div>
            <div v-if="item.state==2" class="btn" >已完成</div>
            <div v-if="item.state==3" class="btn" style="border:none;background-color:#f9f9f9;">已取消</div>
            <div
              v-if="item.state==4"
              class="btn"
              bindtap="gotoguihuan"
              style="border:none;background-color:#f9f9f9;"
            >已关闭</div>
          </div>
        </div>
      </div>
    </div>

    <el-row class="tiaojian_item" v-show="totalItems>=pageSize">
      <el-col :span="20" :offset="2" style="text-align:center;">
        <el-pagination
          background
          :total="totalItems"
          :page-size="pageSize"
          :current-page="page"
          @current-change="changepage"
          layout="prev, pager, next"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-row class="tiaojian_item" v-show="totalItems==0">
      <el-col :span="20" :offset="2" style="text-align:center;">没有订单</el-col>
    </el-row>

    <el-dialog title="添加书号并发货" :visible.sync="show_chuku">
      <div style="overflow:hidden;">
        <div
          style="clear:both;"
          v-for="bookorder in chuku_orderdetail.bookOrderList"
          v-bind:key="bookorder.id"
        >
          <el-row class="tiaojian_item">
            <el-col :span="8" :offset="0">
              <bookItem :bookData="bookorder"></bookItem>
            </el-col>
            <el-col :span="10" :offset="0" v-show="bookorder.bookId==0" style="padding-top:30px;">
              <el-input
                :ref="'qrcode_'+bookorder.id"
                v-model="bookorder.qrcode"
                type="number"
                placeholder="请输入书的编码进行绑定"
              ></el-input>
            </el-col>
            <el-col :span="5" :offset="1" v-show="bookorder.bookId==0" style="padding-top:30px;">
              <el-button @click="bindbookorderandqrcode(bookorder.id,bookorder.qrcode)">绑定</el-button>
            </el-col>
            <el-col :span="6" :offset="0" v-show="bookorder.bookId>0" style="padding-top:30px;">已绑定</el-col>
          </el-row>
        </div>
        <div style="clear:both;margin-top:20px;">
          <el-row class="tiaojian_item">
            <el-col :span="7" :offset="1">快递公司</el-col>
            <el-col :span="10">
              <el-select style="width:100%;" v-model="expressId" placeholder="请选择快递公司">
                <el-option
                  v-for="kuaidi in kuaidilist"
                  v-bind:key="kuaidi.id"
                  :label="kuaidi.name"
                  :value="kuaidi.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div style="clear:both;margin-top:20px;">
          <el-row class="tiaojian_item">
            <el-col :span="7" :offset="1">快递单号</el-col>
            <el-col :span="10">
              <el-input class="riqi" v-model="trackNo" placeholder="请填写快递单号"></el-input>
            </el-col>
          </el-row>
        </div>
        <div style="clear:both;margin-top:20px;">
          <el-row class="tiaojian_item">
            <el-col :span="7" :offset="1">.</el-col>
            <el-col :span="10">
              <el-button style="width:100%;" @click="sendkuaidi">提交</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="物流信息" :visible.sync="show_wuliu">
      <div style="overflow:hidden">
        <!-- {
	            "orderSumId": 4568956,
	            "trackText": "到达北京市天安门广场",
	            "trackTime": "2019-08-26 09:44:14.0",
	            "id": 1,
	            "trackNo": "1435354324534"
        }-->
        <div class="wuliuitem" v-for="item in wuliulist" :key="item.id">
          <div class="mingxi">{{item.trackText}}</div>
          <div class="time">{{item.trackTime}}</div>
        </div>
        <div v-show="wuliulist.length==0">没有物流信息</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getordersum,
  getordersumapprove,
  getordersumByid,
  bindbookorderarcode,
  sendbook,
  gettracktrace,
  getreturnordersum,
  returnorderapprove,
  returnorderapprovebyinter
} from "@/api/order";
import { getstoreList } from "@/api/store";
import { getkuaidilist } from "@/api/express";
import BookItem from "./bookitem";
// import { mapGetters } from 'vuex'
export default {
  named: "订单首页",
  data() {
    return {
      show_wuliu: false,
      wuliulist: [], // 物流记录

      bookStoreId: 0,
      ismendian: false,
      storelist: [],

      show_chuku: false, // 出库开关
      internalNo_chuku: "",
      chuku_orderdetail: "",
      expressId: 0,
      trackNo: "",
      kuaidilist: [],

      internalNoOfSearch: "",
      returnstate: 0, //还书订单 状态：0待确认,1待退款,2完成,3取消,4关闭
      borrowType: -1, //借阅类型(线下借阅(0),在线借阅(1)) 默认为-1查全部
      ordertype: 1, // 1 借阅 2 还书
      state: -1, //（待管理员确认(0),待支付(1),待发货(2),待确认收货(3),待归还(4),已完成(5),已取消(6),交易关闭(7)）默认为-1查全部

      page: 1,
      pageSize: 5,
      sk: "time",
      so: "desc",

      orderlist: [],
      totalItems: 0
    };
  },
  mounted() {
    this.getstorelist();
    this.getkuaidilist();
  },
  components: { BookItem },
  computed: {},
  methods: {
    // 确认收到书了
    queren(internalNo) {
      this.$confirm("确定已经收到书了吗?确定后会把押金退还给用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        returnorderapprove({
          internalNo: internalNo
        }).then(res => {
          this.$message({
            message: "确认还书成功!",
            type: "success"
          });
          this.getorderlist();
        });
      });
    },
    // 退款确认
    tuikuan(internalNo) {},
    // 物流信息
    wuliuxinxi(id) {
      //ordersum/117/tracktrace?id=117&sk=time&so=desc
      gettracktrace({
        id: id,
        sk: "time",
        so: "desc"
      }).then(res => {
        this.wuliulist = res.items;

        this.show_wuliu = true;
      });
    },
    getstorelist() {
      getstoreList({
        page: 1,
        pageSize: 100,
        state: 2 //state：状态：0停业,1未开业,2开业（默认值：1）
      })
        .then(res => {
          this.storelist = [{ name: "全部订单", id: 0 }, ...res.items];
          localStorage.setItem(
            "storelist",
            JSON.stringify([{ name: "通用优惠券", id: 0 }, ...res.items])
          );
          if (localStorage.getItem("bookStoreId")) {
            this.bookStoreId = localStorage.getItem("bookStoreId") * 1;
            this.ismendian = true;
          } else {
            this.ismendian = false;
          }
          this.getorderlist();
        })
        .catch(error => {});
    },
    // 发送快递
    sendkuaidi() {
      if (this.expressId == 0) {
        this.$message.error("请选择快递公司");
        return;
      }
      if (this.trackNo.trim().length == 0) {
        this.$message.error("请输入快递单号");
        return;
      }
      var a = this.chuku_orderdetail.bookOrderList;
      for (var i = 0; i < a.length; i++) {
        if (a[i].bookId == 0) {
          this.$message.error("请先绑定书的编号");
          return;
        }
      }

      sendbook({
        id: this.chuku_orderdetail.id,
        expressId: this.expressId,
        trackNo: this.trackNo
      }).then(res => {
        this.show_chuku = false;
        this.expressId = 0;
        this.trackNo = "";
        this.$message({
          message: "修改成功,订单状态已经为 出库",
          type: "success"
        });
        for (var i = 0; i < this.orderlist.length; i++) {
          if (this.orderlist[i].id == this.chuku_orderdetail.id) {
            this.orderlist[i].state = 3;
            this.orderlist = JSON.parse(JSON.stringify(this.orderlist));
            break;
          }
        }
      });
    },
    // 快递公司列表
    getkuaidilist() {
      getkuaidilist({
        page: 1,
        pageSize: 100
      }).then(res => {
        this.kuaidilist = [{ name: "请选择快递公司", id: 0 }, ...res.items];
      });
    },
    //绑定书号qrcode
    bindbookorderandqrcode(bookorderid, qrcode) {
      // bookorder/{id}/bind
      // {qrCode : 12345}
      // put
      this.$confirm("确定绑定编号为 " + qrcode + " 的书吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          bindbookorderarcode({
            id: bookorderid,
            qrCode: qrcode
          }).then(res => {
            this.getordersumdetailByInternalNo();
          });
        })
        .catch(() => {});
    },
    // 展示订单详情 准备出库
    showchuku(internalNo) {
      this.show_chuku = true;
      this.internalNo_chuku = internalNo;
      this.getordersumdetailByInternalNo();
    },
    getordersumdetailByInternalNo() {
      getordersumapprove({
        internalNo: this.internalNo_chuku
      }).then(res => {
        this.chuku_orderdetail = res.item;
      }).catch(err =>{
        this.$message({
          message: "请使用门店管理员,进行出库操作",
        });
      })
    },
    // 根据 订单号查询 订单
    getordersumapprove() {
      if (this.ordertype == 1) {
        getordersumapprove({
          internalNo: this.internalNoOfSearch
        }).then(res => {
          this.orderlist = [res.item];
          this.totalItems = 1;
          this.internalNoOfSearch = "";
        });
      } else {
        //api/returnorderapprove?internalNo={internalNo}
        returnorderapprovebyinter({
          internalNo: this.internalNoOfSearch
        }).then(res => {
          this.orderlist = [res.item];
          this.totalItems = 1;
          this.internalNoOfSearch = "";
        });
      }
    },
    getorderlist() {
      if (this.ordertype == 1) {
        // 借书订单
        this.getordersum();
      } else if (this.ordertype == 2) {
        // 还书订单
        this.getreturnordersum();
      }
    },
    // 查询订单列表
    getordersum() {
      const loading = this.$loading({
        lock: false,
        target: document.querySelector(".app-main"),
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
      getordersum({
        // bookStoreId: -1,
        bookStoreId: this.bookStoreId,
        borrowType: this.borrowType,
        page: this.page,
        pageSize: this.pageSize,
        state: this.state,
        sk: this.sk,
        so: this.so
      }).then(res => {
        loading.close();
        this.orderlist = res.items;
        this.totalItems = res.totalItems;
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    // 查询还书订单列表
    getreturnordersum() {
      //api/bookstore/id/returnordersum
      const loading = this.$loading({
        lock: false,
        target: document.querySelector(".app-main"),
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
      getreturnordersum({
        bookStoreId: this.bookStoreId,
        page: this.page,
        pageSize: this.pageSize,
        state: this.returnstate,
        sk: this.sk,
        so: this.so
      }).then(res => {
        loading.close();
        this.orderlist = res.items;
        this.totalItems = res.totalItems;
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    // 页码切换
    changepage(e) {
      this.page = e;
      this.getorderlist();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    changetiaojian() {
      this.page = 1;
      this.getorderlist();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 30px;
}
.tiaojian_item {
  height: 40px;
  line-height: 40px;
  clear: both;
}
.order_item {
  padding: 0;
  margin-top: 30px;
}

/* order block */
.order-block {
  width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}
.order-block-top {
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  padding: 0 12px;
  color: #222;
}
.order-block-number {
  font-size: 16px;
  float: left;
  height: 40px;
  line-height: 40px;
}
.order-block-top-img {
  height: 34px;
  width: 80px;
  margin-top: 20px;
  margin-left: 20px;
  float: left;
}

.order-block-top-img .image {
  width: 100%;
  height: 100%;
  float: left;
}
.order-block-top-ms {
  height: 40px;
  line-height: 40px;
  color: #d13f31;
  font-size: 16px;
  float: right;
}

.order-block-mid {
  padding: 10px 12px 10px 30px;
  border-bottom: 1px solid #eee;
  overflow: hidden;
}

.order-block-foot {
  padding: 0 0 10px;
  overflow: hidden;
  border-bottom: 1px solid #eee;
}
.order-block-foot-total {
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  text-align: right;
  padding-right: 12px;
  box-sizing: border-box;
}
.btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #eee;
  border-radius: 6px;
  float: right;
  margin-right: 12px;
  background-color: #fff;
  font-size: 16px;
  margin-top: 10px;
  outline: none;
  text-align: center;
  cursor: pointer;
}

.wuliuitem {
  padding: 10px 35px;
  border-bottom: 1rpx solid #eee;
}
.mingxi {
  color: #333;
  font-size: 18px;
}
.time {
  color: #888;
  font-size: 16px;
  margin-top: 6px;
}
</style>
