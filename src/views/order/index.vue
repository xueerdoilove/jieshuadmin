<template>
  <div class="container" >
    <el-row class="tiaojian_item">
      <el-col :span="10" :offset="1">
        <el-radio-group :disabled="canborrowType" v-model="borrowType" @change="changetiaojian">
          <el-radio :label="-1">全部</el-radio>
          <el-radio :label="1">线上订单</el-radio>
          <el-radio :label="0">店铺订单</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-input v-model="internalNoOfSearch" placeholder="请输入订单号"></el-input>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-button @click="getordersumapprove" >查询</el-button>
      </el-col>
    </el-row>
    <el-row class="tiaojian_item">
      <el-col :span="10" :offset="1">
        <el-radio-group v-model="ordertype">
          <el-radio :label="1">借阅订单</el-radio>
          <el-radio :label="2">还书订单</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row class="tiaojian_item">
      <el-col :span="22" :offset="1">
        <el-radio-group v-model="state" @change="changetiaojian">
          <el-radio :label="-1">全部</el-radio>
          <el-radio :label="0">待管理员确认</el-radio>
          <el-radio :label="1">待支付</el-radio>
          <el-radio :label="2">待发货</el-radio>
          <el-radio :label="3">待确认收货</el-radio>
          <el-radio :label="4">待归还</el-radio>
          <el-radio :label="5">已完成</el-radio>
          <el-radio :label="6">已取消</el-radio>
          <el-radio :label="7">交易关闭</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <div class="order_item">
      <div v-for="item in orderlist" v-bind:key="item.id" class="order-block">
        <div class="order-block-top">
          <div class="order-block-number">订单编号:{{item.internalNo}}</div>
          <div class="order-block-top-ms">{{item.borrowType==1?'线上':'店铺'}}</div>
        </div>
        <div class="order-block-mid" bindtap="gotoorderdetail">
          <bookItem v-for="book in item.bookOrderList" v-bind:key="book.id" :bookData="book"></bookItem>
        </div>
        <div class="order-block-foot">
          <div
            class="order-block-foot-total"
          >共{{item.bookCount}}本书 合计：¥{{item.totalCost/100}}（含运费¥{{item.freight/100}}）</div>
          <div class="order-block-foot-btns">
            <div
              v-if="item.state==0"
              class="btn"
              bindtap="dianyuanqueren"
              style="border:none;background-color:#f9f9f9;"
            >待确认</div>
            <div
              v-if="item.state==1"
              class="btn"
              style="border:none;background-color:#f9f9f9;"
              bindtap="prepay"
            >待支付订单</div>
            <div v-if="item.state==2" class="btn" style="border:none;background-color:#f9f9f9;">待出库</div>
            <div v-if="item.state==2" class="btn" @click="showchuku(item.internalNo)" style="border:none;background-color:none;">出库</div>
            <div v-if="item.state==3" class="btn">查看物流</div>
            <div v-if="item.state==3" class="btn" style="border:none;background-color:#f9f9f9;">已出库</div>
            <div v-if="item.state==4" class="btn" bindtap="gotoguihuan" style="border:none;background-color:#f9f9f9;">待归还图书</div>
            <div v-if="item.state==6" class="btn" style="border:none;background-color:#f9f9f9;">订单已取消</div>
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
      <div  style="overflow:hidden;">
        <div style="clear:both;" v-for="bookorder in chuku_orderdetail.bookOrderList" v-bind:key="bookorder.id">
          <el-row class="tiaojian_item">
            <el-col :span="8" :offset="0">
              <bookItem :bookData="bookorder"></bookItem>
            </el-col>
            <el-col :span="10" :offset="0" v-show="bookorder.bookId==0" style="padding-top:30px;">

              <el-input :ref="'qrcode_'+bookorder.id" v-model="bookorder.qrcode" type="number" placeholder="请输入书的编码进行绑定" ></el-input>
            </el-col>
            <el-col :span="5" :offset="1" v-show="bookorder.bookId==0" style="padding-top:30px;">
              <el-button @click="bindbookorderandqrcode(bookorder.id,bookorder.qrcode)">绑定</el-button>
            </el-col>
            <el-col :span="6" :offset="0" v-show="bookorder.bookId>0" style="padding-top:30px;">
              已绑定
            </el-col>
          </el-row>
        </div>
        <div style="clear:both;margin-top:20px;">
          <el-row class="tiaojian_item" >
            <el-col :span="7" :offset="1">快递公司</el-col>
            <el-col :span="10" >
              <el-select style="width:100%;" v-model="expressId" placeholder="请选择快递公司">
                <el-option v-for="kuaidi in kuaidilist" v-bind:key="kuaidi.id" :label="kuaidi.name" :value="kuaidi.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div style="clear:both;margin-top:20px;">
          <el-row class="tiaojian_item" >
            <el-col :span="7" :offset="1">快递单号</el-col>
            <el-col :span="10" >
              <el-input class="riqi" v-model="trackNo" placeholder="请填写快递单号"> </el-input>
            </el-col>
          </el-row>
        </div>
        <div style="clear:both;margin-top:20px;">
          <el-row class="tiaojian_item" >
            <el-col :span="7" :offset="1">.</el-col>
            <el-col :span="10" >
              <el-button style="width:100%;" @click="sendkuaidi" >提交</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getordersum ,getordersumapprove ,getordersumByid ,bindbookorderarcode ,sendbook} from "@/api/order";
import { getkuaidilist  } from "@/api/express";
import BookItem from "./bookitem";
// import { mapGetters } from 'vuex'
export default {
  named: "订单首页",
  data() {
    return {
      
      show_chuku:false,// 出库开关
      internalNo_chuku:'',
      chuku_orderdetail:'',
      expressId:0,
      trackNo:'',
      kuaidilist:[],

      internalNoOfSearch:'',

      canborrowType:false,
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
    if(localStorage.getItem('bookStoreId')){
      this.borrowType = 0;
      this.canborrowType = true;
    }else{
      this.canborrowType = false;
    }
    this.getordersum();
    this.getkuaidilist()
  },
  components: { BookItem },
  computed: {},
  methods: {
    // 发送快递
    sendkuaidi(){
      if(this.expressId==0){
        this.$message.error('请选择快递公司');
        return
      }
      if(this.trackNo.trim().length==0){
        this.$message.error('请输入快递单号');
        return
      }
      var a = this.chuku_orderdetail.bookOrderList
      for(var i =0;i<a.length;i++){
        if(a[i].bookId==0){
          this.$message.error('请先绑定书的编号');
          return
        }
      }

      sendbook({
        id:this.chuku_orderdetail.id,
        expressId:this.expressId,
        trackNo:this.trackNo
      }).then(res =>{
        this.show_chuku = false
        this.expressId = 0
        this.trackNo = ''
        this.$message({
          message: '修改成功,订单状态已经为 出库',
          type: 'success'
        });
        for(var i=0;i<this.orderlist.length;i++){
          if(this.orderlist[i].id==this.chuku_orderdetail.id){
            this.orderlist[i].state = 3
            this.orderlist = JSON.parse(JSON.stringify(this.orderlist))
            break;
          }
        }
      })

    },
    // 快递公司列表
    getkuaidilist(){
      getkuaidilist({
        page:1,
        pageSize:100,
      }).then(res =>{
        this.kuaidilist = [{name:'请选择快递公司',id:0},...res.items]
      })
    },
    //绑定书号qrcode
    bindbookorderandqrcode(bookorderid,qrcode){
      // bookorder/{id}/bind
      // {qrCode : 12345}
      // put
      this.$confirm('确定绑定编号为 '+qrcode+' 的书吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bindbookorderarcode({
          id:bookorderid,
          qrCode:qrcode
        }).then(res =>{
          this.getordersumdetailByInternalNo()
        })
      }).catch(() => {
                 
      });
      
    },
    // 展示订单详情 准备出库
    showchuku(internalNo){
      this.show_chuku = true;
      this.internalNo_chuku = internalNo;
      this.getordersumdetailByInternalNo()
    },
    getordersumdetailByInternalNo(){
      getordersumapprove({
        internalNo:this.internalNo_chuku,
      }).then(res =>{
        this.chuku_orderdetail = res.item
      })
    },
    // 根据 订单号查询 订单
    getordersumapprove(){
      getordersumapprove({
        internalNo:this.internalNoOfSearch,
      }).then(res =>{
        this.orderlist = [res.item];
        this.totalItems = 1;
        this.internalNoOfSearch = ''
      })
    },
    // 查询订单列表
    getordersum() {
      const loading = this.$loading({
        lock: false,
        target:document.querySelector(".app-main"),
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
      getordersum({
        // bookStoreId: -1,
        bookStoreId: localStorage.getItem("bookStoreId"),
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
      })
      setTimeout(() =>{
        loading.close();
      },2000)
    },
    // 页码切换 
    changepage(e) {
      this.page = e;
      this.getordersum();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    changetiaojian() {
      this.page = 1;
      this.getordersum();
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
</style>
