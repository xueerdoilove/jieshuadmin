<template>
  <div class="container">
    <el-row>
      <el-col :span="50">
        <el-select
          class="riqi"
          v-model="bookStoreId"
          :disabled="ismendian"
          @change="getincomelist"
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
        <!-- <el-col :span="20">
          <div>账户余额</div>
          <div style="color:#C7000B;margin-top:20px;">12477.00元</div>
        </el-col>-->
      </el-row>
      <el-row class="mx-head">
        <el-col :span="3" class="xuanze" :class="{'active':activeNum==0}">
          <div @click="checkxuanze(0)">最近交易记录</div>
        </el-col>
        <!-- <el-col :span="3" class="xuanze" :class="{'active':activeNum==1}">
          <div @click="checkxuanze(1)">收入记录</div>
        </el-col>-->
      </el-row>
      <el-row class="mx-body">
        <el-col :span="2">
          <div>订单类型</div>
        </el-col>
        <el-col :span="3">
          <div>押金</div>
        </el-col>
        <el-col :span="3">
          <div>借阅费</div>
        </el-col>
        <el-col :span="3">
          <div>运费</div>
        </el-col>
        <el-col :span="3">
          <div>会员费</div>
        </el-col>
        <el-col :span="3">
          <div>总计</div>
        </el-col>
      </el-row>
      <el-row class="mx-body" v-for="item in list" v-bind:key="item.id">
        <el-col :span="2">
          <div>{{item.orderType | orderType}}</div>
        </el-col>
        <el-col :span="3">
          <div>{{item.depositAmount/100}}元</div>
        </el-col>
        <el-col :span="3">
          <div>{{item.borrowCostAmount/100}}元</div>
        </el-col>
        <el-col :span="3">
          <div>{{item.freightAmount/100}}元</div>
        </el-col>
        <el-col :span="3">
          <div>{{item.membershipAmount/100}}元</div>
        </el-col>
        <el-col :span="3">
          <div>{{item.totalAmount/100}}元</div>
        </el-col>
      </el-row>
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
      <div v-show="totalItems==0" style="margin-top:30px;text-align:center;">暂无明细</div>
    </div>
  </div>
</template>

<script>
import { getincomestatslist, getincomelist } from "@/api/incomestats";
import { getstoreList } from "@/api/store";
export default {
  named: "账户管理",
  data() {
    return {
      ismendian: false, // false 高级管理员 true 门店店员
      bookStoreId: 0,
      show_new: false,
      storelist: [],
      activeNum: 0,
      page: 1,
      pageSize: 10,
      state: 0,
      totalItems: 0,
      list: [],
      sk: "time",
      so: "desc"
    };
  },
  components: {},
  computed: {},
  filters: {
    orderType(num) {
      // 订单类型，0: 借书总订单 ，1： 还书总订单 ，2： 会员总订单
      switch (num) {
        case 0:
          return "借书总订单";
          break;
        case 1:
          return "还书总订单";
          break;
        case 2:
          return "会员总订单";
          break;
      }
    }
  },
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
    changepage(page) {
      this.page = page;
      this.getincomelist();
    },
    // 获取交易流水记录
    getincomelist() {
      if (this.bookStoreId == 0) {
        return;
      }
      //incomestats?bookStoreId={bookStoreId}&state={state}&sk=xx&so=xx&page=1&pageSize=1
      getincomelist({
        bookStoreId: this.bookStoreId,
        state: this.state,
        sk: this.sk,
        so: this.so,
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.list = res.items;
        this.totalItems = res.totalItems;
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
            this.getincomelist();
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
