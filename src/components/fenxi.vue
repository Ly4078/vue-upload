<template>
  <!-- 双色球历史开奖统计 -->
  <div class="fenxi">
    <el-button type="primary" @click="method5('dataTable')">导出表格</el-button>
    <el-upload
      class="upload-demo"
      ref="upload"
      action="/"
      accept=".xls, .xlxs"
      :on-change="upload"
      :show-file-list="false"
      :aut-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
    <table border="1" id="dataTable">
      <tr>
        <td colspan="4">双色球历史开奖统计</td>
      </tr>
      <tr>
        <td>序号</td>
        <td>期号</td>
        <td>中奖号码</td>
        <td>开奖日期</td>
      </tr>
      <tr v-for="(item,index) in list" :key="item.lottery_no">
        <td>{{index+1}}</td>
        <td>{{item.lottery_no?item.lottery_no:item.__EMPTY }}</td>
        <td>{{item.lottery_res?item.lottery_res:item.__EMPTY_1}}</td>
        <td>{{item.lottery_date?item.lottery_date:item.__EMPTY_2 }}</td>
      </tr>
    </table>
    <div class="boxs" id="boxs"></div>
  </div>
</template>
<script>
import XLSX from "xlsx";
export default {
  name: "fenxi",
  data() {
    return {
      list: [],
      tjarr: [],
      cparr: [],
      isupload:true,
      timer: null,
      page: 1
    };
  },
  methods: {
    //获取原始数据
    getData() {
      let dataObj = {},
        _value = "",
        _this = this;
      dataObj = {
        key: "b2b9f7ced2857729a9c9d0e6f2327c86",
        lottery_id: "ssq",
        page_size: 50,
        page: this.page
      };
      for (let key in dataObj) {
        _value += key + "=" + dataObj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      console.log("_value:", _value);
      let _Url = "/api/lottery/history?" + _value;
      _Url = encodeURI(_Url);
      console.log("_Url3213:", _Url);
      this.$axios({
        url: _Url,
        method: "get"
      }).then(res => {
        if (res.data.error_code == 0) {
          let _list = res.data.result.lotteryResList;
          console.log("_list:", _list);
          _this.list = _this.list.concat(_list);
          console.log("list:", _this.list);
          _this.analysis();
          if (res.data.result.totalPage * 1 - _this.page * 1 > 0) {
            _this.page++;
            // _this.getData();
          } else {
            // _this.analysis();
          }
        }
        console.log("res:", res);
      });
    },
    //数据分析
    analysis() {
      let dataArr = [],
        _tjarr = [],
        _this = this,
        _num = 0;
      console.log('listana:',this.list)
      for (let i in this.list) {
        console.log("fdasfa:",this.list[i])
        if(list[i].lottery_res){
          console.log('1111111')
          dataArr.push(this.list[i].lottery_res.split(","));
        }else{
          console.log('222222')
        }
      }
      console.log("dataArr:", dataArr);
      for (let k in dataArr) {
        for (let n in dataArr[k]) {
          switch (dataArr[k][n]) {
            case dataArr[k][n]:
              var _n = dataArr[k][n];
              if (_tjarr[_n]) {
                _tjarr[_n].total++;
                if (_tjarr[_n][n]) {
                  _tjarr[_n][n]++;
                } else {
                  _tjarr[_n][n] = 1;
                }
              } else {
                _tjarr[_n] = {};
                _tjarr[_n].num = _n;
                _tjarr[_n].total = 1;
                _tjarr[_n][n] = 1;
              }
          }
        }
      }
      this.tjarr = _tjarr;
      console.log("tjarr:", this.tjarr);
      // return
      this.timer = setInterval(() => {
        _this.changesort(_num);
        _num++;
      }, 200);
    },
    changesort(val) {
      const _this = this;
      console.log("tjarr:", this.tjarr);
      if (val > 6) {
        clearInterval(_this.timer);
        this.allDatasort();
      }
      let newarr = [],
        tjarr2 = [];
      for (var n in this.tjarr) {
        Object.keys(this.tjarr[n]).forEach(function(key) {
          if (key == val) {
            newarr.push(_this.tjarr[n]);
          }
        });
      }
      [...tjarr2] = newarr;
      this.cparr = tjarr2;
      this.sort(val);
    },
    //排序
    sort(val1) {
      console.log("cparr:", this.cparr);
      let str = "",
        str1 = "",
        _this = this;
      for (var i = 1; i < _this.cparr.length; i++) {
        for (var j = 1; j < _this.cparr.length - i; j++) {
          if (_this.cparr[j][val1]) {
            if (_this.cparr[j][val1] > _this.cparr[j + 1][val1]) {
              var swap = _this.cparr[j];
              _this.cparr[j] = this.cparr[j + 1];
              _this.cparr[j + 1] = swap;
            }
          }
        }
      }
      Object.keys(_this.cparr[0]).forEach(function(key) {
        if (key == "total") {
          str1 =
            "第" +
            val1 +
            "位出现次数最多的数字是" +
            _this.cparr[0].num +
            ",共计出现" +
            _this.cparr[0].total +
            "次,其中";
        } else if (key == "num") {
        } else {
          str +=
            "在第" + (key * 1 + 1) + "位出现" + _this.cparr[0][key] + "次, ";
        }
      });
      str1 += str;
      console.log("str1:", str1);
      this.shuchu(str1);
    },
    allDatasort() {
      console.log("fdsafdsaf:", this.tjarr);
      for (var m in this.tjarr) {
        var str = "",
          _total = "",
          _this = this;
        Object.keys(_this.tjarr[m]).forEach(function(key) {
          console.log("key:", key);
          if (key == "total") {
            _total =
              "数字" +
              _this.tjarr[m].num +
              "出现总次数有" +
              _this.tjarr[m].total +
              "次,其中 ";
          } else if (key == "num") {
          } else {
            str +=
              "在第" + (key * 1 + 1) + "位出现" + _this.tjarr[m][key] + "次, ";
          }
        });
        _total += str;
        console.log("_total:", _total);
        // this.shuchu(_total);
      }
    },
    shuchu(val) {
      var _boxs = document.getElementById("boxs");
      var ospan = document.createElement("span");
      ospan.innerHTML = val;
      _boxs.appendChild(ospan);
      var obr = document.createElement("br");
      _boxs.appendChild(obr);

      var ohr = document.createElement("hr");
      _boxs.appendChild(ohr);
    },
    //判断浏览器类型
    getExplorer() {
      var explorer = window.navigator.userAgent;
      //ie
      if (explorer.indexOf("MSIE") >= 0) {
        return "ie";
      }
      //firefox
      else if (explorer.indexOf("Firefox") >= 0) {
        return "Firefox";
      }
      //Chrome
      else if (explorer.indexOf("Chrome") >= 0) {
        return "Chrome";
      }
      //Opera
      else if (explorer.indexOf("Opera") >= 0) {
        return "Opera";
      }
      //Safari
      else if (explorer.indexOf("Safari") >= 0) {
        return "Safari";
      }
    },
    //下载表格
    method5(tableid) {
      if (this.getExplorer() == "ie") {
        console.log("1111");
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;

        try {
          var fname = oXL.Application.GetSaveAsFilename(
            "Excel.xls",
            "Excel Spreadsheets (*.xls), *.xls"
          );
        } catch (e) {
          print("Nested catch caught " + e);
        } finally {
          oWB.SaveAs(fname);
          oWB.Close((savechanges = false));
          oXL.Quit();
          oXL = null;
          idTmr = window.setInterval("Cleanup();", 1);
        }
      } else {
        this.tableToExcel(tableid);
      }
    },
    Cleanup() {
      window.clearInterval(idTmr);
      CollectGarbage();
    },
    //生成要下载的表格
    tableToExcel() {
      var uri = "data:application/vnd.ms-excel;base64,",
        template =
          '<html><head><meta charset="UTF-8"></head><body><table  border="1">{table}</table></body></html>',
        base64 = function(s) {
          return window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function(s, c) {
          return s.replace(/{(\w+)}/g, function(m, p) {
            return c[p];
          });
        };
      console.log("format:", format);
      var table = document.getElementById(table);
      var dataTable = document.getElementById("dataTable");

      var ctx = {
        worksheet: name || "Worksheet",
        table: dataTable.innerHTML
      };
      window.location.href = uri + base64(format(template, ctx));
      return window.location.href;

      console.log("table:", table);
      console.log("dataTable:", dataTable);
      console.log("name:", name);
      return function(table, name) {
        console.log("table:", table);
        console.log("name:", name);
        if (!table.nodeType) table = document.getElementById(table);
        var ctx = {
          worksheet: name || "Worksheet",
          table: table.innerHTML
        };
      };
    },
    upload(file, fileList) {
      console.log("file", file);
      console.log("fileList", fileList);
      // if(this.isupload){
        this.isupload=false;
        let files = { 0: file.raw };
        this.readExcel1(files);
      // }
    },
    readExcel1(files) {
      //表格导入
      const _this = this;
      console.log(files);
      if (files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          //  ws.slice(1);
           ws.splice(0,1);
           console.log('ws:',ws)
          for(let i in ws){
           
            // console.log("ws[i].__EMPTY_1:",ws[i].__EMPTY_1)
            ws[i].__EMPTY_1+="";
            if(ws[i].__EMPTY_1.length==13){
              ws[i].__EMPTY_1="0"+ws[i].__EMPTY_1;
            }
          }
          
          const reg=/.{2}/g,h=[];
          for(let j in ws){
              let rs=ws[j].__EMPTY_1.match(reg);
              let _str=rs.join(',');
              ws[j].__EMPTY_1=_str;
            
          }
          _this.list=ws;
          _this.analysis();
          //重写数据
          try {
          } catch (err) {
            console.log(err);
          }

          this.$refs.upload.value = "";
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style scoped>
.fenxi {
  width: 80%;
  min-height: 400px;
  margin: 0 auto;
}
</style>

