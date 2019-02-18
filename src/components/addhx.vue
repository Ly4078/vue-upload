<template>
  <div class="addhx">
    <div class="pageTitle">
      <span class="xqspsc">享7 — 核销列表查询</span>
      <el-button type="primary" plain @click="handtopbtn(1)">增删核销员</el-button>
      <el-button type="primary" plain @click="handtopbtn(2)">解除绑定商品</el-button>
    </div>
    <div class="point">
      <div class="boxs">
        <div class="poleft">平台核销点:</div>
        <div class="poleright">
          <el-radio-group v-model="radio">
            <el-radio
              v-for="item in pointList"
              :key="item.id"
              :label="item.id"
            >{{item.salepointName}}</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="boxs" v-show="isbtn==1">
        <div class="poleft">核销员列表:</div>
        <div class="poleright">
          <el-button type="primary" @click="handbtn(1)">
            <span class="el-icon-circle-plus-outline"></span>添加核销员
          </el-button>
          <ul v-if="userList.length>0">
            <li v-for="(item,index) in userList" :key="index">
              <span class="el-icon-remove-outline" @click="deleteuser(item.salePointUser.id)"></span>
              {{item.user.nickName}}({{item.user.mobile}})
            </li>
          </ul>
          <span v-else class="nohexiao">此销售点暂无相关核销员</span>
        </div>
      </div>

      <div class="boxs" v-show="isbtn==2">
        <el-table :data="tableData" style="width: 100%" max-height="900">
          <el-table-column fixed prop="skuCode" label="商品编号"></el-table-column>
          <el-table-column prop="skuName" label="商品名称"></el-table-column>
          <el-table-column prop="sellPrice" label="卖价"></el-table-column>
          <el-table-column prop="marketPrice" label="参考价"></el-table-column>
          <el-table-column prop="stockNum" label="库存"></el-table-column>
          <el-table-column align="center" prop="skuPic" label="图片" width="160">
            <template scope="scope">
              <img :src="scope.row.skuPic" width="100" height="100">
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >解除绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-size="50"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="添加核销员" :visible.sync="dialogFormVisible">
      <div>
        <el-input placeholder="请输入要添加核销员的电话号码" v-model="phone">
          <template slot="prepend">核销员电话号码</template>
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handbtn(1)">取 消</el-button>
        <el-button type="primary" @click="handbtn(2)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "addhx",
  data() {
    return {
      dialogFormVisible: false,
      phone: "",
      radio: 3,
      isbtn: 1,
      Apage: 1,
      Arows: 20,
      total: 0,
      userList: [],
      pointList: [], //核销点列表
      currentPage4: 4,
      tableData: []
    };
  },
  watch: {
    radio: function() {
      console.log("radio:", this.radio);
      if (this.isbtn == 1) {
        this.getpointUser();
      } else {
        this.getcommodity();
      }
    },
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) {
        this.phone = "";
      }
    }
  },
  methods: {
    loginhx() {
      console.log("addtoken:", sessionStorage.getItem("_TOKEN"));
    },
    //选择操作
    handtopbtn(val) {
      this.isbtn = val;
      this.radio = this.pointList[0].id;
      if (this.radio == this.pointList[0].id) {
        if (this.isbtn == 1) {
          this.getpointUser();
        } else {
          this.getcommodity();
        }
      } else {
        this.radio = this.pointList[0].id;
      }
    },
    //获取销售点列表
    getsalePoint() {
      let dataObj = {},
        _value = "",
        _this = this;
      dataObj = {
        page: 1,
        rows: 50,
        type: 1
      };
      for (let key in dataObj) {
        _value += key + "=" + dataObj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      let _Url = "/api/app/salePoint/listNew?" + _value;
      
      _Url = encodeURI(_Url);
      this.$axios({
        url: _Url,
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN")
        }
      }).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.list.length > 0) {
            _this.pointList = res.data.data.list;
            if (res.data.data.list[0].id) {
              _this.radio = res.data.data.list[0].id;
            }
          }
        }
      });
    },
    //查询销售点的核销员
    getpointUser() {
      const _this = this;
      _this.userList = [];
      this.$axios({
        url: "/api/salePoint/selectSalepintList?salepointId=" + this.radio,
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN")
        }
      }).then(res => {
        if (res.data.code == 0) {
          let _list = res.data.data;
          if (_list.length > 0) {
            for (let i in _list) {
              if (_list[i].user && _list[i].user.id) {
                _this.userList.push(_list[i]);
              }
            }
          }
        }
      });
    },
    //点击添加按钮
    handbtn(val) {
      if (val == 1) {
        this.dialogFormVisible = !this.dialogFormVisible;
      } else if (val == 2) {
        const reg = /^[1][3456789][0-9]{9}$/;
        if (reg.test(this.phone)) {
          this.adduser();
        } else {
          this.phone = "";
          this.$message.error("电话号码输入错误，请重新输入");
        }
      }
    },
    //添加销售点的核销员
    adduser() {
      let _obj = {},
        _value = "",
        _this = this;
      _obj = {
        salepointId: this.radio,
        shopId: 0,
        phone: this.phone,
        isAdmin: 0
      };
      for (let key in _obj) {
        _value += key + "=" + _obj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios({
        url: "/api/salePoint/addSalePointUser?" + _value,
        method: "post",
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN")
        }
      }).then(res => {
        if (res.data.code == 0) {
          _this.dialogFormVisible = !_this.dialogFormVisible;
          _this.$message({
            message: "添加成功！",
            type: "success"
          });
          _this.getpointUser();
        }
      });
    },
    //添加销售点的核销员
    deleteuser(val) {
      let _this = this;
      this.$axios({
        url: "/api/salePoint/deleteSalepintUser?id=" + val,
        method: "post",
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN")
        }
      }).then(res => {
        if (res.data.code == 0) {
          _this.$message("删除成功！");
          _this.deletId = "";
          _this.getpointUser();
        }
      });
    },
    //获取商品列表
    getcommodity() {
      this.$axios({
        url:
          "/api/app/salePoint/getGoodsListBySalePointIdNew?sendType=2&rows=" +
          this.Arows +
          "&id=" +
          this.radio +
          "&page=" +
          this.Apage,
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN")
        }
      }).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.list) {
            this.tableData = res.data.data.list;
          } else {
            this.tableData = [];
          }
          this.total = res.data.data.total;
        }
      });
    },
    //点击解除绑定
    deleteRow(index, rows) {
      const _id = this.tableData[index].id;
      this.$confirm("此操作将解除商品与销售点之间的绑定, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deldata(_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解除绑定操作"
          });
        });
    },
    deldata(_id) {
      const _this = this;
      this.$axios({
        url:
          "/api/app/salePoint/deleteGoodsSkuBySalePointId?id=" +
          this.radio +
          "&goodsSkuId=" +
          _id,
        method: "post",
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN")
        }
      }).then(res => {
        if (res.data.code == 0) {
          _this.$message({
            showClose: true,
            message: "解除绑定成功！",
            type: "success"
          });
          _this.getcommodity();
        }
      });
      // rows.splice(index, 1);
    },
    //每页条数发生变化时
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.Arows = val;
      this.getcommodity();
    },
    //页码发生变化时
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.Apage = val;
      this.getcommodity();
    }
  },
  created() {
    this.getsalePoint();
  }
};
</script>
<style lang="less">
.addhx {
  //   background: pink;
  .point {
    margin: 10px auto;
    width: 70%;
    min-height: 300px;
    font-size: 24px;
    .boxs {
      border: 2px solid pink;
      padding: 5px 0;
      margin: 5px 0;
      width: 100%;
      display: flex;
      align-items: center;
      .el-table {
        width: 100%;
      }
      .nohexiao {
        font-size: 20px;
        color: red;
      }
      & > div {
        float: left;
        ul {
          border-left: 1px solid red;
          padding-left: 10px;
        }
        li {
          list-style-type: none;
          text-align: left;
          .el-icon-remove-outline {
            color: red;
            cursor: pointer;
          }
        }
      }
      .poleft {
        min-width: 150px;
      }
    }
  }
}
</style>


