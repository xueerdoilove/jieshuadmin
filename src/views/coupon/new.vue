<template>
  <div>
    <el-form ref="form" :rules="rules"  :model="newcoupon" label-width="120px">
      <el-form-item label="优惠券名字" prop="name">
        <el-input class="riqi"  v-model="newcoupon.name"></el-input>
      </el-form-item>

      <el-form-item label="有效期">
          <el-switch
            v-model="newcoupon.ruleType"
            active-text="限时间段"
            inactive-text="有效日长"
            active-value="1"
            @change="changeruleType"
            inactive-value="0">
          </el-switch>
      </el-form-item>


      <el-form-item v-if="newcoupon.ruleType==1" label="限时间段" prop="timeRange">
        <el-date-picker
          class="riqi"
          v-model="newcoupon.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="setriqi"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>

      <el-form-item v-if="newcoupon.ruleType==0" label="有效日长" prop="validDays">
        <el-input class="riqi" type="number" v-model="newcoupon.validDays"></el-input>
      </el-form-item>


      <el-form-item label="领取规则">
        <el-select class="riqi" v-model="newcoupon.obtainType" placeholder="请选择优惠券类型">
          <el-option label="发放制" value="0"></el-option>
          <el-option label="领取制" value="1"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="优惠券总数量" prop="couponCnt">
        <el-input class="riqi" type="number" v-model="newcoupon.couponCnt"></el-input>
      </el-form-item>

      

      <el-form-item label="作用">
        <el-select class="riqi" v-model="newcoupon.couponType" placeholder="请选择优惠券类型">
          <el-option label="免服务费" value="0"></el-option>
          <el-option label="免邮券" value="1"></el-option>
          <el-option label="免押券" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="指定门店">
        <el-select class="riqi" v-model="newcoupon.bookStoreId" placeholder="请选择门店,可以不选">
          <el-option
            v-for="store in storelist"
            :key="store.id"
            :label="store.name"
            :value="store.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="限借阅" prop="upperLimit">
        <el-input style="width:80px;margin-right:10px;" v-model="newcoupon.upperLimit"></el-input>(元)以内书籍使用
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
        <el-input class="riqi" type="textarea" v-model="newcoupon.introduction"></el-input>
      </el-form-item>

      <el-form-item label="封面图" prop="picture">
        
        <el-upload
          id="picturediv"
          class="upload-demo"
          ref="upload"
          action=""
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="imglist"
          :multiple="false"
          :limit="1"
          list-type="picture"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <span style="margin-left:20px;" slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,宽700px,高100px</span>
        </el-upload>
        <input style="display:none;" type="text" v-model="newcoupon.picture" />

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
      storelist:[{name:'通用优惠券',id:0}],
      newcoupon: {
        name: "",
        bookStoreId: 0,
        introduction: "",
        startDate: "",
        endDate: "",
        timeRange: "",
        lowerLimit: "1",
        upperLimit: "100",
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
    this.newcoupon.bookStoreId = this.bookStoreId>0?this.bookStoreId:0
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
            if(key=='picture' || key == 'upperLimit'){
              continue
            }
            formData.append( key,this.newcoupon[key])
          }
          formData.append( 'upperLimit',this.newcoupon['upperLimit']*100)
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
