<template>
  <div>
    <el-form ref="form" :rules="rules"  :model="newcoupon" label-width="120px">
      <el-form-item label="优惠券名字" prop="name">
        <el-input class="riqi"  v-model="newcoupon.name"></el-input>
      </el-form-item>

      <el-form-item label="有效期" prop="validDays">
        <el-input class="riqi" type="number" v-model="newcoupon.validDays"></el-input>
      </el-form-item>

      <el-form-item label="购买金额" prop="cost">
        <el-input class="riqi" v-model="newcoupon.upperLimit"></el-input>(分)
      </el-form-item>

      <el-form-item label="介绍" prop="description">
        <el-input class="riqi" type="textarea" v-model="newcoupon.introduction"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { postcouponList } from '@/api/coupon'
import qs from 'qs'
export default {
  name: "newcoupon",
  data() {
    return {
      storelist:[{name:'',id:0}],
      newcoupon: {
        name: "",
        bookStoreId: 0,
        introduction: "",
        startDate: "",
        endDate: "",
        timeRange: "",
        lowerLimit: "1",
        upperLimit: "10000",
        validDays: 10,
        couponCnt: "1",
        couponType: "0",
        ruleType:'0',//0: 有效日期，1：限时间段
        obtainType :'0',// 0:发放， 1：领取
        picture:'',
      },
      rules: {
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请选输入优惠券简介", trigger: "change" }
        ],
        validDays:[
          { required: true, message: "请选输入有效日长", trigger: "change" }
        ],
        timeRange: [
          {
            type: "array",
            required: true,
            message: "请选择优惠券时间范围",
            trigger: "change"
          }
        ],
        couponCnt: [
          { required: true, message: "请输入优惠券数量", trigger: "change" }
        ],
        upperLimit: [
          {
            required: true,
            message: "请输入优惠券可使用的价格上限",
            trigger: "change"
          }
        ],
        picture:[
          { required: true, message: "请选择一个图片", trigger: "change" }
        ]
      },
      imglist:[],
    };
  },
  props: {
    bookStoreId: {
      type: Number
      // required: true
    },
    className: {
      type: String,
      default: ""
    }
  },
  created(){
    this.storelist = JSON.parse(localStorage.getItem('storelist'))
    this.newcoupon.bookStoreId = this.bookStoreId || 0
  },
  computed: {},
  methods: {
    handleRemove(file, fileList) {
      this.newcoupon.picture = ''
    },
    handleChange(file,fileList) {
      console.log(file)
       //生成canvas
      var self = this;
      var imgurl = file.url
      var img = document.createElement("img");
      img.src = imgurl

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      var quality = 1; // 默认图片质量为0.7
      var imgobj;
      img.onload = function() {
        var that = this;
        // 默认按比例压缩
        var w = 600,
          h = (600 / that.width) * that.height;
        
        imgobj = { width: w, height: h };
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        var base64 = canvas.toDataURL("image/png", quality);
        self.newcoupon.picture  = base64
      };
    },
    changeruleType(e){
      if(e==0){
        this.newcoupon.startDate = ''
        this.newcoupon.endDate = ''
        this.newcoupon.timeRange = ''
        this.newcoupon.validDays = 10
      }else{
        this.newcoupon.validDays = 0
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData()
          for(var key in this.newcoupon){
            if(key=='picture'){
              continue
            }
            formData.append( key,this.newcoupon[key])
          }

          formData.append('picture',convertBase64UrlToBlob(this.newcoupon['picture']),'fmt.jpg')

          //图片格式转化
          function convertBase64UrlToBlob(urlData) {
            var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
            }
            return new Blob([ab], {
            type: 'image/jpg'
            });
          }
          postcouponList(formData).then(res =>{
            this.$emit('hidenew');
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setriqi(e) {
      this.newcoupon.startDate = e[0];
      this.newcoupon.endDate = e[1];
    }
  }
};
</script>

<style scoped>
.riqi {
  width: 400px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
