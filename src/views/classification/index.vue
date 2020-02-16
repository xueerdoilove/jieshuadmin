<template>
  <div class="container">
    <el-row>
      <el-col :span="6">
        <el-select v-model="fcatid" @change="changepage(1)" placeholder="请选择主分类">
          <el-option v-for="item in fcatlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="14">
        <el-radio-group v-model="state" @change="changepage(1)" style="margin-top:10px;">
          <el-radio :label="2">正常使用中的分类</el-radio>
          <el-radio :label="1">待上架的分类</el-radio>
          <el-radio :label="0">删除的分类</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="shownew">{{show_new?'-收起':'+新增子类'}}</el-button>
      </el-col>
    </el-row>
    <div style="overflow:hidden">
      <div class="leimu" v-for="item in catlist" v-bind:key="item.id">
        <span>{{item.name}}</span>
        <el-button
          v-show="state!=2"
          type="text"
          style="cursor: pointer;"
          @click="putactive(item.id)"
        >上架使用</el-button>
        <el-button
          v-show="state==2"
          type="text"
          style="cursor: pointer;"
          @click="delacat(item.id)"
        >删除分类</el-button>
        <el-button  type="text" @click="showedit(item.id,item.name)" style="cursor: pointer;">编辑</el-button>
      </div>
    </div>
    <div v-show="totalItems>=pageSize" style="clear:both;margin-top:30px;text-align:center;">
      <el-pagination
        background
        :total="totalItems"
        :page-size="pageSize"
        :current-page="page"
        @current-change="changepage"
        layout="prev, pager, next"
      ></el-pagination>
    </div>
    <div v-show="catlist.length==0" style="line-height:100px;text-align:center;">没有查到相关书籍分类</div>
    <el-dialog title="新增书籍子分类" :visible.sync="show_new">
      <newone v-if="show_new" @hidenew="hidenew" />
    </el-dialog>

    <el-dialog title="修改书籍子分类" :visible.sync="show_edit">
      <editcat v-if="show_edit" @hideedit="hideedit" />
    </el-dialog>
  </div>
</template>

<script>
import { getcatlist, putcatactive, delcat } from "@/api/classification";
import Editcat from "./edit";
import Newone from "./new";
export default {
  named: "书籍分类",
  data() {
    return {
      show_edit: false,
      show_new: false,
      fcatid: -1,
      fcatlist: [],
      catlist: [],
      page: 1,
      state: 2,
      pageSize: 50,
      totalItems: 0
      // couponType: -1,
      // sk: "time",
      // so: "desc"
    };
  },
  mounted() {
    this.mgetfathercat();
  },
  components: {
    Editcat,
    Newone
  },
  filters: {
    
  },
  computed: {},
  methods: {
    showedit(id,name){
      this.show_edit = true;
      localStorage.setItem("catname", name);
      localStorage.setItem("parentId", this.fcatid);
      localStorage.setItem("catId", id);
    },
    hideedit() {
      this.show_edit = false;
      this.mgetcatlist();
    },
    // 弹出新增子类
    shownew() {
      localStorage.setItem("fcatlist", JSON.stringify(this.fcatlist));
      localStorage.setItem("parentId", JSON.stringify(this.fcatid));
      this.show_new = true;
    },
    hidenew() {
      this.show_new = false;
      this.mgetcatlist();
    },
    changetiaojian() {
      this.page = 1;
      this.mgetcatlist();
    },
    putactive(id) {
      this.$confirm("确定上架使用此子分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        putcatactive(id).then(res => {
          this.$message({
            message: "上架成功",
            type: "success"
          });
          this.mgetcatlist();
        });
      });
    },
    delacat(id) {
      this.$confirm("确定下架使用此子分类吗?", "删除下架分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delcat(id).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.mgetcatlist();
        });
      });
    },
    changepage(page) {
      this.page = page;
      this.mgetcatlist();
    },
    mgetcatlist() {
      this.catlist = [];
      //parentId=-1&state=2&sk=xx&so=xx&page=1&pageSize=30
      getcatlist({
        parentId: this.fcatid,
        state: this.state,
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.catlist = res.items;
        this.totalItems = res.totalItems;
      });
    },
    mgetfathercat() {
      getcatlist({ parentId: 0, page: 1, pageSize: 20 }).then(res => {
        this.fcatlist = res.items;
        this.fcatid = res.items[0].id;
        this.changepage(1);
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
.leimu {
  border: 1px solid #1f7872;
  padding: 5px 10px;
  border-radius: 6px;
  margin-left: 10px;
  margin-top: 20px;
  float: left;
}
</style>
