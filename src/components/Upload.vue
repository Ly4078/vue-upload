<template>
  <div class="upload">
    <div class="pageTitle">
      <span class="xqspsc">享7 — 商品上传</span>
    </div>
    <el-form ref="formObj" :model="formObj" label-width="100px">
      <el-form-item label="商品类型">
        <el-radio-group v-model="ActIds">
          <el-radio v-model="ActIds" label="41">砍价</el-radio>
          <el-radio v-model="ActIds" label="43">拼团</el-radio>
          <el-radio v-model="ActIds" label="42">抽奖</el-radio>
          <el-radio v-model="ActIds" label="xsd">上传平台销售点商品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品主图">
        <el-upload class="avatar-uploader" action="#" :before-upload="beforeAvatarUpload">
          <img v-if="formObj.skuPic" :src="formObj.skuPic" class="avatar ztimg">
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon addimg"
            v-loading="loading1"
            style="width: 100%"
          ></i>
        </el-upload>
      </el-form-item>
      <hr>
      <el-form-item label="商品轮播图">
        <el-upload class="avatar-uploader" action="#" :before-upload="beforeAvatarUpload3">
          <img v-for="item in SkuPics" :key="item" :src="item" class="avatar ztimg">
          <i
            class="el-icon-plus avatar-uploader-icon addimg"
            v-loading="loading3"
            style="width: 100%"
          ></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品标题" prop="skuName">
        <el-input v-model="formObj.skuName"></el-input>
      </el-form-item>
      <el-form-item label="一级类目ID" required>
        <el-col :span="10">
          <el-form-item prop="Cateid">
            <el-select v-model="Cateid" placeholder="请选择一级类目ID">
              <el-option
                v-for="item in Category"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="4">二级类目ID</el-col>
        <el-col :span="10">
          <el-form-item prop="categoryId">
            <el-select v-model="formObj.goodsSpuInVo.categoryId" placeholder="请选择二级类目ID">
              <el-option
                v-for="item in Category2"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="商品原价" required>
        <el-col :span="10">
          <el-form-item prop="sellPrice">
            <el-input
              type="formObj.stockNum"
              v-model.number="formObj.sellPrice"
              autocomplete="off"
              placeholder="元"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="4">原价库存</el-col>
        <el-col :span="10">
          <el-form-item prop="stockNum">
            <el-input v-model="formObj.stockNum"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="最小销售量">
        <el-input v-model="formObj.miniNum" disabled></el-input>
      </el-form-item>

      <el-form-item label="参考价" required>
        <el-col :span="11">
          <el-form-item prop="marketPrice">
            <el-input v-model="formObj.marketPrice" placeholder="元"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11" v-if="ActIds!='xsd'">
          <el-form-item label="商品活动价" prop="actAmount">
            <el-input
              v-model="formObj.actGoodsSkuInVos[0].goodsPromotionRules.actAmount"
              placeholder="元"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="重量" required>
        <el-col :span="11">
          <el-form-item prop="realWeight">
            <el-input v-model="formObj.realWeight" placeholder="千克(KG)"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="单位" prop="unit">
            <el-select v-model="formObj.unit" placeholder="请选择单位">
              <el-option v-for="item in units" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <!-- <el-input v-model="formObj.unit" placeholder="盒/斤/件..."></el-input> -->
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="件数" required>
        <el-col :span="11">
          <el-form-item prop="piece">
            <el-input v-model="formObj.piece"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="体积" pro="bulk">
            <el-input v-model="formObj.bulk" placeholder="米立米（M3）"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="是否包邮">
        <el-radio-group v-model="formObj.deliveryTemplateInVo.isFree">
          <el-radio v-model="formObj.deliveryTemplateInVo.isFree" label="0">不包邮</el-radio>
          <el-radio v-model="formObj.deliveryTemplateInVo.isFree" disabled label="1">包邮</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="配送类型">
        <el-radio-group v-model="formObj.sendType">
          <el-radio v-model="formObj.sendType" label="1" v-if="ActIds!='xsd'">平台邮购</el-radio>
          <el-radio v-model="formObj.sendType" label="2" v-if="ActIds=='xsd'">门店自提</el-radio>
          <el-radio v-model="formObj.sendType" disabled label="0">均支持</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="拆单类型">
        <el-radio-group v-model="formObj.singleType">
          <el-radio v-model="formObj.singleType" label="1">分单</el-radio>
          <el-radio v-model="formObj.singleType" disabled label="2">整单</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="权重" v-if="ActIds==42">
        <el-col :span="11">
          <el-input v-model="formObj.actGoodsSkuInVos[0].weight"></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="比率">
            <el-input v-model="formObj.actGoodsSkuInVos[0].ratio"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="计价方式">
        <el-radio-group v-model="formObj.deliveryTemplateInVo.calculateType">
          <el-radio v-model="formObj.deliveryTemplateInVo.calculateType" label="1">按件数</el-radio>
          <el-radio v-model="formObj.deliveryTemplateInVo.calculateType" disabled label="2">按重量</el-radio>
          <el-radio v-model="formObj.deliveryTemplateInVo.calculateType" disabled label="3">按体积</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择销售点" v-if="ActIds=='xsd'">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item in pointList"
            :label="item.id"
            :key="item.id"
          >{{item.salepointName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发货地址">
        <el-input class="narrow" disabled v-model="formObj.deliveryTemplateInVo.shippingAddress"></el-input>
      </el-form-item>

      <el-form-item label="运费设置" required v-if="formObj.sendType!=2">
        <el-col :span="11">
          <el-select v-model="template_id" placeholder="设置运费">
            <el-option
              v-for="item in delivery"
              :key="item.id"
              :label="item.deliveryTemplateOut.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11" v-if="template_id=='自定义运费模板'|| template_id==0">
          <el-form-item label="模板名称" required>
            <el-input v-model="formObj.deliveryTemplateInVo.name"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="发货范围" v-if="template_id=='自定义运费模板'|| template_id==0">
        <el-col :span="11">
          <el-input v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].regionDesc" disabled></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="首件" v-if="template_id=='自定义运费模板'|| template_id==0" required>
        <el-col :span="11">
          <el-input
            v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].firstPiece"
            placeholder="元"
          ></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="续件" required>
            <el-input
              v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].secondPiece"
              placeholder="元"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="首重" v-if="template_id=='自定义运费模板'|| template_id==0" required>
        <el-col :span="11">
          <el-input
            v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].firstWeight"
            placeholder="元/千克(kg)"
          ></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="续重" required>
            <el-input
              v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].secondWeight"
              placeholder="元/千克(kg)"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="首体积" v-if="template_id=='自定义运费模板'|| template_id==0" required>
        <el-col :span="11">
          <el-input
            v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].firstBulk"
            placeholder="立方米/千克(M3/kg)"
          ></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="续体积" required>
            <el-input
              v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].secondBulk"
              placeholder="立方米/千克(M3/kg)"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="首价格" v-if="template_id=='自定义运费模板'|| template_id==0" required>
        <el-col :span="11">
          <el-input
            v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].firstAmount"
            placeholder="元"
          ></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
        <el-col :span="11">
          <el-form-item label="续价格" required>
            <el-input
              v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].secondAmount"
              placeholder="元"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="平台配送" v-if="template_id=='自定义运费模板'|| template_id==0">
        <el-radio-group
          v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].deliveryMethodType"
        >
          <el-radio
            v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].deliveryMethodType"
            label="3"
          >中通</el-radio>
          <el-radio
            v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].deliveryMethodType"
            disabled
            label="1"
          >顺丰</el-radio>
          <el-radio
            v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].deliveryMethodType"
            disabled
            label="2"
          >圆通</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否默认配送方式" v-if="template_id=='自定义运费模板'|| template_id==0">
        <el-radio-group v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].isDefaultt">
          <el-radio v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].isDefaultt" label="0">否</el-radio>
          <el-radio
            v-model="formObj.deliveryTemplateInVo.deliveryMethods[0].isDefaultt"
            disabled
            label="1"
          >是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="开团时间" v-if="ActIds==43">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker
            type="fixed-time"
            placeholder="选择时间"
            v-model="date11"
            style="width: 100%;"
          ></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间" v-if="ActIds==43">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="date2" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker
            type="fixed-time"
            placeholder="选择时间"
            v-model="date22"
            style="width: 100%;"
          ></el-time-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="参团人数" v-if="ActIds==41 ||ActIds==43">
        <el-input class="narrow" v-model="formObj.actGoodsSkuInVos[0].peopleNum"></el-input>人
      </el-form-item>

      <el-form-item label="活动规则" v-if="ActIds==41 ||ActIds==43">
        <el-input
          type="textarea"
          v-model="formObj.actGoodsSkuInVos[0].ruleDesc"
          placeholder="输入活动规则"
        ></el-input>
      </el-form-item>

      <el-form-item label="图文详情">
        <el-input
          type="textarea"
          v-model="formObj.goodsSpuInVo.goodsSpuDesc.title"
          placeholder="输入商品详情文字信息"
        ></el-input>
        <div v-for="(item,index) in picUrl" :key="item" class="picimgs">
          <img :src="item" alt="图片">
          <el-button @click="delpicimg(index)">删除</el-button>
        </div>
        <el-upload class="avatar-uploader" action="#" :before-upload="beforeAvatarUpload2">
          <i
            class="el-icon-plus avatar-uploader-icon addimg"
            v-loading="loading2"
            :data="picUrl"
            style="width: 100%"
          ></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交数据</el-button>
        <el-button @click="Refresh">清空数据</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import qs from "qs";
export default {
  data() {
    return {
      checkList: [],
      pointList: [], //销售列表
      picUrl: [], //富文本图片数组
      ActIds: "xsd", //活动ID  41砍价  43拼团
      Category: [], //商品类目
      Cateid: "", //一级类目ID
      Category2: [],
      SkuPics: [], //轮播图数组
      Cateid2: "", //二级类目ID
      delivery: [], //运费模板数组
      date1: "", //开始时间 年月日
      date11: "", //开始时间 时分秒
      date2: "", //结束时间年月日
      date22: "", //结束时间 时分秒
      template_id: "自定义运费模板", //运费模板ID
      loading2: false,
      loading1: false,
      loading3: false,
      units: [
        "盒",
        "件",
        "个",
        "提",
        "台",
        "斤",
        "两",
        "克",
        "千克",
        "升",
        "毫升"
      ],
      form: {
        age: "",
        name: "",
        delivery: false,
        type: [],
        ActId: ""
      },
      formObj: {
        goodsSkuPics: "", //
        skuName: "",
        skuPic: "",
        smallSkuPic: "",
        sellPrice: "",
        marketPrice: "",
        otherMarkerPrice: "",
        costPrice: "",
        stockNum: "9999",
        shopId: "0",
        miniNum: "1",
        sendType: "",
        singleType: "1",
        expiryDate: "90",
        realWeight: "1",
        unit: "",
        piece: "1",
        bulk: "1",
        goodsSkuSpecValue: {
          specValueId: "23"
        },
        goodsSpuInVo: {
          spuName: "",
          spuType: "10",
          categoryId: "",
          brandId: "1",
          goodsSpuSpec: {
            specId: "7"
          },
          goodsSpuDesc: {
            title: "",
            content: ""
          }
        },
        salePointInVo: {
          shopId: "0", //商家id
          salePointIds: [] //销售点id列表
        },
        actGoodsSkuInVos: [
          {
            actId: "41",
            shopId: "0",
            categoryId: "",
            peopleNum: "4",
            ruleDesc: "",
            weight: "",
            ratio: "",
            stockNum: "9999",
            startTime: "",
            dueTime: "",
            goodsPromotionRules: {
              ruleType: "4",
              ruleDesc: "邀请好友砍价",
              shopId: "0",
              actAmount: ""
            }
          }
        ],
        deliveryTemplateInVo: {
          name: "",
          id: "",
          shippingAddress: "上海",
          isFree: "0",
          calculateType: "1",
          shopId: "0",
          deliveryMethods: [
            {
              regionDesc: "全国各地",
              firstPiece: "",
              firstWeight: "",
              firstBulk: "",
              firstAmount: "",
              secondPiece: "",
              secondWeight: "",
              secondBulk: "",
              secondAmount: "",
              deliveryMethodType: "3",
              isDefaultt: "0"
            }
          ]
        }
      },
      rules: {
        skuName: [
          { required: true, message: "请输入商品标题", trigger: "blur" }
        ],
        Cateid: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        categoryId: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        sellPrice: [
          { required: true, message: "请输入商品原价", trigger: "blur" }
        ],
        stockNum: [
          { required: true, message: "请输入原价库存", trigger: "blur" }
        ],
        marketPrice: [
          { required: true, message: "请输入参考价", trigger: "blur" }
        ],
        actAmount: [
          { required: true, message: "请输入商品活动价格", trigger: "blur" }
        ],
        realWeight: [
          { required: true, message: "请输入重量", trigger: "blur" }
        ],
        unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
        piece: [{ required: true, message: "请输入件数", trigger: "blur" }],
        bulk: [{ required: true, message: "请输入体积", trigger: "blur" }]
      }
    };
  },
  watch: {
    checkList: function() {
      console.log("checkList:", this.checkList);
    },
    ActIds: function() {
      this.formObj.actGoodsSkuInVos[0].actId = this.ActIds;
      if (this.ActIds == 41) {
        this.formObj.sendType = "1";
        this.formObj.actGoodsSkuInVos[0].goodsPromotionRules.ruleDesc =
          "邀请好友砍价";
        this.formObj.actGoodsSkuInVos[0].goodsPromotionRules.ruleType = "4";
      } else if (this.ActIds == 43) {
        this.formObj.sendType = "1";
        this.formObj.actGoodsSkuInVos[0].goodsPromotionRules.ruleDesc =
          "邀请好友拼团";
        this.formObj.actGoodsSkuInVos[0].goodsPromotionRules.ruleType = "7";
      } else if (this.ActIds == "xsd") {
        this.getsalePoint();
        this.formObj.sendType = "2";
      } else {
        this.formObj.sendType = "1";
      }
    },
    Cateid: function() {
      let _datas = this.Category;
      this.Category2 = [];
      this.formObj.goodsSpuInVo.categoryId = "";
      for (let i in _datas) {
        if (
          _datas[i].status == 1 ||
          _datas[i].status == 3 ||
          _datas[i].status == 5
        ) {
          if (this.Cateid == _datas[i].id) {
            this.Category2 = _datas[i].children;
          }
        }
      }
    },
    template_id: function() {
      (this.date1 = ""),
        (this.date11 = ""),
        (this.date2 = ""),
        (this.date22 = "");
      for (let i in this.delivery) {
        if (this.template_id == this.delivery[i].id) {
          this.formObj.deliveryTemplateInVo.shippingAddress = this.delivery[
            i
          ].deliveryTemplateOut.shippingAddress;
          if (this.template_id != 0) {
            this.formObj.deliveryTemplateInVo.id = this.template_id;
            this.formObj.deliveryTemplateInVo.name = this.delivery[
              i
            ].deliveryTemplateOut.name;
          } else {
            this.formObj.deliveryTemplateInVo.name = "";
            this.formObj.deliveryTemplateInVo.id = "";
          }
        }
      }
    }
  },
  methods: {
    //用户登录
    login() {
      let _this = this;
      _this.deliveryTemplateShop();
      _this.goodsCategory();
      if (this.ActIds == "xsd") {
        this.getsalePoint();
        this.formObj.sendType = "2";
      } else {
        this.formObj.sendType = "1";
      }
    },
    //提交数据
    onSubmit() {
      if (!this.formObj.goodsSkuPics) {
        this.$message.error("请至少上传一张轮播图");
        return;
      }
      if (!this.formObj.skuPic) {
        this.$message.error("商品主图必传");
        return;
      }
      if (this.template_id == "自定义运费模板" || this.template_id == 0) {
        if (!this.formObj.deliveryTemplateInVo.name) {
          this.$message.error("请填写运费模板名称");
          return;
        }
      }
      if (!this.formObj.marketPrice) {
        this.$message.error("请输入商品参考价");
        return;
      }
      if (!this.formObj.goodsSpuInVo.categoryId) {
        this.$message.error("请选择商品所属类目");
        return;
      }
      if (this.formObj.goodsSkuPics.substr(0, 1) == ",") {
        this.formObj.goodsSkuPics = this.formObj.goodsSkuPics.substr(1);
      }
      if (this.ActIds != "xsd") {
        if (this.formObj.marketPrice <= this.formObj.sellPrice) {
          this.$alert("参考价应该大于原价", "价格错误", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {}
          });
          return;
        }
        if (
          this.formObj.sellPrice <=
          this.formObj.actGoodsSkuInVos[0].goodsPromotionRules.actAmount
        ) {
          this.$alert("售价应该大于活动价", "价格错误", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {}
          });
          return;
        }
      }
      this.formObj.costPrice = this.formObj.marketPrice;
      this.formObj.otherMarkerPrice = this.formObj.marketPrice;
      this.formObj.goodsSpuInVo.spuName = this.formObj.skuName;
      this.formObj.goodsSpuInVo.categoryId = this.formObj.goodsSpuInVo.categoryId;

      if (this.formObj.deliveryTemplateInVo.deliveryMethods[0].firstWeight) {
        delete this.formObj.deliveryTemplateInVo.id;
      }
      if (this.formObj.actGoodsSkuInVos) {
        if (!this.formObj.actGoodsSkuInVos[0].ruleDesc) {
          delete this.formObj.actGoodsSkuInVos[0].ruleDesc;
        }
      }

      if (this.ActIds == 43) {
        if (new Date(this.date11).getTime() > new Date(this.date22).getTime()) {
          this.open();
          return;
        }
        this.date1 = this.formatDate(this.date1, 1);
        this.date11 = this.formatDate(this.date11, 2);
        this.date2 = this.formatDate(this.date2, 1);
        this.date22 = this.formatDate(this.date22, 2);
        this.formObj.actGoodsSkuInVos[0].startTime = this.date1 + this.date11;
        this.formObj.actGoodsSkuInVos[0].dueTime = this.date2 + this.date22;
        this.formObj.actGoodsSkuInVos[0].categoryId = this.formObj.goodsSpuInVo.categoryId;
      } else if (this.ActIds == "xsd") {
        if (this.checkList.length < 1) {
          this.$alert("请选择至少一个销售点", "", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {}
          });
          return;
        } else {
          this.formObj.salePointInVo.salePointIds = this.checkList;
        }
        delete this.formObj.actGoodsSkuInVos;
      } else if (this.ActIds == 42) {
        delete this.formObj.actGoodsSkuInVos[0].goodsPromotionRules;
        delete this.formObj.actGoodsSkuInVos[0].peopleNum;
        delete this.formObj.actGoodsSkuInVos[0].ruleDesc;
        delete this.formObj.actGoodsSkuInVos[0].startTime;
        delete this.formObj.actGoodsSkuInVos[0].dueTime;
      } else {
        this.formObj.actGoodsSkuInVos[0].categoryId = this.formObj.goodsSpuInVo.categoryId;
      }
      if (this.formObj.sendType != 2) {
        _this.template_id = "";
        _this.formObj.deliveryTemplateInVo.shippingAddress = "";
      }

      let _content = "",
        _picUrl = "";
      _content += "<p>" + this.formObj.goodsSpuInVo.goodsSpuDesc.title + "</p>";
      if (this.picUrl) {
        for (let i in this.picUrl) {
          let _img = '<img src="' + this.picUrl[i] + '">';
          _picUrl += _img;
        }
      }
      _content += _picUrl;
      this.formObj.goodsSpuInVo.goodsSpuDesc.content = _content;
      const _formObj = JSON.stringify(this.formObj);
      console.log("_formObj:", _formObj);
      let _Url = "";
      if (this.ActIds == "xsd") {
        delete this.formObj.actGoodsSkuInVos;
        _Url = this.$GLOBAL.API+"app/goodsSku/addPlatformGoodsSkuAndSalePoint";
      } else {
        delete this.formObj.salePointInVo;
        _Url = this.$GLOBAL.API+"app/goodsSku/addPlatformGoodsSkuAndAct";
      }
      this.$axios({
        method: "post",
        url: _Url,
        data: this.formObj,
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN"),
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data.code == 0) {
          window.scrollTo(0, 0);
          this.open2();
        }
      });
    },
    //提交成功后的提示
    open2() {
      this.$confirm("数据提交成功, 是否清空页面数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          this.Refresh();
        })
        .catch(() => {});
    },
    //获取销售点列表
    getsalePoint() {
      let dataObj = {},
        _value = "",
        _this = this;
      dataObj = {
        page: 1,
        rows: 50,
        city: "十堰市",
        type: 1
      };
      for (let key in dataObj) {
        _value += key + "=" + dataObj[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      let _Url = this.$GLOBAL.API+"app/salePoint/listNew?" + _value;
      _Url = encodeURI(_Url);
      this.$axios({
        url: _Url,
        method: "get",
        headers: {
          Authorization: sessionStorage.getItem("_TOKEN")
        }
      }).then(res => {
        if (res.data.code == 0) {
          _this.pointList = res.data.data.list;
          window.scrollTo(0, 0);
        }
      });
    },
    //刷新页面，清空数据
    Refresh() {
      history.go(0);
    },
    //图片上传
    beforeAvatarUpload2(file) {
      this.loading2 = true;
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 500kb!");
      } else {
        let form = new FormData(),
          _this = this;
        form.append("file", file);
        form.append("userName", "13971489895");
        this.$axios
          .post(this.$GLOBAL.API+"img/uploadMp4", form, {
            headers: {
              Authorization: sessionStorage.getItem("_TOKEN")
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              if (res.data.data.picUrl) {
                _this.loading2 = false;
                _this.picUrl.push(res.data.data.picUrl);
              }
            }
          });
      }
    },
    //图片上传1
    beforeAvatarUpload(file) {
      this.loading1 = true;
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 500kb!");
      } else {
        let form = new FormData(),
          _this = this;
        form.append("file", file);
        form.append("userName", "13971489895");
        this.$axios
          .post(this.$GLOBAL.API+"img/uploadMp4", form, {
            headers: {
              Authorization: sessionStorage.getItem("_TOKEN")
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              if (res.data.data.picUrl) {
                _this.loading1 = false;
                _this.formObj.skuPic = res.data.data.picUrl;
                _this.formObj.smallSkuPic = res.data.data.smallPicUrl;
              }
            }
          });
      }
    },
    //图片上传3
    beforeAvatarUpload3(file) {
      if (this.SkuPics.length > 4) {
        this.$message.error("轮播图最多只可上传五张");
        return;
      }
      this.loading3 = true;
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 500kb!");
      } else {
        let form = new FormData(),
          _this = this;
        form.append("file", file);
        form.append("userName", "13971489895");
        this.$axios
          .post(this.$GLOBAL.API+"img/uploadMp4", form, {
            headers: {
              Authorization: essionStsorage.getItem("_TOKEN")
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              _this.loading3 = false;
              let _data = res.data.data;
              _this.formObj.goodsSkuPics =
                _this.formObj.goodsSkuPics + "," + _data.id;
              _this.SkuPics.push(_data.picUrl);
            }
          });
      }
    },
    //删除图片
    delpicimg(ind) {
      this.picUrl.splice(ind, 1);
    },
    //运费模板列表
    deliveryTemplateShop() {
      let _this = this;
      this.$axios
        .get(this.$GLOBAL.API+"app/deliveryTemplateShop/list?shopId=0&page=1&rows=100", {
          headers: {
            Authorization: sessionStorage.getItem("_TOKEN")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.list && res.data.data.list.length > 0) {
              _this.delivery = res.data.data.list;
              let obj2 = {
                deliveryTemplateOut: {
                  name: "自定义运费模板"
                },
                id: 0
              };
              obj2.id = 0;
              obj2.deliveryTemplateOut.name = "自定义运费模板";
              _this.delivery.push(obj2);
              for (let i in _this.delivery) {
                if (
                  _this.delivery[i].deliveryTemplateOut.name ==
                  "十堰武商购买8元专线"
                ) {
                  _this.template_id = _this.delivery[i].id;
                  _this.formObj.deliveryTemplateInVo.shippingAddress =
                    _this.delivery[i].deliveryTemplateOut.shippingAddress;
                }
              }
            }
          }
        });
    },
    // 商品类目
    goodsCategory() {
      this.$axios
        .get(this.$GLOBAL.API+"goodsCategory/list", {
          headers: {
            Authorization: sessionStorage.getItem("_TOKEN")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            let _data = res.data.data,
              arr = [];
            for (let i in _data) {
              if (
                _data[i].status == 1 ||
                _data[i].status == 3 ||
                _data[i].status == 5
              ) {
                this.Category.push(_data[i]);
              }
            }
          }
        });
    },
    //格式化时间
    formatDate(date, val) {
      if (date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        if (val == 1) {
          return (
            year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " "
          );
        } else if (val == 2) {
          return hour + ":" + minute + ":" + second;
        }
      }
    },
    formatTen(num) {
      return num > 9 ? num + "" : "0" + num;
    },
    open() {
      this.$alert("开始时间应该大于结束时间", "时间错误", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    }
  },
  created() {
    this.login();
  }
};
</script>

<style lang="less" scoped>
.upload {
  min-height: 300px;
  .el-form {
    width: 70%;
    margin-left: 15%;
  }
  .el-select {
    float: left;
  }
  .el-radio-group {
    float: left;
    margin-top: 12px;
  }
  .narrow {
    width: 30%;
    float: left;
  }
  .ztimg {
    max-width: 100px;
  }
  .addimg {
    font-size: 80px;
    border: 1rpx solid red;
  }
  .picimgs {
    height: 150px;
    border: 2px solid pink;
    padding-top: 20px;
    min-width: 200px;
    float: left;
  }
  .picimgs img {
    max-width: 150px;
  }
  .picimgs button {
    position: relative;
    top: -50px;
  }
}
</style>

