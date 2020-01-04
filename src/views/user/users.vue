<template>
  <div class="container">
    <el-row>
      <el-col :span="20">
        <!-- <el-radio-group v-model="state" @change="changetiaojian" style="margin-top:10px;">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">删除的</el-radio>
        </el-radio-group>
        
        gender: 1
        balance: 0
        phone: "15530081675"
        openId: "ocOh45KsY-r9qq25KiXDkVjMEAyA"
        name: "大灰狼"
        deposit: 0
        expireDate: "2022-10-23"
        id: 2
        sn: "47019076"
        membership: 2
        portrait: "https://91huidu.com/book/api/image/e5b156c7-35d8-4f9a-980b-753e1e9028ae"
        totalIte-->
        &nbsp;
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col :span="2">
        <span>头像</span>
      </el-col>
      <el-col :span="3">
        <span>姓名</span>
      </el-col>
      <el-col :span="2">
        <span>性别</span>
      </el-col>
      <el-col :span="4">
        <span>身份</span>
      </el-col>
      <el-col :span="4">
        <span>电话</span>
      </el-col>
      <el-col :span="3">
        <span>余额</span>
      </el-col>
      <el-col :span="3">
        <span>押金</span>
      </el-col>
      <el-col :span="3">
        <span>会员到期时间</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item" v-for="item in userlist" v-bind:key="item.id">
      <el-col :span="2">
        <span>
          <img style="height:70px;" :src="item.portrait" alt />
        </span>
      </el-col>
      <el-col :span="3">
        <span>{{item.name}}</span>
      </el-col>
      <el-col :span="2">
        <span>{{item.gender | gender }}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.membership | membership}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.phone}}</span>
      </el-col>
      <el-col :span="3">
        <span>{{item.balance/100}}元</span>
      </el-col>
      <el-col :span="3">
        <span>{{item.deposit/100}}元</span>
      </el-col>
      <el-col :span="3">
        <span>{{item.expireDate}}</span>
      </el-col>
    </el-row>
    <el-row class="tiaojian_item" v-show="totalItems>=pageSize">
      <el-col :span="20" :offset="2" style="text-align:center;margin-top:20px;">
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
    <div v-show="userlist.length==0" style="line-height:100px;text-align:center;">没有查到相应条件下的管理员列表</div>

    <el-dialog title="新增管理员" :visible.sync="show_new">
      <newuser v-if="show_new" @hidenew="hidenew" />
    </el-dialog>
  </div>
</template>

<script>
import { getuserlist } from "@/api/user";
import Newuser from "./newone";
export default {
  named: "优惠券",
  data() {
    return {
      show_edit: false,
      show_new: false,
      userlist: [],
      page: 1,
      pageSize: 5,
      state: 1,
      totalItems: 0
      // couponType: -1,
      // sk: "time",
      // so: "desc"
    };
  },
  mounted() {
    this.getuserlist();
  },
  components: { Newuser },
  filters: {
    gender(value) {
      if (value == 1) {
        return "男";
      } else if (value == 2) {
        return "女";
      } else if (value == 0) {
        return "未知";
      }
    },
    membership(num) {
      //注册用户(0),免费会员(1),付费会员(2);
      if (num == 0) {
        return "注册用户";
      } else if (num == 1) {
        return "免费会员";
      } else {
        return "付费会员";
      }
    }
  },
  computed: {},
  methods: {
    // 弹出新增人员
    shownew() {
      this.show_new = true;
    },
    // 弹出优惠券编辑
    showedit(id) {
      this.userlist.forEach(item => {
        if (item.id == id) {
          localStorage.setItem("oneuser", JSON.stringify(item));
          return;
        }
      });
      this.show_edit = true;
    },
    hideedit() {
      this.show_edit = false;
      this.getuserlist();
    },
    hidenew() {
      this.show_new = false;
      this.getuserlist();
    },
    changepage(e) {
      this.page = e;
      this.getuserlist();
    },
    getuserlist() {
      //useradd?userType=1&state=1&sk=x&so=x&page=1&pageSize=10 usertype 1 管理员 0 普通用户
      getuserlist({
        userType: 0,
        page: this.page,
        pageSize: this.pageSize,
        state: 1
      }).then(res => {
        if (res) {
          this.userlist = res.items;
          this.totalItems = res.totalItems;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 30px;
}
.coupon_item {
  height: 80px;
  border-bottom: 1px solid #eee;
  clear: both;
}
.coupon_item span {
  display: inline-flex;
  height: 80px;
  flex-direction: column;
  justify-content: center;
}
</style>
