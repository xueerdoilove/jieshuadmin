<template>
  <div class="container">
    <div class="shili">
      <img src="../../assets/toubu1.jpg" class="shilitouimg" alt />
      <div v-html="htmltext"></div>
    </div>
    <div class="caozuo">
      <el-button type="primary" @click="showfuwenben">编辑</el-button>
    </div>

    <!-- 富文本 -->
    <el-dialog title="帮助文案修改,字数要少于5120" :visible.sync="show_wenan">
      <div v-if="show_wenan">
        <div id="butGroup" class="editorhead">
          <el-tooltip
            class="item"
            effect="dark"
            content="返回上一步"
            placement="bottom"
            :open-delay="1000"
          >
            <input onclick="editor.undo()" type="button" style="background-position:0 -168px;" />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="返回下一步"
            placement="bottom"
            :open-delay="1000"
          >
            <input
              onclick="editor.redo()"
              type="button"
              style="background-position:0 -198px;opacity: .3;"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="清除样式"
            placement="bottom"
            :open-delay="1000"
          >
            <input
              onclick="editor.clearStyle()"
              type="button"
              style="background-position:0 -890px;"
            />
          </el-tooltip>
        </div>
        <iframe class="contenteditablebody" id="contenteditable2"></iframe>
        <div>
          <el-button type="primary" @click="tijiaoxinxi">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { gethelpcfg, puthelpcfg } from "@/api/baseconfig";
export default {
  named: "帮助",
  data() {
    return {
      htmltext: "",
      show_wenan: false
      // couponType: -1,
      // sk: "time",
      // so: "desc"
    };
  },
  mounted() {
    this.mgethelpcfg();
  },
  components: {},
  filters: {},
  computed: {},
  methods: {
    mgethelpcfg() {
      gethelpcfg({}).then(res => {
        this.htmltext = res.item.helpTxt;
      });
    },

    tijiaoxinxi() {
      var str = window.editor.html();
      if (str.length > 5120) {
        this.$message({
          message: "文案太长,字数少于5120",
          type: "success"
        });
        return;
      }
      puthelpcfg({ helpTxt: str }).then(res => {
        this.show_wenan = false;
        this.mgethelpcfg();
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    },

    // 展示富文本编辑器
    showfuwenben() {
      this.show_wenan = true;
      setTimeout(() => {
        window.editor = new Weditor("contenteditable2");
        window.editor.html(this.htmltext);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 30px;
}
.shili {
  width: 400px;
  border: 1px solid #eee;
  min-height: 650px;
  float: left;
  box-shadow: 0 0 3px #333;
}
.shilitouimg {
  width: 100%;
}
.caozuo {
  float: left;
  margin-left: 20px;
}
.contenteditablebody {
  width: 100%;
  height: 400px;
}
.editorhead {
  background-color: #eee;
  padding: 5px 10px 3px 10px;
}
.editorhead input {
  height: 20px;
  width: 20px;
  display: inline-block;
  overflow: hidden;
  background: url(../../assets/editor.png) no-repeat;
  border: none;
  padding: 0;
  cursor: pointer;
  box-sizing: border-box;
}
.editorhead input:hover {
  box-shadow: 0 0 1px #000;
}
</style>
