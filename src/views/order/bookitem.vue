<template>
  <div class="book-item">
    <div class="book-img">
      <img class="image" :src="bookData.portrait" />
    </div>
    <div class="book-name">{{bookData.name || bookData.bookCipName}}</div>
  </div>
</template>

<script>
export default {
  name: "bookitem",
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
.book-item {
  width:80px;
  margin-bottom: 15px;
  float: left;
  margin-left: 10px;
  position: relative;
}
.book-img{
  border-radius: 5px;
  box-shadow: 0 5px 5px #aaa;
  margin-bottom: 5px;
  overflow: hidden;
}
.book-img  .image{
  width:80px;
  height:112px;
  float: left;
}
.book-name{
  font-size: 16px;
  font-weight: 600;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  height: 18px;
  line-height: 18px;
}
</style>
