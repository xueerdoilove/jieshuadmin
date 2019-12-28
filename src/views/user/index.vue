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
        <el-button type="primary" @click="shownew">+新增管理员</el-button>
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
    <el-row class="coupon_item" v-for="item in userlist" v-bind:key="item.id">
      <el-col :span="4">
        <span>{{item.seq}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{item.name}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{item.configValue | zhanshi(item.seq)}}</span>
      </el-col>
      <el-col :span="6" style="padding-top:20px;">
        <el-button @click="showedit(item.id)">编辑</el-button>
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
      pageSize: 10,
      state: 1,
      totalItems: 0
      // couponType: -1,
      // sk: "time",
      // so: "desc"
    };
  },
  mounted() {},
  components: { Newuser },
  filters: {
    zhanshi(value, seq) {
      if (seq == 1) {
        return value / 100 + "元";
      } else if (seq == 2) {
        return value + "%";
      } else if (seq == 3) {
        return value + "分钟";
      } else if (seq == 4) {
        return value + "天";
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
    hidenew(){
      this.show_new = false;
      this.getuserlist()
    },
    changepage() {
      this.page = 1;
      this.getuserlist();
    },
    getuserlist() {
      getuserlist({ page: this.page, pageSize: this.pageSize }).then(res => {
        this.userlist = res.items;
        this.totalItems = res.totalItems;
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
}
.coupon_item span {
  display: inline-flex;
  height: 80px;
  flex-direction: column;
  justify-content: center;
}
</style>
