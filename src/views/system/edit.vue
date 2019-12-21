<template>
  <div>
    <el-form ref="form" :rules="rules"  :model="newone" label-width="120px">
      <el-form-item label="提醒" >
        修改基础配置续跟管理员联系，不可自行修改，可能会导致软件出现问题。
      </el-form-item>
      <el-form-item label="配置名字" prop="name">
        <el-input class="riqi"  v-model="newone.name"></el-input>
      </el-form-item>

      <el-form-item label="配置简介" prop="description">
        <el-input class="riqi" type="textarea" v-model="newone.description"></el-input>
      </el-form-item>

      <el-form-item label="配置值" prop="configValue">
        <el-input class="riqi" style="width:100px;margin-right:10px;" type="number" v-model="newone.configValue"></el-input>{{danwei}}
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { putbaseconfig } from '@/api/baseconfig'
export default {
  name: "newone",
  data() {
    return {
      newone: {
        name: "",
        configValue: 0,
        description: "",
        seq:0,
      },
      danwei:'',
      rules: {
        name: [
          { required: true, message: "请输入基础配置名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请选输入基础配置简介", trigger: "change" }
        ],
        configValue: [
          { required: true, message: "请输入基础配置值", trigger: "change" }
        ],
       
      },
    };
  },
  props: {
  },
  created(){
    var a = JSON.parse(localStorage.getItem('editbaseconfig'))
    this.newone = a
    if(this.newone.seq==1){
      this.danwei = '元'
      this.newone.configValue = this.newone.configValue/100
    }else if(this.newone.seq==2){
      this.danwei = '%'
    }else if(this.newone.seq==3){
      this.danwei = '分钟'
    }else if(this.newone.seq ==4){
      this.danwei = '天'
    }
  },
  computed: {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var a = JSON.parse(JSON.stringify(this.newone))
          if(a.seq==1){// 邮费设置
            a.configValue = a.configValue*100
          }
          putbaseconfig(this.newone.id,a).then(res =>{
            this.$emit('hideedit');
          })
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
