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
    _.isBoolean = function (bool) {
        return toString.call(bool) === "[object Boolean]"
    }
    _.isNumber = function (bool) {
        return toString.call(bool) === "[object Number]"
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
        if(interatee == null){
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
            case 4:
                return function (memo,value,index,obj) {
                    return func.call(context,memo,value,index,obj)
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
        var reduce = function (obj,iteratee,memo,init) {
            var keys = !_.isArray(obj) && Object.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length-1;
            if(!init){
                memo = obj[keys ? keys[index] : index]
                index += dir
            }
            for(;index >= 0 && index <length ;index+=dir){
                var currentKey = keys ? keys[index]: index
                memo = iteratee(memo,obj[currentKey],currentKey,obj)
            }
            return memo
        }
        //memo 第一次累加的时候得初始值 || 数组数据中的下标为0的值
        return function (obj,iteratee,memo,context) {
            var init = arguments.length >=3;
            return reduce(obj,optimizeCb(iteratee,context,4),memo,init)
        }
    }
    _.reduce = createReduce(1)
    //predicate 真值检测（重点： 返回值）
    _.filter = _.select = function (obj,predicate,context) {
        var result = []
        predicate = cb(predicate,context)
        _.each(obj,function (value,index,list) {
            if(predicate(value,index,list) ){
                result.push(value)
            }
        })
        return result
    }
    createIndexFinder = function (dir,predicateFind,sortedIndex) {
        return function(array,item,idx){
            //1-二分查找 2-特殊情况 3-正常循环
            var length = array.length
            var i =0;
            if(sortedIndex && _.isBoolean(idx) && length){
                var ind = sortedIndex(array,item)
                return array[ind] === item ?ind : -1
            }
            if(item !== item){
                var ind = predicateFind(slice.call(array,i,length),_.isNaN)
                return ind
            }
            for(idx = dir > 0 ? i : length - 1; idx>=0 && idx<length; idx += dir){
                if(array[idx] === item){
                    return idx
                }
            }
            return -1
        }
    }
    _.isNaN = function (obj) {
       return _.isNumber(obj) && obj !== obj
    }
    createPredicateIndexFinder = function (dir) {
        return function (array,predicate,context) {
            predicate = cb(predicate,context)
            var length = array.length
            var index = dir>0? 0: length-1
            for(;index>=0 && index<length;index +=dir){
                if(predicate(array[index],index,array)){
                    return index
                }
            }
            return -1
        }
    }
    _.findIndex = createPredicateIndexFinder(1)
    _.sortedIndex = function (array,obj,iteratee,context) {
        iteratee = cb(iteratee,context,1)
        var value = iteratee(obj)
        var low = 0,
            height = array.length;
        while(low < height){
            var mid = Math.floor((low+height)/2)
            if(iteratee(array[mid])< value){
               low = mid + 1
            }else{
                height = mid
            }
        }
        return low
    }
    //_.findIndex 特殊情况的处理方案 NAN _.sortedIndex 针对排序的数组做二分查找
    _.indexOf = createIndexFinder(1,_.findIndex,_.sortedIndex)

    _.clone = function (obj) {
        return  _.isArray(obj) ? obj.slice() : _.extend({},obj)
    }
    //抽样函数  10  11
    _.sample = function (array,n) {
        if(n== null){
            return array[_.random(array.length-1)]
        }
        var sample = _.clone(array)
        var length = sample.length
        n = Math.max(Math.min(n,length),0)
        for(var i=0;i<n;i++){
            var rand = _.random(i,length-1)
            var temp = sample[i];
            sample[i] = sample[rand];
            sample[rand] = temp
        }
        return sample.slice(0,n)

    }
    //返回一个[min,max]范围内的任意整数
    _.random = function (min,max) {
        if(max == null){
            max = min;
            min = 0
        }
        return min + Math.floor(Math.random()*(max-min+1))
    }
    // //返回乱序之后的数组副本
    _.shuffle = function (array) {
        return _.sample(array,Infinity)
    }
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