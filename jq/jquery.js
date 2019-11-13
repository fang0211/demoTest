(function(root) {
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var version = "1.0.1"
    var jQuery = function(selector,context) {
        return new jQuery.prototype.init(selector,context);
    }
    jQuery.fn = jQuery.prototype = {
        length: 0,
        jquery: version,
        init: function(selector,context) {
            context = context || document;
            var match,elem,index=0;
            if(!selector){
                return this;
            }
            if(typeof selector === 'string'){
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    match = [selector]
                }
                if(match){//创建dom
                    jQuery.merge(this,jQuery.parseHTML(selector,context));
                }else{//查询dom
                    elem = document.querySelectorAll(selector);
                    var elems = Array.prototype.slice.call(elem);
                    this.length = elems.length;
                    for(;index<elems.length;index++){
                        this[index] = elems[index]
                    };
                    this.context = context;
                    this.selector = selector;
                }
            }else if(selector.nodeType){
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }
        },
        css: function() {

        }
    }

    //extend
    jQuery.fn.extend = jQuery.extend = function() {
        var target = arguments[0] || {};
        var length = arguments.length;
        var i = 1;
        var deep = false;
        var option, name,copy,src,copyIsArray,clone;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1];
            i = 2;
        }
        if (typeof target !== "object") {
            target = {};
        }
        //参数的个数 1
        if (length === i) {
            target = this;
            i--;
        }

        //浅拷贝  深拷贝
        for (; i < length; i++) {
            if ((option = arguments[i]) != null) {
                for (name in option) {
                    copy = option[name];
                    src = target[name];
                    if(deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if(copy != undefined){
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }

    //共享原型对象
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.extend({
        //类型检测
        isPlainObject: function(obj){
            return toString.call(obj) === "[object Object]";
        },
        isArray: function(obj){
            return toString.call(obj) === "[object Array]";
        },
        //合并社数组
        merge: function (first,second) {
            var l = second.length,
                i = first.length,
                j=0;
            if(typeof l === "number"){
                for(;j<l;j++){
                    first[i++] = second[j];
                }
            }else{
                while (second[j] !== undefined){
                    first[i++] = second[j++];
                }
            }

        },
        parseHTML: function (data,context) {
            if(!data || typeof data !== "string"){
                return null;
            };
            //过滤掉<a> => a
            var parse = rejectExp.exec(data);
            //创建元素 返回一个element对象
            return [context.createElement(parse[1])]
        }
    });
    root.$ = root.jQuery = jQuery;
})(this);
