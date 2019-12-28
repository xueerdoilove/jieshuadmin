<template>
  <div>
    <el-form ref="form" :rules="rules" :model="newone" label-width="120px">
      <el-form-item label="提醒">新增管理员后,请立刻设置管理员的权限身份</el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input class="riqi" v-model="newone.name"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="newone.gender" placeholder="请选择">
          <el-option
            v-for="item in genderlist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input class="riqi" type="text" maxlength="11" v-model="newone.phone"></el-input>
      </el-form-item>

      <el-form-item label="登录密码" prop="pass">
        <el-input class="riqi" type="text" v-model="newone.pass"></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPass">
        <el-input class="riqi" type="text" v-model="newone.confirmPass"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">新增管理员</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { useradd } from '@/api/user'
import sha1 from "sha1";
export default {
  name: "newone",
  data() {
    const phonepipei = (rule, value, callback) => {
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error("手机号输入有误"));
      } else {
        callback();
      }
    };
    var dangqiammima1 = ''
    var dangqiammima2 = ''
    var mimapipei1 = (rule, value, callback) => {
      if(value.length<6|| value.length>18){
        callback(new Error("密码长度在 6 到 18 个字符"));
      }else{
        dangqiammima1 = value
        if(dangqiammima2==''){
          callback();
        }else{
          if(dangqiammima2 == dangqiammima1){
            callback();
          }else{
            callback(new Error("密码不一致"));
          }
        }
      }
    };
    var mimapipei2 = (rule, value, callback) => {
      if(value.length<6|| value.length>18){
        callback(new Error("密码长度在 6 到 18 个字符"));
      }else{
        dangqiammima2 = value
        if(dangqiammima1==''){
          callback();
        }else{
          if(dangqiammima2 == dangqiammima1){
            callback();
          }else{
            callback(new Error("密码不一致"));
          }
        }
      }
    };
    return {
      newone: {
        name: "",
        gender: 0,
        phone: "",
        pass: '',
        confirmPass: '',
      },
      danwei: "",
      rules: {
        name: [
          { required: true, message: "请输入管理员昵称", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 2 到 16 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true,  validator:phonepipei, trigger: "blur" }
        ],
        pass: [
          { required: true, validator: mimapipei1, trigger: "blur" }
        ],
        confirmPass: [
          { required: true, validator: mimapipei2, trigger: "blur" }
        ],
      },
      genderlist:[
        {label:'未知',value:0},
        {label:'男',value:1},
        {label:'女',value:2},
      ]
    };
  },
  props: {},
  created() {
    
  },
  computed: {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var a = JSON.parse(JSON.stringify(this.newone));
           a.pass = sha1(a.pass)
           a.confirmPass = sha1(a.confirmPass)
          useradd(a).then(res => {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.$emit("hidenew");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
