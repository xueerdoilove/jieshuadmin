<template>
  <div class="book-item">adf</div>
</template>

<script>
export default {
  name: "bookdetail",
  data() {
    return { bookid: 0 };
  },
  mounted() {
    this.bookid = this.$route.params.bookid;
    if (!this.bookid) {
      this.$router.go(-1);
      return;
    }
  },
  methods: {
    aaa(){

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
.color0 {
  background-color: #d13f31;
}
.color1 {
  background-color: #e6a050;
}
.color2 {
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
