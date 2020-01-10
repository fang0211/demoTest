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
    _.now = Date.now;
    _.unique = function (arr,isSorted, iteratee,context) {
        if(!_.isBoolean(isSorted)){
            context = iteratee
            iteratee = isSorted
            isSorted = false

        }
        if(iteratee != null){
            iteratee = cb(iteratee,context)
        }
        var ret = [];
        var seen
        var target,i=0;
        for(;i<arr.length;i++){
            var target = iteratee ? iteratee(arr[i],i,arr) : arr[i];
            if(isSorted){
                if(!i || target !== seen ) ret.push(target)
                seen =  target
            }else if(ret.indexOf(target) === -1){
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
    _.isArguments = function (array) {

    }
    flatten = function(array,shallow){
        var ret = [];
        var index = 0;
        for(var i =0;i<array.length;i++){
            var value = array[i];
            if(_.isArray(value) || _.isArguments(value)){
                if(!shallow){
                    value = flatten(value,shallow)
                }
                var j=0;
                ret.length += value.length
                while(j<value.length){
                    ret[index++] = value[j++]
                }
            }else{
                ret[index++] = value
            }
        }
        return ret;

    }
    _.flatten = function (array,shallow) {
        return flatten(array,shallow)
    }
    //返回数组中除了最后一个元素外的其他全部元素。 在arguments对象上特别有用。
    _.initial = function(array,n){
        return [].slice.call(array,0,Math.max(0,array.length-(n==null?1:n)))
    }
    _.range = function (start,end,step) {
       if(end == null){
           end = start || 0
           start = 0;

       }
        var ret =[]
        step = step || 1
        var length = Math.max(Math.ceil((end-start)/step),0)
        var range = Array(length)
        for(var i=0;i<length;i++,start+=step){
            range[i] = start
        }
        return range
    }
    _.partial = function (func,num) {
        var args = [].slice.call(arguments,1)
        var bound = function () {
            var index = 0;
            var ret = []
            for(var i=0;i<args.length;i++){
                ret.push(args[i])
            }
            while(index < arguments.length){
                args.push(arguments[index++])
            }
            return func.apply(this.args)
        }
        return bound
    }
    _.has = function (obj,key) {
        return obj != null && hasOwnProperty.call(obj,key)
    }
    _.memoize = function (func,hasher) {
       var memoize = function (key) {
           var cache = memoize.cache
           var address = '' + (hasher?hasher.apply(this,arguments): key)
           if(!_.has(cache,address)){
               cache[address] = func.apply(this,arguments)
           }
           return cache[address]
       }
       memoize.cache = {}
       return memoize
    }
    _.delay = function (func,wait) {
        var args = [].slice.call(arguments,2)
        return setTimeout(function () {
            func.apply(null,args)
        },wait)
    }
    _.compose = function () {
        var args = arguments
        var end = args.length -1
        return function () {
            var index = end;
            var ret = args[index].apply(null,arguments)
            while(index--){
                ret = args[index].call(null,ret)
            }
            return ret
        }
    }
    var escapeMap = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
    }
    createEscaper = function () {
        var source = Object.keys(escapeMap).join("|")
        var textExp = new RegExp(source,"g")
        var ret = function (match) {
            return escapeMap[match]
        }
        return function (string) {
            return textExp.test(string) ? string.replace(textExp,ret) : string
        }
    }
    _.escape = createEscaper()
    //返回数组中除了第一个元素外的其他全部元素。传递 n 参数将返回从n开始的剩余所有元素
    _.rest = function (array,n) {
        return [].slice.call(array,(n==null ? 1: n))
    }
    /**
     * 节流 两次执行时间大于time
     *，如果你在wait周期内调用任意次数的函数，都将尽快的被覆盖。
     * 如果你想禁用第一次首先执行的话，传递{leading: false}，
     * 还有如果你想禁用最后一次执行的话，传递{trailing: false}
     */
    _.throttle = function (func,wait,options) {
        var lastTime = 0;
        var timeout= null;
        var args;
        if(!options){
            options = {}
        }
        var later = function(){
            lastTime = _.now()
            timeout = null;
            func.apply(null,args)
        }
        return function () {
            args = arguments
            var now = _.now();
            var remaining = wait-(now-lastTime)
            if(!lastTime && options.leading === false){
                lastTime = now;
                return;
            }
            if(remaining<=0){
                if(timeout){
                    clearTimeout(timeout);
                    timeout = null;
                }
                lastTime = now;
                func.apply(null,args)
            }else if(!timeout && options.trailing !== false){
                timeout = setTimeout(later,remaining)
            }
        }
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