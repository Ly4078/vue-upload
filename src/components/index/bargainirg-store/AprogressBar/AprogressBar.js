import Api from '../../../../utils/config/api.js';
var utils = require('../../../../utils/util.js');
import {
  GLOBAL_API_DOMAIN
} from '../../../../utils/config/config.js';
import getToken from '../../../../utils/getToken.js';
import canvasShareImg from '../../../../utils/canvasShareImg.js';
import getCurrentLocation from '../../../../utils/getCurrentLocation.js';
var app = getApp();
var requestTask = false


Page({
  data: {
    _build_url: GLOBAL_API_DOMAIN,
    isshowlocation: false,
    initiator: '', //发起人Id
    showModal: false,
    instruct: false,
    showCanvas: false,
    groupId: '', //生成团砍Id
    move: '',
    showSkeleton: true,
    dishData: {}, //当前菜
    doneBargain: '', //已砍金额
    countDown: '', //倒计时
    getGoldNum: 0, //砍价人获得的金币数
    progress: 0, //进度条
    status: 1, //砍价状态 1.60分钟内  3.过了60分钟或者已买 4.满5人
    otherStatus: "", //1.可以帮发起人砍价  2.已经砍过  3.人数已满  4.过了60分钟砍价结束
    isMine: false, //不是本人
    page: 1,
    flag: true,
    hotDishList: [],
    issnap: false,
    isnew: false,
    timer: null,
    canvasSrc: '',
    audioSrc: '',
    _city: '',
    _lat: '',
    _lng: '',
    actId: '',
    actType: '4',
    isBargained: true //控制频繁点击砍价按钮---true可以点/false不能点
  },
  onLoad: function(options) {
    console.log('options:', options)
    // return
    let _token = wx.getStorageSync('token') || "";
    let userInfo = wx.getStorageSync('userInfo') || {};
    if (userInfo) {
      app.globalData.userId = userInfo;
    }
    if (_token.length > 5) {
      app.globalData.token = _token;
    }

    this.setData({
      actId: options.actId ? options.actId : '',
      categoryId: options.categoryId ? options.categoryId : '',
      refId: options.refId ? options.refId : '', //菜品Id
      shopId: options.shopId ? options.shopId : '', //商家Id
      skuMoneyOut: options.skuMoneyOut ? options.skuMoneyOut : '', //原价
      skuMoneyMin: options.skuMoneyMin ? options.skuMoneyMin : '', //低价
      userId: app.globalData.userInfo.userId, //登录者Id
      initiator: options.initiator ? options.initiator : '', //发起人Id
      groupId: options.groupId ? options.groupId : '', //团砍Id
      _city: options.city ? options.city : '',
      _lat: options.lat ? options.lat : '',
      _lng: options.lng ? options.lng : '',
    });
    // this.getUserlocation();

  },
  onShow() {
    let that = this;
    this.setData({
      flag: true,
      page: 1,
      isshowlocation: false
    });
    if(!app.globalData.token) {
      getToken(app).then( ()=>{
        if (app.globalData.userInfo.lat && app.globalData.userInfo.lng) {
          if (that.data._city || app.globalData.userInfo.city) {
            this.hotDishList();
          } else {
            getCurrentLocation(that).then(() => {
            that.getCutDish();
            })
          }
        } else {
          getCurrentLocation(that).then(() => {
            if (that.data.groupId) {
              that.dishDetail();
              that.hotDishList();
              that.bargain();
            } else {
              that.createBargain();
            }
          })
        }
        this.dishDetail(); //查询菜详情
        if (this.data.groupId) {
          this.bargain();
        } else {
          this.createBargain();
        }
      })
    }else{
      if (app.globalData.userInfo.lat && app.globalData.userInfo.lng) {
        if (that.data._city || app.globalData.userInfo.city) {
          this.hotDishList();
        } else {
          getCurrentLocation(that).then(() => {
            that.getCutDish();
          })
        }
      } else {
        getCurrentLocation(that).then(() => {
          if (that.data.groupId) {
            that.dishDetail();
            that.hotDishList();
            that.bargain();
          } else {
            that.createBargain();
          }
        })
      }
      this.dishDetail(); //查询菜详情
      if (this.data.groupId) {
        this.bargain();
      } else {
        this.createBargain();
      }
    }
 
  },
  onHide() {
    let _this = this;
    clearInterval(_this.data.timer);
    this.setData({
      timer: null
    });
  },
  onUnload() {
    let _this = this;
    clearInterval(_this.data.timer);
    this.setData({
      timer: null
    });
  },


  openSetting() { //打开授权设置界面
    let that = this;
    that.setData({
      isshowlocation: false
    })
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) { //打开位置授权          
         that.onShow();
        } else {
          that.setData({
            isshowlocation: true
          })

        }
      }
    })
  },


  closetel: function(e) {
    let id = e.target.id;
    this.setData({
      issnap: false
    })
    if (id == 1) {
      wx.navigateTo({
        url: '/pages/init/init?isback=1'
      })
    }
  },
  //创建一笔砍价
  createBargain() {
    let _value = "",
      _parms = {},
      url = "",
      that = this;
    if (this.data.actId) {
      _parms = {
        refId: this.data.refId,
        shopId: this.data.shopId,
        actId: this.data.actId
      }
    } else {
      _parms = {
        refId: this.data.refId,
        userId: app.globalData.userInfo.userId,
        shopId: this.data.shopId,
        amount: (+this.data.skuMoneyOut - this.data.skuMoneyMin).toFixed(2),
        skuMoneyOut: this.data.skuMoneyOut,
        skuMoneyMin: this.data.skuMoneyMin
      };
    }

    for (var key in _parms) {
      _value += key + "=" + _parms[key] + "&";
    }
    _value = _value.substring(0, _value.length - 1);

    if (this.data.actId) {
      url = this.data._build_url + 'goodsGold/initiator?' + _value;
    } else {
      url = this.data._build_url + 'gold/initiator?' + _value;
    }

    wx.request({ //isflag
      url: url,
      header: {
        "Authorization": app.globalData.token
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '发起成功',
            icon: 'none'
          })
          that.setData({
            isMine: true,
            status: 1,
            otherStatus: 1,
            groupId: res.data.data.groupId //生成团砍Id
          });
          that.bargain();
        }
      }
    })
  },
  //获取砍价券详情
  bargain() {
    let _parms = {},
      _this = this,
      _values = "",
      url = "";
    _parms = {
      skuId: this.data.refId, //菜品Id
      parentId: this.data.initiator ? this.data.initiator : app.globalData.userInfo.userId, //发起人的userId
      shopId: this.data.shopId,
      groupId: this.data.groupId
    };
    if (this.data.actId) {
      _parms['actId'] = this.data.actId;
    }
    for (var key in _parms) {
      _values += key + "=" + _parms[key] + "&";
    }
    _values = _values.substring(0, _values.length - 1);
    if (this.data.actId) {
      url = _this.data._build_url + 'goodsBar/skuGroup?' + _values;
    } else {
      url = _this.data._build_url + 'bargain/skuGroup?' + _values;
    }
    wx.request({
      url: url,
      header: {
        "Authorization": app.globalData.token
      },
      method: 'GET',
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res.data.code == 0) {
          if (res.data.data) {
            let data = res.data.data,
              reg = /^1[34578][0-9]{9}$/,
              endTime = data[0].endTime.replace(/\-/g, "/"),
              max = (+_this.data.skuMoneyOut - _this.data.skuMoneyMin).toFixed(2),
              doneBargain = (+_this.data.skuMoneyOut - data[0].skuMoneyNow).toFixed(2),
              progress = 0;

            progress = doneBargain / max * 100;
            let _move = doneBargain / max * 1;
            _move *= 500;

            _move = _move.toFixed(0);
            if (_move == 500) {
              _move = +_move + 14;
            }
            _move = _move * 1 + 60;
            _this.setData({
              move: _move - 14
            })
            if (_this.data.initiator && (_this.data.initiator != app.globalData.userInfo.userId)) {
              _this.setData({
                isMine: false
              });
              _this.isBargain();
            }
            if (_this.data.initiator == app.globalData.userInfo.userId) {
              _this.setData({
                isMine: true
              });
            }
            _this.setData({
              skuMoneyNow: data[0].skuMoneyNow,
              doneBargain: doneBargain,
              progress: progress <= 100 ? progress : 100,
              endTime: endTime,
              // actType: data[0].goodsSkuOut.actInfo.type ? data[0].goodsSkuOut.actInfo.type:'',
              peoplenum: data[0].peoplenum * 1 - 1
            });
            if (_this.data.actId) {
              _this.setData({
                totleKey: data[0].totleKey,
                valueKey: data[0].valueKey
              });
            }
            // data.shift();
            let _arr = data.slice(1),
              arr = [],
              peopleList = [];

            if (data.slice(1)[0].user) {
              for (let i in _arr) {
                peopleList.push(_arr[i]);
              }
            } else {
              peopleList = _arr;
            }
            for (let i = 0; i < peopleList.length; i++) {
              if (peopleList[i].userName){
                if (peopleList[i].userName && reg.test(peopleList[i].userName)) {
                  peopleList[i].userName = peopleList[i].userName.substr(0, 3) + "****" + peopleList[i].userName.substr(7)
                } else if (peopleList[i].user.userName && reg.test(peopleList[i].user.userName)) {
                  peopleList[i].user.userName = peopleList[i].user.userName.substr(0, 3) + "****" + peopleList[i].user.userName.substr(7)
                } 
              }
              if (peopleList[i].userId == app.globalData.userInfo.userId) {
                _this.setData({
                  getGoldNum: peopleList[i].goldAmount,
                  otherStatus: 2
                });
              } else if (peopleList[i].user && peopleList[i].user.id) {
                if (peopleList[i].user.id == app.globalData.userInfo.userId) {
                  _this.setData({
                    getGoldNum: peopleList[i].goldAmount,
                    otherStatus: 2
                  });
                }
              }
            }
           
            for(let i in peopleList){
              if (peopleList[i].userId == app.globalData.userInfo.userId) {
               
                _this.setData({
                  getGoldNum: peopleList[i].goldAmount,
                  otherStatus: 2
                });
                break;
              } else if (peopleList[i].user && peopleList[i].user.id) {
                if (peopleList[i].user.id == app.globalData.userInfo.userId) {
                  _this.setData({
                    getGoldNum: peopleList[i].goldAmount,
                    otherStatus: 2
                  });
                  break;
                }
                break;
              } else {
                _this.setData({
                  otherStatus: 1
                });
              }
            }
            _this.setData({
              peopleList: peopleList
            });
            let miliEndTime = new Date(endTime).getTime(),
              miliNow = new Date().getTime();
            let minus = Math.floor((miliEndTime - miliNow) / 1000);
            if (minus > 0 && minus <= 3610) { //小于60分钟
              //好友进入砍菜页面人数满3人并且超过半小时不能砍价
              let  maxNum =4;
              try {
                maxNum = _this.data.dishData.actGoodsSkuOut.peopleNum;
              }catch(err){
                
              }
              if (_this.data.peoplenum+1 >= maxNum ) {
                _this.setData({
                  status: 4,
                  otherStatus: 3
                });
              } else {
                _this.setData({
                  status: 1,
                  // otherStatus: 1
                });
                let hours = '',
                  minutes = '',
                  seconds = '',
                  countDown = '';
                _this.setData({
                  timer: setInterval(function() {
                    if (minus == 0) {
                      clearInterval(_this.data.timer);
                      minus = 0;
                      _this.setData({
                        otherStatus: 4,
                        status: 3
                      });
                    } else {
                      hours = Math.floor(minus / 3600); //时
                      minutes = Math.floor(minus / 60); //分
                      seconds = minus % 60; //秒
                      hours = hours < 10 ? '0' + hours : hours;
                      minutes = minutes < 10 ? '0' + minutes : minutes;
                      seconds = seconds < 10 ? '0' + seconds : seconds;
                      countDown = minutes + ':' + seconds;
                      _this.setData({
                        countDown: countDown
                      });
                      minus--;
                    }
                  }, 1000)
                });
              }
            } else {
              _this.setData({
                status: 3,
                otherStatus: 4
              });
            }
          } else {
            _this.setData({
              status: 3,
              otherStatus: 4
            });
          }
        } else {
          _this.setData({
            status: 3,
            otherStatus: 4
          });
        }
      }
    })
  },
  //查询砍价菜详情
  dishDetail() {
    let _parms = {},
      that = this,
      url = "",
      _value = "";
    _parms = {
      Id: this.data.refId,
      zanUserId: this.data.initiator ? this.data.initiator : app.globalData.userInfo.userId,
      actId: this.data.actId,
      shopId: this.data.shopId
    };
    if (this.data.actId) {
      _parms.actId = this.data.actId;
    }
    for (var key in _parms) {
      _value += key + "=" + _parms[key] + "&";
    }
    _value = _value.substring(0, _value.length - 1);
    if (this.data.actId) {
      url = this.data._build_url + 'goodsSku/selectDetailBySkuIdNew?' + _value;
    } else {
      url = this.data._build_url + 'sku/getKjc?' + _value;
    }
    wx.request({
      url: url,
      header: {
        "Authorization": app.globalData.token
      },
      method: 'GET',
      success: function(res) {
        if (res.data.code == 0) {
          if (res.data.data) {
            let data = res.data.data;
            if (data.shopId == 0) {
              data.shopName = '享七自营'
            }
            that.setData({
              dishData: data,
              showSkeleton: false,
              // picUrl: data.picUrl,
              skuName: data.skuName,
              // shopName: data.shopName,
              sellNum: data.sellNum
            });
            let url = data.picUrl ? data.picUrl : data.skuPic
            canvasShareImg(url, that.data.skuMoneyMin, that.data.dishData.marketPrice ? that.data.dishData.marketPrice:that.data.skuMoneyOut).then(function(res) {
              that.setData({
                shareImg: res
              })
            })
            if (data.actGoodsSkuOut && data.actGoodsSkuOut.categoryId) {
              that.setData({
                categoryId: data.actGoodsSkuOut.categoryId
              })
            }
          } else {
            that.setData({
              showSkeleton: false,
            });
          }
        } else {
          that.setData({
            status: 3,
            showSkeleton: false,
            otherStatus: 4
          });
        }
      },
      fail: function() {
        that.setData({
          showSkeleton: false,
        });
      }
    })
  },
  chilkDish(e) {
    let id = e.currentTarget.id,
      _categoryId = this.data.categoryId,
      _shopId = e.currentTarget.dataset.shipid;
    if (this.data.actId) {
      wx.navigateTo({
        url: '/pages/index/bargainirg-store/CandyDishDetails/CandyDishDetails?id=' + id + '&actId=' + this.data.actId + '&categoryId=' + _categoryId + '&shopId=' + _shopId,
      })
    } else {
      wx.navigateTo({
        url: '../CandyDishDetails/CandyDishDetails?id=' + id + '&shopId=' + _shopId + '&categoryId=' + _categoryId
      })
    }
  },
  candyDetails(e) {
    let id = e.currentTarget.id,
      _categoryId = this.data.categoryId,
      _shopId = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../CandyDishDetails/CandyDishDetails?id=' + id + '&shopId=' + _shopId + '&categoryId=' + _categoryId + '&actId=' + this.data.actId,
    })
  },
  //查询能否砍价
  isBargain() {
    let _parms = {},
      url = "",
      _value = "",
      that = this;
    if (!app.globalData.userInfo.mobile) {
      wx.navigateTo({
        url: '/pages/init/init?isback=1'
      })
    } else {
      _parms = {
        refId: this.data.refId,
        parentId: this.data.initiator,
        groupId: this.data.groupId
      };
      if (this.data.actId) {
        _parms.actId = this.data.actId;
      }
      for (let key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      if (this.data.actId) {
        url = this.data._build_url + 'goodsGold/getshior?' + _value;
      } else {
        url = this.data._build_url + 'gold/getshior?' + _value;
      }
      wx.request({
        url: url,
        header: {
          "Authorization": app.globalData.token
        },
        method: 'GET',
        success: function(res) {
          let code = res.data.code,
            otherStatus = "";
          if (code == 0) {
            otherStatus = 1;
          } else if (code == 200065) {
            otherStatus = 2;
          } else if (code == 200066) {
            otherStatus = 3;
          } else if (code == 200068) {
            otherStatus = 4;
            that.setData({
              status: 3
            });
          }
          that.setData({
            otherStatus: otherStatus
          });
        }
      })
    }
  },
  //查询是否帮忙砍过价或者人数已满
  helpfriend() {
    if (!this.data.isBargained) {
      return false;
    }
    this.setData({
      isBargained: false
    });
    let _this = this,
      _value = "",
      url = "",
      _parms = {};
    if (!app.globalData.userInfo.mobile) {
      wx.navigateTo({
        url: '/pages/init/init?isback=1'
      })
    } else {
      _parms = {
        refId: this.data.refId,
        parentId: this.data.initiator,
        groupId: this.data.groupId
      };
      if (this.data.actId) {
        _parms.actId = this.data.actId
      }
      for (let key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      if (this.data.actId) {
        url = this.data._build_url + 'goodsGold/getshior?' + _value;
      } else {
        url = this.data._build_url + 'gold/getshior?' + _value;
      }
      wx.request({
        url: url,
        header: {
          "Authorization": app.globalData.token
        },
        method: 'GET',
        success: function(res) {
          if (res.data.code == 0) {
            _this.tohelpfriend();
          } else if (res.data.code == 200065) {
            _this.setData({
              otherStatus: 2
            });
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else if (res.data.code == 200066) {
            _this.setData({
              otherStatus: 3
            });
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else if (res.data.code == 200068) {
            _this.setData({
              otherStatus: 4,
              status: 3
            });
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        },
        fail() {
          this.setData({
            isBargained: true
          });
        }
      })
    }
  },
  //断续帮好友砍价
  tohelpfriend: function() {
    let _parms = {},
      that = this,
      url = "",
      _value = "";
    _parms = {
      refId: this.data.refId,
      parentId: this.data.initiator,
      shopId: this.data.shopId,
      groupId: this.data.groupId
    };
    if (this.data.actId) {
      _parms.actId = this.data.actId
    }
    for (var key in _parms) {
      _value += key + "=" + _parms[key] + "&";
    }
    _value = _value.substring(0, _value.length - 1);
    if (this.data.actId) {
      url = this.data._build_url + 'goodsGold/helpfriend?' + _value;
    } else {
      url = this.data._build_url + 'gold/helpfriend?' + _value;
    }
    wx.request({
      url: url,
      header: {
        "Authorization": app.globalData.token
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            showModal: true,
            showCanvas: true,
            otherStatus: 2,
            canvasSrc: 'https://lg-dn28ltjg-1256805295.cos.ap-shanghai.myqcloud.com/kan.gif',
            audioSrc: 'https://xqmp4-1256079679.file.myqcloud.com/test_kan.mp3'
          });
          setTimeout(function() {
            const innerAudioContext = wx.createInnerAudioContext();
            innerAudioContext.autoplay = true
            innerAudioContext.src = that.data.audioSrc;
            innerAudioContext.onPlay(() => {})
          }, 700);
          setTimeout(function() {
            that.setData({
              showModal: false,
              showCanvas: false,
              canvasSrc: '',
              audioSrc: ''
            });
          }, 2000);
          that.bargain();
        } else {
          that.setData({
            isBargained: true
          });
        }
      },
      fail() {
        that.setData({
          isBargained: true
        });
      }
    })
  },
  toBuy() { //买菜
    if (!app.globalData.userInfo.mobile) {
      this.setData({
        issnap: true
      })
    } else {
      let _parms = {},
        _this = this,
        url = "",
        sellPrice = "",
        _soData = this.data.dishData,
        _values = "";

      if (_this.data.actId) {
        wx.navigateTo({
          url: '/pages/index/crabShopping/crabDetails/submitOrder/submitOrder?num=1&issku=3&picUrl=' + _soData.skuPic + '&sellPrice=' + _this.data.skuMoneyNow + '&id=' + _soData.id + '&actId=' + _this.data.actId + '&skuName=' + _soData.skuName + '&remark=' + _soData.remark + '&shopId=' + _soData.shopId + '&singleType=' + _soData.singleType + '&spuId=' + _soData.spuId + '&groupId=' + _this.data.groupId + '&flag=' + this.data.actType + '&totleKey=' + this.data.totleKey + '&valueKey=' + this.data.valueKey
        })
      } else {
        // sellPrice = _this.data.skuMoneyNow + '元砍价券';
        wx.navigateTo({
          url: '../../order-for-goods/order-for-goods?shopId=' + _this.data.shopId + '&groupId=' + _this.data.groupId + '&skuName=' + _this.data.skuMoneyNow + '元砍价券&sell=' + _this.data.skuMoneyNow + '&skutype=4&dishSkuId=' + _this.data.refId + '&dishSkuName=' + _this.data.skuName + '&bargainType=2'
        })
      }
    }
  },
  //热门推荐
  hotDishList(types) {
    //browSort 0附近 1销量 2价格
    let that = this,
      _values = "",
      _Url = "",
      url = "",
      _parms = {};

    if (!app.globalData.userInfo.lng && !app.globalData.userInfo.lat) {
      getCurrentLocation(that).then( ()=>{
        that.hotDishList(types)
      })
    } else {
      if (that.data.actId && that.data.categoryId) {
        _parms = {
          id: that.data.refId,
          actId: that.data.actId,
          categoryId: that.data.categoryId,
          locationX: app.globalData.userInfo.lng,
          locationY: app.globalData.userInfo.lat,
          page: that.data.page,
          rows: 10
        }
        if (that.data.shopId !=0){
          _parms.city = app.globalData.userInfo.city ? app.globalData.userInfo.city : that.data._city;
        }
        for (var key in _parms) {
          _values += key + "=" + _parms[key] + "&";
        }
        _values = _values.substring(0, _values.length - 1);
        url = that.data._build_url + 'goodsSku/listForActOut?' + _values;
      } else {
        _parms = {
          zanUserId: app.globalData.userInfo.userId,
          browSort: 1,
          locationX: app.globalData.userInfo.lng,
          locationY: app.globalData.userInfo.lat,
          isDeleted: 0,
          page: that.data.page,
          rows: 10
        };
        if (this.data.shopId != 0) {
          _parms.city = app.globalData.userInfo.city ? app.globalData.userInfo.city :that.data._city;
        }
        for (var key in _parms) {
          _values += key + "=" + _parms[key] + "&";
        }
        _values = _values.substring(0, _values.length - 1);
        url = that.data._build_url + 'sku/kjcList?' + _values;
      }
      console.log('------------972-------------');
      console.log(_parms);
      _Url = encodeURI(url);
      requestTask = true;
      wx.request({
        url: _Url,
        method: 'GET',
        header: {
          "Authorization": app.globalData.token
        },
        success: function (res) {
          console.log('------------983-------------');
          console.log(res);
          wx.stopPullDownRefresh();
          if (res.data.code == 0) {
            if (res.data.data.list && res.data.data.list.length > 0) {
              if (that.data.page == 1) {
                that.setData({
                  hotDishList: []
                });
              }
              let list = res.data.data.list,
                hotDishList = that.data.hotDishList,
                arr = [];
              for (let i = 0; i < list.length; i++) {
                list[i].distance = utils.transformLength(list[i].distance);
                hotDishList.push(list[i]);
                arr.push(list[i]);
              }
              if (types == 'next') {
                arr = [];
                arr = hotDishList
              } else {
                arr = arr
              }
              that.setData({
                hotDishList: arr
              });
              requestTask = false;
              if (list.length < 6) {
                that.setData({
                  flag: false
                });
              }
            } else {
              requestTask = false
              that.setData({
                flag: false
              });
            }
          } else {
            requestTask = false
          }
        },
        fail() {
          requestTask = false
        }
      })
    }
  },
  onReachBottom: function() { //用户上拉触底加载更多
    // if (!this.data.flag) {
    //   return false;
    // }
    // if (requestTask) {
    //   return false
    // }
    this.setData({
      page: this.data.page + 1
    });
    this.hotDishList('next');
  },
  onPullDownRefresh: function() { //下拉刷新 
    this.bargain();
    if (requestTask) {
      return false
    }
    this.setData({
      flag: true,
      page: 1
    });

    this.hotDishList();
  },
  // 左上角返回首页
  returnHomepage: function() {
    wx.switchTab({
      url: '../../index'
    })
  },
  // 使用规则
  instructions: function() {
    let that = this;
    let url = ''
    if (that.data.shopId != '0') {
      url = '/pages/index/crabShopping/getFailure/getFailure?onekey=bargain&twokey=dish'
    } else {
      url = '/pages/index/crabShopping/getFailure/getFailure?onekey=bargain&twokey=goods'
    }
    wx.navigateTo({
      url: url,
    })
  },
  // 关闭弹窗
  understand: function() {
    this.setData({
      showModal: false,
      instruct: false,
      showCanvas: false
    })
  },
  transpond() {
    this.onShareAppMessage();
  },
  onShareAppMessage() { //分享给好友帮忙砍价
    let initiator = this.data.initiator ? this.data.initiator : app.globalData.userInfo.userId,
      userInfo = app.globalData.userInfo,
      city = this.data._city ? this.data._city : userInfo.city;
    return {
      title: '帮我砍价！你也有机会直接拿走商品↓↓↓',
      desc: '享7购',
      imageUrl: this.data.shareImg,
      path: '/pages/index/bargainirg-store/AprogressBar/AprogressBar?refId=' + this.data.refId + '&shopId=' + this.data.shopId + '&skuMoneyOut=' + this.data.skuMoneyOut + '&skuMoneyMin=' + this.data.skuMoneyMin + '&initiator=' + initiator + '&groupId=' + this.data.groupId + '&lat=' + userInfo.lat + '&lng=' + userInfo.lng + '&city=' + city + '&actId=' + this.data.actId + '&categoryId=' + this.data.categoryId,
      success: function(res) {

      },
      fail: function(res) {

      }
    }
  }
})