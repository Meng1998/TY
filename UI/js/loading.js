(function ($) {
    //扩展jquery 方法
    $.fn.extend({
    	/***
    	 * 为制定标签创建点击加载层效果
    	 */
    	openLoadForm:function(msg,callback){
            if(typeof msg=="function"){
                callback=msg;
                msg={};
            }
    		$(this).on("click",function(){
                var index=$.openLoadForm(msg);
    			if(typeof callback=="function"){
    				callback(index);
    			}
    		});
    	},
    });


    $.extend({
        /**
         * 弹出加载层
         * 
         */
        openLoadForm:function(msg){
            if(typeof msg=="string"){
                msg={"msg":msg};
            }

            var option= $.extend({}, defoption, msg);  

            var uuid='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
              });
            //引入js文件
            var str=
		            '<div  class="loadForms" id="'+uuid+'"  style="cursor: not-allowed;width: 100%; height: 100%;position: fixed;z-index: 9999;background-color: rgba(235, 235, 235, 0.55);top: 0px;">'+
		            '    <div id="box_'+uuid+'" style="user-select: none;opacity: 1;width: auto;height: auto;display: block;padding: 0px;border: 1px solid #ccc;font-size: 18px;position: fixed;background-color: white;margin-top: 30%;    box-shadow: 1px 1px #cecece">'+
		            '		<div style="float:left;">'+
		            '	    	<img style="padding: 15px;width: 25px;" src="'+option["gif"]+'" _height="64" _width="64">'+
		            '		</div>'+
		            '		<div id="content_'+uuid+'" style="display: block;float:left;padding-top: 15px;padding-right: 37px;">'+option['msg']+'</div>'+
		            '   </div>            '+
		            '</div>';
            $("body").append(str);
            //计算并设置div的位置
            var width=$("body").width();
            var tinbW=$("#content_"+uuid).width();
            $("#box_"+uuid).css("left",width/2-tinbW/2);
            return uuid;
        },
        /**
         * 关闭加载层
         */
        closeLoadForm:function(index){
            if(!index){
                $(".loadForms").remove();
                return ;
            }
            $("#"+index).remove();
        },
    });
   var defoption={
       gif:'wait.gif',
       msg:'加载中，请稍后'
   }
    
})(window.jQuery);