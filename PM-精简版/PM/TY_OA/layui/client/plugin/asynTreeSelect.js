
/**
 @ Name：layui.asynTreeSelect 异步树形选择器     
 @ Author： wwy
 @ 版本1.0
 @ 2020年5月27日 
 */

layui.define(['form', 'element'], function (exports) {
	var $ = layui.$
		, form = layui.form
		, element = layui.element
		//字符常量
		, MOD_NAME = 'asynTreeSelect', ELEM = '.layui-asynTreeSelect'
		//外部接口
		, asynTreeSelect = {
			index: layui.asynTreeSelect ? (layui.asynTreeSelect.index + 10000) : 0
			//设置全局项
			, set: function (options) {
				var that = this;
				that.config = $.extend({}, that.config, options);
				return that;
			}

			//事件监听
			, on: function (events, callback) {
				return layui.onevent.call(this, MOD_NAME, events, callback);
			}
		}

		//操作当前实例
		, thisIns = function () {
			var that = this
				, options = that.config
				, id = options.id || options.index;

			return {
				reload: function (options) {
					//that.reload.call(that, options);
					that.config.defaultValue = options.defaultValue;
					$("#" + that.elementId).val(options.defaultValue);
					$("#" + that.dataUlId + " li").remove();
					$("#" + that.contentId).empty();
					_getNextDatas(that, that.config.rootNodeValue, true);
				}
				, config: options
				, setValue: function (value) {

				}
				, getIdValues: function () {
					return that.idValues;

				}
				, getNameValues: function () {
					return that.nameValues;
				}
			}
		}

		//构造器
		, Class = function (options) {
			var that = this;
			that.index = ++asynTreeSelect.index;
			that.config = $.extend({}, that.config, asynTreeSelect.config, options);
			var $elem = $(that.config.elem);
			var deVal = $elem.val();
			var jsDeval = that.config.defaultValue;
			if (jsDeval == null || jsDeval == undefined || jsDeval.toString().length == 0)
				that.config.defaultValue = deVal;
			var elementId = $elem.prop("id");
			//that.config.maxWidth=$elem.width()*2; 
			var tempTime = new Date().getTime();
			that.elementId = elementId
			that.outDivId = elementId + "_a" + tempTime;
			that.displayInputId = elementId + "_b" + tempTime;
			that.dataDivId = elementId + "_c" + tempTime;
			that.closeImgId = elementId + "_d" + tempTime;
			that.refreshImgId = elementId + "_e" + tempTime;
			that.dataTabLayFilter = elementId + "_f" + tempTime;
			that.dataUlId = elementId + "_g" + tempTime;
			that.contentId = elementId + "_h" + tempTime;
			that.idValues = new Array();
			that.nameValues = new Array();
			that.render();
		};

	//默认配置
	Class.prototype.config = {
		paramName: "pid" //
		, maxWidth: null
		, maxHeight: null
		, rootNodeValue: null
		, defaultValue: null
		, toolbar: false
		, showRootNode: true
		, separator: null
		, getCurrentNodeUrl: "data.json" // 
		, getChildrenNodeUrl: "data.json" // 
		, getBrotherNodeUrl: "data.json" // 
		, response: {
			idName: "ID"
			, valueName: "NAME"
			, parentName: "PARENT_ID"
		}
		, onClick: $.noop
		, onDivClose: $.noop
		, beforeRequest: $.noop
		, parseData: $.noop
	};

	//渲染视图
	Class.prototype.render = function () {
		var that = this
			, options = that.config;
		options.elem = $(options.elem);
		var elemTmp = options.elem;

		var placeholder = elemTmp.attr("placeholder") ? elemTmp.attr("placeholder") : "";
		var valueTagIdStyle = elemTmp.attr("style");

		var clearTagId = that.elementId + "_ci" + new Date().getTime();
		var stylecss = ""
		if (valueTagIdStyle)
			stylecss = "style=\"" + valueTagIdStyle + "\" ";
		var divStr = "<div id=\"" + that.outDivId + "\"  class=\"layui-unselect layui-form-select\" " + stylecss + " >";
		divStr += "<div class=\"layui-select-title\" >";
		divStr += "<input id=\"" + that.displayInputId + "\"  type=\"text\" placeholder=\"" + placeholder + "\" readonly=\"\" class=\"layui-input\" >";

		divStr += "<i class=\"layui-edge\"></i>";
		divStr += "</div>";
		divStr += "</div>";
		elemTmp.prop("type", "hidden");
		elemTmp.after(divStr);

		$("#" + clearTagId).click(function () {
			$("#" + that.elementId).val("");
			$("#" + that.displayInputId).val("");
			$("#" + that.outDivId).removeClass("layui-form-selected");
			that.isOpen = false;
		})

		var tempTime = new Date().getTime();
		var tabTitleUlId = "titleUl" + tempTime;
		var dlStr = "<dl style=\"padding: 0px 0px;max-height: 350px;\" >";
		dlStr += "<div id=\"" + that.dataDivId + "\" class=\"layui-tab\" lay-filter=\"" + that.dataTabLayFilter + "\" style=\"margin:initial;\">";
		dlStr += "<ul id=\"" + that.dataUlId + "\" class=\"layui-tab-title\">";
		if (that.config.toolbar)
			dlStr += " <span style=\"position: absolute;right:0;z-index:11\"  ><i  title='刷新' id=\"" + that.refreshImgId + "\" style=\"cursor: pointer; font-size:13px;\" class=\"layui-icon\">&#xe669;</i><i  title='关闭' id=\"" + that.closeImgId + "\" style=\"cursor: pointer;\" class=\"layui-icon\">&#x1006;</i>";
		dlStr += "</ul>";
		dlStr += "<div id=\"" + that.contentId + "\" class=\"layui-tab-content\" style=\"padding:initial;\">";
		dlStr += "</div>";
		dlStr += "</div>";
		dlStr += "</dl>";

		$("#" + that.outDivId).append(dlStr);

		if (that.config.maxWidth)
			$("#" + that.dataDivId).parent().css("max-width", that.config.maxWidth);//最大宽度值

		$("#" + that.displayInputId).click(that, _divTagClickDefault);//绑定点击事件
		if (that.config.toolbar) {
			$("#" + that.closeImgId).click(that, _divTagClickDefault);//绑定关闭事件
			$("#" + that.refreshImgId).click(function (e) {//绑定刷新事件
				//阻止冒泡事件
				layui.stope(e);
				$("#" + that.dataUlId + " li").remove();
				$("#" + that.contentId).empty();
				_getNextDatas(that, that.config.rootNodeValue, true);
			})
		}

		element.render("tab");
		element.on('tab(' + that.dataTabLayFilter + ')', function (data) {
			var clickLi = $(this);
			var curLiObj = $(this).data("curObj");
			var loadData = $(this).data("loadData");
			if (loadData) {
				var indexTab = data.index;
				var params = new Object();
				params[that.config.paramType] = 3;
				var currVal = curLiObj[that.config.response.idName];
				var postUrl = that.config.getBrotherNodeUrl;
				if (currVal == that.config.rootNodeValue) {//获取本节点
					postUrl = that.config.getCurrentNodeUrl;
					params[that.config.paramType] = 1;
				}
				params[that.config.paramName] = currVal;
				$(this).removeData("loadData");
				//加载兄弟节点
				that.config.beforeRequest.call(that, params);
				$.ajax({
					url: postUrl
					, dataType: "json"
					, type: "POST"
					, data: params
					, success: function (datasRes) {
						datasRes = that.config.parseData.call(that, datasRes);
						var newItmeDiv = $("#" + that.contentId + " div").eq(indexTab);
						var idName = that.config.response.idName;
						var valueName = that.config.response.valueName;
						var $newEleDl = $("<dl class=\"layui-anim layui-anim-upbit\" style=\"position:initial;padding:initial;box-shadow:initial;border:initial;max-height:" + that.config.maxHeight + ";\"></dl>");
						$(newItmeDiv).html($newEleDl);
						for (var i = 0; i < datasRes.length; i++) {
							var curObj = datasRes[i];
							var $newEleDd = $("<dd lay-value=\"" + curObj[idName] + "\" >" + curObj[valueName] + "</dd>");
							if (currVal && currVal == curObj[idName]) {
								$newEleDd.addClass("layui-this");
							}
							$newEleDd.data("curObj", curObj);
							$newEleDl.append($newEleDd);
						}

						//绑定点击事件
						$newEleDl.find("dd").click(function (e) {
							layui.stope(e);
							//删掉后面的tab
							clickLi.nextAll("li").remove();
							$(newItmeDiv).nextAll("div.layui-tab-item").remove();

							var jqObj = $(this);
							jqObj.siblings().removeClass("layui-this");
							jqObj.addClass("layui-this");
							var curTmpObj = $(this).data("curObj");
							//赋值
							var curVal = curTmpObj[that.config.response.idName];
							var curName = curTmpObj[that.config.response.valueName];
							var elemCur = that.config.elem;
							$("#" + that.elementId).val(curVal);
							clickLi.attr("lay-id", curVal);
							clickLi.text(curName);
							if (that.config.separator) {
								var lis = clickLi.parent().find("li");
								that.idValues = new Array();
								that.nameValues = new Array();
								if (lis && lis.length > 0) {
									var curNames = "";
									for (var j = 0; j < lis.length; j++) {
										var $lisCur = $(lis[j]);
										var innerText = $lisCur.text();
										var idvalue = $lisCur.attr("lay-id");
										that.idValues.push(idvalue);
										that.nameValues.push(innerText);
										curNames += that.config.separator + innerText;
									}
									curNames = curNames.substring(that.config.separator.toString().length)
								}
								$("#" + that.displayInputId).val(curNames);
							} else {
								$("#" + that.displayInputId).val(curName);
							}


							that.config.onClick.call(that, curTmpObj);//调用自定义方法
							_getNextDatas(that, curVal, false);
						})
					}
				})
			}
		});
		//第一次请求
		_getNextDatas(that, that.config.rootNodeValue, true);

		$(document).bind("click", function (e) {
			var target = $(e.target);
			if (target.closest("#" + that.outDivId).length == 0 && that.isOpen) {
				$("#" + that.outDivId).removeClass("layui-form-selected");
				that.config.onDivClose.call(that, that.idValues, that.nameValues);//监听关闭
				that.isOpen = false;
			}
		});
	}

	//核心入口
	asynTreeSelect.render = function (options) {
		var ins = new Class(options);
		return thisIns.call(ins);
	};

	/*  //加载组件所需样式
	  layui.link(layui.cache.base + 'asynTreeSelect/asynTreeSelect.css?v=1', function(){
		//样式加载完毕的回调
	    
	  }, 'asynTreeSelect'); //此处的“asynTreeSelect”要对应 asynTreeSelect.css 中的样式： html #layuicss-asynTreeSelect{}
	*/ //div的点击事件
	_divTagClickDefault = function (event) {
		var that = event.data;
		if ($("#" + that.outDivId).hasClass("layui-form-selected")) {
			$("#" + that.outDivId).removeClass("layui-form-selected");
			that.config.onDivClose.call(that, that.idValues, that.nameValues);//监听关闭
			that.isOpen = false;
		} else {
			that.isOpen = true;
			$("#" + that.outDivId).addClass("layui-form-selected");
		}
		var dlEle = $("#" + that.outDivId).children("dl")[0];
		var dlHeight = $(dlEle).height();
		if (dlHeight > 10000) {
			$(dlEle).height(500);
		}
	}
	_liClick = function (obj, that) {
		element.tabChange(that.dataTabLayFilter, $(obj).attr("lay-id"))
	}
	//获取当前数据
	_getNextDatas = function (that, currNodeId, isFirst) {
		//隐藏当前tab
		$("#" + that.outDivId + " .layui-show").removeClass("layui-show");
		$("#" + that.dataUlId + " .layui-this").removeClass("layui-this");

		var tempTimeTitle = new Date().getTime();
		var successDl = "sucDl_" + tempTimeTitle;
		var titleLi = "titleLi_" + tempTimeTitle;
		var newItemUl = "itemUl" + tempTimeTitle;
		var newItemLiTitle = "itemLi_" + tempTimeTitle;
		var newItmeDivId = "itmeDiv_" + tempTimeTitle;
		var liJq = $("<li id=\"" + titleLi + "\" class=\"layui-this\" lay-id=\"" + titleLi + "\"  >请选择</li>");
		$("#" + that.dataUlId).append(liJq);
		liJq.click(function (e) {
			layui.stope(e);
			_liClick(this, that);
		})

		var divshowStr = "";
		divshowStr += "<div id=\"" + newItmeDivId + "\" class=\"layui-tab-item layui-show\" >";
		divshowStr += "<ul id=\"" + newItemUl + "\"    >";
		divshowStr += "<li  ><i class=\"layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop\" ></i> </li>";
		divshowStr += "</ul>";
		divshowStr += "</div>";
		$("#" + that.contentId).append(divshowStr);
		element.render("tab");
		var postUrl = "";
		var params = new Object();
		if (isFirst) {//第一次请求
			//判断是否有默认值
			var defVal = that.config.defaultValue;
			var tagValue = $(that.config.elem).val();
			if (tagValue != null && tagValue.toString().length > 0) defVal = tagValue;
			if (defVal != null && defVal.toString().length > 0) {//标签有值
				var resultObj = { count: 0, list: [], isFindRoot: false };
				_dealDefaultValue(that, defVal, resultObj, titleLi, newItmeDivId, successDl, isFirst, currNodeId);
				return;
			} else {//没默认值
				if (that.config.showRootNode) {//如果显示根节点
					postUrl = that.config.getCurrentNodeUrl;
					params[that.config.paramType] = 1;
				} else {
					postUrl = that.config.getChildrenNodeUrl;
					params[that.config.paramType] = 2;
				}
				params[that.config.paramName] = currNodeId;

			}
		} else {
			if (that.config.beforeRequest)
				that.config.beforeRequest.call(that, params);
			postUrl = that.config.getChildrenNodeUrl;//获取子节点
			params[that.config.paramType] = 2;
			params[that.config.paramName] = currNodeId;
		}
		_getLidata(postUrl, params, that, titleLi, newItmeDivId, successDl, isFirst, currNodeId);



	}
	_getLidata = function (postUrl, params, that, titleLi, newItmeDivId, successDl, isFirst, currNodeId) {
		$.ajax({
			url: postUrl
			, dataType: "json"
			, type: "POST"
			, data: params
			, success: function (datasRes) {
				datasRes = that.config.parseData.call(that, datasRes);
				var idName = that.config.response.idName;
				var valueName = that.config.response.valueName;
				if (!isFirst && (!datasRes || datasRes.length == 0)) {//不是第一次，没数据关闭
					//删掉后面的tab
					$("#" + titleLi).remove();
					$("#" + newItmeDivId).remove();
					element.tabChange(that.dataTabLayFilter, currNodeId);
					$("#" + that.outDivId).removeClass("layui-form-selected");//关闭操作
					that.isOpen = false;
					that.config.onDivClose.call(that, that.idValues, that.nameValues);//监听关闭
					return;
				}
				if (datasRes) {
					var $newEleDl = $("<dl id=\"" + successDl + "\" class=\"layui-anim layui-anim-upbit\" style=\"position:initial;padding:initial;box-shadow:initial;border:initial;max-height:" + that.config.maxHeight + ";\"></dl>");
					$("#" + newItmeDivId).html($newEleDl);
					if (datasRes.length == 0) {
						var $newEleDd = $("<dd lay-value=\"\" style=\"text-align: center;\" class=\"layui-select-tips\">无数据</dd>");
						$newEleDl.append($newEleDd);
						return;
					}
					for (var i = 0; i < datasRes.length; i++) {
						var curObj = datasRes[i];
						var $newEleDd = $("<dd lay-value=\"" + curObj[idName] + "\" >" + curObj[valueName] + "</dd>");

						$newEleDd.data("curObj", curObj);
						$newEleDl.append($newEleDd);
						//绑定点击事件

						$newEleDd.click(function (e) {
							layui.stope(e);
							//删掉后面的tab
							$("#" + titleLi).nextAll("li").remove();
							$("#" + newItmeDivId).nextAll("div.layui-tab-item").remove();

							var jqObj = $(this);
							jqObj.siblings().removeClass("layui-this");
							jqObj.addClass("layui-this");
							var curTmpObj = $(this).data("curObj");
							//赋值
							var curVal = curTmpObj[that.config.response.idName];
							var curName = curTmpObj[that.config.response.valueName];
							var elemCur = that.config.elem;
							$("#" + that.elementId).val(curVal);
							$("#" + titleLi).text(curName);
							$("#" + titleLi).attr("lay-id", curVal);
							if (that.config.separator) {
								var lis = $("#" + titleLi).parent().find("li");
								if (lis && lis.length > 0) {
									that.idValues = new Array();
									that.nameValues = new Array();
									var curNames = "";
									for (var j = 0; j < lis.length; j++) {
										var $lisCur = $(lis[j]);
										var innerText = $lisCur.text();
										var idvalue = $lisCur.attr("lay-id");
										that.idValues.push(idvalue);
										that.nameValues.push(innerText);
										curNames += that.config.separator + innerText;
									}
									curNames = curNames.substring(that.config.separator.toString().length)
								}
								$("#" + that.displayInputId).val(curNames);
							} else {
								$("#" + that.displayInputId).val(curName);
							}


							that.config.onClick.call(that, curTmpObj);//调用自定义方法
							_getNextDatas(that, curVal, false);
						})
					}

				}
			}
		})
	}
	_dealDefaultValue = function (that, currNodeId, resultObj, titleLi, newItmeDivId, successDl, isFirst) {
		var params = new Object();
		params[that.config.paramType] = 1;
		params[that.config.paramName] = currNodeId;
		$.ajax({
			url: that.config.getCurrentNodeUrl
			, dataType: "json"
			, type: "POST"
			, data: params
			, success: function (msg) {
				var idName = that.config.response.idName;
				var valueName = that.config.response.valueName;
				var parentName = that.config.response.parentName;

				msg = that.config.parseData.call(that, msg);
				if (msg && msg.length > 0) {
					if (resultObj.count > 100) return;//递归次数禁止超过100次
					resultObj.count = resultObj.count + 1;
					var currObj = msg[0];
					resultObj.list.push(currObj);
					var parentId = currObj[parentName];
					var breakNodeFlag = null;
					if (that.config.showRootNode) {//显示根节点
						breakNodeFlag = idName;
					} else {//不显示根节点
						breakNodeFlag = parentName;
					}
					if (currObj[breakNodeFlag] == that.config.rootNodeValue) {//到达根节点，跳出递归
						//处理默认值
						$("#" + that.contentId).empty();
						var $dataUl = $("#" + that.dataUlId);
						$dataUl.empty();
						var defaultValArr = resultObj.list;
						var dispalyNames = "";
						that.idValues = new Array();
						that.nameValues = new Array();
						for (var k = defaultValArr.length - 1; k >= 0; k--) {
							var defaultValObj = defaultValArr[k];
							var name = defaultValObj[valueName];
							var idVal = defaultValObj[idName];
							dispalyNames += that.config.separator + name;

							var $li = $("<li lay-id='" + idVal + "'   >" + name + "</li>");
							that.idValues.push(idVal);
							that.nameValues.push(name);
							$li.data("curObj", defaultValObj);
							$li.data("loadData", true);
							$dataUl.append($li);
							$li.click(function (e) {
								layui.stope(e);
								_liClick(this, that);
							})
							var divshowStr = "";
							divshowStr += "<div id=\"item_" + defaultValObj[idName] + "\" class=\"layui-tab-item\" >";
							divshowStr += "<ul  >";
							divshowStr += "<li  ><i class=\"layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop\" ></i> </li>";
							divshowStr += "</ul>";
							divshowStr += "</div>";
							$("#" + that.contentId).append(divshowStr);
							if (k == 0) {//设置默认值
								$("#" + that.elementId).val(idVal);
								dispalyNames = dispalyNames.substring(that.config.separator.toString().length);
								$("#" + that.displayInputId).val(dispalyNames);
								//加载兄弟节点
								element.tabChange(that.dataTabLayFilter, idVal);
							}
						}

						element.render("tab");

						return;
					} else if (currObj[idName] == currObj[parentName] || currObj[parentName] == null) {
						var postUrl = "";
						var params = new Object();
						//没默认值
						if (that.config.showRootNode) {//如果显示根节点
							postUrl = that.config.getCurrentNodeUrl;
							params[that.config.paramType] = 1;
						} else {
							postUrl = that.config.getChildrenNodeUrl;
							params[that.config.paramType] = 2;
						}
						params[that.config.paramName] = that.config.rootNodeValue;
						_getLidata(postUrl, params, that, titleLi, newItmeDivId, successDl, isFirst, currNodeId);


						return;
					} else {//继续查找父节点
						_dealDefaultValue(that, parentId, resultObj, titleLi, newItmeDivId, successDl, isFirst);
					}


				} else {
					var postUrl = "";
					var params = new Object();
					//没默认值
					if (that.config.showRootNode) {//如果显示根节点
						postUrl = that.config.getCurrentNodeUrl;
						params[that.config.paramType] = 1;
					} else {
						postUrl = that.config.getChildrenNodeUrl;
						params[that.config.paramType] = 2;
					}
					params[that.config.paramName] = that.config.rootNodeValue;
					_getLidata(postUrl, params, that, titleLi, newItmeDivId, successDl, isFirst, currNodeId);
				}
			}
		})
	}

	exports(MOD_NAME, asynTreeSelect);
});