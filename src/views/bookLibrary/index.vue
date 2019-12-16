<template>
  <div class="container">
    <el-row class="tianjian_tou">
      <el-col :span="20" :offset="0">
        <el-form label-width="80px">
          <el-form-item label="状态:">
            <el-radio-group v-model="state" @change="zhuangtai">
              <el-radio :label="2">上架中</el-radio>
              <el-radio :label="0">下架中</el-radio>
              <el-radio :label="1">待上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="primary">+新增</el-button>
      </el-col>
    </el-row>

    <el-row class="caozuo_tou">
      <el-col :span="4" :offset="0">
        <el-checkbox v-model="checkedall">全选</el-checkbox>
      </el-col>
      <el-col :span="20" style="text-align:right">
        <el-button type="primary">编辑</el-button>
      </el-col>
    </el-row>

    <el-row class="book_div">
      <el-col :span="12" v-for="book in booklist" v-bind:key="book.id">
        <bookbigitem   :bookData="book" />
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
    <el-row class="tiaojian_item" v-show="totalItems==0">
      <el-col :span="20" :offset="2" style="text-align:center;">没有书籍</el-col>
    </el-row>
  </div>
</template>

<script>
import { getbookList } from "@/api/book";
import Bookbigitem from './bookbigitem'

export default {
  named: "书库信息",
  data() {
    return {
      checkedall:false,
      booklist: [],
      state: 2, //下架(0),未上架(1),上架(2)）默认为1
      page: 1,
      pageSize: 10,

      totalItems:0,
    };
  },
  components:{
    Bookbigitem
  },
  mounted() {
    this.getbooklist();
  },
  methods: {
    getbooklist() {
      getbookList({state:this.state, page: this.page, pageSize: this.pageSize })
        .then(res => {
          this.booklist = res.items
          this.totalItems = res.totalItems
        })
        .catch(error => {});
    },
    zhuangtai(e){
      this.page = 1
      this.getbooklist()
    },
    changepage(e){
      this.page = e
      this.getbooklist()
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 30px;
}
.tianjian_tou {
  border-bottom: 1px solid #aaa;
}
.caozuo_tou{
  padding:15px 0 15px 30px;
}
.book_div{
  margin-top: 10px;
}
.tiaojian_item{
  margin-top: 20px;
}
</style>
