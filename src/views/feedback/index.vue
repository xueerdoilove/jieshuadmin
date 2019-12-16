<template>
  <div class="container">
    <el-row>
      <el-col :span="14">
        <el-radio-group v-model="state" @change="changetiaojian" style="margin-top:10px;">
          <el-radio :label="0">待处理</el-radio>
          <el-radio :label="1">已处理</el-radio>
          <el-radio :label="2">不可处理</el-radio>
        </el-radio-group>&nbsp;
      </el-col>
      <el-col :span="4">
        <!-- <el-button type="primary" @click="shownew">{{show_new?'-收起':'+新增'}}</el-button> -->
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col :span="6">
        <span>作者</span>
      </el-col>
      <el-col :span="6">
        <span>书名</span>
      </el-col>
      <!-- <el-col :span="6">
        <span>反馈者用户id</span>
      </el-col>-->
      <el-col :span="6">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item" v-for="item in feedbacklist" v-bind:key="item.id">
      <el-col :span="6">
        <span>{{item.author}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{item.name}}</span>
      </el-col>
      <!-- <el-col :span="6">
        <span>{{item.userId}}</span>
      </el-col>-->
      <el-col :span="6" style="padding-top:20px;">
        <el-button v-show="state==0" @click="chuli(item.id)">已处理</el-button>
        <el-button v-show="state==0" @click="buchuli(item.id)">不可处理</el-button>
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

    <div v-show="feedbacklist.length==0" style="line-height:100px;text-align:center;">没有查到相应条件下反馈</div>
  </div>
</template>

<script>
import {
  getextrabooklist,
  solveextrabook,
  closeextrabook
} from "@/api/feedback";
export default {
  named: "客户反馈",
  data() {
    return {
      feedbacklist: [],
      page: 1,
      pageSize: 5,
      state: 0, //{state}=（待处理(0),已处理(1),不处理(2)）默认为-1查全部
      sk: "time",
      so: "desc",

      totalItems: 0
    };
  },
  mounted() {
    this.mgetextrabooklist();
  },
  components: {},
  computed: {},
  methods: {
    //  处理
    chuli(id) {
      this.$confirm("确定已处理此反馈吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          solveextrabook({
            id: id
          }).then(res => {
            this.$message({
              type: "info",
              message: "处理成功"
            });
            this.mgetextrabooklist();
          });
        })
        .catch(() => {});
    },
    // 不处理
    buchuli(id) {
      this.$confirm("确定不可处理此反馈吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          closeextrabook({
            id: id
          }).then(res => {
            this.$message({
              type: "info",
              message: "忽略此处理,成功!"
            });
            this.mgetextrabooklist();
          });
        })
        .catch(() => {});
    },
    changetiaojian() {
      this.page = 1;
      this.mgetextrabooklist();
    },
    changepage(e) {
      this.page = e;
      this.mgetextrabooklist();
    },
    mgetextrabooklist() {
      getextrabooklist({
        state: this.state,
        sk: this.sk,
        so: this.so,
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.feedbacklist = res.items;
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
.tiaojian_item {
  margin-top: 20px;
}
</style>
