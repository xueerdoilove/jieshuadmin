<template>
  <div>
    <el-form ref="form" :rules="rules"  :model="newcoupon" label-width="120px">
      <el-form-item label="优惠券名字" prop="name">
        <el-input class="riqi" v-model="newcoupon.name"></el-input>
      </el-form-item>
      <el-form-item label="时效" prop="timeRange">
        <el-date-picker
          class="riqi"
          v-model="newcoupon.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="setriqi"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
        <span v-show="newcoupon.validDays>0">有效天数{{newcoupon.validDays}}天</span>
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
          <el-option label="无" value></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="限借阅" prop="upperLimit">
        <el-input style="width:80px;margin-right:10px;" v-model="newcoupon.upperLimit"></el-input>元以内书籍使用
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
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

export default {
  name: "newcoupon",
  data() {
    return {
      newcoupon: {
        name: "",
        bookStoreId: localStorage.getItem('bookStoreId')*1,
        introduction: "",
        startTime: "",
        endTime: "",
        timeRange: "",
        lowerLimit: "1",
        upperLimit: "100",
        validDays: 0,
        couponCnt: "1",
        couponType: "0"
      },
      rules: {
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请选输入优惠券简介", trigger: "change" }
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
        ]
      }
    };
  },
  props: {
    iconClass: {
      type: String
      // required: true
    },
    className: {
      type: String,
      default: ""
    }
  },
  computed: {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          postcouponList(this.newcoupon).then(res =>{
            this.$emit('hidenew');
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setriqi(e) {
      this.newcoupon.startTime = e[0];
      this.newcoupon.endTime = e[1];
      this.newcoupon.validDays = Math.ceil(
        (new Date(this.newcoupon.endTime).getTime() -
          new Date(this.newcoupon.startTime).getTime()) /
          1000 /
          24 /
          3600
      );
    }
  }
};
</script>

<style scoped>
.riqi {
  width: 400px;
}
</style>
