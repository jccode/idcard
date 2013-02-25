/**
 * jQuery分页插件
 * @author 陈俊昌
 * @depend jQuery && bootstrap
 */
;(function ($) {

	// Define Constants
	var CLASS_NUM = "page-num", 
		CLASS_PREV = "page-prev", 
		CLASS_NEXT = "page-next";
	
	/**
	 * Entry
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	$.fn.pagination = function (options) {
		var $this = $(this), 
			opts = $.extend({}, $.fn.pagination.defaults, options);
		$this.data("page", opts.page); // save current page number
		render($this, opts);
		initEvent($this, opts);
	};

	/**
	 * 渲染DOM结构
	 * @param  {[type]} $el  [description]
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	function render ($el, opts) {
		$el.html(buildHTML($el, opts));
		setActive($el);
	}

	/**
	 * 构建HTML
	 * @param  {object} opts [description]
	 * @return {string}      [description]
	 */
	function buildHTML ($el, opts) {
		// total page less than 1, don't show pagination.
		if(opts.count <= 1) return "";

		// build item list
		var itemList = [], 
			page = parseInt($el.data("page")), 
			num = Math.min(opts.num, opts.count), 
			region = pageRegion(page, num, opts.count);

		itemList.push(buildItem(CLASS_PREV, opts.title.prev));
		for(var i = region.start; i <= region.end; i++) {
			itemList.push(buildItem(CLASS_NUM, i));
		}
		itemList.push(buildItem(CLASS_NEXT, opts.title.next));

		// build body
		var result = 
			Template.body
				.replace("${class}", opts.class)
				.replace("${itemList}", itemList.join(""));

		return result;
	}

	/**
	 * 构建单个元素
	 * @param  {string} clazz  样式名
	 * @param  {string} text    分页标签显示的内容
	 * @return {string}        innerHTML
	 */
	function buildItem(clazz, text) {
		var result =  
			Template.item
				.replace("${class}", clazz)
				.replace(/\${text}/g, text);

		return result;
	}

	/**
	 * 计算页码区间
	 * @param  {number} page 	 当前页码
	 * @param  {number} num 	 页码显示的个数
	 * @param  {number} count 	 总页码数
	 * @return {[type]}          [description]
	 */
	function pageRegion (page, num, count) {
		var boundary = Math.ceil(num / 2), 
			region;
		if(page <= boundary) {
			region = {
				start: 1, 
				end: num
			};

		} else {
			var left = boundary, 
				right = num - left;

			if(page + right >= count) {
				region = {
					start: count - num + 1, 
					end: count
				}
			} else {
				region = {
					start: page - left + 1, 
					end: page + right
				}
			}
		}
		return region;
	}

	/**
	 * 设置当前激活的页码
	 * @param {[type]} argument [description]
	 */
	function setActive ($el) {
		var page = $el.data("page");
		$(".pagination > ul > li", $el).removeClass( "active" );
		$("." + CLASS_NUM + "[idx=" + page + "]", $el).parent().addClass( "active" );
	}

	/**
	 * 初始化事件绑定
	 * @param  {object} opts [description]
	 */
	function initEvent ($el, opts) {

		$el.click( function (e) {

			var $target = $(e.target), 
				currentPage = $el.data("page");

			// number
			if($target.hasClass(CLASS_NUM)) { 
				clickHandler($el, currentPage, $target.html(), opts);
			}

			// prev
			else if($target.hasClass(CLASS_PREV)) {
				if(currentPage > 1)
					clickHandler($el, currentPage, parseInt(currentPage)-1, opts);
			}

			// next
			else if($target.hasClass(CLASS_NEXT)) {
				if(currentPage < opts.count) 
					clickHandler($el, currentPage, parseInt(currentPage)+1, opts);
			}

			return false;
		});
	}

	/**
	 * 点击处理函数
	 * @param  {jQuery}   $el         [description]
	 * @param  {string}   currentPage 当前所在的页码
	 * @param  {string}   newPage     即将跳转到的页码
	 * @param  {object}   opts        跳转处理函数
	 * @return {void}               
	 */
	function clickHandler ($el, currentPage, newPage, opts) {
		$el.data("page", newPage);
		if(!opts.refresh) {
			render($el, opts);
		}
		opts.callback && opts.callback.call(null, currentPage, newPage);
	}

	/**
	 * 模板
	 * @type {Object}
	 */
	var Template = {
		
		body: '\
				<div class="pagination ${class}">\
					<ul>\
						${itemList}\
					</ul>\
				</div>\
				', 

		item: '<li><a href="#" class="${class}" idx="${text}">${text}</a></li>'
	};

	/**
	 * 默认Options
	 * @type {Object}
	 */
	$.fn.pagination.defaults = {
		page: 1, 				// require. current page no. default is 1.
		count: 1, 				// require. total page count
		callback: $.noop(), 	// require. callbak when click
		num: 5, 				// how many number shows
		class: "", 				// additional class name
		refresh: true, 			// whether refresh when page no changes. Typically, this value set false when using ajax.
		title: {				// title of the previous btn & next btn.
			prev: "«", 
			next: "»"
		}
	}


})(jQuery);