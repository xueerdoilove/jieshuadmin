<template>
  <div class="container">
    <el-row>
      <el-col :span="20">
        <el-radio-group v-model="state" @change="changetiaojian" style="margin-top:10px;">
          <el-radio :label="1">正常的</el-radio>
          <el-radio :label="0">删除的</el-radio>
        </el-radio-group>&nbsp;
      </el-col>
      <el-col :span="4">
        <!-- <el-button type="primary" @click="shownew">{{show_new?'-收起':'+新增'}}</el-button> -->
      </el-col>
    </el-row>
    <el-row class="coupon_item">
      <el-col :span="4">
        <span>会员名称</span>
      </el-col>
      <el-col :span="2">
        <span>有效期天数</span>
      </el-col>
      <el-col :span="4">
        <span>会员金额</span>
      </el-col>
      <el-col :span="10">
        <span>介绍</span>
      </el-col>
      <el-col :span="4">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-row class="coupon_item" v-for="item in viplist" v-bind:key="item.id">
      <el-col :span="4">
        <span>{{item.name}}</span>
      </el-col>
      <el-col :span="2">
        <span>{{item.validDays}}天</span>
      </el-col>
      <el-col :span="4">
        <span>{{item.cost/100}}元</span>
      </el-col>
      <el-col :span="10">
        <span>{{item.description}}</span>
      </el-col>
      <el-col :span="4" style="padding-top:20px;">
        <el-button @click="showedit(item.id)">编辑</el-button>
      </el-col>
    </el-row>
    <div v-show="viplist.length==0" style="line-height:100px;text-align:center;">没有查到相应条件下的会员类型</div>
    <!-- <el-dialog title="新增会员类型" :visible.sync="show_new">
      <newVip v-if="show_new"  @hidenew="hidenew" />
    </el-dialog> -->

    <el-dialog title="编辑会员类型" :visible.sync="show_edit">
      <editVip v-if="show_edit" @hideedit="hideedit" />
    </el-dialog>
  </div>
</template>

<script>
import { getvipList } from "@/api/vip";
// import NewVip from "./new";
import EditVip from "./edit";
// import { mapGetters } from 'vuex'
export default {
  named: "优惠券",
  data() {
    return {
      show_edit: false,
      show_new: false,
      viplist: [],
      page: 1,
      pageSize: 100,
      state: 1,
      sk: "time",
      so: "desc"
    };
  },
  mounted() {
    this.mgetvipList();
  },
  components: {
    // NewVip,
    EditVip
  },
  computed: {},
  methods: {
    // 弹出vip编辑
    showedit(id) {
      for(var i = 0;i<this.viplist.length;i++){
        if(this.viplist[i].id == id){
          localStorage.setItem('onevip',JSON.stringify(this.viplist[i]))
          break
        }
      }
      this.show_edit = !this.show_new;
    },
    hideedit() {
      this.show_edit = false;
      this.mgetvipList();
    },
    shownew() {
      this.show_new = !this.show_new;
    },
    hidenew() {
      this.show_new = false;
      this.mgetvipList();
    },
    changetiaojian() {
      this.page = 1;
      this.mgetvipList();
    },
    mgetvipList() {
      // state={state}&sk=xx&so=xx&page=1&pageSize=3
      getvipList({
        page: this.page,
        pageSize: this.pageSize,
        state: this.state,
        sk: this.sk,
        so: this.so
      }).then(res => {
        this.viplist = res.items;
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
