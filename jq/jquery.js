(function(root){
    var version = "1.0.1"
    var jQuery = function(selector,context){
        return new jQuery.prototype.init(selector,context);
    };
    jQuery.fn = jQuery.prototype = {
        length: 0,
        jquery: version,
        init: function(selector,context){
            context = context || document;
            var match ,elem,index =0;
            if(!selector){
                return this;
            }
            if(typeof selector === 'string'){
                if(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3){
                    match = [selector]
                }

                if(match){//创建dom
                    jQuery.merge(this,jQuery.parseHTML(selector,context))
                }else{//查询dom
                    elem = document.querySelectorAll(selector)
                }
            }
        },
        css: function(){

        }
    };

    jQuery.fn.extend = jQuery.extend = function(){
        var target = arguments[0] || {};
        var length = arguments.length;
        var i = 0;
        var deep = false;
        var option,name,copy,src,copyIsArray,clone;
        if(typeof target === "boolean"){
            deep = target;
            target = arguments[1];
            i = 2
        }
        if(typeof target !== 'object'){
            target = {};
        };
        //参数的格式
        if(length === i){
            target = this;
            i--;
        }
        //浅拷贝
        for(;i < length; i++){
            if((option = arguments[i]) != null){
                for(name in option){
                    copy = option[name];
                    src= target[name];
                    if(deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))){
                        if(copyIsArray){
                            copyIsArray= false;
                            clone = src && jQuery.isArray(src) ?src : []
                        }else{
                            clone = src && jQuery.isPlainObject(src) ? src : {}
                        };
                        target[name] = jQuery.extend(deep,clone,copy)
                    }else if(copy != undefined){
                        target[name] = copy;
                    }
                }
            }
        };
        return  target;
    }

    //共享原型对象
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.extend({
        //类型检测
        isPlainObject: function(obj){
            return toString.call(obj) === '[object Object]'
        },
        isArray: function(obj){
            return toString.call(obj) === '[object Array]'
        },
        merge: function () {

        },
        parseHTML: function () {
            
        }
    })
    root.jQuery = root.$ = jQuery;
})(this)