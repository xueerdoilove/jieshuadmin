<template>
  <div class="book-item">
    <div class="caozuo">
      <div class="c_flex">
        <div class="c_yuandian">
          <el-checkbox v-show="bookData.state!=2" v-model="bookData.selected" @change="danxuanhandler">选择</el-checkbox>
          <el-button v-show="bookData.state==2&&bookData.bookCipStoreId" @click="xiajia(bookData.bookCipStoreId)">下架</el-button>
        </div>
        <div class="state" :class="{'color0':+bookData.state==0,'color1':+bookData.state==1,'color2':+bookData.state==2}" >{{bookData.state | state}}</div>
      </div>
      <div class="x_kucun">
        库存:
        <span style="color:#1F7872">{{bookData.totalCnt}}</span>
      </div>
      <div class="x_kucun">
        借阅次数:
        <span style="color:#1F7872">{{bookData.borrowCnt}}</span>
      </div>
    </div>
    <div class="book-img" @click="gotodetail(bookData.id,bookData.storeid)">
      <img class="image" :src="bookData.portrait" />
    </div>
    <div class="book-right-c" >
      <div class="book-name">{{bookData.name || bookData.bookCipName}}</div>
      <div class="book-right-left">
        <div class="book-stars">
          <div class="book-stars-s">
            <img class="image" src="../../assets/xingxing.png" />
            <div class="bg" :style="{'width':bookData.doubanScore*10+'%'}"></div>
          </div>
          <div class="book-stars-f">{{bookData.doubanScore}}</div>
        </div>
        <div class="book-auth">作者:{{bookData.author}}</div>
        <div class="book-auth">ISBN:{{bookData.isbn}}</div>
        <div class="book-price">
          <div class="book-icon-yuan" style="margin-left:0;">
            <img class="image" src="../../assets/fei.png" />
          </div>
          <div class="book-price-num">￥ {{bookData.borrowCost/100}}</div>
          <div class="book-icon-yuan">
            <img class="image" src="../../assets/ya.png" />
          </div>
          <div class="book-price-num">￥ {{bookData.deposit/100}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { delbook } from "@/api/book";

export default {
  name: "bookbigitem",
  data() {
    return {};
  },
  props: {
    bookData: {
      type: Object
      // required: true
    }
  },
  filters: {
    state(num) {
      //下架(0),未上架(1),上架(2))
      if (num == 0) {
        return "下架中";
      } else if (num == 1) {
        return "待上架";
      } else {
        return "上架中";
      }
    }
  },
  computed: {},
  methods: {
    gotodetail(id,storeid){
      this.$router.push({ name: "bookdetail", params: { bookid:id ,storeid:storeid} });
    },
    danxuanhandler(){
      this.$emit('danxuan')
    },
    xiajia(id){
      this.$confirm("确定下架此本书吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() =>{
        delbook(id).then(res =>{
          this.$message({
            message: '下架成功',
            type: 'success'
          });
          this.$emit('getbooklist')
        })
      })
      
    }
  }
};
</script>

<style scoped>
/* 顶部要固定定位   标题要居中   自定义按钮和标题要和右边微信原生的胶囊上下对齐 */
.book-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
}
.caozuo {
  position: relative;
  min-width: 120px;
  float: left;
  height: 140px;
  border-right: 1px solid #aaa;
}
.c_flex {
  display: flex;
  display: -webkit-flex; /* Safari */
  justify-content: space-around;
}
.c_yuandian {
  height: 100px;
  box-sizing: border-box;
  padding-top: 40px;
}
.c_xsxx {
  height: 100px;
  writing-mode: vertical-lr;
  writing-mode: tb-lr;
}
.state {
  width: 20px;
  background-color: #1f7872;
  border-radius: 10px;
  color: #fff;
  position: absolute;
  top: 70px;
  right: -10px;
  transform: translateY(-50%);
  font-size: 14px;
  text-align: center;
  padding: 2px 0;
}
.color0{
  background-color: #D13F31;
}
.color1{
  background-color: #E6A050;
}
.color2{
  background-color: #1f7872;
}
.c_shudian {
  height: 100px;
  writing-mode: vertical-lr;
  writing-mode: tb-lr;
}
.x_kucun {
  font-size: 14px;
  margin-top: 10px;
}
.book-img {
  border-radius: 7px;
  box-shadow: 0 5px 5px #aaa;
  width: 100px;
  height: 140px;
  float: left;
  margin-left: 20px;
  overflow: hidden;
  cursor: pointer;
}
.book-img .image {
  float: left;
  width: 100%;
  height: 100%;
}

.book-right-c {
  box-sizing: border-box;
  padding-left: 10px;
  float: left;
  width: 280px;
}

.book-right-d {
  width: 200px;
  box-sizing: border-box;
  padding-left: 10px;
  float: left;
}

.book-name {
  font-size: 18px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.book-right-left {
  max-width: 500px;
  float: left;
}
.book-right-right {
  width: 35px;
  height: 75px;
  float: left;
  box-sizing: border-box;
  border-left: 1px solid #eee;
  position: relative;
  left: -15px;
}
.book-stars {
  overflow: hidden;
  margin-top: 5px;
}
.book-stars-s {
  height: 19px;
  width: 90px;
  float: left;
  position: relative;
  background-color: #aaa;
}
.book-stars-s .image {
  width: 100%;
  height: 105%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.book-stars-s .bg {
  height: 95%;
  position: absolute;
  background-color: #ce3f31;
  top: 0;
  left: 1px;
  z-index: 2;
}
.book-stars-f {
  float: left;
  margin-left: 3px;
  font-size: 12px;
  line-height: 16px;
  color: #ce3f31;
}

.book-auth {
  color: #888;
  font-size: 18px;
  margin-top: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-price {
  height: 30px;
  margin-top: 15px;
}
.book-icon-yuan {
  height: 20px;
  width: 20px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  float: left;
  margin-left: 5px;
}
.book-icon-yuan .image {
  width: 100%;
  height: 100%;
}
.book-price-num {
  color: #d13f32;
  font-size: 15px;
  float: left;
  padding-left: 3px;
}
</style>
