<template>
  <div class="book-item" >
    <div class="book-img">
        <img class="image" :src="bookData.portrait">
    </div>
    <div class="book-right-c" >
        <div class="book-name">{{bookData.name || bookData.bookCipName}}</div>
        <div class="book-right-left">
            <div class="book-stars">
                <div class="book-stars-s">
                    <img class="image" src="../../assets/xingxing.png">
                    <div class="bg" :style="{'width':bookData.doubanScore*10+'%'}"></div>
                </div>
                <div class="book-stars-f">{{bookData.doubanScore}}</div>
            </div>
            <div class="book-auth">{{bookData.author}}</div>
            <div class="book-price">
                <div class="book-icon-yuan" style="margin-left:0;"><img class="image" src="../../assets/fei.png" /></div>
                <div class="book-price-num">￥ {{bookData.borrowCost/100}}</div>
                <div class="book-icon-yuan"><img class="image" src="../../assets/ya.png" /></div>
                <div class="book-price-num">￥ {{bookData.deposit/100}}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
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
  computed: {},
  methods: {}
};
</script>

<style scoped>
/* 顶部要固定定位   标题要居中   自定义按钮和标题要和右边微信原生的胶囊上下对齐 */
.book-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
}


.book-img{
  border-radius: 7px;
  box-shadow: 0 5px 5px #aaa;
  width:80px;
  height: 112px;
  float: left;
  margin-left: 12px;
  overflow: hidden;
}
.book-img .image{
  float: left;
  width: 100%;
  height: 100%;
}


.book-right-c{
  box-sizing: border-box;
  padding-left: 10px;
  float: left;
}

.book-right-d{
  width:200px;
  box-sizing: border-box;
  padding-left: 10px;
  float: left;
}

.book-name{
  font-size: 18px;
  font-weight: 600;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
  height: 30px;
}
.book-right-left{
  max-width: 500px;
  height: 85px;
  float: left;
}
.book-right-right{
 width: 35px;
 height: 75px;
 float: left;
 box-sizing: border-box;
 border-left: 1px solid #eee;
 position: relative;
 left: -15px;
}
.book-stars{
  overflow: hidden;
  margin-top: 5px;
}
.book-stars-s{
  height: 19px;
  width: 90px;
  float: left;
  position: relative;
  background-color: #aaa;
}
.book-stars-s  .image{
  width:100%;
  height: 105%;
  position: absolute;
  top:0;
  left:0;
  z-index: 10;
}
.book-stars-s .bg{
  height: 95%;
  position: absolute;
  background-color: #CE3F31;
  top:0;
  left:1px;
  z-index: 2;
}
.book-stars-f{
  float: left;
  margin-left: 3px;
  font-size: 12px;
  line-height: 16px;
  color: #CE3F31
}

.book-auth{
  color:#888;
  font-size: 18px;
  margin-top:10px;
}


.book-price{
  height: 30px;
  margin-top:15px;
}
.book-icon-yuan{
  height: 20px;
  width:20px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  float: left;
  margin-left: 5px;
}
.book-icon-yuan .image{
  width:100%;
  height: 100%;
}
.book-price-num{
  color: #D13F32;
  font-size: 15px;
  float: left;
  padding-left: 3px;
}
</style>
