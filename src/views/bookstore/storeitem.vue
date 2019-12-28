<template>
  <div class="shop-block" >
    <!-- <div class="shop-left-img" >
        <img class="image" :src="shitidianData.imgurl" />
    </div> -->
    <div class="shop-left" >
        <div class="shop-name">
            <div class="shop-location-img">
                <img class="image" :src="localimg">
            </div>
            <div class="shop-n">{{shitidianData.name}}</div>
        </div>
        <div class="shop-jj">
            地址: {{shitidianData.address}}
        </div>
        <div class="shop-jj">
            电话: {{shitidianData.mobile}}
        </div>
    </div>
    <div style="text-align:right;padding-right:20px;clear:both;">
        <el-button @click="parentHandel">实体店详情</el-button>
        <el-button @click="parentHandelerweima">实体店推广码<br>({{shitidianData.shareCode || '未设置'}})</el-button>
    </div>
</div>
</template>

<script>
import localimg from '@/assets/local.png'
export default {
  name: "store",
  data() {
    return {
      localimg:localimg
    };
  },
  props: {
    shitidianData: {
      type: Object
      // required: true
    }
  },
  computed: {},
  methods: {
      parentHandel(){
          this.$emit('showDetial',{id:this.shitidianData.id});
      },
      parentHandelerweima(){
          this.$emit('showErweima',{id:this.shitidianData.id,sharecode:this.shitidianData.shareCode});

      }
  }
};
</script>

<style scoped>
/* 顶部要固定定位   标题要居中   自定义按钮和标题要和右边微信原生的胶囊上下对齐 */
.shop-block{
    width:100%;
    margin-left: 12px;
    padding:15px 0;
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
}

.shop-left-img{
    height: 90px;
    width:180px;
    margin-right: 12px;
    border-radius: 10px;
    float: left;
    overflow: hidden;
}
.shop-left-img .image{
    width:100%;
    height: 100%;
}
.shop-left{
    float: left;
    max-width: 500px;
}
.shop-name{
    height: 30px;
    width: 300px;
}
.shop-location-img{
    height: 30px;
    width:25px;
    float: left;
}
.shop-location-img .image{
    width:16px;
    height: 20px;
    margin-top:5px;
}
.shop-n{
    font-size: 18px;
    font-weight: 600;
    float: left;
    height: 15px;
    line-height: 15px;
    margin-left: 5px;
    color: #5D5D5D;
    margin-top:8px;
    padding-right: 10px;
}
.shop-juli{
    font-size: 16px;
    margin-left: 10px;
    color: #1F7872;
    height: 20px;
    margin-top: 2px;
    line-height: 20px;
    float: left;
}
.shop-jj{
    line-height: 20px;
    color: #5D5D5D;
    font-size: 16px;
    max-width: 500px;
}
.shop-right{
    width:50px;
    box-sizing: border-box;
    height: 70px;
    padding-top:10px;
    float: left;
}
.shop-goto-img{
    height: 30px;
    width:30px;
    margin-left: 10px;
    border-radius: 50%;
    background-color: #1F7872;
}
.shop-goto-img .image{
    height: 20px;
    width:20px;
    margin-left: 5px;
    margin-top: 5px;
}
.shop-goto-t{
    font-size: 10px;
    width:50px;
    text-align: center;
    color: #1F7872;
    line-height: 20px;
}
</style>
