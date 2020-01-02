<template>
  <div class="container">
    <el-row>
      <el-col :span="50">
        <el-select
          class="riqi"
          v-model="bookStoreId"
          :disabled="ismendian"
          @change="getincomestatslist"
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
    </el-row>
    <div v-show="bookStoreId>0" style="padding-top:20px;">
      <el-row>
        <el-col :span="20">
          <div>账户余额</div>
          <div style="color:#C7000B;margin-top:20px;">12477.00元</div>
        </el-col>
      </el-row>
      <el-row class="mx-head">
        <el-col :span="3" class="xuanze" :class="{'active':activeNum==0}">
          <div @click="checkxuanze(0)">最近交易记录</div>
        </el-col>
        <el-col :span="3" class="xuanze" :class="{'active':activeNum==1}">
          <div @click="checkxuanze(1)">收入记录</div>
        </el-col>
        <el-col :span="3" class="xuanze" :class="{'active':activeNum==2}">
          <div @click="checkxuanze(2)">退款记录</div>
        </el-col>
      </el-row>
      <el-row class="mx-body" v-for="item in incomestatslist" v-bind:key="item.id">
        <el-col :span="6">
          <div>{{item.startDate}}</div>
        </el-col>
        <el-col :span="6">
          <div>交易</div>
        </el-col>
        <el-col :span="6">
          <div>{{item.totalAmount}}</div>
        </el-col>
        <el-col :span="6">
          <div>明细</div>
        </el-col>
      </el-row>
      <div style="margin-top:30px;text-align:center;">暂无明细</div>
    </div>

    <el-dialog title="新增优惠券" :visible.sync="show_new"></el-dialog>
  </div>
</template>

<script>
import { getincomestatslist } from "@/api/incomestats";
import { getstoreList } from "@/api/store";
import NewCoupon from "./new";
// import { mapGetters } from 'vuex'
export default {
  named: "优惠券",
  data() {
    return {
      ismendian: false, // false 高级管理员 true 门店店员
      bookStoreId: 0,
      show_new: false,
      storelist: [],
      activeNum: 0,
      page: 1,
      pageSize: 100,
      state: 0, //未处理(0),已处理(1)）默认为0
      incomestatslist: [],
      // couponType: -1,
      sk: "time"
      // so: "desc"
    };
  },
  components: {
    // NewCoupon
  },
  computed: {},
  mounted() {
    this.getstorelist();
  },
  methods: {
    checkxuanze(num) {
      this.activeNum = num;
    },
    shownew() {
      this.show_new = !this.show_new;
    },
    // 获取交易流水记录
    getincomestatslist() {
      if (this.bookStoreId == 0) {
        return;
      }
      //incomestats?bookStoreId={bookStoreId}&state={state}&sk=xx&so=xx&page=1&pageSize=1
      getincomestatslist({
        bookStoreId: this.bookStoreId,
        state: this.state,
        sk: this.sk
      }).then(res => {
        this.incomestatslist = res.items;
      });
    },
    getstorelist() {
      getstoreList({
        page: 1,
        pageSize: 100,
        state: 2 //state：状态：0停业,1未开业,2开业（默认值：1）
      })
        .then(res => {
          this.storelist = [{ name: "请选择门店", id: 0 }, ...res.items];
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
        })
        .catch(error => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 30px;
}
.mx-head {
  height: 50px;
  margin-top: 30px;
  border: 1px solid #eee;
  line-height: 50px;
  text-align: center;
}
.active {
  background-color: #dcdddd;
}
.xuanze {
  cursor: pointer;
}
.mx-body {
  height: 50px;
  border: 1px solid #eee;
  line-height: 50px;
  text-align: center;
  border-top: none;
  clear: both;
}
</style>
