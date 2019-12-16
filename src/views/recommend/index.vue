<template>
  <div class="container">
    <el-row>
      <el-col :span="20">
        <el-radio-group v-model="state" @change="changetiaojian" style="margin-top:10px;">
          <el-radio :label="2">上线的</el-radio>
          <el-radio :label="1">待上线</el-radio>
          <el-radio :label="0">已下线</el-radio>
        </el-radio-group>&nbsp;
      </el-col>
      <el-col :span="4">
        <el-button type="primary" >{{show_new?'-收起':'+新增书单'}}</el-button>
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col :span="2">
        <span>书单名</span>
      </el-col>
      <el-col :span="4">
        <span>开始时间</span>
      </el-col>
      <el-col :span="4">
        <span>结束时间</span>
      </el-col>
      <el-col :span="6">
        <span>介绍</span>
      </el-col>
      <el-col :span="4">
        <span>封面图</span>
      </el-col>
      <el-col :span="4">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item" v-for="item in list" v-bind:key="item.id">
      <el-col :span="2">
        <span>{{item.name}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.startTime}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.endTime}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{item.introduction}}</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.path[0]}}</span>
      </el-col>
      <el-col :span="4" style="padding-top:20px;">
        <el-button @click="showedit(item.id)">编辑</el-button>
        <el-button @click="showshudan(item.id)">查看书单</el-button>
      </el-col>
    </el-row>

    <div v-show="list.length==0" style="line-height:100px;text-align:center;">没有查到相应条件下的书单</div>
    <el-dialog title="编辑基础配置" :visible.sync="show_edit">
      <editbaseconfig v-if="show_edit" @hideedit="hideedit" />
    </el-dialog>

  </div>
</template>

<script>
import { getlist  } from "@/api/recommend";
import Editbaseconfig from "./edit";
import booklist from "./booklist";
export default {
  named: "优惠券",
  data() {
    return {
      show_new:false,
      show_edit: false,
      list: [],
      page: 1,
      pageSize: 10,
      state: 2,

      // couponType: -1,
      sk: "time",
      so: "desc"
    };
  },
  mounted() {
    this.mgetlist();
  },
  components: {
    Editbaseconfig,
    booklist
  },
  computed: {},
  methods: {
    // 弹出本周书单
    showshudan(id){
      this.$router.push({ name: 'booklist', params: { idd: id }})
    },
    // 弹出优惠券编辑
    showedit(id) {
      this.list.forEach(item => {
        if (item.id == id) {
          localStorage.setItem("editrecommend", JSON.stringify(item));
          return;
        }
      });
      this.show_edit = true;
    },
    hideedit() {
      this.show_edit = false;
      this.mgetlist();
    },
    changetiaojian() {
      this.page = 1;
      this.mgetlist();
    },
    mgetlist() {
      getlist({
        state: this.state,
        page: this.page,
        pageSize: this.pageSize,
        sk:this.sk,
        so:this.so,
      }).then(res => {
        this.list = res.items;
      });
    },
    getrecommendbookciplist(id){
      getrecommendbookciplist({
        id:id
      }).then(res =>{

      })
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
