<template>
  <div class="container">
    <el-row>
      <el-col :span="20">
        <!-- <el-radio-group v-model="state" @change="changetiaojian" style="margin-top:10px;">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">删除的</el-radio>
        </el-radio-group>-->
        &nbsp;
      </el-col>
      <el-col :span="4">
        <!-- <el-button type="primary" @click="shownew">+新增管理员</el-button> -->
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col :span="4">
        <span>姓名</span>
      </el-col>
      <el-col :span="6">
        <span>电话</span>
      </el-col>
      <el-col :span="6">
        <span>性别</span>
      </el-col>
      <el-col :span="6">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item" v-for="item in usermenulist" v-bind:key="item.id">
      <el-col :span="4">
        <span>{{item.name}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{item.phone}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{item.gender | gender }}</span>
      </el-col>
      <el-col :span="6" style="padding-top:20px;">
        <el-button >权限管理</el-button>
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
    <div v-show="usermenulist.length==0" style="line-height:100px;text-align:center;">没有查到相应条件下的管理员列表</div>

    <el-dialog title="新增管理员" :visible.sync="show_new">
      <newuser v-if="show_new" @hidenew="hidenew" />
    </el-dialog>
  </div>
</template>

<script>
import { usermenu } from "@/api/user";
import Newuser from "./newone";
export default {
  named: "管理员权限",
  data() {
    return {
      show_edit: false,
      show_new: false,
      usermenulist: [],
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
    console.log(this.$route)
    this.userid = this.$route.query.userid;

    this.getusermenu();
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
    }
  },
  computed: {},
  methods: {
    // 弹出新增人员
    shownew() {
      this.show_new = true;
    },
    
    hideedit() {
      this.show_edit = false;
      this.getusermenu();
    },
    hidenew() {
      this.show_new = false;
      this.getusermenu();
    },
    changepage(e) {
      this.page = e;
      this.getusermenu();
    },
    getusermenu() {
      //useradd?userType=1&state=1&sk=x&so=x&page=1&pageSize=10
      usermenu({
        id: this.userid,
      }).then(res => {
        if (res) {
          this.usermenulist = res.items;
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
