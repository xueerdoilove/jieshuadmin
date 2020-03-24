<template>
  <div>
    <el-form ref="form" :rules="rules" :model="newcoupon" label-width="120px">
      <el-form-item label="跳转类型">
        <el-select class="riqi" :disabled="true" v-model="newcoupon.adsType" placeholder="请选择轮播图跳转类型">
          <el-option label="跳转到书目类型" value="0"></el-option>
          <el-option label="跳转到书单类型" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名字" prop="name">
        <el-input class="riqi" v-model="newcoupon.name"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input class="riqi" type="textarea" v-model="newcoupon.description"></el-input>
      </el-form-item>

      <el-form-item label="书籍" v-if="newcoupon.adsType==0" prop="linkId">
        <el-select
          style="width:400px;"
          v-model="newcoupon.linkId"
          filterable
          remote
          @change="setpressname"
          placeholder="请搜索一个书籍,并选择"
          :remote-method="getbookListbyname"
          :loading="false"
        >
          <el-option v-for="item in booklist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="书单" v-if="newcoupon.adsType==1" prop="linkId">
        <el-select
          style="width:400px;"
          v-model="newcoupon.linkId"
          @change="setpressname"
          placeholder="请搜索一个书单,并选择"
        >
          <el-option v-for="item in shudanlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { postbannerlist, putbanner } from "@/api/baseconfig";
import { bookcipsearch ,getonebook} from "@/api/book";
import { getlist  } from "@/api/recommend";
import qs from "qs";
export default {
  name: "newcoupon",
  data() {
    return {
      storelist: [{ name: "通用优惠券", id: 0 }],
      newcoupon: {
        id:'',
        name: "",
        description: "",
        adsType: "0",
        linkId: "",
        path: ""
      },
      shudanlist: [],
      rules: {
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请选输入优惠券简介", trigger: "change" }
        ],
        validDays: [
          { required: true, message: "请选输入有效日长", trigger: "change" }
        ],
        linkId: [
          { required: true, message: "请选择书籍/书单", trigger: "change" }
        ],
        path: [{ required: true, message: "请选择一个图片", trigger: "change" }]
      },
      imglist: [],

      searchvalue: "",
      booklist: []
    };
  },
  props: {},
  created() {
    this.getbookdanlist();
    this.newcoupon = JSON.parse(localStorage.getItem('banneritem'))
    this.newcoupon.adsType = ''+this.newcoupon.adsType
    if(this.newcoupon.adsType==0){
      this.getonebook(this.newcoupon.linkId)
    }
  },
  computed: {},
  methods: {
    setpressname(e) {
      this.newcoupon.linkId = e
    },
    getonebook(id){
      getonebook(id).then(res =>{
        this.booklist = [res.item]
      })
    },
    getbookdanlist() {
      getlist({
        state: 2,
        page: 1,
        pageSize: 100,
        sk: "time",
        so: "desc"
      }).then(res => {
        this.shudanlist = res.items;
      });
    },
    getbookListbyname(name) {
      if (name == "") {
        this.booklist = [];
        this.newcoupon.linkId = ''
        return;
      }
      bookcipsearch({
        state: 2,
        name: name,
        page: 1,
        pageSize: 50,
        sk: "time",
        so: "desc"
      })
        .then(res => {
          this.booklist = res.items;
        })
        .catch(() => {});
    },
     
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data =  this.newcoupon;
          putbanner(data).then(res => {
            this.$emit("hidenew");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    
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
  border-color: #409eff;
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
