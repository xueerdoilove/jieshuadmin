<template>
  <div>
    <el-form ref="form" :rules="rules"  :model="new_one" label-width="120px">
      <el-form-item label="书店名称" prop="name">
        <el-input class="riqi" v-model="new_one.name"></el-input>
      </el-form-item>

      <el-form-item label="书店经度" prop="longitude">
        <el-input class="riqi" type="number" v-model="new_one.longitude"></el-input>
        <br>(经纬度的填写,请去 <a style="color:red;" href='https://lbs.qq.com/tool/getpoint/' target="_blank">坐标拾取</a> 页面自己找寻) <el-button type="text" style="margin-left:30px;" @click="showjieshi=!showjieshi">{{showjieshi?'收起':'详细教程'}}</el-button>
        <div v-show="showjieshi">
          1,点击红色文字跳转到坐标拾取页面并输入地点名字
          <br>2,搜索并寻找正确的地点位置 
          <br>3,复制坐标<img :src="step3" style="width:300px;" alt="">
        </div>
        
      </el-form-item>

      <el-form-item label="书店维度" prop="latitude">
        <el-input class="riqi" type="number" v-model="new_one.latitude"></el-input>
      </el-form-item>

      <el-form-item label="书店手机号" prop="mobile">
        <el-input class="riqi" type="number" v-model="new_one.mobile"></el-input>
      </el-form-item>

      <el-form-item label="书店介绍" prop="introduction">
        <el-input class="riqi" type="textarea" v-model="new_one.introduction"></el-input>
      </el-form-item>


      <el-form-item label="省市区" prop="district">
        <el-select v-model="new_one.province" @change="getshi"  placeholder="请选择省">
          <el-option
            v-for="sheng in shenglist"
            :key="sheng.id"
            :label="sheng.name"
            :value="sheng.id">
          </el-option>
        </el-select>

        <el-select v-model="new_one.city" @change="getqu"  placeholder="请选择市">
          <el-option
            v-for="shi in shilist"
            :key="shi.id"
            :label="shi.name"
            :value="shi.id">
          </el-option>
        </el-select>

        <el-select v-model="new_one.district" placeholder="请选择区">
          <el-option
            v-for="qu in qulist"
            :key="qu.id"
            :label="qu.name"
            :value="qu.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="具体地址" prop="address">
        <el-input class="riqi" v-model="new_one.address"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { poststore ,getprovcity } from '@/api/store'
import step3 from '@/assets/step3.png'
export default {
  name: "newstore",
  data() {
    return {
      showjieshi:false,
      step3:step3,
      shenglist:[],
      shilist:[],
      qulist:[],

      new_one: {
        name:"",                             // ->书店名称
        longitude:"",                         // ->经度
        latitude:"",                            //->维度
        introduction:"",               //->书店介绍
        mobile:"",                        //->手机号
        province:"",                                //->所在省份id
        city:"",                                    //->所在城市id
        district:"",                               // ->所在区id
        address:"",//->具体地址
      },
      rules: {
        name: [
          { required: true, message: "请输入书店名称", trigger: "blur" },
          { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请选输入书店介绍", trigger: "change" }
        ],
        longitude: [
          { required: true, message: "请选输入书店经度", trigger: "change" }
        ],
        latitude: [
          { required: true, message: "请选输入书店维度", trigger: "change" }
        ],
        mobile: [
          { required: true, message: "请选输入书店电话", trigger: "change" },
          { min: 11, max: 11, message: '长度在11字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: "请选输入书店具体地址", trigger: "change" }
        ],
        district:[
          { required: true, message: "请选择地址", trigger: "change" }
        ]
      }
    };
  },
  props: {
  },
  computed: {},
  mounted(){
    this.getsheng()
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          poststore(this.new_one).then(res =>{
            this.$emit('hidenew');
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getsheng(){
      //api/getprovcity?parentCode=110000&dataType=2&state=1&sk=xx&so=xx&page=1&pageSize=2
      getprovcity({
        parentCode:0,
        dataType:1,
        state:1,
      }).then(res =>{
        this.shenglist =[{name:'请选择省',id:'',code:''},...res.items]
      })
    },
    getshi(id){
      //api/getprovcity?parentCode=110000&dataType=2&state=1&sk=xx&so=xx&page=1&pageSize=2
      if(!id){
        this.new_one.city = ''
        this.new_one.district = ''
      }else{
        var parentCode = ''
        for(var i = 0 ;i<this.shenglist.length;i++){
          if(this.shenglist[i].id==id){
            parentCode = this.shenglist[i].code
          }
        }
        getprovcity({
          parentCode:parentCode,
          dataType:2,
          state:1,
        }).then(res =>{
          this.shilist = [{name:'请选择市',id:'',code:''},...res.items]
        })
      }
    },
    getqu(id){
      //api/getprovcity?parentCode=110000&dataType=2&state=1&sk=xx&so=xx&page=1&pageSize=2
      if(!id){
        this.new_one.district = ''
      }else{
        var parentCode = ''
        for(var i = 0 ;i<this.shilist.length;i++){
          if(this.shilist[i].id==id){
            parentCode = this.shilist[i].code
          }
        }
        getprovcity({
          parentCode:parentCode,
          dataType:3,
          state:1,
        }).then(res =>{
          this.qulist = [{name:'请选择区',id:'',code:''},...res.items]
        })
      }
      
    },
  }
};
</script>

<style scoped>
.riqi {
  width: 400px;
}
.el-select{
  width: 130px;
  margin-right: 10px;
}
</style>
