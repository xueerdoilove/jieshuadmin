<template>
  <div class="container">
    <el-row class="tianjian_tou">
      <el-col :span="4">
        <el-select class="riqi" style="margin-bottom:20px;" v-model="searchtype" @change="changepage(1)">
          <el-option
            v-for="searchdtype in searchtypelist"
            :key="searchdtype.id"
            :label="searchdtype.name"
            :value="searchdtype.id"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="15" :offset="1">
        <el-input
          placeholder="请输入线上图书名称/作者/isbn"
          v-model="searchvalue"
          v-show="searchtype==2"
          class="input-with-select"
        >
          <el-select
            v-model="state"
            @change="searchbookbykeyword"
            slot="prepend"
            placeholder="请选择状态"
            style="width:100px;"
          >
            <el-option label="已上架" :value="2"></el-option>
            <el-option label="待上架" :value="1"></el-option>
            <el-option label="已下架" :value="0"></el-option>
          </el-select>
          <el-button slot="append" @click="searchbookbykeyword" icon="el-icon-search">搜索</el-button>
        </el-input>

        <el-autocomplete
          class="input-with-select"
          v-show="searchtype==3"
          v-model="storeitem"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入门店名"
          @select="searchbookbystore"
          value-key="name"
        ></el-autocomplete>

        <el-form label-width="80px" v-show="searchtype==0">
          <el-form-item label="状态:">
            <el-radio-group v-model="state" @change="zhuangtai">
              <el-radio :label="2">上架中</el-radio>
              <el-radio :label="1">待上架</el-radio>
              <el-radio :label="0">已下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <el-form label-width="80px" v-show="searchtype==1 || searchtype==3">
          <el-form-item label="状态:">
            <el-radio-group v-model="bookStorestate" @change="zhuangtai">
              <el-radio :label="1">上架中</el-radio>
              <el-radio :label="0">已下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="primary" @click="shownew">+新增</el-button>
      </el-col>
    </el-row>

    <el-row class="caozuo_tou">
      <el-col :span="4" :offset="0">
        <el-checkbox v-model="checkedall" @change="quanxuan" v-show="state!=2">全选</el-checkbox>&nbsp;
      </el-col>
      <el-col :span="20" style="text-align:right">
        <el-button type="primary" @click="piliangshangjia" v-show="bookidlist.length>0">上架</el-button>
      </el-col>
    </el-row>

    <el-row class="book_div">
      <el-col :span="12" v-for="book in booklist" v-bind:key="book.id">
        <bookbigitem :bookData="book" @danxuan="danxuan" @getbooklist="changepage(page)" />
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


    <!-- 新增书目 -->
      <el-dialog title="新增书目" :visible.sync="show_new">
        <newbook     @hidenew='hidenew'/>
      </el-dialog>
  </div>
</template>

<script>
import {
  getbookList,
  bookcipsearch,
  bookcipbystore,
  putbookonline,
  postbookcip,
  
} from "@/api/book";
import Bookbigitem from "./bookbigitem";
import newbook from "./newbook";
import { getstoreList , getrepositorystore} from "@/api/store";

export default {
  named: "书库信息",
  data() {
    return {
      show_new:false,

      loading: "",

      searchtype: 0,
      searchtypelist: [
        { id: 0, name: "全部书目" },
        { id: 2, name: "全部书目 搜索" },
        { id: 1, name: "线上书目" },
        { id: 3, name: "线下书目" }
      ],

      checkedall: false,
      booklist: [],
      state: 2, //下架(0),未上架(1),上架(2)）
      bookStorestate:1,// 1 上架中 0 下架中 书店的书目状态
      count: -1, // -1 无,
      page: 1,
      pageSize: 10,

      searchvalue: "", // 搜索书的关键字

      onlinestoreid:1,// 线上仓库id
      storeid: 0,
      storelist: [],
      storeitem: "",

      totalItems: 0
    };
  },
  components: {
    Bookbigitem,
    newbook
  },
  computed: {
    bookidlist() {
      var a = [];
      this.booklist.forEach(book => {
        if (book.selected) {
          a.push(book.id);
        }
      });
      return a;
    }
  },
  mounted() {
    this.changepage();
    this.getrepositorystore()
  },
  methods: {
    // 查询线上仓库id
    getrepositorystore(){
      getrepositorystore().then(res =>{
        this.onlinestoreid = res.item.id
      })
    },
    //批量上架
    piliangshangjia() {
      this.$confirm("确定上架已勾选的书吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        putbookonline({
          bookCipIdList: this.bookidlist
        }).then(res => {
          this.$message({
            message: "上架成功",
            type: "success"
          });
          this.changepage(this.page);
        });
      });
    },
    // 全选
    quanxuan(e) {
      if (e) {
        this.booklist.forEach(book => {
          book.selected = true;
        });
      } else {
        this.booklist.forEach(book => {
          book.selected = false;
        });
      }
    },
    // 单选
    danxuan() {
      var length = this.booklist.length;
      var a = 0;
      this.booklist.forEach(book => {
        if (book.selected) {
          a++;
        }
      });
      if (a == length) {
        this.checkedall = true;
      } else {
        this.checkedall = false;
      }
    },
    // 根据关键字查询书籍
    searchbookbykeyword() {
      if (this.searchvalue == "") {
        this.booklist = [];
        this.totalItems = 0;
        return;
      }
      this.loading = this.$loading({
        lock: false,
        target: document.querySelector(".app-main"),
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
      bookcipsearch({
        state: this.state,
        name: this.searchvalue,
        page: this.page,
        pageSize: this.pageSize,
        sk:'time',
        so:'desc',
      })
        .then(res => {
          this.booklist = this.tianjiazhuangt(res.items);
          this.totalItems = res.totalItems;
          this.loading.close();
        })
        .catch(() => {
          this.loading.close();
        });
    },
    // 异步去请求门店数据
    querySearchAsync(queryString, cb) {
      if (this.storelist.length == 0) {
        getstoreList({
          page: 1,
          pageSize: 100,
          type: "1",
          state: 2
        }).then(res => {
          var aa = [];
          res.items.forEach(item => {
            if (item.storeType == 1) {
              aa.push(item);
            }
          });
          this.storelist = aa;
          var restaurants = this.storelist;
          var results = queryString
            ? restaurants.filter(this.createStateFilter(queryString))
            : restaurants;
          cb(results);
        });
      } else {
        var restaurants = this.storelist;
        var results = queryString
          ? restaurants.filter(this.createStateFilter(queryString))
          : restaurants;
        cb(results);
      }
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    searchbookbystore(item) {
      this.page = 1;
      this.storeid = item.id;
      this.getbookbystore();
    },
    
    // 根据书店id查询书列表
    getbookbystore() {
      if (this.storeid == 0 ) {// 如果是根据门店查询并且 storeid ==0 那就返回空
        this.booklist = [];
        this.totalItems = 0;
        return;
      }
      if(this.storeid == this.onlinestoreid&& this.searchtype==3){// 
        this.booklist = [];
        this.totalItems = 0;
        return;
      }
      this.loading = this.$loading({
        lock: false,
        target: document.querySelector(".app-main"),
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
      bookcipbystore({
        bookStoreId: this.storeid,
        state: this.bookStorestate,
        page: this.page,
        pageSize: this.pageSize,
        sk:'time',
        so:'desc',
      })
        .then(res => {

          this.booklist = this.tianjiazhuangt(res.items,this.bookStorestate);
          this.totalItems = res.totalItems;
          this.loading.close();
        })
        .catch(() => {
          this.loading.close();
        });
    },
    tianjiazhuangt(arr,bookStorestate) {
      if(bookStorestate == undefined){
        arr.forEach(book => {
          book.selected = false;
          book.storeid = this.storeid
        });
      }else{
        arr.forEach(book => {
          book.selected = false;
          book.storeid = this.storeid
          book.state = bookStorestate
          book.mendianshu = true
        });
      }

      
      return arr;
    },
    // 根据状态 查询书列表
    getbooklist() {
      this.loading = this.$loading({
        lock: false,
        target: document.querySelector(".app-main"),
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)"
      });
      getbookList({
        state: this.state,
        page: this.page,
        pageSize: this.pageSize,
        sk:'time',
        so:'desc',
      })
        .then(res => {
          this.booklist = this.tianjiazhuangt(res.items);
          this.totalItems = res.totalItems;
          this.loading.close();
        })
        .catch(() => {
          this.loading.close();
        });
    },
    zhuangtai(e) {
      this.changepage(1);
    },
    shownew(){
      this.show_new = true
    },
    hidenew(){
      this.state = 1
      this.searchtype = 0
      this.show_new = false;
      this.changepage(1)
    },
    changepage(e) {
      this.page = e;
      if (this.searchtype == 0) {// 全部数目
        this.storeid = 0
        this.getbooklist();
      } else if (this.searchtype == 1) {// 线上数目
        this.storeid =  this.onlinestoreid
        this.getbookbystore();
      } else if (this.searchtype == 3) {// 线下数目
        this.getbookbystore();
      } else {// 全部数目搜索
        this.storeid = 0
        this.searchbookbykeyword();
      }
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
.caozuo_tou {
  padding: 15px 0 15px 30px;
  height: 60px;
}
.book_div {
  margin-top: 10px;
}
.tiaojian_item {
  margin-top: 20px;
}
.input-with-select {
  margin-bottom: 20px;
}
</style>
