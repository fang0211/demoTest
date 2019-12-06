(function(root) {
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var version = "1.0.1";
    var core_version = "1.0.1";
    var optionscache = {};
    var jQuery = function(selector,context) {
        return new jQuery.prototype.init(selector,context);
    }
    function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}
	//activeElement 属性返回文档中当前获得焦点的元素。
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
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
        expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
        guid: 1,//计数器
        //类型检测
        isPlainObject: function(obj){
            return toString.call(obj) === "[object Object]";
        },
        isArray: function(obj){
            return toString.call(obj) === "[object Array]";
        },
        isFunction: function(obj){
            return toString.call(obj) === "[object Function]";
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
        	//类数组转化成正真的数组  
		markArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
			}
			return ret;
		},
        parseHTML: function (data,context) {
            if(!data || typeof data !== "string"){
                return null;
            };
            //过滤掉<a> => a
            var parse = rejectExp.exec(data);
            //创建元素 返回一个element对象
            return [context.createElement(parse[1])]
        },
        callbacks: function(options){
            options = typeof options === 'string' ? (optionscache[options] || createOptions(options)) : {};
            var list = [];
            var length,index,testing,start,starts,memory;
            var fire = function (data) {
                memory = options.memory && data;
                index = starts || 0;
                start = 0;
                length = list.length;
                testing = true;
                console.log('list',list);
                for(;index<length;index++){
                    if(list[index].apply(data[0],data[1]) === false && options.stopOnfalse){
                        break;
                    }
                }
            }
            var self = {
                add: function(){
                    var args = Array.prototype.slice.call(arguments);
                    start = list.length;debugger
                    args.forEach(function(fn){
                        if(toString.call(fn) === '[object Function]'){
                            list.push(fn)
                        }
                    });
                    if(memory){
                        starts = start;
                        fire(memory)
                    }
                  return this
                },
                fireWith: function (context,arguments) {
                    var args = [context,arguments];
                    if(!options.once || !testing){
                        fire(args);
                    }
                },
                fire: function () {
                    self.fireWith(this,arguments)
                }
            }
            return self
        },
        //异步回调解决方案
        Deferred: function(func) {
            var tuples = [
                    ["resolve", "done", jQuery.callbacks("once memory"), "resolved"],
                    ["reject", "fail", jQuery.callbacks("once memory"), "rejected"],
                    ["notify", "progress", jQuery.callbacks("memory")]
                ],
                state = "pending",
                //promise   权限分配  add   添加callback
                promise = {
                    state: function() {
                        return state;
                    },
                    then: function( /* fnDone, fnFail, fnProgress */ ) {
                        var fns = [].slice.call(arguments); //真正数组对象
                        //创建一个Deferred 延迟对象  返回一个promise对象
                        return jQuery.Deferred(function(newdefer) {
                            tuples.forEach(function(tuple, i) {
                                var fn = jQuery.isFunction(fns[i]) && fns[i];
                                /*
                                deferred   通过闭包去访问  此处链接式调用时指向的deferred对象
                                newdefer   通过参数传递    指向新创建的deferred对象
                                */
                                //resolve  队列中的 callback
                                deferred[tuple[1]](function() {debugger
                                    var returndefer = fn && fn.apply(this, arguments);
                                    // console.log('this',this)
                                    if (returndefer && jQuery.isFunction(returndefer.promise)) {
                                        //  console.log(newdefer);
                                        //  console.log(newdefer.resolve);
                                        returndefer.done(newdefer.resolve)
                                            .fail(newdefer.reject)
                                            .progress(newdefer.notify);
                                    }
                                });

                            })
                        }).promise();
                    },
                    promise: function(obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                },
                deferred = {};

            tuples.forEach(function(tuple, i) {
                var list = tuple[2],
                    stateString = tuple[3];

                // promise[ done | fail | progress ] = list.add
                promise[tuple[1]] = list.add;

                // Handle state
                if (stateString) {
                    list.add(function() {
                        // state = [ resolved | rejected ]
                        state = stateString;
                    });
                }

                // deferred[ resolve | reject | notify ]  der.resolve("加载成功");
                deferred[tuple[0]] = function() {
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                    return this;
                };
                deferred[tuple[0] + "With"] = list.fireWith;
            });

            // Make the deferred a promise
            promise.promise(deferred);

            //新创建的deferred 对象
            if (func) {
                func.call(deferred, deferred);
            }
            return deferred;
        },
        //执行一个或者多个对象的延时对象的回调
        when: function (subordinate) {
            return subordinate.promise();
        },
        /**
         * object 目标源 (on添加事件时指jquery实例对象)
         * callback 回调函数
         * args 自定义回调函数参数
         **/ 
        each: function(object,callback,args){
            // object 数组对象 || object 对象
            var length = object.length;
            var name,i=0;
            if (args) {
                if (length === undefined) {
                    for(name in object){
                        callback.call(object,args)
                    }
                } else {
                    for(; i < length;){
                        callback.apply(object[i++],args)
                    }
                }
            }else{
                if(length === undefined){
                    for(name in object){
                        callback.call(object,name,object[name])
                    }
                } else {
                    for(; i < length;){
                        callback.call(object[i],i,object[i++])
                    }
                }
            }
        }
    });
    function createOptions(options) {
        var object = optionscache[options] = {};
        options.split(/\s+/).forEach(function(value){
            object[value] = true
        });
        return object;
    }
    function Data(){
        //jQuery.expando是jQuery的静态属性,对于jQuery的每次加载运行期间时唯一的随机数
        this.expando = jQuery.expando + Math.random();
        this.cache = {}
    }
    Data.uid = 1;
    Data.prototype = {
        key: function(elem){
            var descriptor = {},
                unlock = elem[this.expando];
                if(!unlock){
                    unlock = Data.uid++;
                    descriptor[this.expando] = {
                        value: unlock
                    }
                    //方法直接在一个对象上定义一个或多个新的属性或修改现有属性,并返回该对象。
				    //DOM   =>  jQuery101089554822917892030.7449198463843298 = 1;
                    Object.defineProperties(elem,descriptor)
                }
                //确保缓存对象记录信息
                if(!this.cache[unlock]){
                    this.cache[unlock] = {} ;//数据
                }
                return unlock
        },
        get: function(elem,key){
            var cache = this.cache[this.key(elem)];//1 { events: {},handle: function(){}}
            console.log('cache',cache)
            return key === undefined ? cache : cache[key]
        }
    }
    var data_priv = new Data();
    //指定模拟对象
    jQuery.Event = function(src,props){
        if(!(this instanceof jQuery.Event)){
            return new jQuery.Event(src,props)
        }
        this.type = src;
        this.timeStamp = src && src.timeStamp || jQuery.now();
        this[jQuery.expando] = true
    }
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function(){
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if(e && e.preventDefault){
                e.preventDefault()
            }
        },
        	// 方法阻止事件冒泡到父元素,阻止任何父事件处理程序被执行。
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		}
        
    }
    //jquery 事件模块
    jQuery.event = {
        //1.利用data_priv数据缓存，分离事件和数据 2.元素与缓存中建立 guid 的映射关系用户查找
        add: function(elem,type,handler){ // elem-element对象 type -- 事件名称/事件对象 handle-事件处理函数
            var eventHandle,event,handlers;
            //事件缓存 数据对象
            var elemmData = data_priv.get(elem); // {event: { "click": []},handler: function(){}}
            //添加id的目的 用来寻找或者删除相应事件
            if(!handler.guid) {
                handler.guid = jQuery.guid++ ;
            }
            		/*
			给缓存增加事件处理句柄
			elemData = {
			  events:
			  handle:	
			}
            */
           //同一元素，不同事件 不重复绑定
            if(!(events = elemmData.events)){
                events = elemmData.events = {}
            }
            if(!(eventHandle = elemmData.handler)){
                eventHandle = elemmData.handle = function(e){
                    return jQuery.event.dispatch.apply(eventHandle.elem,arguments)
                }
            }
            eventHandle.elem = elem;
            if(!(handlers = events[type])){
                handlers = events[type] = []
                handlers.delegateCount = 0 //有多少事件代理默认0
            }
            handlers.push({
                type: type,
                handler: handler,
                guid: handler.guid
            })
            //添加事件
            if(elem.addEventListener){
                elem.addEventListener(type, eventHandle, false);
            }
        },
        //修复事件对象event 从缓存体中的events对象取得对应队列。
        dispatch: function(event){
            var handlers = (data_priv.get(this,"events") ||  {})[event.type] || []
            event.delegateTarget = this;
            jQuery.event.handlers.call(this,event,handlers);
        },
        handlers: function(event,handlers){
            handlers[0].handler.call(this,event)
        },
        special: {
            load: {
                noBubble: true
            },
            focus: {
                trigger: function() {
                    if(this !== safeActiveElement() && this.focus){
                        this.focus();
                        return false
                    }
                },
               delegateType: "focusin"
            },
            blur: {
				trigger: function() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function(event) {
					return jQuery.nodeName(event.target, "a");
				}
            },
            beforeunload: {
				postDispatch: function(event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
        }
    }
    jQuery.fn.extend({
        each: function(callback,args){
            return jQuery.each(this,callback,args)
        },
        on: function(types,fn){
            var type ;
            if(typeof types === "object"){
                for(type in types){
                    this.on(type,types[type]);
                }
                return;
            }
            return this.each(function(){
                //this element 对象
                jQuery.event.add(this,types,fn)
            })
        },
        //event 事件名称
        //data 传递到事件处理程序的额外参数
        // elem element对象
        trigger: function(event,data,elem){
            var i,cur,tmp,bubbleType,ontype,handle,
            i=0,
            eventPath = [elem | document],
            type = event.type || event,
            cur = tmp = elem = elem || document,
            ontype =  /^\w+$/.test(type) && "on" + type;
            event = event[jQuery.expando] ? event : new jQuery.event(type,typeof event ==="object" && event)
            if(!event.target) {
                event.target = elem
            }
            data = data == null ? [event] : jQuery.markArray(data,[event]);
            special = jQuery.event.special[type] || {};
            if(special.trigger && special.trigger.apply(elem,data) === false){
                return;
            }
            cur = cur.parentNode;
            for(;cur;cur=cur,parentNode){
                eventPath.push(cur);
                tmp= cur
            }
            if(tmp === (elem.ownerDocument || document)){
                eventPath.push(tmp.defaultView || tmp.parentWindow || window)
            }
            while((cur = eventPath[i++])){
                handle = (data_priv.get(cur,"events") || {})[event.type] && data_priv.get(cur,"handle")
                if(handle){
                    handle.apply(cur,data)
                }
            }
        }
    })
    jQuery.extend({
        access: function(elems,callback,key,value){
            var chain,cache,len = elems.length;
            var testing = key ===undefined;
            if(jQuery.isPlainObject(key)){
                chain = true;
                for(var item in key){
                    jQuery.access(elems,callback,item,key[item])
                }
            }
            if(value !== undefined){
                chain = true;
                if(testing){
                    cache = callback;
                    callback = function(key,value){
                        cache.call(elems[i],value)
                    }
                }
                for(var i=0;i<len;i++){
                    callback.call(elems[i],key,value)
                }
            }
            return chain ? elems : (testing ? callback.call(elems,value) : callback.call(elems[0],key,value) )
        },
        text: function(elem){
            var textContent='';
            for(var i=0;i<elem.length;i++){
                var nodeType = elem[i].nodeType;
                if(nodeType  === 1 || nodeType===9 || nodeType ===11){
                    textContent += elem[i].textContent
                }
            }
            return textContent
        },
        content: function(elem,value){
            var nodeType = elem.nodeType;
            if(nodeType  === 1 || nodeType===9 || nodeType ===11){
                 elem.textContent = value;
            }
        },
        style: function(elem,key ,value){
            if (!elem || elem.nodeType === 3 || !elem.style) {
				return;
			}
			elem.style[key] = value;
        }
    })
    jQuery.fn.extend({
        text: function(value){
            return jQuery.access(this,function(value){
                return value===undefined ? jQuery.text(this) : jQuery.content(this,value)
            },null,value)
        },
        css: function(key,value){
            return jQuery.access(this,function(key,value){
                var CSSStyleDeclaration,len;
                var map = {};
                if(jQuery.isArray(key)){
                    CSSStyleDeclaration = window.getComputedStyle(this);
                    len = key.length;
                    for(var i=0;i<len;i++){
                        map[key[i]] = CSSStyleDeclaration.getPropertyValue(key[i])
                    }
                    return map;
                }
                 
                return value===undefined ?  (window.getComputedStyle(this).getPropertyValue(
					key) || undefined ): jQuery.style(this,key,value)
            },key,value)
        },
        addClass: function(value){
            var precess = typeof value === "string" && value;
            var classes = (value || "").match(/\S+/g) || [];
            var  len = this.length
            for(var i=0;i<len;i++){
                var elem = this[i];
                var classs = elem.nodeType ===1 && elem.className ? " " +elem.className + " " : ""
                var  j =0,cur;
                while(cur = classes[j++]){
                    if(classs.indexOf(" " + cur + " ")<0){
                        classs += cur+ " ";
                    }
                }
                elem.className = classs.trim();
            }
        }
    })

    root.$ = root.jQuery = jQuery;
})(this);
