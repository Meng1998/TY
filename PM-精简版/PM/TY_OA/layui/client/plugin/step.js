/** 步骤条模块 date:2020-02-16   License By http://easyweb.vip */
layui.define(["element"], function (b) {
    var $ = layui.jquery;
    var element = layui.element;
    if ($("#ew-css-steps").length <= 0) {

        var $head = $('head');
        $head.append([
            '<style>',

            '.layui-tab.layui-steps {',
            '    margin: 0 auto',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title {',
            '    height: auto;',
            '    border: 0;',
            '    margin: 0 auto;',
            '    text-align: center;',
            '    overflow: auto!important;',
            '    -webkit-transition: none;',
            '    transition: none;',
            '    display: -webkit-box;',
            '    display: -moz-box;',
            '    display: -webkit-flex;',
            '    display: -moz-flex;',
            '    display: -ms-flexbox;',
            '    display: flex',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>.layui-tab-bar {',
            '    display: none',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li {',
            '    min-width: 130px;',
            '    text-align: left;',
            '    line-height: 24px;',
            '    padding: 0 0 0 44px;',
            '    white-space: initial;',
            '    box-sizing: border-box;',
            '    -webkit-transition: none;',
            '    transition: none;',
            '    -webkit-flex: 1;',
            '    -ms-flex: 1;',
            '    flex: 1',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li:last-child {',
            '    -webkit-box-flex: 0;',
            '    -webkit-flex: none;',
            '    -ms-flex: none;',
            '    flex: none',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li>.layui-icon {',
            '    color: #5fb878;',
            '    position: absolute;',
            '    top: 3px;',
            '    left: 10px;',
            '    width: 24px;',
            '    height: 24px;',
            '    line-height: 24px;',
            '    text-align: center;',
            '    display: inline-block;',
            '    box-sizing: border-box;',
            '    -moz-transition: color .3s, background-color .3s;',
            '    -webkit-transition: color .3s, background-color .3s;',
            '    transition: color .3s, background-color .3s',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li>.layui-steps-title {',
            '    color: #8c8c8c;',
            '    font-weight: 600;',
            '    padding-right: 6px;',
            '    position: relative;',
            '    display: inline-block;',
            '    background-color: #fff;',
            '    -moz-transition: color .3s;',
            '    -webkit-transition: color .3s;',
            '    transition: color .3s',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li>.layui-steps-content {',
            '    color: #999;',
            '    display: block;',
            '    font-size: 12px;',
            '    line-height: initial;',
            '    -moz-transition: color .3s;',
            '    -webkit-transition: color .3s;',
            '    transition: color .3s',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li:after {',
            '    display: none',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li:before {',
            '    content: "";',
            '    position: absolute;',
            '    right: 0;',
            '    top: 15px;',
            '    left: 44px;',
            '    height: 1px;',
            '    background-color: #5fb878;',
            '    -moz-transition: background-color .3s;',
            '    -webkit-transition: background-color .3s;',
            '    transition: background-color .3s',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li:last-child:before, .layui-tab.layui-steps[overflow]>.layui-tab-title>li:nth-last-child(2):before {',
            '    display: none',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li>.layui-icon.layui-icon-ok {',
            '    border: 1px solid #5fb878;',
            '    border-radius: 50%;',
            '    font-size: 0',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li>.layui-icon.layui-icon-ok:before {',
            '    font-size: 14px',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li.layui-this~li>.layui-icon {',
            '    color: #ccc;',
            '    border-color: #ccc!important',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li.layui-this:before, .layui-tab.layui-steps>.layui-tab-title>li.layui-this~li:before {',
            '    background-color: #e8eaec',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li.layui-this>.layui-icon.layui-icon-ok, .layui-tab.layui-steps>.layui-tab-title>li.layui-this~li>.layui-icon.layui-icon-ok {',
            '    font-size: 14px',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li.layui-this>.layui-icon.layui-icon-ok:before, .layui-tab.layui-steps>.layui-tab-title>li.layui-this~li>.layui-icon.layui-icon-ok:before {',
            '    display: none',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li.layui-this>.layui-icon.layui-icon-ok {',
            '    color: #fff;',
            '    background-color: #5fb878',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li.layui-this>.layui-steps-title {',
            '    color: #595959',
            '}',

            '.layui-tab.layui-steps>.layui-tab-title>li.layui-this>.layui-steps-content {',
            '    color: #595959',
            '}',

            '.layui-tab.layui-steps.layui-steps-small>.layui-tab-title>li>.layui-icon {',
            '    top: 3px;',
            '    left: 8px;',
            '    width: 18px;',
            '    height: 18px;',
            '    line-height: 16px',
            '}',

            '.layui-tab.layui-steps.layui-steps-small>.layui-tab-title>li>.layui-steps-title {',
            '    font-size: 13px',
            '}',

            '.layui-tab.layui-steps.layui-steps-small>.layui-tab-title>li:before {',
            '    top: 12px;',
            '    left: 34px',
            '}',

            '.layui-tab.layui-steps.layui-steps-small>.layui-tab-title>li {',
            '    padding-left: 34px;',
            '    min-width: 100px',
            '}',

            '.layui-tab.layui-steps.layui-steps-small>.layui-tab-title>li>.layui-icon.layui-icon-ok:before {',
            '    font-size: 12px',
            '}',

            '.layui-tab.layui-steps.layui-steps-small>.layui-tab-title>li.layui-this>.layui-icon.layui-icon-ok, .layui-tab.layui-steps.layui-steps-small>.layui-tab-title>li.layui-this~li>.layui-icon.layui-icon-ok {',
            '    font-size: 12px',
            '}',

            '.layui-tab.layui-steps.layui-steps-vertical>.layui-tab-title>li>.layui-icon {',
            '    background-color: #fff;',
            '    position: relative;',
            '    left: 0',
            '}',

            '.layui-tab.layui-steps.layui-steps-vertical>.layui-tab-title>li>.layui-steps-title {',
            '    background-color: transparent;',
            '    padding-right: 0;',
            '    margin-top: 6px;',
            '    display: block',
            '}',

            '.layui-tab.layui-steps.layui-steps-vertical>.layui-tab-title>li:before {',
            '    left: 50%;',
            '    right: -50%',
            '}',

            '.layui-tab.layui-steps.layui-steps-vertical>.layui-tab-title>li {',
            '    padding-left: 0;',
            '    text-align: center',
            '}',

            '.layui-tab.layui-steps.layui-steps-vertical>.layui-tab-title>li:last-child {',
            '    -webkit-box-flex: 1;',
            '    -webkit-flex: 1;',
            '    -ms-flex: 1;',
            '    flex: 1',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li {',
            '    color: #fff;',
            '    height: 26px;',
            '    line-height: 26px;',
            '    font-size: 12px;',
            '    min-width: 120px;',
            '    padding: 0 10px 0 24px;',
            '    background-color: #9fd4ae;',
            '    overflow: hidden;',
            '    white-space: nowrap;',
            '    text-overflow: ellipsis;',
            '    -webkit-transition: background-color .3s;',
            '    -moz-transition: background-color .3s;',
            '    -ms-transition: background-color .3s;',
            '    -o-transition: background-color .3s;',
            '    transition: background-color .3s',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li:first-child {',
            '    padding-left: 10px',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li.layui-this {',
            '    background-color: #5fb878',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li.layui-this~li {',
            '    background-color: #c9c9c9',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li:after, .layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li:before {',
            '    content: "";',
            '    position: absolute;',
            '    top: 0!important;',
            '    left: 0!important;',
            '    right: auto!important;',
            '    bottom: auto!important;',
            '    border: 13px solid!important;',
            '    border-color: transparent transparent transparent #9fd4ae!important;',
            '    background-color: transparent!important;',
            '    border-radius: 0!important;',
            '    display: block!important;',
            '    height: auto!important;',
            '    width: auto!important;',
            '    -webkit-transition: border-left-color .3s;',
            '    -moz-transition: border-left-color .3s;',
            '    -ms-transition: border-left-color .3s;',
            '    -o-transition: border-left-color-color .3s;',
            '    transition: border-left-color .3s',
            '}',

            'body .layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li:before {',
            '    left: 1px!important;',
            '    border-color: transparent transparent transparent #fff!important',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li.layui-this~li:after {',
            '    border-color: transparent transparent transparent #c9c9c9!important',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li.layui-this+li:after {',
            '    border-color: transparent transparent transparent #5fb878!important',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li:first-child:after, .layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li:first-child:before {',
            '    display: none!important',
            '}',

            '.layui-tab.layui-steps.layui-steps-simple>.layui-tab-title>li:last-child {',
            '    -webkit-box-flex: 1;',
            '    -webkit-flex: 1;',
            '    -ms-flex: 1;',
            '    flex: 1',
            '}',

            '.layui-tab.layui-steps.layui-steps-readonly>.layui-tab-title>li {',
            '    pointer-events: none!important',
            '}',

            '</style>'
        ].join(''));
        //layui.link(layui.cache.base + "steps/steps.css")
    }
    var step = {};
    step.next = function (filter) {
        step.checkLayId(filter);
        var h = $('[lay-filter="' + filter + '"]');
        var g = h.children(".layui-tab-title").children("li");
        var e = g.filter(".layui-this").next();
        if (e.length <= 0) {
            e = g.first()
        }
        element.tabChange(f, e.attr("lay-id"))
    };
    step.prev = function (f) {
        step.checkLayId(f); var h = $('[lay-filter="' + f + '"]');
        var g = h.children(".layui-tab-title").children("li");
        var e = g.filter(".layui-this").prev();
        if (e.length <= 0) {
            e = g.last()
        }
        element.tabChange(f, e.attr("lay-id"))
    };
    step.go = function (f, e) {
        step.checkLayId(f);
        var h = $('[lay-filter="' + f + '"]');
        var g = h.children(".layui-tab-title").children("li");
        element.tabChange(f, g.eq(e).attr("lay-id"))
    };
    step.checkLayId = function (e) {
        var g = $('.layui-steps[lay-filter="' + e + '"]');
        var f = g.children(".layui-tab-title").children("li");
        if (f.first().attr("lay-id") === undefined) {
            f.each(function (h) { $(this).attr("lay-id", "steps-" + h) })
        } g.find(".layui-tab-bar").remove(); g.removeAttr("overflow")
    };
    $(document).off("click.steps").on("click.steps", "[data-steps]", function () {
        var g = $(this);
        var f = g.parents(".layui-steps").first().attr("lay-filter");
        var e = g.data("steps");
        if (e === "next") {
            step.next(f)
        } else {
            if (e === "prev") {
                step.prev(f)
            } else {
                if (e === "go") { step.go(f, g.data("go")) }
            }
        }
    });
    b("steps", step)
});