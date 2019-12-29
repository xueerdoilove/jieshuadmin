<template>
  <div class="container">
    <el-row>
      <el-col :span="20">
        {{username}}
        所属门店
        <el-select class="riqi" v-model="bookStoreId" placeholder="请选择门店">
          <el-option
            v-for="store in storelist"
            :key="store.id"
            :label="store.name"
            :value="store.id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="showadd">添加权限菜单</el-button>
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col :span="4">
        <span>菜单名</span>
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
        <el-button @click="removecaidan(item.id,item.menuid)">删除</el-button>
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
    <div v-show="usermenulist.length==0" style="line-height:100px;text-align:center;">没有查到管理员的权限菜单列表</div>

    <el-dialog title="新增权限菜单" :visible.sync="show_add">
      <el-transfer
        v-model="caidanidlist"
        :titles="['可选授权菜单','已选菜单']"
        :props="{key:'seq',label:'name',disabled:'keyong'}"
        :data="menulist"
      ></el-transfer>
      <div style="margin-top:20px;">
        <el-button type="primary" @click="postcaidan">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { usermenu } from "@/api/user";
import { getstoreList } from "@/api/store";
import { getmenulist, postmenu, delmenu } from "@/api/baseconfig";

import Newuser from "./newone";
export default {
  named: "管理员权限列表",
  data() {
    return {
      bookStoreId: "",
      show_add: false,
      storelist: [],

      userid: "",
      username: "",
      usermenulist: [],
      page: 1,
      pageSize: 5,
      state: 1,
      totalItems: 0,

      menulist: [],
      caidanidlist: []
      // couponType: -1,
      // sk: "time",
      // so: "desc"
    };
  },
  mounted() {
    this.userid = this.$route.query.userid;
    this.username = this.$route.query.username;

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
    // 删除用户菜单
    removecaidan(menuid) {
      this.$confirm("确定删除用户授权菜单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delmenu({ userid: this.userid,menuid:menuid}).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getusermenu();
        });
      });
    },
    // 提交菜单
    postcaidan() {
      if (this.caidanidlist.length == 0) {
        this.$message("请至少选择一个菜单");
        return;
      }
      postmenu(this.userid, {
        menuIdList: this.caidanidlist,
        bookStoreId: 1
      }).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.show_add = false;
        this.caidanidlist = [];
        this.getusermenu();
      });
    },
    // 展示新增
    showadd() {
      this.show_add = true;
      this.getmenulist();
      this.getstoreList();
    },
    getstoreList() {
      if (this.storelist.length > 0) {
        return;
      }
      getstoreList({
        page: 1,
        pageSize: 50,
        state: 2 //state：状态：0停业,1未开业,2开业（默认值：1）
      })
        .then(res => {
          this.storelist = [{ name: "请选择门店", id: 0 }, ...res.items];
          localStorage.setItem(
            "storelist",
            JSON.stringify([{ name: "通用优惠券", id: 0 }, ...res.items])
          );
        })
        .catch(error => {});
    },
    changepage(e) {
      this.page = e;
      this.getusermenu();
    },
    getmenulist() {
      if (this.menulist.length > 0) {
        return;
      }
      getmenulist({
        page: 1,
        pageSize: 20,
        menuType: -1,
        state: 1
      }).then(res => {
        res.items.forEach(item => {
          item.keyong = false;
        });
        this.menulist = res.items;
      });
    },
    getusermenu() {
      //useradd?userType=1&state=1&sk=x&so=x&page=1&pageSize=10
      usermenu({
        id: this.userid
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
