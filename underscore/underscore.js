(function(root){
    var push = Array.prototype.push;
    var _ = function(obj){
        if(obj instanceof _){
            return obj
        }
        if(!(this instanceof _)){
            return new _(obj)
        }
        this._wrapped = obj
    }
    _.prototype.value = function () {
        return this._wrapped;
    }
    _.unique = function (arr, callback) {
        var ret = [];
        var target,i=0;
        for(;i<arr.length;i++){
            var target = callback ? callback(arr[i]) : arr[i];
            if(ret.indexOf(target) === -1){
                ret.push(target)
            }
        }
        return ret
    }
    _.isArray = function (array) {
       return toString.call(array) === "[object Array]"
    }
    _.isFunction = function (func) {
        return toString.call(func) === "[object Function]"
    }
    _.each = function (target,callback) {
        var key , i=0;
        if(_.isArray(target)){
            var length = target.length
            for(;i<length;i++){
                callback.call(target,target[i],i)
            }
        }else{
            for(key in target){
                callback.call(target,key,target[key])
            }
        }
    }
    _.function = function (obj) {//obj -- _构造函数
        var result = [];
        var key ;
        for(key in obj){
            result.push(key)
        }
        return result
    }
    //开启链接调用
    _.chain = function(obj){
        var instance = _(obj)
        instance._chain = true;
        return instance
    }
    _.map = function(obj,iteratee,context){
        //生成不同的迭代器
        var interatee = cb(iteratee,context)
        var keys = !_.isArray(obj) && Object.keys(obj)
        var length = (keys || obj).length;
        var result = Array(length)
        for(var index =0 ;index<length;index++){
            var currentKey = keys?keys[index]: index;
                result[index] = interatee(obj[currentKey],index,obj)
        }
        return result
    }
    var result = function(instance,obj){
        return instance._chain ? _(obj).chain() : obj
    }
    var cb = function(interatee,context,count){
        if(interatee === null){
            return _.identify;
        }
        if(_.isFunction(interatee)){
            return optimizeCb(interatee,context,count)
        }
    }
    var optimizeCb = function(func,context,count){
        if(context == void 0){
            return func
        }
        switch (count == null ? 3 : count){
            case 1:
                return function (value) {
                    return func.call(context,value)
                }
            case 3:
                return function (value,index,obj) {
                    return func.call(context,value,index,obj)
                }
        }
    }
    _.restArguments = function (func) {
        var startIndex = func.length-1;
        return function () {
           var length = arguments.length - startIndex,
               rest = Array(length),
               index = 0;
           for(;index <length;index++){
               rest[index] = arguments[index + startIndex]
           }
            var args = Array(startIndex+1)
            for(var index =0;index<startIndex;index++){
               args[index] = arguments[index]
            }
            args[startIndex] = rest
            return func.apply(this,args)
        }
    }
    var Ctor = function(){}
    var baseCreate = function (prototype) {
        // if(!_.isObject(prototype)){
        //     return {}
        // }
        // if(Object.create) return Object.create(prototype)
        Ctor.prototype = prototype
        var result = new Ctor;
        Ctor.prototype = null
        return result
    }
    _.isObject = function(obj){
        return toString.call(obj) === '[object Object]'
    }
    _.identify = function(value){
        return value
    }
    var createReduce = function (dir) {
        var reduce = function () {
            
        }
        //memo 第一次累加的时候得初始值 || 数组数据中的下标为0的值
        return function (obj,iteratee,memo,context) {
            var init = arguments.length >=3;
            return reduce(obj,optimizeCb(iteratee,context,4),memo,init)
        }
    }
    _.reduce = createReduce(1)
    _.mixin = function(obj){
        _.each(_.function(obj),function(name){
            var func = obj[name];
            _.prototype[name] = function(){
                var args = [this._wrapped]
                push.apply(args,arguments)
                return result(this,func.apply(this,args));
            }
        })
    }
    _.mixin(_)
    root._ = _
})(this)