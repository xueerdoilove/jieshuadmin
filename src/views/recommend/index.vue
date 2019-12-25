<template>
  <div class="container">
    <el-row>
      <el-col :span="20">
        <el-radio-group v-model="state" @change="changetiaojian" style="margin-top:10px;">
          <el-radio :label="2">上线的</el-radio>
          <!-- <el-radio :label="1">待上线</el-radio> -->
          <!-- <el-radio :label="0">已下线</el-radio> -->
        </el-radio-group>&nbsp;
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="shownewone">{{ show_new?'-收起':'+新增书单' }}</el-button>
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col :span="3" style="text-align:center;">
        <span>封面图</span>
      </el-col>
      <el-col :span="2" style="text-align:center;">
        <span>书单名</span>
      </el-col>
      <el-col :span="4" style="text-align:center;">
        <span>开始-结束时间</span>
      </el-col>
      <el-col :span="6" >
        <span>介绍</span>
      </el-col>
      <el-col :span="9" style="text-align:center;">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item img_item" v-for="item in list" v-bind:key="item.id">
      <el-col :span="3" >
        <div class="fmt">
          <img class="fmt1" :src="item.path[0]" v-if="item.path[0]" alt="">
          <img class="fmt2" :src="item.path[1]" v-if="item.path[1]" alt="">
          <img class="fmt3" :src="item.path[2]" v-if="item.path[2]" alt="">
          &nbsp;
        </div>
      </el-col>
      <el-col :span="2">
        <span>{{item.name}}</span>
      </el-col>
      <el-col :span="4" style="text-align:center;">
        <span>{{item.startTime | timerd}} <br><br>至<br><br>{{item.endTime | timerd}}</span>
      </el-col>
      <el-col :span="6">
        <textarea >{{item.introduction}}</textarea>
      </el-col>
      <el-col :span="9" style="padding-top:70px;text-align:center">
        <el-button @click="showedit(item.id)">编辑</el-button>
        <el-button @click="delone(item.id)">删除</el-button>
        <el-button @click="showshudan(item.id)">查看书单</el-button>
      </el-col>
    </el-row>

    <div v-show="list.length==0" style="line-height:100px;text-align:center;">没有查到相应条件下的书单</div>
    <el-dialog title="编辑书单" :visible.sync="show_edit">
      <editbaseconfig v-if="show_edit" @hideedit="hideedit" />
    </el-dialog>

    <el-dialog title="新增书单" :visible.sync="show_new">
      <newone v-if="show_new" @hideedit="hideedit" />
    </el-dialog>
  </div>
</template>

<script>
import { getlist, delrecommendlist } from "@/api/recommend";
import Editbaseconfig from "./edit";
import Newone from "./newone";
import booklist from "./booklist";
export default {
  named: "",
  data() {
    return {
      show_new: false,
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
    booklist,
    Newone
  },
  filters:{
    timerd(time){
      return time.replace('.0','')
    }
  },
  computed: {},
  methods: {
    //shownewone
    shownewone() {
      this.show_new = true;
    },
    // 弹出本周书单
    showshudan(id) {
      this.$router.push({ name: "onerecommend", params: { idd: id } });
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
      this.show_new = false;
      this.show_edit = false;
      this.mgetlist();
    },
    delone(id) {
      this.$confirm("确定删除本书单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delrecommendlist(id).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.mgetlist()
          });
        })
        .catch(() => {});
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
        sk: this.sk,
        so: this.so
      }).then(res => {
        this.list = res.items;
      });
    },
    getrecommendbookciplist(id) {
      getrecommendbookciplist({
        id: id
      }).then(res => {});
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
.coupon_item textarea {
  margin-top: 5px;
  height: 170px;
  width: 100%;
  border:1px solid #aaa;
}
.img_item{
  height: 180px;
  border-bottom: 1px solid #eee;
  clear: both;
}
.img_item span {
  display: inline-flex;
  height: 180px;
  flex-direction: column;
  justify-content: center;
}
.fmt{
  position: relative;
  width: 100%;
}
.fmt1{
  position: absolute;
  z-index: 10;
  left: 1px;
  top: 3px;
  width: 100px;
  height: 140px;
}
.fmt2{
  position: absolute;
  z-index: 8;
  left: 18px;
  top: 18px;
  width: 100px;
  height: 140px;
}
.fmt3{
  position: absolute;
  z-index: 6;
  left: 33px;
  top: 33px;
  width: 100px;
  height: 140px;
}
</style>
