define(function(require, exports, module) {
	
	var $ = require('jquery'), 
		IC = require('./idcard');

	var tpl = "<option value='${val}'>${name}</option>";


	function init_year() {
		var currYear = new Date().getFullYear(), 
			year, html;

		for(var i = 0; i < 90; i++) {
			year = currYear - i;
			html += tpl.replace("${val}", year).replace("${name}", year);
		}
		$("#year").append(html);
	}

	function init_month() {
		var html;
		for(var i = 1; i <= 12; i++) {
			html += tpl.replace("${val}", i).replace("${name}", i+"月");
		}
		$("#month").append(html);
	}

	function loadDate() {
		var year = $("#year").val(), 
			month = $("#month").val(), 
			day = new Date(year, month, 0).getDate(), 
			html;

		for(var i = 1; i <= day; i++) {
			html += tpl.replace("${val}", i).replace("${name}", i);
		}
		$("#day").empty().append(html);
	}

	function getNodeListHtml (nodeList) {
		var html;
		for (var i = 0, len = nodeList.length; i < len; i++) {
			var node = nodeList[i];
			html += tpl.replace("${val}", node['code']).replace("${name}", node['name']);
		};
		return html;
	}

	function init_province () {
		var citys = IC.getData(); 
		$("#province").append(getNodeListHtml(citys));
	}

	function loadCity () {
		var province = $("#province").val(), 
			citys = IC.getLevel2Nodes(province);
		$("#city").empty().append(getNodeListHtml(citys));
		$("#city").trigger("change");
	}

	function loadTown () {
		var city = $("#city").val(), 
			$town = $("#town");
		$town.empty();
		if(city) {
			var	towns = IC.getLevel3Nodes(city);
			$town.append(getNodeListHtml(towns));
		}
	}

	function showResult (id, msg) {
		$("#" + id).removeClass("hide").children("div").html(msg);
	}

	function twoBit (n) {
		return (n+"").length == 1 ? "0"+n : n;
	}

	function queryInfo () {
		var num = $("#txt_idcard").val();
		var msg = IC.parseWithMsg(num);
		showResult("ret_query", msg);
	}

	function genIdCard () {
		var birthday = $("#year").val() + twoBit($("#month").val()) + twoBit($("#day").val());
		var sex = $("input[name='sex']:radio:checked").val();
		var code = $("#town").val();
		if(!code) {
			code = $("#city").val();
			if(!code) code = $("#province").val();
		}
		var num = IC.genIdCard(code, birthday, sex);
		showResult("ret", "生成号码为: " + num);
	}

	function genRandIdCard () {
		var ret = IC.rndGenIdCardFull();
		var msg = " 生成号码为: ${cardNum}<br> 出生地: ${birthplace}<br> 生日: ${birthday}<br> 性别: ${sex}"
			.replace("${cardNum}", ret.cardNum)
			.replace("${birthplace}", ret.birthplace)
			.replace("${birthday}", ret.birthday)
			.replace("${sex}", {"0":"女", "1":"男"}[ret.sex]);
		showResult("ret_rnd", msg);
	}

	function init_event () {
		$("#year, #month").change(loadDate);
		$("#province").change(loadCity);
		$("#city").change(loadTown);

		$("#gen").click(genIdCard);
		$("#gen_rnd").click(genRandIdCard);
		$(".alert .close").click(function () {
			$(this).closest(".alert").addClass("hide");
		});

		$("#query").click(queryInfo);
	}

	function init_options () {
		init_province();
		loadCity();
		loadTown();

		init_year();
		init_month();
		loadDate();
	}

	function init() {
		init_options();
		init_event();
	}

	$(function() {
		init();
	});
});