// 'use strict';
/**
 * 入口函数 自动运行，默认三个参数
 * @param modules
 * @param n
 * @param r
 */
!function boot(modules, config, bootModule) {
    // 加载函数和导出模块的函数
    function mainExport(moduleName, s) {
        // 判断配置文件中是否有，没有则可以执行
        if (!config[moduleName]) {
            // 判断加载模块列表中是否有，没有提示无法找到模块
            if (!modules[moduleName]) {
                var innerFunctionName = "function" == typeof require && require;
                if (!s && innerFunctionName) return innerFunctionName(moduleName, !0);
                if (functionName) return functionName(moduleName, !0);
                var moduleException = new Error("Cannot find module '" + moduleName + "'");
                throw moduleException.code = "MODULE_NOT_FOUND", moduleException
            }
            // 如果配置中有，则重置
            var configExport = config[moduleName] = {exports: {}};
            // 调用，模块中的函数，第一个为函数，后面的为参数，
            modules[moduleName][0].call(configExport.exports, function (itemName) {
                var innerModuleName = modules[moduleName][1][itemName];
                return mainExport(innerModuleName ? innerModuleName : itemName)
            }, configExport, configExport.exports, boot, modules, config, bootModule)
        }
        return config[moduleName].exports
    }

    for (var functionName = "function" == typeof require && require, index = 0; index < bootModule.length; index++) mainExport(bootModule[index]);
    return mainExport
}({
    1 : [function(context, def, n) {
        /**
         * @param {?} allOrId
         * @return {undefined}
         */
        function update(allOrId) {
            /** @type {number} */
            var width = window.WIDTH = window.innerWidth;
            /** @type {number} */
            var height = window.HEIGHT = window.innerHeight;
            if (window.parent) {
                /** @type {number} */
                width = window.parent.innerWidth;
                /** @type {number} */
                height = window.parent.innerHeight;
            }
            this.setSize(width, height);
        }
        /**
         * @param {string} t
         * @return {undefined}
         */
        function attachVisibilityEvent(t) {
            var propertyName;
            var visibilityChange;
            if ("undefined" != typeof document.hidden) {
                /** @type {string} */
                propertyName = "hidden";
                /** @type {string} */
                visibilityChange = "visibilitychange";
            } else {
                if ("undefined" != typeof document.mozHidden) {
                    /** @type {string} */
                    propertyName = "mozHidden";
                    /** @type {string} */
                    visibilityChange = "mozvisibilitychange";
                } else {
                    if ("undefined" != typeof document.msHidden) {
                        /** @type {string} */
                        propertyName = "msHidden";
                        /** @type {string} */
                        visibilityChange = "msvisibilitychange";
                    } else {
                        if ("undefined" != typeof document.webkitHidden) {
                            /** @type {string} */
                            propertyName = "webkitHidden";
                            /** @type {string} */
                            visibilityChange = "webkitvisibilitychange";
                        }
                    }
                }
            }
            if ("undefined" != typeof document.addEventListener) {
                document.addEventListener(visibilityChange, function() {
                    if (document[propertyName]) {
                        t.onLeaveTab();
                    } else {
                        setTimeout(t.onFocusTab.bind(t), 50);
                    }
                }, false);
            }
        }
        /**
         * @param {?} _options
         * @return {undefined}
         */
        function Slatebox(_options) {
        }
        var a = context("3");
        var that = context("6");
        var Store = context("2");
        /**
         * @param {!Object} options
         * @return {undefined}
         */
        var init = function(options) {
            if (options = void 0 !== options ? options : {}, this.renderer = new THREE.WebGLRenderer({
                alpha : true,
                antialias : true,
                canvas : options.canvas || document.querySelector("canvas"),
                preserveDrawingBuffer : void 0 !== options.preserveDrawingBuffer ? options.preserveDrawingBuffer : void 0
            }), THREE.Extensions = this.renderer.extensions, this.config = {
                fps : void 0 !== options.fps && options.fps,
                profiling : void 0 !== options.profiling && options.profiling,
                logCalls : void 0 !== options.logCalls && options.logCalls
            }, options && options.maxPixelRatio) {
                var ratio = window.devicePixelRatio > options.maxPixelRatio ? options.maxPixelRatio : window.devicePixelRatio;
            } else {
                /** @type {number} */
                ratio = window.devicePixelRatio;
            }
            if (window.isMobile) {
                ratio = ratio > 1.5 ? 1.5 : ratio;
            }
            this.renderer.setPixelRatio(ratio);
            this.setSize(options.width || window.innerWidth, options.height || window.innerHeight);
            if (void 0 !== options.autoClear) {
                this.renderer.autoClear = options.autoClear;
            }
            if (void 0 !== options.clearColor) {
                this.renderer.setClearColor(options.clearColor);
            }
            if (!(void 0 !== options.supportsTextureLod && options.supportsTextureLod !== true)) {
                THREE.Extensions.get("EXT_shader_texture_lod");
            }
            this.clock = new THREE.Clock;
            /** @type {boolean} */
            this.paused = false;
            /** @type {!Array} */
            this.scenes = [];
            /** @type {null} */
            this.scene = null;
            window.onresize = update.bind(this);
            window.addEventListener("keyup", Slatebox.bind(this));
            this.renderer.domElement.addEventListener("mousemove", function(event) {
                /** @type {number} */
                window.mouseX = event.pageX / WIDTH * 2 - 1;
                /** @type {number} */
                window.mouseY = 1 - event.pageY / HEIGHT * 2;
            });
            if (this.config.fps) {
                this.fpsCounter = new Store;
                /** @type {!Element} */
                this.counter = document.createElement("div");
                document.querySelectorAll("body")[0].appendChild(this.counter);
                this.counter.setAttribute("style", "position:absolute;top:20px;left:100px;color:#ff00ff;display:block !important;z-index:999999;");
            }
            attachVisibilityEvent(this);
            if (this.config.logCalls) {
                this.initDrawCallsCounter();
            }
        };
        init.prototype = {
            initDrawCallsCounter : function() {
                var $panzoom = $("<div id='dc'></div>");
                $("body").append($panzoom);
                $panzoom.css("position", "absolute").css("display", "block !important").css("color", "yellow").css("top", "60px").css("left", "20px").css("padding", "3px").css("font-size", "2em").css("background-color", "black").css("z-index", "999999");
                this.dcCounter = $panzoom[0];
            },
            render : function(text) {
                /** @type {number} */
                var totalPlayers = 0;
                var mapFragmentAndProps = function() {
                    if (this.config.logCalls) {
                        totalPlayers = totalPlayers + this.renderer.info.render.calls;
                    }
                }.bind(this);
                this.renderScene(this.scene, this.camera);
                mapFragmentAndProps();
                if (this.config.logCalls) {
                    this.dcCounter.textContent = totalPlayers + " DC";
                }
            },
            renderScene : function(scene, camera) {
                this.renderer.render(scene, camera);
            },
            update : function(target) {
                if (this.camera) {
                    this.camera.updateMatrixWorld(true);
                    this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
                }
                _.each(this.scenes, function(camera) {
                    this.updateCustomMaterials(camera);
                    if (camera.update) {
                        camera.updateMatrixWorld(true);
                        camera.update(this.renderer, target);
                    }
                }, this);
            },
            updateCustomMaterials : function(model, name) {
                _.each(model.materials, function(handler) {
                    if (handler.pbr) {
                        handler.refreshUniforms(name || this.camera, this.envRotation);
                    }
                }, this);
            },
            doUpdate : function() {
                var data = {
                    delta : 0,
                    elapsed : 0
                };
                return function() {
                    if (data.delta = this.clock.getDelta(), data.elapsed = this.clock.getElapsedTime(), !this.paused) {
                        this.requestAnimationFrame(this.doUpdate.bind(this));
                        /** @type {number} */
                        var t = void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now();
                        that.updateTimers(data);
                        if (this.config.profiling) {
                            console.time("update");
                        }
                        this.update(data);
                        if (this.config.profiling) {
                            console.timeEnd("update");
                        }
                        this.render(data);
                        if (!this.started) {
                            /** @type {boolean} */
                            this.started = true;
                        }
                        if (this.config.fps) {
                            this.fpsCounter.update(data, function(pctg) {
                                /** @type {string} */
                                this.counter.textContent = pctg + " FPS";
                            }.bind(this));
                        }
                    }
                };
            }(),
            start : function() {
                this.doUpdate();
            },
            pause : function() {
                if (!this.paused) {
                    this.clock.stop();
                    /** @type {boolean} */
                    this.paused = true;
                    if (this.config.fps) {
                        this.counter.textContent += " (paused)";
                    }
                }
            },
            resume : function() {
                if (this.paused) {
                    this.clock.start();
                    /** @type {boolean} */
                    this.paused = false;
                    if (this.started) {
                        this.doUpdate();
                    }
                }
            },
            onLeaveTab : function() {
                if (!this.paused) {
                    this.pause();
                    /** @type {boolean} */
                    this.shouldResume = true;
                }
            },
            onFocusTab : function() {
                if (this.shouldResume) {
                    this.resume();
                    /** @type {boolean} */
                    this.shouldResume = false;
                }
            },
            setAspectRatio : function(aspect) {
                if (this.camera) {
                    /** @type {number} */
                    this.camera.aspect = aspect;
                    this.camera.updateProjectionMatrix();
                }
            },
            setSize : function(width, height) {
                if (this.started) {
                    this.setAspectRatio(width / height);
                }
                this.renderer.setSize(width, height);
            },
            requestAnimationFrame : function(callback) {
                requestAnimationFrame(callback);
            }
        };
        init.mixin(a);
        /** @type {function(!Object): undefined} */
        def.exports = init;
    }, {
        2 : 2,
        3 : 3,
        6 : 6
    }],
    2 : [function(canCreateDiscussions, module, n) {
        /**
         * @return {undefined}
         */
        var Stats = function() {
            /** @type {number} */
            this.frames = 0;
            /** @type {number} */
            this.fps = 0;
            /** @type {number} */
            this.lastTime = 0;
        };
        Stats.prototype = {
            update : function(time, f) {
                /** @type {number} */
                time = 1E3 * time.elapsed;
                this.frames++;
                if (time > this.lastTime + 1E3) {
                    /** @type {number} */
                    this.fps = Math.round(1E3 * this.frames / (time - this.lastTime));
                    f(this.fps);
                    /** @type {number} */
                    this.lastTime = time;
                    /** @type {number} */
                    this.frames = 0;
                }
            }
        };
        /** @type {function(): undefined} */
        module.exports = Stats;
    }, {}],
    3 : [function(canCreateDiscussions, module, n) {
        var Events = {
            on : function(type, callback, context) {
                if (!eventsApi(this, "on", type, [callback, context]) || !callback) {
                    return this;
                }
                if (!this._events) {
                    this._events = {};
                }
                var handlers = this._events[type] || (this._events[type] = []);
                return handlers.push({
                    callback : callback,
                    context : context,
                    ctx : context || this
                }), this;
            },
            once : function(type, callback, context) {
                if (!eventsApi(this, "once", type, [callback, context]) || !callback) {
                    return this;
                }
                var self = this;
                var onceListener = _.once(function() {
                    self.off(type, onceListener);
                    callback.apply(this, arguments);
                });
                return onceListener._callback = callback, this.on(type, onceListener, context);
            },
            off : function(name, callback, context) {
                var listeners;
                var handler;
                var _ref2;
                var names;
                var j;
                var i;
                var _k;
                var _len2;
                if (!this._events || !eventsApi(this, "off", name, [callback, context])) {
                    return this;
                }
                if (!name && !callback && !context) {
                    return this._events = void 0, this;
                }
                names = name ? [name] : _.keys(this._events);
                /** @type {number} */
                j = 0;
                i = names.length;
                for (; j < i; j++) {
                    if (name = names[j], _ref2 = this._events[name]) {
                        if (this._events[name] = listeners = [], callback || context) {
                            /** @type {number} */
                            _k = 0;
                            _len2 = _ref2.length;
                            for (; _k < _len2; _k++) {
                                handler = _ref2[_k];
                                if (callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
                                    listeners.push(handler);
                                }
                            }
                        }
                        if (!listeners.length) {
                            delete this._events[name];
                        }
                    }
                }
                return this;
            },
            trigger : function(type) {
                if (!this._events) {
                    return this;
                }
                /** @type {!Array<?>} */
                var args = slice.call(arguments, 1);
                if (!eventsApi(this, "trigger", type, args)) {
                    return this;
                }
                var obj = this._events[type];
                var fn = this._events.all;
                return obj && check(obj, args), fn && check(fn, arguments), this;
            },
            stopListening : function(obj, name, callback) {
                var listeningTo = this._listeningTo;
                if (!listeningTo) {
                    return this;
                }
                /** @type {boolean} */
                var i = !name && !callback;
                if (!(callback || "object" != typeof name)) {
                    callback = this;
                }
                if (obj) {
                    /** @type {!Object} */
                    (listeningTo = {})[obj._listenId] = obj;
                }
                var id;
                for (id in listeningTo) {
                    obj = listeningTo[id];
                    obj.off(name, callback, this);
                    if (i || _.isEmpty(obj._events)) {
                        delete this._listeningTo[id];
                    }
                }
                return this;
            }
        };
        /** @type {!RegExp} */
        var i = /\s+/;
        /** @type {!Array} */
        var prototypeOfArray = [];
        /** @type {function(this:(IArrayLike<T>|string), *=, *=): !Array<T>} */
        var slice = prototypeOfArray.slice;
        /**
         * @param {!Object} obj
         * @param {string} action
         * @param {string} name
         * @param {!Array} rest
         * @return {?}
         */
        var eventsApi = function(obj, action, name, rest) {
            if (!name) {
                return true;
            }
            if ("object" == typeof name) {
                var template;
                for (template in name) {
                    obj[action].apply(obj, [template, name[template]].concat(rest));
                }
                return false;
            }
            if (i.test(name)) {
                var a = name.split(i);
                /** @type {number} */
                var j = 0;
                var startLen = a.length;
                for (; j < startLen; j++) {
                    obj[action].apply(obj, [a[j]].concat(rest));
                }
                return false;
            }
            return true;
        };
        /**
         * @param {!NodeList} f
         * @param {!Array} a
         * @return {undefined}
         */
        var check = function(f, a) {
            var self;
            /** @type {number} */
            var j = -1;
            var m = f.length;
            var i = a[0];
            var ac = a[1];
            var c2 = a[2];
            switch(a.length) {
                case 0:
                    for (; ++j < m;) {
                        (self = f[j]).callback.call(self.ctx);
                    }
                    return;
                case 1:
                    for (; ++j < m;) {
                        (self = f[j]).callback.call(self.ctx, i);
                    }
                    return;
                case 2:
                    for (; ++j < m;) {
                        (self = f[j]).callback.call(self.ctx, i, ac);
                    }
                    return;
                case 3:
                    for (; ++j < m;) {
                        (self = f[j]).callback.call(self.ctx, i, ac, c2);
                    }
                    return;
                default:
                    for (; ++j < m;) {
                        (self = f[j]).callback.apply(self.ctx, a);
                    }
                    return;
            }
        };
        var collection = {
            listenTo : "on",
            listenToOnce : "once"
        };
        _.each(collection, function(implementation, method) {
            /**
             * @param {!NodeList} obj
             * @param {?} name
             * @param {!Object} callback
             * @return {?}
             */
            Events[method] = function(obj, name, callback) {
                var listeningTo = this._listeningTo || (this._listeningTo = {});
                var id = obj._listenId || (obj._listenId = _.uniqueId("l"));
                return listeningTo[id] = obj, callback || "object" != typeof name || (callback = this), obj[implementation](name, callback, this), this;
            };
        });
        module.exports = Events;
    }, {}],
    4 : [function(canCreateDiscussions, module, n) {
        var console = {};
        /**
         * @param {undefined} message
         * @param {undefined} callback
         * @return {?}
         */
        console.CreateWhiteTexture = function(message, callback) {
            var request = console.CreateDataTexture(message, callback);
            /** @type {number} */
            var i = 0;
            for (; i < request.image.data.length; i++) {
                /** @type {number} */
                request.image.data[i] = 255;
            }
            return request;
        };
        /**
         * @param {undefined} s
         * @param {undefined} e
         * @return {?}
         */
        console.CreateBlackTexture = function(s, e) {
            var div = console.CreateDataTexture(s, e);
            /** @type {number} */
            var i = 0;
            for (; i < div.image.data.length; i++) {
                /** @type {number} */
                div.image.data[i] = 0;
            }
            return div;
        };
        /**
         * @param {undefined} s
         * @param {undefined} e
         * @return {?}
         */
        console.CreateNormalTexture = function(s, e) {
            var div = console.CreateDataTexture(s, e);
            /** @type {number} */
            var i = 0;
            for (; i < div.image.data.length; i = i + 3) {
                /** @type {number} */
                div.image.data[i] = 128;
                /** @type {number} */
                div.image.data[i + 1] = 128;
                /** @type {number} */
                div.image.data[i + 2] = 255;
            }
            return div;
        };
        /**
         * @param {number} size
         * @param {number} width
         * @return {?}
         */
        console.CreateDataTexture = function(size, width) {
            if (void 0 === size) {
                /** @type {number} */
                size = 4;
            }
            if (void 0 === width) {
                /** @type {number} */
                width = 4;
            }
            /** @type {number} */
            var calculated_mac = size * width * 3;
            /** @type {!Uint8Array} */
            var a = new Uint8Array(calculated_mac);
            var texture = new THREE.DataTexture(a, size, width, THREE.RGBFormat);
            return texture.needsUpdate = true, texture;
        };
        module.exports = console;
    }, {}],
    5 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {!Object} options
         * @return {undefined}
         */
        var $ = function(options) {
            options = _.extend({}, {
                duration : 1E3,
                repeat : false,
                onStart : function() {
                },
                onEnd : function() {
                }
            }, options);
            this.duration = options.duration;
            this.repeat = options.repeat;
            this.startCallback = options.onStart;
            this.endCallback = options.onEnd;
            this.reset();
        };
        $.inherit(Object, {
            reset : function() {
                return this.started = false, this.paused = false, this.ended = false, this.elapsedTime = 0, this;
            },
            start : function() {
                return this.started || this.ended ? this : (this.started = true, this.startCallback(), this);
            },
            stop : function() {
                return this.started ? this.reset() : this;
            },
            pause : function() {
                return this.paused = true, this;
            },
            resume : function() {
                return this.paused = false, this;
            },
            update : function(prop) {
                return !this.started || this.paused || this.ended ? this : (this.elapsedTime += 1E3 * prop.delta, this.elapsedTime > this.duration && (this.endCallback(), this.ended = true), this);
            }
        });
        /** @type {function(!Object): undefined} */
        module.exports = $;
    }, {}],
    6 : [function(require, module, n) {
        var TimeoutError = require("5");
        var self = {
            _timers : {}
        };
        /**
         * @param {?} timeout
         * @return {?}
         */
        self.createTimer = function(timeout) {
            var i = _.uniqueId("timer_");
            var e = new TimeoutError(timeout);
            return e.id = i, self._timers[i] = e, e;
        };
        /**
         * @param {!Function} dt
         * @param {!Function} n
         * @param {?} o
         * @return {?}
         */
        self.delay = function(dt, n, o) {
            var m = self.createTimer({
                duration : dt,
                onEnd : function() {
                    n.call(o);
                    delete self._timers[this.id];
                }
            }).start();
            return m;
        };
        /**
         * @param {undefined} object
         * @return {undefined}
         */
        self.updateTimers = function(object) {
            _.each(self._timers, function(e) {
                e.update(object);
            });
        };
        /**
         * @return {undefined}
         */
        self.clearTimers = function() {
            _.each(self._timers, function(options) {
                /** @type {null} */
                options.onEnd = null;
            });
            self._timers = {};
        };
        module.exports = self;
    }, {
        5 : 5
    }],
    7 : [function(canCreateDiscussions, mixin, n) {
        !function() {
            /**
             * @param {!Object} object
             * @return {undefined}
             */
            function OrbitConstraint(object) {
                /** @type {!Object} */
                this.object = object;
                this.target = new THREE.Vector3;
                /** @type {number} */
                this.minDistance = 0;
                /** @type {number} */
                this.maxDistance = 1 / 0;
                /** @type {number} */
                this.minZoom = 0;
                /** @type {number} */
                this.maxZoom = 1 / 0;
                /** @type {number} */
                this.minPolarAngle = 0;
                /** @type {number} */
                this.maxPolarAngle = Math.PI;
                /** @type {number} */
                this.minAzimuthAngle = -(1 / 0);
                /** @type {number} */
                this.maxAzimuthAngle = 1 / 0;
                /** @type {boolean} */
                this.enableDamping = false;
                /** @type {number} */
                this.dampingFactor = .25;
                var theta;
                var phi;
                var scope = this;
                /** @type {number} */
                var EPS = 1E-6;
                /** @type {number} */
                var phiDelta = 0;
                /** @type {number} */
                var thetaDelta = 0;
                /** @type {number} */
                var scale = 1;
                var view = new THREE.Vector3;
                /** @type {boolean} */
                var zoomChanged = false;
                /**
                 * @return {?}
                 */
                this.getPolarAngle = function() {
                    return phi;
                };
                /**
                 * @return {?}
                 */
                this.getAzimuthalAngle = function() {
                    return theta;
                };
                /**
                 * @param {number} angle
                 * @return {undefined}
                 */
                this.rotateLeft = function(angle) {
                    /** @type {number} */
                    thetaDelta = thetaDelta - angle;
                };
                /**
                 * @param {number} angle
                 * @return {undefined}
                 */
                this.rotateUp = function(angle) {
                    /** @type {number} */
                    phiDelta = phiDelta - angle;
                };
                this.panLeft = function() {
                    var t = new THREE.Vector3;
                    return function(size) {
                        var values = this.object.matrix.elements;
                        t.set(values[0], values[1], values[2]);
                        t.multiplyScalar(-size);
                        view.add(t);
                    };
                }();
                this.panUp = function() {
                    var t = new THREE.Vector3;
                    return function(u) {
                        var values = this.object.matrix.elements;
                        t.set(values[4], values[5], values[6]);
                        t.multiplyScalar(u);
                        view.add(t);
                    };
                }();
                /**
                 * @param {number} deltaX
                 * @param {number} deltaY
                 * @param {number} screenWidth
                 * @param {number} screenHeight
                 * @return {undefined}
                 */
                this.pan = function(deltaX, deltaY, screenWidth, screenHeight) {
                    if (scope.object instanceof THREE.PerspectiveCamera) {
                        var oldPosition = scope.object.position;
                        var expRecords = oldPosition.clone().sub(scope.target);
                        var targetDistance = expRecords.length();
                        /** @type {number} */
                        targetDistance = targetDistance * Math.tan(scope.object.fov / 2 * Math.PI / 180);
                        scope.panLeft(2 * deltaX * targetDistance / screenHeight);
                        scope.panUp(2 * deltaY * targetDistance / screenHeight);
                    } else {
                        if (scope.object instanceof THREE.OrthographicCamera) {
                            scope.panLeft(deltaX * (scope.object.right - scope.object.left) / screenWidth);
                            scope.panUp(deltaY * (scope.object.top - scope.object.bottom) / screenHeight);
                        } else {
                            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
                        }
                    }
                };
                /**
                 * @param {?} dollyScale
                 * @return {undefined}
                 */
                this.dollyIn = function(dollyScale) {
                    if (scope.object instanceof THREE.PerspectiveCamera) {
                        /** @type {number} */
                        scale = scale / dollyScale;
                    } else {
                        if (scope.object instanceof THREE.OrthographicCamera) {
                            /** @type {number} */
                            scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale));
                            scope.object.updateProjectionMatrix();
                            /** @type {boolean} */
                            zoomChanged = true;
                        } else {
                            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
                        }
                    }
                };
                /**
                 * @param {?} dollyScale
                 * @return {undefined}
                 */
                this.dollyOut = function(dollyScale) {
                    if (scope.object instanceof THREE.PerspectiveCamera) {
                        /** @type {number} */
                        scale = scale * dollyScale;
                    } else {
                        if (scope.object instanceof THREE.OrthographicCamera) {
                            /** @type {number} */
                            scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale));
                            scope.object.updateProjectionMatrix();
                            /** @type {boolean} */
                            zoomChanged = true;
                        } else {
                            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
                        }
                    }
                };
                this.update = function() {
                    var offset = new THREE.Vector3;
                    var quat = (new THREE.Quaternion).setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
                    var quatInverse = quat.clone().inverse();
                    var lastPosition = new THREE.Vector3;
                    var lastQuaternion = new THREE.Quaternion;
                    return function() {
                        var position = this.object.position;
                        offset.copy(position).sub(this.target);
                        offset.applyQuaternion(quat);
                        /** @type {number} */
                        theta = Math.atan2(offset.x, offset.z);
                        /** @type {number} */
                        phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);
                        theta = theta + thetaDelta;
                        phi = phi + phiDelta;
                        /** @type {number} */
                        this.object.theta = theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, theta));
                        /** @type {number} */
                        phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));
                        /** @type {number} */
                        this.object.phi = phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));
                        /** @type {number} */
                        var radius = offset.length() * scale;
                        return radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius)), this.target.add(view), offset.x = radius * Math.sin(phi) * Math.sin(theta), offset.y = radius * Math.cos(phi), offset.z = radius * Math.sin(phi) * Math.cos(theta), offset.applyQuaternion(quatInverse), position.copy(this.target).add(offset), this.object.lookAt(this.target), this.enableDamping === true ? (thetaDelta = thetaDelta * (1 - this.dampingFactor), phiDelta = phiDelta * (1 - this.dampingFactor)) : (thetaDelta =
                            0, phiDelta = 0), scale = 1, view.set(0, 0, 0), !!(zoomChanged || lastPosition.distanceToSquared(this.object.position) > EPS || 8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS) && (lastPosition.copy(this.object.position), lastQuaternion.copy(this.object.quaternion), zoomChanged = false, true);
                    };
                }();
            }
            /**
             * @param {!Event} event
             * @return {?}
             */
            function withinClickDistance(event) {
                /** @type {boolean} */
                var e = event.clientX == end && event.clientY == begin;
                return end = event.clientX, begin = event.clientY, e;
            }
            var end;
            var begin;
            /**
             * @param {!Function} object
             * @param {!Object} options
             * @return {undefined}
             */
            var OrbitControls = function(object, options) {
                /**
                 * @param {number} deltaX
                 * @param {number} deltaY
                 * @return {undefined}
                 */
                function pan(deltaX, deltaY) {
                    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
                    constraint.pan(deltaX, deltaY, element.clientWidth, element.clientHeight);
                }
                /**
                 * @return {?}
                 */
                function getAutoRotationAngle() {
                    return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
                }
                /**
                 * @return {?}
                 */
                function getZoomScale() {
                    return Math.pow(.95, scope.zoomSpeed);
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function onMouseDown(event) {
                    if (scope.enabled !== false) {
                        if (end = event.clientX, begin = event.clientY, event.preventDefault(), event.button === scope.mouseButtons.ORBIT) {
                            if (scope.enableRotate === false) {
                                return;
                            }
                            /** @type {number} */
                            state = STATE.ROTATE;
                            rotateStart.set(event.clientX, event.clientY);
                        } else {
                            if (event.button === scope.mouseButtons.ZOOM) {
                                if (scope.enableZoom === false) {
                                    return;
                                }
                                /** @type {number} */
                                state = STATE.DOLLY;
                                b.set(event.clientX, event.clientY);
                            } else {
                                if (event.button === scope.mouseButtons.PAN) {
                                    if (scope.enablePan === false) {
                                        return;
                                    }
                                    /** @type {number} */
                                    state = STATE.PAN;
                                    panStart.set(event.clientX, event.clientY);
                                }
                            }
                        }
                        if (state !== STATE.NONE) {
                            document.addEventListener("mousemove", onMouseMove, false);
                            document.addEventListener("mouseup", onMouseUp, false);
                            scope.dispatchEvent(objectChangeEvent);
                        }
                        scope.onMouseDown();
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function onMouseMove(event) {
                    if (scope.enabled !== false && !withinClickDistance(event)) {
                        event.preventDefault();
                        var htmlElt = scope.domElement === document ? scope.domElement.body : scope.domElement;
                        if (state === STATE.ROTATE) {
                            if (scope.enableRotate === false) {
                                return;
                            }
                            /** @type {boolean} */
                            scope.isRotating = true;
                            rotateEnd.set(event.clientX, event.clientY);
                            rotateDelta.subVectors(rotateEnd, rotateStart);
                            constraint.rotateLeft(2 * Math.PI * rotateDelta.x / htmlElt.clientWidth * scope.rotateSpeed);
                            constraint.rotateUp(2 * Math.PI * rotateDelta.y / htmlElt.clientHeight * scope.rotateSpeed);
                            rotateStart.copy(rotateEnd);
                        } else {
                            if (state === STATE.DOLLY) {
                                if (scope.enableZoom === false) {
                                    return;
                                }
                                target.set(event.clientX, event.clientY);
                                result.subVectors(target, b);
                                if (result.y > 0) {
                                    constraint.dollyIn(getZoomScale());
                                } else {
                                    if (result.y < 0) {
                                        constraint.dollyOut(getZoomScale());
                                    }
                                }
                                b.copy(target);
                            } else {
                                if (state === STATE.PAN) {
                                    if (scope.enablePan === false) {
                                        return;
                                    }
                                    panEnd.set(event.clientX, event.clientY);
                                    panDelta.subVectors(panEnd, panStart);
                                    pan(panDelta.x, panDelta.y);
                                    panStart.copy(panEnd);
                                }
                            }
                        }
                        if (state !== STATE.NONE) {
                            scope.update();
                        }
                        scope.onMouseMove();
                    }
                }
                /**
                 * @return {undefined}
                 */
                function onMouseUp() {
                    if (scope.enabled !== false) {
                        document.removeEventListener("mousemove", onMouseMove, false);
                        document.removeEventListener("mouseup", onMouseUp, false);
                        scope.dispatchEvent(fooEvent);
                        /** @type {number} */
                        state = STATE.NONE;
                        /** @type {boolean} */
                        scope.isRotating = false;
                        scope.onMouseUp();
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function onMouseWheel(event) {
                    if (scope.enabled !== false && scope.enableZoom !== false && state === STATE.NONE) {
                        event.preventDefault();
                        event.stopPropagation();
                        /** @type {number} */
                        var delta = 0;
                        if (void 0 !== event.wheelDelta) {
                            delta = event.wheelDelta;
                        } else {
                            if (void 0 !== event.detail) {
                                /** @type {number} */
                                delta = -event.detail;
                            }
                        }
                        if (delta > 0) {
                            constraint.dollyOut(getZoomScale());
                        } else {
                            if (delta < 0) {
                                constraint.dollyIn(getZoomScale());
                            }
                        }
                        scope.update();
                        scope.dispatchEvent(objectChangeEvent);
                        scope.dispatchEvent(fooEvent);
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function onKeyDown(event) {
                    if (scope.enabled !== false && scope.enableKeys !== false && scope.enablePan !== false) {
                        switch(event.keyCode) {
                            case scope.keys.UP:
                                pan(0, scope.keyPanSpeed);
                                scope.update();
                                break;
                            case scope.keys.BOTTOM:
                                pan(0, -scope.keyPanSpeed);
                                scope.update();
                                break;
                            case scope.keys.LEFT:
                                pan(scope.keyPanSpeed, 0);
                                scope.update();
                                break;
                            case scope.keys.RIGHT:
                                pan(-scope.keyPanSpeed, 0);
                                scope.update();
                        }
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function touchstart(event) {
                    if (scope.enabled !== false) {
                        switch(event.touches.length) {
                            case 1:
                                if (scope.enableRotate === false) {
                                    return;
                                }
                                /** @type {number} */
                                state = STATE.TOUCH_ROTATE;
                                rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
                                break;
                            case 2:
                                if (scope.enableZoom === false) {
                                    return;
                                }
                                /** @type {number} */
                                state = STATE.TOUCH_DOLLY;
                                /** @type {number} */
                                var lightI = event.touches[0].pageX - event.touches[1].pageX;
                                /** @type {number} */
                                var lightJ = event.touches[0].pageY - event.touches[1].pageY;
                                /** @type {number} */
                                var cos = Math.sqrt(lightI * lightI + lightJ * lightJ);
                                b.set(0, cos);
                                break;
                            case 3:
                                if (scope.enablePan === false) {
                                    return;
                                }
                                /** @type {number} */
                                state = STATE.TOUCH_PAN;
                                panStart.set(event.touches[0].pageX, event.touches[0].pageY);
                                break;
                            default:
                                /** @type {number} */
                                state = STATE.NONE;
                        }
                        if (state !== STATE.NONE) {
                            scope.dispatchEvent(objectChangeEvent);
                        }
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function touchmove(event) {
                    if (scope.enabled !== false) {
                        event.preventDefault();
                        event.stopPropagation();
                        var htmlElt = scope.domElement === document ? scope.domElement.body : scope.domElement;
                        switch(event.touches.length) {
                            case 1:
                                if (scope.enableRotate === false) {
                                    return;
                                }
                                if (state !== STATE.TOUCH_ROTATE) {
                                    return;
                                }
                                /** @type {boolean} */
                                scope.isRotating = true;
                                rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                                rotateDelta.subVectors(rotateEnd, rotateStart);
                                constraint.rotateLeft(2 * Math.PI * rotateDelta.x / htmlElt.clientWidth * scope.rotateSpeed);
                                constraint.rotateUp(2 * Math.PI * rotateDelta.y / htmlElt.clientHeight * scope.rotateSpeed);
                                rotateStart.copy(rotateEnd);
                                scope.update();
                                break;
                            case 2:
                                if (scope.enableZoom === false) {
                                    return;
                                }
                                if (state !== STATE.TOUCH_DOLLY) {
                                    return;
                                }
                                /** @type {number} */
                                var lightI = event.touches[0].pageX - event.touches[1].pageX;
                                /** @type {number} */
                                var lightJ = event.touches[0].pageY - event.touches[1].pageY;
                                /** @type {number} */
                                var y = Math.sqrt(lightI * lightI + lightJ * lightJ);
                                target.set(0, y);
                                result.subVectors(target, b);
                                if (result.y > 0) {
                                    constraint.dollyOut(getZoomScale());
                                } else {
                                    if (result.y < 0) {
                                        constraint.dollyIn(getZoomScale());
                                    }
                                }
                                b.copy(target);
                                scope.update();
                                break;
                            case 3:
                                if (scope.enablePan === false) {
                                    return;
                                }
                                if (state !== STATE.TOUCH_PAN) {
                                    return;
                                }
                                panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                                panDelta.subVectors(panEnd, panStart);
                                pan(panDelta.x, panDelta.y);
                                panStart.copy(panEnd);
                                scope.update();
                                break;
                            default:
                                /** @type {number} */
                                state = STATE.NONE;
                        }
                    }
                }
                /**
                 * @return {undefined}
                 */
                function touchend() {
                    if (scope.enabled !== false) {
                        scope.dispatchEvent(fooEvent);
                        /** @type {number} */
                        state = STATE.NONE;
                        /** @type {boolean} */
                        scope.isRotating = false;
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function contextmenu(event) {
                    event.preventDefault();
                }
                var constraint = new OrbitConstraint(object);
                this.domElement = void 0 !== options ? options : document;
                Object.defineProperty(this, "constraint", {
                    get : function() {
                        return constraint;
                    }
                });
                /**
                 * @return {?}
                 */
                this.getPolarAngle = function() {
                    return constraint.getPolarAngle();
                };
                /**
                 * @return {?}
                 */
                this.getAzimuthalAngle = function() {
                    return constraint.getAzimuthalAngle();
                };
                /** @type {boolean} */
                this.enabled = true;
                this.center = this.target;
                /** @type {boolean} */
                this.enableZoom = true;
                /** @type {number} */
                this.zoomSpeed = 1;
                /** @type {boolean} */
                this.enableRotate = true;
                /** @type {number} */
                this.rotateSpeed = 1;
                /** @type {boolean} */
                this.enablePan = true;
                /** @type {number} */
                this.keyPanSpeed = 7;
                /** @type {boolean} */
                this.autoRotate = false;
                /** @type {number} */
                this.autoRotateSpeed = 2;
                /** @type {boolean} */
                this.enableKeys = true;
                this.keys = {
                    LEFT : 37,
                    UP : 38,
                    RIGHT : 39,
                    BOTTOM : 40
                };
                this.mouseButtons = {
                    ORBIT : THREE.MOUSE.LEFT,
                    ZOOM : THREE.MOUSE.MIDDLE,
                    PAN : THREE.MOUSE.RIGHT
                };
                var scope = this;
                var rotateStart = new THREE.Vector2;
                var rotateEnd = new THREE.Vector2;
                var rotateDelta = new THREE.Vector2;
                var panStart = new THREE.Vector2;
                var panEnd = new THREE.Vector2;
                var panDelta = new THREE.Vector2;
                var b = new THREE.Vector2;
                var target = new THREE.Vector2;
                var result = new THREE.Vector2;
                var STATE = {
                    NONE : -1,
                    ROTATE : 0,
                    DOLLY : 1,
                    PAN : 2,
                    TOUCH_ROTATE : 3,
                    TOUCH_DOLLY : 4,
                    TOUCH_PAN : 5
                };
                /** @type {number} */
                var state = STATE.NONE;
                this.target0 = this.target.clone();
                this.position0 = this.object.position.clone();
                this.zoom0 = this.object.zoom;
                var modelChangedEvent = {
                    type : "change"
                };
                var objectChangeEvent = {
                    type : "start"
                };
                var fooEvent = {
                    type : "end"
                };
                /**
                 * @return {undefined}
                 */
                this.update = function() {
                    if (this.autoRotate && state === STATE.NONE) {
                        constraint.rotateLeft(getAutoRotationAngle());
                    }
                    if (constraint.update() === true) {
                        this.dispatchEvent(modelChangedEvent);
                    }
                };
                /**
                 * @return {undefined}
                 */
                this.reset = function() {
                    /** @type {number} */
                    state = STATE.NONE;
                    this.target.copy(this.target0);
                    this.object.position.copy(this.position0);
                    this.object.zoom = this.zoom0;
                    this.object.updateProjectionMatrix();
                    this.dispatchEvent(modelChangedEvent);
                    this.update();
                };
                /**
                 * @return {undefined}
                 */
                this.dispose = function() {
                    this.domElement.removeEventListener("contextmenu", contextmenu, false);
                    this.domElement.removeEventListener("mousedown", onMouseDown, false);
                    this.domElement.removeEventListener("mousewheel", onMouseWheel, false);
                    this.domElement.removeEventListener("MozMousePixelScroll", onMouseWheel, false);
                    this.domElement.removeEventListener("touchstart", touchstart, false);
                    this.domElement.removeEventListener("touchend", touchend, false);
                    this.domElement.removeEventListener("touchmove", touchmove, false);
                    document.removeEventListener("mousemove", onMouseMove, false);
                    document.removeEventListener("mouseup", onMouseUp, false);
                    window.removeEventListener("keydown", onKeyDown, false);
                };
                this.domElement.addEventListener("contextmenu", contextmenu, false);
                this.domElement.addEventListener("mousedown", onMouseDown, false);
                this.domElement.addEventListener("mousewheel", onMouseWheel, false);
                this.domElement.addEventListener("MozMousePixelScroll", onMouseWheel, false);
                this.domElement.addEventListener("touchstart", touchstart, false);
                this.domElement.addEventListener("touchend", touchend, false);
                this.domElement.addEventListener("touchmove", touchmove, false);
                window.addEventListener("keydown", onKeyDown, false);
                this.update();
            };
            /** @type {!Object} */
            OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
            /** @type {function(!Function, !Object): undefined} */
            OrbitControls.prototype.constructor = OrbitControls;
            /**
             * @return {undefined}
             */
            OrbitControls.prototype.onMouseDown = function() {
            };
            /**
             * @return {undefined}
             */
            OrbitControls.prototype.onMouseMove = function() {
            };
            /**
             * @return {undefined}
             */
            OrbitControls.prototype.onMouseUp = function() {
            };
            Object.defineProperties(OrbitControls.prototype, {
                object : {
                    get : function() {
                        return this.constraint.object;
                    }
                },
                target : {
                    get : function() {
                        return this.constraint.target;
                    },
                    set : function(result) {
                        console.warn("OrbitControls: target is now immutable. Use target.set() instead.");
                        this.constraint.target.copy(result);
                    }
                },
                minDistance : {
                    get : function() {
                        return this.constraint.minDistance;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.minDistance = value;
                    }
                },
                maxDistance : {
                    get : function() {
                        return this.constraint.maxDistance;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.maxDistance = value;
                    }
                },
                minZoom : {
                    get : function() {
                        return this.constraint.minZoom;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.minZoom = value;
                    }
                },
                maxZoom : {
                    get : function() {
                        return this.constraint.maxZoom;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.maxZoom = value;
                    }
                },
                minPolarAngle : {
                    get : function() {
                        return this.constraint.minPolarAngle;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.minPolarAngle = value;
                    }
                },
                maxPolarAngle : {
                    get : function() {
                        return this.constraint.maxPolarAngle;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.maxPolarAngle = value;
                    }
                },
                minAzimuthAngle : {
                    get : function() {
                        return this.constraint.minAzimuthAngle;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.minAzimuthAngle = value;
                    }
                },
                maxAzimuthAngle : {
                    get : function() {
                        return this.constraint.maxAzimuthAngle;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.maxAzimuthAngle = value;
                    }
                },
                enableDamping : {
                    get : function() {
                        return this.constraint.enableDamping;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.enableDamping = value;
                    }
                },
                dampingFactor : {
                    get : function() {
                        return this.constraint.dampingFactor;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.dampingFactor = value;
                    }
                },
                noZoom : {
                    get : function() {
                        return console.warn("OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."), !this.enableZoom;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.");
                        /** @type {boolean} */
                        this.enableZoom = !value;
                    }
                },
                noRotate : {
                    get : function() {
                        return console.warn("OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."), !this.enableRotate;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.");
                        /** @type {boolean} */
                        this.enableRotate = !value;
                    }
                },
                noPan : {
                    get : function() {
                        return console.warn("OrbitControls: .noPan has been deprecated. Use .enablePan instead."), !this.enablePan;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .noPan has been deprecated. Use .enablePan instead.");
                        /** @type {boolean} */
                        this.enablePan = !value;
                    }
                },
                noKeys : {
                    get : function() {
                        return console.warn("OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."), !this.enableKeys;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.");
                        /** @type {boolean} */
                        this.enableKeys = !value;
                    }
                },
                staticMoving : {
                    get : function() {
                        return console.warn("OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."), !this.constraint.enableDamping;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.");
                        /** @type {boolean} */
                        this.constraint.enableDamping = !value;
                    }
                },
                dynamicDampingFactor : {
                    get : function() {
                        return console.warn("OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."), this.constraint.dampingFactor;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.");
                        /** @type {number} */
                        this.constraint.dampingFactor = value;
                    }
                }
            });
            /** @type {function(!Function, !Object): undefined} */
            mixin.exports = OrbitControls;
        }();
    }, {}],
    9 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {number} t
         * @param {?} data
         * @param {?} array
         * @return {undefined}
         */
        function findErrorByList(t, data, array) {
            /** @type {number} */
            var d = t * t;
            /** @type {number} */
            var x = 2 * t * t;
            /** @type {number} */
            var index = 3 * t * t;
            /** @type {number} */
            var item = 0;
            /** @type {number} */
            var i = 0;
            for (; i < d; i++) {
                array[item++] = data[i];
                array[item++] = data[i + d];
                array[item++] = data[i + x];
                array[item++] = data[i + index];
            }
        }
        /**
         * @param {number} options
         * @param {boolean} value
         * @param {string} manager
         * @return {undefined}
         */
        var MTLLoader = function(options, value, manager) {
            this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
            /** @type {number} */
            this._size = options;
            /** @type {boolean} */
            this._interleaved = value;
        };
        /** @type {!Object} */
        MTLLoader.prototype = Object.create(THREE.CompressedTextureLoader.prototype);
        /**
         * @param {!ArrayBuffer} buffer
         * @return {?}
         */
        MTLLoader.prototype._parser = function(buffer) {
            /** @type {!Array} */
            var e = [];
            /** @type {number} */
            var order = Math.log2(this._size);
            /** @type {number} */
            var dataOffset = 0;
            /** @type {number} */
            var i = 0;
            for (; i <= order; i++) {
                /** @type {number} */
                var r = Math.pow(2, order - i);
                /** @type {number} */
                var dataLength = r * r * 4;
                if (dataOffset >= buffer.byteLength) {
                    break;
                }
                /** @type {number} */
                var startKey = 0;
                for (; startKey < 6; startKey++) {
                    if (e[startKey] || (e[startKey] = []), this._interleaved) {
                        /** @type {!Uint8Array} */
                        var srcBuffer = new Uint8Array(buffer, dataOffset, dataLength);
                        /** @type {!Uint8Array} */
                        var byteArray = new Uint8Array(dataLength);
                        findErrorByList(r, srcBuffer, byteArray);
                    } else {
                        /** @type {!Uint8Array} */
                        byteArray = new Uint8Array(buffer, dataOffset, dataLength);
                    }
                    e[startKey].push({
                        data : byteArray,
                        width : r,
                        height : r
                    });
                    /** @type {number} */
                    dataOffset = dataOffset + dataLength;
                }
            }
            return {
                isCubemap : true,
                mipmaps : _.flatten(e),
                mipmapCount : order + 1,
                width : this._size,
                height : this._size,
                format : THREE.RGBAFormat,
                minFilter : THREE.LinearMipMapLinearFilter,
                magFilter : THREE.LinearFilter,
                wrapS : THREE.ClampToEdgeWrapping,
                wrapT : THREE.ClampToEdgeWrapping,
                type : THREE.UnsignedByteType
            };
        };
        /** @type {function(number): number} */
        Math.log2 = Math.log2 || function(score) {
            return Math.log(score) * Math.LOG2E;
        };
        /** @type {function(number, boolean, string): undefined} */
        module.exports = MTLLoader;
    }, {}],
    10 : [function(canCreateDiscussions, m, n) {
        /**
         * @param {string} data
         * @return {undefined}
         */
        var load = function(data) {
            THREE.XHRLoader.call(this);
            this.setResponseType("arraybuffer");
            this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
        };
        /** @type {!Object} */
        load.prototype = Object.create(THREE.XHRLoader.prototype);
        /** @type {function(string): undefined} */
        m.exports = load;
    }, {}],
    11 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {number} t
         * @param {?} data
         * @param {!Object} obj
         * @return {undefined}
         */
        function normalize(t, data, obj) {
            /** @type {number} */
            var d = t * t;
            /** @type {number} */
            var index = 2 * t * t;
            /** @type {number} */
            var x = 3 * t * t;
            /** @type {number} */
            var objCursor = 0;
            /** @type {number} */
            var i = 0;
            for (; i < d; i++) {
                obj[objCursor++] = data[i];
                obj[objCursor++] = data[i + d];
                obj[objCursor++] = data[i + index];
                obj[objCursor++] = data[i + x];
            }
        }
        /**
         * @param {number} value
         * @param {!Object} options
         * @param {string} manager
         * @return {undefined}
         */
        var MTLLoader = function(value, options, manager) {
            this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
            /** @type {number} */
            this._size = value;
            /** @type {!Object} */
            this._interleaving = options;
        };
        /** @type {!Object} */
        MTLLoader.prototype = Object.create(THREE.BinaryTextureLoader.prototype);
        /**
         * @param {?} size
         * @return {?}
         */
        MTLLoader.prototype._parser = function(size) {
            var result;
            var r = this._size;
            if (this._interleaving) {
                /** @type {number} */
                var outputByteCount = r * r * 4;
                /** @type {!Uint8Array} */
                var out = new Uint8Array(size);
                /** @type {!Uint8Array} */
                result = new Uint8Array(outputByteCount);
                normalize(r, out, result);
            } else {
                /** @type {!Uint8Array} */
                result = new Uint8Array(size);
            }
            return {
                width : r,
                height : r,
                data : result,
                format : THREE.RGBAFormat,
                minFilter : THREE.LinearFilter,
                magFilter : THREE.LinearFilter,
                wrapS : THREE.ClampToEdgeWrapping,
                wrapT : THREE.ClampToEdgeWrapping,
                type : THREE.UnsignedByteType
            };
        };
        /** @type {function(number, !Object, string): undefined} */
        module.exports = MTLLoader;
    }, {}],
    12 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {!Array} tests
         * @return {?}
         */
        function r(tests) {
            var delta = tests.slice(0, 27);
            /** @type {number} */
            var a = 1 / (2 * Math.sqrt(Math.PI));
            /** @type {number} */
            var e = -(.5 * Math.sqrt(3 / Math.PI));
            /** @type {number} */
            var i = -e;
            /** @type {number} */
            var abcd = e;
            /** @type {number} */
            var knobHalf = .5 * Math.sqrt(15 / Math.PI);
            /** @type {number} */
            var currentRelations = -knobHalf;
            /** @type {number} */
            var c = .25 * Math.sqrt(5 / Math.PI);
            /** @type {number} */
            var addedRelations = currentRelations;
            /** @type {number} */
            var l = .25 * Math.sqrt(15 / Math.PI);
            /** @type {!Array} */
            var array = [a, a, a, e, e, e, i, i, i, abcd, abcd, abcd, knobHalf, knobHalf, knobHalf, currentRelations, currentRelations, currentRelations, c, c, c, addedRelations, addedRelations, addedRelations, l, l, l];
            return array.map(function(position, i) {
                return position * delta[i];
            });
        }
        /**
         * @param {string} data
         * @return {undefined}
         */
        var DataFrameReader = function(data) {
            THREE.XHRLoader.call(this);
            this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
        };
        /** @type {!Object} */
        DataFrameReader.prototype = Object.create(THREE.XHRLoader.prototype);
        /**
         * @param {string} f
         * @param {!Function} m
         * @param {!Function} data
         * @param {!Function} xhr
         * @return {undefined}
         */
        DataFrameReader.prototype.load = function(f, m, data, xhr) {
            THREE.XHRLoader.prototype.load.call(this, f, function(dir) {
                /** @type {*} */
                var n = JSON.parse(dir);
                var x = r(n);
                m(x);
            }, data, xhr);
        };
        /** @type {function(string): undefined} */
        module.exports = DataFrameReader;
    }, {}],
    13 : [function($, canCreateDiscussions, n) {
        var data = $("22");
        var images = $("20");
        /** @type {function(!Object): ?} */
        var RandomBaseTimeSeriesDataModel = (THREE.MaterialLoader.prototype.parse);
        /** @type {null} */
        var shaders = null;
        /**
         * @param {!Object} trackInfoUrl
         * @return {undefined}
         */
        THREE.MaterialLoader.setShaders = function(trackInfoUrl) {
            /** @type {!Object} */
            shaders = trackInfoUrl;
        };
        /**
         * @param {!Object} options
         * @return {?}
         */
        THREE.MaterialLoader.prototype.parse = function(options) {
            var json = RandomBaseTimeSeriesDataModel.call(this, options);
            if (options.customType && "MatcapMaterial" === options.customType) {
                return images.create({
                    uuid : options.uuid,
                    name : options.name,
                    normalMap : json.normalMap,
                    matcapMap : THREE.ImageUtils.loadTexture("textures/matcap.jpg"),
                    normalMapFactor : 1
                });
            }
            if (options.customType && "PBRMaterial" === options.customType) {
                var n = options.metalGlossMap ? this.getTexture(options.metalGlossMap) : null;
                var s = options.map2 ? this.getTexture(options.map2) : null;
                var c = options.normalMap2 ? this.getTexture(options.normalMap2) : null;
                var u = options.aoMap2 ? this.getTexture(options.aoMap2) : null;
                var l = options.lightMapM ? this.getTexture(options.lightMapM) : null;
                var f = options.lightMapDir ? this.getTexture(options.lightMapDir) : null;
                var materialEmissiveMapRow = options.emissiveMap ? this.getTexture(options.emissiveMap) : null;
                var p = options.packedPBRMap ? this.getTexture(options.packedPBRMap) : null;
                return data.create({
                    vertexShader : shaders["pbr.vs"],
                    fragmentShader : shaders["pbr.fs"],
                    uuid : options.uuid,
                    name : options.name,
                    color : options.color,
                    opacity : json.opacity,
                    transparent : json.transparent,
                    alphaTest : json.alphaTest,
                    environment : options.environment,
                    exposure : options.exposure,
                    albedoMap : json.map,
                    albedoMap2 : s,
                    metalGlossMap : n,
                    packedMap : p,
                    metalFactor : options.metalFactor,
                    glossFactor : options.glossFactor,
                    normalMapFactor : options.normalFactor,
                    normalMap : json.normalMap,
                    normalMap2 : c,
                    lightMap : json.lightMap,
                    lightMapM : l,
                    lightMapDir : f,
                    aoMap : json.aoMap,
                    aoMap2 : u,
                    aoFactor : options.aoFactor,
                    occludeSpecular : options.occludeSpecular,
                    emissiveMap : materialEmissiveMapRow
                });
            }
            if ("SkyboxMaterial" === options.customType) {
                var shader = THREE.ShaderLib.cube;
                json.vertexShader = shaders["skybox.vs"];
                json.fragmentShader = shaders["skybox.fs"];
                json.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
                json.uniforms.tCube.value = this.getTexture(options.cubemap);
            }
            return json;
        };
    }, {
        15 : 15,
        20 : 20,
        21 : 21,
        22 : 22
    }],
    14 : [function(require, module, n) {
        require("24")
        var r = Promise;
        var $ = require("15");
        /**
         * @param {!Object} obj
         * @return {undefined}
         */
        var Renderer = function(obj) {
            if (obj.manager) {
                this.manager = obj.manager;
            }
            if (obj.cubemaps) {
                this.cubemaps = obj.cubemaps;
            }
            if (obj.sh) {
                this.sh = obj.sh;
            }
            if (obj.textures) {
                this.textures = obj.textures;
            }
            if (obj.panoramas) {
                this.panoramas = obj.panoramas;
            }
            if (obj.geometries) {
                this.geometries = obj.geometries;
            }
        };
        /**
         * @return {?}
         */
        Renderer.prototype.load = function() {
            var params = {};
            return this.cubemaps && (params.cubemap = $.loadSpecularCubemaps(this.cubemaps)), this.panoramas && (params.panorama = $.loadPanoramas(this.panoramas)), this.sh && (params.sh = $.loadSH(this.sh)), this.textures && (params.texture = $.loadTextures(this.textures, "")), this.geometries && (params.geometry = $.loadGeometries(this.geometries)), r.props(params);
        };
        /** @type {function(!Object): undefined} */
        module.exports = Renderer;
    }, {
        15 : 15,
        24 : 24
    }],
    15 : [function(_dereq_, module, n) {
        /**
         * @param {!Object} tree
         * @param {!Object} event
         * @return {?}
         */
        function normalize(tree, event) {
            return {
                _cache : event || {},
                load : function(f, m, callback, options, path) {
                    var cache = this._cache;
                    if (_.has(cache, path)) {
                        resolve(cache[path]);
                    } else {
                        tree.load(f, function(tmpl) {
                            cache[path] = tmpl;
                            m.apply(this, arguments);
                        }, callback, options);
                    }
                },
                get : function(path) {
                    return _.has(this._cache, path) || console.error("Resource not found: " + path), this._cache[path];
                }
            };
        }
        /**
         * @param {?} selector
         * @param {?} name
         * @param {?} close
         * @param {!Function} callback
         * @return {?}
         */
        function exec(selector, name, close, callback) {
            return _.isArray(selector) || (selector = [selector]), $.all(_.map(selector, function(ext) {
                if (callback) {
                    return callback(require(name, ext), ext, close);
                }
            }));
        }
        /**
         * @param {string} url
         * @param {string} name
         * @param {!Object} type
         * @return {?}
         */
        function load(url, name, type) {
            return new $(function(i, stepCallback) {
                type.load(url, function(t) {
                    /** @type {string} */
                    t.filename = name;
                    i(arguments.length > 1 ? _.toArray(arguments) : t);
                }, function() {
                }, function() {
                    stepCallback(new Error("Resource was not found: " + url));
                }, name);
            });
        }
        /**
         * @param {!Array} c
         * @param {?} b
         * @param {?} a
         * @return {?}
         */
        function fn(c, b, a) {
            return c = c || [], exec(c, b, a, load);
        }
        var $ = Promise;
        var require = _dereq_("29");
        var ImageLoader = _dereq_("16");
        var Big = _dereq_("11");
        var List = _dereq_("9");
        var Type = _dereq_("12");
        var Connection = _dereq_("10");
        var manager = new THREE.LoadingManager;
        var loader = new ImageLoader(manager);
        var name = {};
        var target = normalize(new THREE.TextureLoader(manager), name);
        var list = normalize(new Big(1024, false, manager), name);
        var y = normalize(new List(256, false, manager), name);
        var nsListById = {};
        var scope = new Type(manager);
        var schema = {};
        var c = normalize(new Connection(manager), schema);
        var self = {
            environmentPath : "assets/environments",
            geometryPath : "assets/scenes/data/",
            manager : manager,
            sceneLoader : loader
        };
        /** @type {string} */
        var temp = "";
        Object.defineProperty(self, "texturePath", {
            get : function() {
                return temp;
            },
            set : function(dir) {
                temp = dir;
                loader.setTexturePath(dir);
            }
        });
        /**
         * @param {string} url
         * @param {string} key
         * @return {?}
         */
        self.loadScene = function(url, key) {
            return load(url, key, loader);
        };
        /**
         * @param {!Array} t
         * @param {?} i
         * @return {?}
         */
        self.loadOBJs = function(t, i) {
            return fn(t, i, objLoader);
        };
        /**
         * @param {!Array} selected
         * @param {!Object} options
         * @return {?}
         */
        self.loadTextures = function(selected, options) {
            return fn(selected, options || self.texturePath, target);
        };
        /**
         * @param {!Array} t
         * @param {?} i
         * @return {?}
         */
        self.loadBRDFs = function(t, i) {
            return fn(t, i, brdfLoader);
        };
        /**
         * @param {!Array} args
         * @param {string} options
         * @return {?}
         */
        self.loadPanoramas = function(args, options) {
            return fn(args, options || self.environmentPath, list);
        };
        /**
         * @param {!Array} args
         * @param {string} options
         * @return {?}
         */
        self.loadSpecularCubemaps = function(args, options) {
            return fn(args, options || self.environmentPath, y);
        };
        /**
         * @param {!Function} fn
         * @return {?}
         */
        self.loadSH = function(fn) {
            return $.all(_.map(fn, function(id) {
                return new $(function(e, stepCallback) {
                    var r = require(self.environmentPath, id + "/irradiance.json");
                    scope.load(r, function(n) {
                        nsListById[id] = n;
                        e(n);
                    }, function() {
                    }, function() {
                        stepCallback(new Error("Resource was not found: " + r));
                    });
                });
            }));
        };
        /**
         * @param {?} e
         * @param {string} options
         * @return {?}
         */
        self.loadGeometries = function(e, options) {
            return e = _.map(e, function(canCreateDiscussions) {
                return canCreateDiscussions + ".bin";
            }), fn(e, options || self.geometryPath, c);
        };
        /**
         * @param {string} key
         * @return {?}
         */
        self.getTexture = function(key) {
            return target.get(key);
        };
        /**
         * @param {string} t
         * @return {?}
         */
        self.getBRDF = function(t) {
            return brdfLoader.get(t);
        };
        /**
         * @param {string} name
         * @return {?}
         */
        self.getPanorama = function(name) {
            return list.get(name + "/panorama.bin");
        };
        /**
         * @param {string} i
         * @return {?}
         */
        self.getCubemap = function(i) {
            return y.get(i + "/cubemap.bin");
        };
        /**
         * @param {?} notebookID
         * @return {?}
         */
        self.getSH = function(notebookID) {
            return nsListById[notebookID];
        };
        /**
         * @param {string} name
         * @return {?}
         */
        self.getGeometry = function(name) {
            return c.get(name + ".bin");
        };
        module.exports = self;
    }, {
        10 : 10,
        11 : 11,
        12 : 12,
        16 : 16,
        24 : 24,
        29 : 29,
        9 : 9
    }],
    16 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {string} data
         * @return {undefined}
         */
        var MTLLoader = function(data) {
            this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
            /** @type {string} */
            this.texturePath = "";
        };
        Object.assign(MTLLoader.prototype, {
            load : function(f, e, data, options) {
                if ("" === this.texturePath) {
                    this.texturePath = f.substring(0, f.lastIndexOf("/") + 1);
                }
                var scope = this;
                var helpers = new THREE.XHRLoader(scope.manager);
                helpers.load(f, function(response) {
                    /** @type {*} */
                    var value = JSON.parse(response);
                    scope.parse(value, e);
                }, data, options);
            },
            setTexturePath : function(path) {
                /** @type {string} */
                this.texturePath = path;
            },
            setCrossOrigin : function(value) {
                /** @type {!Object} */
                this.crossOrigin = value;
            },
            parse : function(json, fn) {
                var geometries;
                geometries = json.binary ? this.parseBinaryGeometries(json.geometries) : this.parseGeometries(json.geometries);
                var images = this.parseImages(json.images, function() {
                    if (void 0 !== fn) {
                        fn(object, json);
                    }
                });
                var textures = this.parseTextures(json.textures, images);
                var materials = this.parseMaterials(json.materials, textures);
                var object = this.parseObject(json.object, geometries, materials);
                return json.animations && (object.animations = this.parseAnimations(json.animations)), json.cameras && (object.cameras = this.parseCameras(object, json.cameras)), void 0 !== json.images && 0 !== json.images.length || void 0 !== fn && fn(object, json), object;
            },
            parseCameras : function(object, options) {
                /** @type {!Array} */
                var onSelectionCalls = [];
                /** @type {number} */
                var index = 0;
                for (; index < options.length; index++) {
                    var e = object.getObjectByProperty("uuid", options[index]);
                    if (e) {
                        onSelectionCalls.push(e);
                    }
                }
                return onSelectionCalls;
            },
            parseGeometries : function(json) {
                var geometries = {};
                if (void 0 !== json) {
                    var geometryLoader = new THREE.JSONLoader;
                    var primParser = new THREE.BufferGeometryLoader;
                    /** @type {number} */
                    var i = 0;
                    var jsonLength = json.length;
                    for (; i < jsonLength; i++) {
                        var geometry;
                        var data = json[i];
                        switch(data.type) {
                            case "PlaneGeometry":
                            case "PlaneBufferGeometry":
                                geometry = new THREE[data.type](data.width, data.height, data.widthSegments, data.heightSegments);
                                break;
                            case "BoxGeometry":
                            case "BoxBufferGeometry":
                            case "CubeGeometry":
                                geometry = new THREE[data.type](data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments);
                                break;
                            case "CircleGeometry":
                            case "CircleBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.segments, data.thetaStart, data.thetaLength);
                                break;
                            case "CylinderGeometry":
                            case "CylinderBufferGeometry":
                                geometry = new THREE[data.type](data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
                                break;
                            case "ConeGeometry":
                            case "ConeBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
                                break;
                            case "SphereGeometry":
                            case "SphereBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
                                break;
                            case "DodecahedronGeometry":
                            case "IcosahedronGeometry":
                            case "OctahedronGeometry":
                            case "TetrahedronGeometry":
                                geometry = new THREE[data.type](data.radius, data.detail);
                                break;
                            case "RingGeometry":
                            case "RingBufferGeometry":
                                geometry = new THREE[data.type](data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength);
                                break;
                            case "TorusGeometry":
                            case "TorusBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc);
                                break;
                            case "TorusKnotGeometry":
                            case "TorusKnotBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.tube, data.tubularSegments, data.radialSegments, data.p, data.q);
                                break;
                            case "LatheGeometry":
                            case "LatheBufferGeometry":
                                geometry = new THREE[data.type](data.points, data.segments, data.phiStart, data.phiLength);
                                break;
                            case "BufferGeometry":
                                geometry = primParser.parse(data);
                                break;
                            case "Geometry":
                                geometry = geometryLoader.parse(data.data, this.texturePath).geometry;
                                break;
                            default:
                                console.warn('THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"');
                                continue;
                        }
                        geometry.uuid = data.uuid;
                        if (void 0 !== data.name) {
                            geometry.name = data.name;
                        }
                        geometries[data.uuid] = geometry;
                    }
                }
                return geometries;
            },
            setBinaryGeometryBuffer : function(addedRenderer) {
                /** @type {!Object} */
                this.geometryBuffer = addedRenderer;
            },
            parseBinaryGeometries : function(result) {
                var geometries = {};
                if (void 0 !== result) {
                    /** @type {number} */
                    var i = (new THREE.BufferGeometryLoader, 0);
                    var length = result.length;
                    for (; i < length; i++) {
                        var geometry = new THREE.BufferGeometry;
                        var data = result[i];
                        var key;
                        for (key in data.offsets) {
                            if (data.offsets.hasOwnProperty(key)) {
                                var tex = data.offsets[key];
                                var c = tex[0];
                                var n = tex[1] + 1;
                                var len = this.geometryBuffer.slice(c, n);
                                if ("index" === key) {
                                    /** @type {!Uint32Array} */
                                    var indices = new Uint32Array(len);
                                    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
                                } else {
                                    var size;
                                    /** @type {!Float32Array} */
                                    indices = new Float32Array(len);
                                    if ("uv" === key || "uv2" === key) {
                                        /** @type {number} */
                                        size = 2;
                                    } else {
                                        if ("position" === key || "normal" === key || "color" === key) {
                                            /** @type {number} */
                                            size = 3;
                                        } else {
                                            if ("tangent" === key) {
                                                /** @type {number} */
                                                size = 4;
                                            }
                                        }
                                    }
                                    geometry.addAttribute(key, new THREE.BufferAttribute(indices, size));
                                }
                            }
                        }
                        geometry.uuid = data.uuid;
                        if (void 0 !== data.name) {
                            geometry.name = data.name;
                        }
                        geometries[data.uuid] = geometry;
                    }
                    this.setBinaryGeometryBuffer(null);
                }
                return geometries;
            },
            parseMaterials : function(json, textures) {
                var materials = {};
                if (void 0 !== json) {
                    var loader = new THREE.MaterialLoader;
                    loader.setTextures(textures);
                    /** @type {number} */
                    var i = 0;
                    var jsonLength = json.length;
                    for (; i < jsonLength; i++) {
                        var material = loader.parse(json[i]);
                        materials[material.uuid] = material;
                    }
                }
                return materials;
            },
            parseAnimations : function(json) {
                /** @type {!Array} */
                var t_chksum = [];
                /** @type {number} */
                var i = 0;
                for (; i < json.length; i++) {
                    var r = THREE.AnimationClip.parse(json[i]);
                    t_chksum.push(r);
                }
                return t_chksum;
            },
            parseImages : function(json, onLoad) {
                /**
                 * @param {string} url
                 * @return {?}
                 */
                function loadImage(url) {
                    return scope.manager.itemStart(url), loader.load(url, function() {
                        scope.manager.itemEnd(url);
                    });
                }
                var scope = this;
                var images = {};
                if (void 0 !== json && json.length > 0) {
                    var manager = new THREE.LoadingManager(onLoad);
                    var loader = new THREE.ImageLoader(manager);
                    loader.setCrossOrigin(this.crossOrigin);
                    /** @type {number} */
                    var i = 0;
                    var jsonLength = json.length;
                    for (; i < jsonLength; i++) {
                        var image = json[i];
                        var url = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(image.url) ? image.url : scope.texturePath + image.url;
                        images[image.uuid] = loadImage(url);
                    }
                }
                return images;
            },
            parseTextures : function(json, images) {
                /**
                 * @param {(Object|string)} value
                 * @return {?}
                 */
                function parseConstant(value) {
                    return "number" == typeof value ? value : (console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.", value), THREE[value]);
                }
                var textures = {};
                if (void 0 !== json) {
                    /** @type {number} */
                    var i = 0;
                    var jsonLength = json.length;
                    for (; i < jsonLength; i++) {
                        var texture;
                        var data = json[i];
                        if (data.images) {
                            /** @type {!Array} */
                            var c = [];
                            /** @type {number} */
                            var i = 0;
                            var l = data.images.length;
                            for (; i < l; i++) {
                                if (void 0 === images[data.images[i]]) {
                                    console.warn("THREE.ObjectLoader: Undefined image", data.images[i]);
                                }
                                c.push(images[data.images[i]]);
                            }
                            texture = new THREE.CubeTexture(c);
                        } else {
                            if (void 0 === data.image) {
                                console.warn('THREE.ObjectLoader: No "image" specified for', data.uuid);
                            }
                            if (void 0 === images[data.image]) {
                                console.warn("THREE.ObjectLoader: Undefined image", data.image);
                            }
                            texture = new THREE.Texture(images[data.image]);
                        }
                        /** @type {boolean} */
                        texture.needsUpdate = true;
                        texture.uuid = data.uuid;
                        if (void 0 !== data.name) {
                            texture.name = data.name;
                        }
                        if (void 0 !== data.mapping) {
                            texture.mapping = parseConstant(data.mapping);
                        }
                        if (void 0 !== data.offset) {
                            texture.offset.fromArray(data.offset);
                        }
                        if (void 0 !== data.repeat) {
                            texture.repeat.fromArray(data.repeat);
                        }
                        if (void 0 !== data.wrap) {
                            texture.wrapS = parseConstant(data.wrap[0]);
                            texture.wrapT = parseConstant(data.wrap[1]);
                        }
                        if (void 0 !== data.minFilter) {
                            texture.minFilter = parseConstant(data.minFilter);
                        }
                        if (void 0 !== data.magFilter) {
                            texture.magFilter = parseConstant(data.magFilter);
                        }
                        if (void 0 !== data.anisotropy) {
                            texture.anisotropy = data.anisotropy;
                        }
                        if (void 0 !== data.flipY) {
                            texture.flipY = data.flipY;
                        }
                        textures[data.uuid] = texture;
                    }
                }
                return textures;
            },
            parseObject : function() {
                var matrix = new THREE.Matrix4;
                return function(data, geometries, materials) {
                    /**
                     * @param {undefined} name
                     * @return {?}
                     */
                    function getGeometry(name) {
                        return void 0 === geometries[name] && console.warn("THREE.ObjectLoader: Undefined geometry", name), geometries[name];
                    }
                    /**
                     * @param {?} name
                     * @return {?}
                     */
                    function getMaterial(name) {
                        if (void 0 !== name) {
                            return void 0 === materials[name] && console.warn("THREE.ObjectLoader: Undefined material", name), materials[name];
                        }
                    }
                    var object;
                    switch(data.type) {
                        case "Scene":
                            object = new THREE.Scene;
                            break;
                        case "PerspectiveCamera":
                            object = new THREE.PerspectiveCamera(data.fov, data.aspect, data.near, data.far);
                            if (void 0 !== data.focus) {
                                object.focus = data.focus;
                            }
                            if (void 0 !== data.zoom) {
                                object.zoom = data.zoom;
                            }
                            if (void 0 !== data.filmGauge) {
                                object.filmGauge = data.filmGauge;
                            }
                            if (void 0 !== data.filmOffset) {
                                object.filmOffset = data.filmOffset;
                            }
                            if (void 0 !== data.view) {
                                /** @type {!Object} */
                                object.view = Object.assign({}, data.view);
                            }
                            break;
                        case "OrthographicCamera":
                            object = new THREE.OrthographicCamera(data.left, data.right, data.top, data.bottom, data.near, data.far);
                            break;
                        case "AmbientLight":
                            object = new THREE.AmbientLight(data.color, data.intensity);
                            break;
                        case "DirectionalLight":
                            object = new THREE.DirectionalLight(data.color, data.intensity);
                            break;
                        case "PointLight":
                            object = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay);
                            break;
                        case "SpotLight":
                            object = new THREE.SpotLight(data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay);
                            break;
                        case "HemisphereLight":
                            object = new THREE.HemisphereLight(data.color, data.groundColor, data.intensity);
                            break;
                        case "Mesh":
                            var geometry = getGeometry(data.geometry);
                            var material = getMaterial(data.material);
                            object = geometry.bones && geometry.bones.length > 0 ? new THREE.SkinnedMesh(geometry, material) : new THREE.Mesh(geometry, material);
                            break;
                        case "LOD":
                            object = new THREE.LOD;
                            break;
                        case "Line":
                            object = new THREE.Line(getGeometry(data.geometry), getMaterial(data.material), data.mode);
                            break;
                        case "LineSegments":
                            object = new THREE.LineSegments(getGeometry(data.geometry), getMaterial(data.material));
                            break;
                        case "PointCloud":
                        case "Points":
                            object = new THREE.Points(getGeometry(data.geometry), getMaterial(data.material));
                            break;
                        case "Sprite":
                            object = new THREE.Sprite(getMaterial(data.material));
                            break;
                        case "Group":
                            object = new THREE.Group;
                            break;
                        default:
                            object = new THREE.Object3D;
                    }
                    if (object.uuid = data.uuid, void 0 !== data.name && (object.name = data.name), void 0 !== data.matrix ? (matrix.fromArray(data.matrix), matrix.decompose(object.position, object.quaternion, object.scale)) : (void 0 !== data.position && object.position.fromArray(data.position), void 0 !== data.rotation && object.rotation.fromArray(data.rotation), void 0 !== data.scale && object.scale.fromArray(data.scale)), void 0 !== data.castShadow && (object.castShadow = data.castShadow), void 0 !== data.receiveShadow &&
                    (object.receiveShadow = data.receiveShadow), void 0 !== data.visible && (object.visible = data.visible), void 0 !== data.userData && (object.userData = data.userData), void 0 !== data.children) {
                        var child;
                        for (child in data.children) {
                            object.add(this.parseObject(data.children[child], geometries, materials));
                        }
                    }
                    if ("LOD" === data.type) {
                        var levels = data.levels;
                        /** @type {number} */
                        var i = 0;
                        for (; i < levels.length; i++) {
                            var level = levels[i];
                            child = object.getObjectByProperty("uuid", level.object);
                            if (void 0 !== child) {
                                object.addLevel(child, level.distance);
                            }
                        }
                    }
                    return void 0 !== data.layers && (object.layers.mask = data.layers), object;
                };
            }()
        });
        /** @type {function(string): undefined} */
        module.exports = MTLLoader;
    }, {}],
    17 : [function(create, module, n) {
        var _getServer = Promise;
        create("13");
        var shape = create("15");
        var instance = (create("22"), create("16"), {});
        /**
         * @param {string} name
         * @param {string} data
         * @param {!Object} options
         * @param {string} callback
         * @return {?}
         */
        instance.loadScene = function(name, data, options, callback) {
            return new _getServer(function(_emscripten_bind_Vector___destroy___0, a) {
                var addedRenderer = (options.renderer, shape.getGeometry(name));
                if (addedRenderer) {
                    shape.sceneLoader.setBinaryGeometryBuffer(addedRenderer);
                }
                shape.loadScene(data + name + (callback || ".json")).spread(function(self, canCreateDiscussions) {
                    var camera;
                    self.materials = {};
                    if (self.cameras && self.cameras.length > 0) {
                        camera = self.cameras[0];
                    }
                    if (camera) {
                        /** @type {number} */
                        camera.aspect = window.innerWidth / window.innerHeight;
                        camera.updateProjectionMatrix();
                    } else {
                        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .01, 2E3);
                        camera.position.set(-3.5, 2, 3);
                    }
                    /** @type {number} */
                    var size = 100;
                    /** @type {number} */
                    var step = 10;
                    var grid = new THREE.GridHelper(size, step);
                    self.add(grid);
                    var s = new THREE.AxisHelper(5);
                    self.add(s);
                    /** @type {!Array} */
                    self.dirLights = [];
                    self.traverse(function(camera) {
                        if (camera instanceof THREE.DirectionalLight) {
                            camera.position.set(0, 0, 5);
                            camera.quaternion.normalize();
                            camera.position.applyQuaternion(camera.quaternion);
                            camera.quaternion.set(0, 0, 0, 0);
                            camera.scale.set(1, 1, 1);
                            self.dirLights.push(camera);
                        }
                    });
                    mixer = new THREE.AnimationMixer(self);
                    /** @type {number} */
                    var i = 0;
                    for (; i < self.animations.length; i++) {
                        mixer.clipAction(self.animations[i]).play();
                    }
                    self.traverse(function(options) {
                        var material = options.material;
                        if (material && material.aoMap) {
                            !material.map;
                        }
                    });
                    self.traverse(function(box1) {
                        if ("Line" === box1.name) {
                            /** @type {number} */
                            box1.material.linewidth = 10;
                            box1.material.color.setRGB(1, 0, 1);
                        }
                    });
                    self.traverse(function(node) {
                        if (node instanceof THREE.SpotLight) {
                            var p = new THREE.Vector3(0, 0, -1);
                            var sprite = new THREE.Object3D;
                            node.updateMatrixWorld();
                            node.localToWorld(p);
                            sprite.position.copy(p);
                            self.add(sprite);
                            node.target = sprite;
                        }
                        if (node.material) {
                            if (node.material.materials) {
                                node.material.materials.forEach(function(b) {
                                    /** @type {number} */
                                    self.materials[b.uuid] = b;
                                });
                            } else {
                                self.materials[node.material.uuid] = node.material;
                            }
                        }
                    });
                    _emscripten_bind_Vector___destroy___0(self);
                });
            });
        };
        module.exports = instance;
    }, {
        13 : 13,
        15 : 15,
        16 : 16,
        22 : 22,
        24 : 24
    }],
    18 : [function(fn, canCreateDiscussions, n) {
        fn("19");
        /**
         * @param {number} minIn
         * @param {number} maxIn
         * @return {?}
         * @this {!Number}
         */
        Number.prototype.lerp = function(minIn, maxIn) {
            return this + (minIn - this) * maxIn;
        };
        if (!String.prototype.endsWith) {
            /**
             * @param {string} value
             * @param {number=} offset
             * @return {boolean}
             * @this {!String}
             */
            String.prototype.endsWith = function(value, offset) {
                /** @type {string} */
                var buffer = this.toString();
                if ("number" != typeof offset || !isFinite(offset) || Math.floor(offset) !== offset || offset > buffer.length) {
                    /** @type {number} */
                    offset = buffer.length;
                }
                /** @type {number} */
                offset = offset - value.length;
                /** @type {number} */
                var count = buffer.indexOf(value, offset);
                return count !== -1 && count === offset;
            };
        }
        /**
         * @param {!Function} target
         * @param {?} obj
         * @return {undefined}
         */
        Function.prototype.inherit = function(target, obj) {
            if (!target || !_.isFunction(target)) {
                throw "parent argument must be a function";
            }
            this.prototype = _.extend(Object.create(target.prototype), obj);
        };
        /**
         * @param {!Function} name
         * @return {undefined}
         */
        Function.prototype.mixin = function(name) {
            _.each(name, function(fn, methodName) {
                if (void 0 === this.prototype[methodName]) {
                    /** @type {!Function} */
                    this.prototype[methodName] = fn;
                }
            }, this);
        };
        /** @type {number} */
        window.WIDTH = window.innerWidth;
        /** @type {number} */
        window.HEIGHT = window.innerHeight;
        /** @type {number} */
        window.mouseX = 0;
        /** @type {number} */
        window.mouseY = 0;
        /** @type {boolean} */
        window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        /** @type {boolean} */
        window.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }, {
        19 : 19,
        34 : 34
    }],
    19 : [function(canCreateDiscussions, module, n) {
    }, {}],
    20 : [function(encodeURIComponent, module, n) {
        /**
         * @param {?} value
         * @param {string} defaultValue
         * @return {?}
         */
        function optionalParameter(value, defaultValue) {
            return void 0 !== value ? value : defaultValue;
        }
        var t = encodeURIComponent("21");
        var value = encodeURIComponent("15");
        var a = {
            normalMapFactor : "uNormalMapFactor",
            normalMap : "sTextureNormalMap",
            matcapMap : "sTextureAOMap"
        };
        /**
         * @param {!Function} data
         * @return {undefined}
         */
        var update = function(data) {
            /** @type {!Object} */
            data = Object.assign({
                vertexShader : data.vertexShader,
                fragmentShader : data.fragmentShader,
                uniforms : {
                    uNormalMapFactor : {
                        type : "f",
                        value : 1
                    },
                    sTextureMatcapMap : {
                        type : "t",
                        value : null
                    },
                    sTextureNormalMap : {
                        type : "t",
                        value : null
                    },
                    uFlipY : {
                        type : "i",
                        value : 0
                    },
                    uOutputLinear : {
                        type : "i",
                        value : 0
                    }
                }
            }, data);
            t.call(this, data);
            Object.keys(this.uniforms).forEach(function(name) {
                this.onPropertyChange(name, function(initSBC) {
                    /** @type {!Object} */
                    this.uniforms[name].value = initSBC;
                });
            }, this);
            _.each(a, function(javascriptName, prop) {
                this.onPropertyChange(prop, function(jsonName) {
                    this[javascriptName] = jsonName;
                });
            }, this);
            this.extensions = {
                derivatives : true
            };
        };
        update.inherit(t, {
            clone : function(params) {
                var data = params || new update;
                return t.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
                    var value = dom.type;
                    if ("v2" === value || "m4" === value) {
                        data.uniforms[name].value.copy(dom.value);
                    } else {
                        data.uniforms[name].value = dom.value;
                    }
                }, this), data;
            }
        });
        /**
         * @param {!Object} material
         * @return {?}
         */
        update.create = function(material) {
            var source = new update;
            source.uuid = material.uuid;
            source.name = material.name;
            source.transparent = optionalParameter(material.transparent, false);
            source.polygonOffset = optionalParameter(material.polygonOffset, false);
            source.polygonOffsetUnits = optionalParameter(material.polygonOffsetUnits, 0);
            source.polygonOffsetFactor = optionalParameter(material.polygonOffsetFactor, 0);
            var pm = (value.getTexture("white.png"), material.normalMap);
            var color = material.matcapMap;
            return source.uNormalMapFactor = optionalParameter(material.normalMapFactor, 1), source.uFlipY = optionalParameter(material.flipNormals, 0), source.side = optionalParameter(material.side, THREE.FrontSide), pm.needsUpdate = true, color.needsUpdate = true, source.sTextureNormalMap = pm, source.sTextureMatcapMap = color, source;
        };
        /** @type {function(!Function): undefined} */
        module.exports = update;
    }, {
        15 : 15,
        21 : 21
    }],
    21 : [function(canCreateDiscussions, module, n) {
        module.exports = function() {}
    }
      ],
    22 : [function(__webpack_require__, context, n) {
        /**
         * @param {?} value
         * @param {string} defaultValue
         * @return {?}
         */
        function optionalParameter(value, defaultValue) {
            return void 0 !== value ? value : defaultValue;
        }
        var object = __webpack_require__("23");
        var component = __webpack_require__("15");
        var __WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month__ = __webpack_require__("4");
        var options = {
            aoFactor : "uAOPBRFactor",
            albedoFactor : "uAlbedoPBRFactor",
            glossFactor : "uGlossinessPBRFactor",
            metalFactor : "uMetalnessPBRFactor",
            opacity : "uOpacityFactor",
            normalMapFactor : "uNormalMapFactor",
            f0Factor : "uSpecularF0Factor",
            albedoMap : "sTextureAlbedoMap",
            normalMap : "sTextureNormalMap",
            normalMap2 : "sTextureNormalMap2",
            aoMap : "sTextureAOMap",
            aoMap2 : "sTextureAOMap2",
            metalGlossMap : "sTexturePBRMaps",
            emissiveMap : "sTextureEmissiveMap",
            lightMap : "sTextureLightMap",
            lightMapDir : "sTextureLightMapDir",
            cubemap : "sSpecularPBR",
            panorama : "sPanoramaPBR",
            sph : "uDiffuseSPH",
            exposure : "uEnvironmentExposure",
            transform : "uEnvironmentTransform",
            occludeSpecular : "uOccludeSpecular",
            alphaTest : "uAlphaTest",
            color : "uColor",
            contrast : "uContrast"
        };
        /**
         * @param {!Function} obj
         * @return {undefined}
         */
        var init = function(obj) {
            /** @type {!Object} */
            obj = Object.assign({
                uniforms : {
                    uAOPBRFactor : {
                        type : "f",
                        value : 1
                    },
                    uAlbedoPBRFactor : {
                        type : "f",
                        value : 1
                    },
                    uGlossinessPBRFactor : {
                        type : "f",
                        value : 1
                    },
                    uMetalnessPBRFactor : {
                        type : "f",
                        value : 1
                    },
                    uNormalMapFactor : {
                        type : "f",
                        value : 1
                    },
                    uSpecularF0Factor : {
                        type : "f",
                        value : 1
                    },
                    uEnvironmentExposure : {
                        type : "f",
                        value : 1
                    },
                    uOpacityFactor : {
                        type : "f",
                        value : 1
                    },
                    sTextureAlbedoMap : {
                        type : "t",
                        value : null
                    },
                    sTextureAlbedoMap2 : {
                        type : "t",
                        value : null
                    },
                    sTextureNormalMap : {
                        type : "t",
                        value : null
                    },
                    sTextureNormalMap2 : {
                        type : "t",
                        value : null
                    },
                    sTextureAOMap : {
                        type : "t",
                        value : null
                    },
                    sTextureAOMap2 : {
                        type : "t",
                        value : null
                    },
                    sTexturePBRMaps : {
                        type : "t",
                        value : null
                    },
                    sTextureEmissiveMap : {
                        type : "t",
                        value : null
                    },
                    sTextureLightMap : {
                        type : "t",
                        value : null
                    },
                    sTextureLightMapDir : {
                        type : "t",
                        value : null
                    },
                    sSpecularPBR : {
                        type : "t",
                        value : null
                    },
                    sPanoramaPBR : {
                        type : "t",
                        value : null
                    },
                    uTextureEnvironmentSpecularPBRLodRange : {
                        type : "v2",
                        value : new THREE.Vector2(10, 5)
                    },
                    uTextureEnvironmentSpecularPBRTextureSize : {
                        type : "v2",
                        value : new THREE.Vector2
                    },
                    uDiffuseSPH : {
                        type : "3fv",
                        value : null
                    },
                    uFlipY : {
                        type : "i",
                        value : 0
                    },
                    uOccludeSpecular : {
                        type : "i",
                        value : 0
                    },
                    uOutputLinear : {
                        type : "i",
                        value : 0
                    },
                    uEnvironmentTransform : {
                        type : "m4",
                        value : new THREE.Matrix4
                    },
                    uMode : {
                        type : "i",
                        value : 0
                    },
                    uColor : {
                        type : "c",
                        value : null
                    },
                    uAlphaTest : {
                        type : "f",
                        value : 0
                    },
                    uContrast : {
                        type : "f",
                        value : 1.1
                    },
                    offsetRepeat : {
                        type : "v4",
                        value : new THREE.Vector4(0, 0, 1, 1)
                    },
                    offsetRepeatDetail : {
                        type : "v4",
                        value : new THREE.Vector4(0, 0, 1, 1)
                    },
                    viewLightDir : {
                        type : "v3",
                        value : new THREE.Vector3
                    },
                    specularHighlights : {
                        type : "i",
                        value : 1
                    },
                    ambientLightColor : {
                        value : []
                    },
                    directionalLights : {
                        value : [],
                        properties : {
                            direction : {},
                            color : {},
                            shadow : {},
                            shadowBias : {},
                            shadowRadius : {},
                            shadowMapSize : {}
                        }
                    },
                    directionalShadowMap : {
                        value : []
                    },
                    directionalShadowMatrix : {
                        value : []
                    },
                    spotLights : {
                        value : [],
                        properties : {
                            color : {},
                            position : {},
                            direction : {},
                            distance : {},
                            coneCos : {},
                            penumbraCos : {},
                            decay : {},
                            shadow : {},
                            shadowBias : {},
                            shadowRadius : {},
                            shadowMapSize : {}
                        }
                    },
                    spotShadowMap : {
                        value : []
                    },
                    spotShadowMatrix : {
                        value : []
                    },
                    pointLights : {
                        value : [],
                        properties : {
                            color : {},
                            position : {},
                            decay : {},
                            distance : {},
                            shadow : {},
                            shadowBias : {},
                            shadowRadius : {},
                            shadowMapSize : {},
                            shadowCameraNear : {},
                            shadowCameraFar : {}
                        }
                    },
                    pointShadowMap : {
                        value : []
                    },
                    pointShadowMatrix : {
                        value : []
                    },
                    hemisphereLights : {
                        value : [],
                        properties : {
                            direction : {},
                            skyColor : {},
                            groundColor : {}
                        }
                    },
                    rectAreaLights : {
                        value : [],
                        properties : {
                            color : {},
                            position : {},
                            width : {},
                            height : {}
                        }
                    },
                    fogNear : {
                        type : "f",
                        value : 225
                    },
                    fogFar : {
                        type : "f",
                        value : 325
                    },
                    fogColor : {
                        type : "c",
                        value : new THREE.Color(10676479)
                    }
                }
            }, obj);
            object.call(this, obj);
            Object.keys(this.uniforms).forEach(function(name) {
                this.onPropertyChange(name, function(initSBC) {
                    /** @type {!Object} */
                    this.uniforms[name].value = initSBC;
                });
            }, this);
            _.each(options, function(javascriptName, prop) {
                this.onPropertyChange(prop, function(jsonName) {
                    this[javascriptName] = jsonName;
                });
            }, this);
            this.extensions = {
                derivatives : true,
                shaderTextureLOD : null !== THREE.Extensions.get("EXT_shader_texture_lod")
            };
            /** @type {boolean} */
            this.pbr = true;
            /** @type {boolean} */
            this.lights = true;
        };
        init.inherit(object, {
            _clone : function(options) {
                var data = options || new init;
                return object.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
                    var value = dom.type;
                    if ("v2" === value || "m4" === value) {
                        data.uniforms[name].value.copy(dom.value);
                    } else {
                        data.uniforms[name].value = dom.value;
                    }
                }, this), data;
            },
            clone : function() {
                var rvm3 = init.create(this.createOptions);
                return rvm3.uuid = THREE.Math.generateUUID(), rvm3;
            },
            updateEnvironmentTransform : function() {
                var q = new THREE.Quaternion;
                var matrix = new THREE.Matrix4;
                return function(uri2, options) {
                    uri2.getWorldQuaternion(q).inverse();
                    matrix.makeRotationY(options || 0);
                    this.uniforms.uEnvironmentTransform.value.makeRotationFromQuaternion(q).multiply(matrix);
                };
            }(),
            refreshOffsetRepeat : function() {
                var uvScaleMap;
                if (this.defines.USE_ALBEDOMAP ? uvScaleMap = this.sTextureAlbedoMap : this.defines.USE_NORMALMAP ? uvScaleMap = this.sTextureNormalMap : this.defines.USE_AOMAP && (uvScaleMap = this.sTextureAOMap), void 0 !== uvScaleMap) {
                    var offset = uvScaleMap.offset;
                    var repeat = uvScaleMap.repeat;
                    this.uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
                }
            },
            refreshOffsetRepeatDetail : function() {
                var uvScaleMap = this.sTextureNormalMap2;
                if (void 0 !== uvScaleMap) {
                    var offset = uvScaleMap.offset;
                    var repeat = uvScaleMap.repeat;
                    this.uniforms.offsetRepeatDetail.value.set(offset.x, offset.y, repeat.x, repeat.y);
                }
            },
            refreshUniforms : function(mmCoreSplitViewBlock, $state) {
                this.updateEnvironmentTransform(mmCoreSplitViewBlock, $state);
            }
        });
        /**
         * @param {!Object} material
         * @return {?}
         */
        init.create = function(material) {
            var parameters = new init({
                vertexShader : material.vertexShader,
                fragmentShader : material.fragmentShader
            });
            /** @type {!Object} */
            parameters.createOptions = material;
            parameters.uuid = material.uuid;
            parameters.name = material.name;
            parameters.transparent = optionalParameter(material.transparent, false);
            parameters.polygonOffset = optionalParameter(material.polygonOffset, false);
            parameters.polygonOffsetUnits = optionalParameter(material.polygonOffsetUnits, 0);
            parameters.polygonOffsetFactor = optionalParameter(material.polygonOffsetFactor, 0);
            var DEFAULT_RECONNECT_TIME_INCREASE = __WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month__.CreateWhiteTexture();
            var r = __WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month__.CreateNormalTexture();
            var options = material.albedoMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var directLoginReference = material.albedoMap2 || DEFAULT_RECONNECT_TIME_INCREASE;
            var flag = material.normalMap || r;
            var cloudDistance = material.normalMap2 || r;
            var hyperParameters = material.aoMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var picture_right_map = material.aoMap2 || DEFAULT_RECONNECT_TIME_INCREASE;
            var picture_below_map = material.metalGlossMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var topTexture = material.emissiveMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var defTexture = material.lightMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var reconnectTimeIncrease = material.lightMapDir || DEFAULT_RECONNECT_TIME_INCREASE;
            var value = component.getSH(material.environment);
            return material.normalMap && (parameters.defines.USE_NORMALMAP = true), material.normalMap2 && (parameters.defines.USE_NORMALMAP2 = true), material.aoMap && (parameters.defines.USE_AOMAP = true), material.aoMap2 && (parameters.defines.USE_AOMAP2 = true), material.emissiveMap && (parameters.defines.USE_EMISSIVEMAP = true), material.lightMap && (parameters.defines.USE_LIGHTMAP = true), material.lightMapDir && (parameters.defines.USE_LIGHTMAP_DIR = true), material.albedoMap && (parameters.defines.USE_ALBEDOMAP =
                true), material.albedoMap2 && (parameters.defines.USE_ALBEDOMAP2 = true), parameters.uAlbedoPBRFactor = optionalParameter(material.albedoFactor, 1), parameters.uNormalMapFactor = optionalParameter(material.normalMapFactor, 1), parameters.uMetalnessPBRFactor = optionalParameter(material.metalFactor, 1), parameters.uGlossinessPBRFactor = optionalParameter(material.glossFactor, 1), parameters.uAOPBRFactor = optionalParameter(material.aoFactor, 1), parameters.uSpecularF0Factor = optionalParameter(material.f0Factor,
                .5), parameters.uEnvironmentExposure = optionalParameter(material.exposure, 1), parameters.occludeSpecular = optionalParameter(material.occludeSpecular ? 1 : 0, 1), parameters.uFlipY = optionalParameter(material.flipNormals, 0), parameters.opacity = optionalParameter(material.opacity, 1), parameters.color = (new THREE.Color).setHex(void 0 !== material.color ? material.color : 16777215), parameters.side = optionalParameter(material.side, THREE.FrontSide), options.needsUpdate = true, directLoginReference.needsUpdate =
                true, flag.needsUpdate = true, cloudDistance.needsUpdate = true, hyperParameters.needsUpdate = true, picture_right_map.needsUpdate = true, picture_below_map.needsUpdate = true, topTexture.needsUpdate = true, defTexture.needsUpdate = true, reconnectTimeIncrease.needsUpdate = true, parameters.sTextureAlbedoMap = options, parameters.sTextureAlbedoMap2 = directLoginReference, parameters.sTextureNormalMap = flag, parameters.sTextureNormalMap2 = cloudDistance, parameters.sTextureAOMap = hyperParameters,
                parameters.sTextureAOMap2 = picture_right_map, parameters.sTexturePBRMaps = picture_below_map, parameters.sTextureEmissiveMap = topTexture, parameters.sTextureLightMap = defTexture, parameters.sTextureLightMapDir = reconnectTimeIncrease, value && (parameters.uDiffuseSPH = new Float32Array(value, 27)), parameters.uEnvironmentTransform = new THREE.Matrix4, material.alphaTest && (parameters.alphaTest = material.alphaTest, parameters.defines.ALPHATEST = true), parameters.refreshOffsetRepeat(),
                parameters.refreshOffsetRepeatDetail(), parameters;
        };
        /** @type {function(!Function): undefined} */
        context.exports = init;
    }, {
        15 : 15,
        23 : 23,
        4 : 4
    }],
    23 : [function(canCreateDiscussions, module, n) {
        /** @type {!Array} */
        var keys = ["side", "alphaTest", "transparent", "depthWrite", "shading", "wireframe"];
        /**
         * @param {!Array} obj
         * @return {undefined}
         */
        var Link = function(obj) {
            obj = obj || {};
            THREE.RawShaderMaterial.call(this, obj);
            _.each(keys, function(property) {
                var method = obj[property];
                if (void 0 !== method) {
                    this[property] = method;
                }
            }, this);
        };
        Link.inherit(THREE.RawShaderMaterial, {
            onPropertyChange : function(e, prop) {
                Object.defineProperty(this, e, {
                    get : function() {
                        return this["_" + e];
                    },
                    set : function(result) {
                        /** @type {number} */
                        this["_" + e] = result;
                        prop.call(this, result);
                    }
                });
            },
            clone : function(dataAndEvents) {
                var material = dataAndEvents || new Material;
                return THREE.RawShaderMaterial.prototype.clone.call(this, material), material.shading = this.shading, material.wireframe = this.wireframe, material.wireframeLinewidth = this.wireframeLinewidth, material.fog = this.fog, material.lights = this.lights, material.vertexColors = this.vertexColors, material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, material;
            }
        });
        /** @type {function(!Array): undefined} */
        module.exports = Link;
    }, {}],
    24 : window.bluebird,
    25 : [],
    26 : [function(moment, canCreateDiscussions, exports) {
        (function(extra) {
            /**
             * @param {!Array} res
             * @param {boolean} parts
             * @return {?}
             */
            function normalizeArray(res, parts) {
                /** @type {number} */
                var n = 0;
                /** @type {number} */
                var level = res.length - 1;
                for (; level >= 0; level--) {
                    var code = res[level];
                    if ("." === code) {
                        res.splice(level, 1);
                    } else {
                        if (".." === code) {
                            res.splice(level, 1);
                            n++;
                        } else {
                            if (n) {
                                res.splice(level, 1);
                                n--;
                            }
                        }
                    }
                }
                if (parts) {
                    for (; n--; n) {
                        res.unshift("..");
                    }
                }
                return res;
            }
            /**
             * @param {!Array} a
             * @param {!Function} f
             * @return {?}
             */
            function filter(a, f) {
                if (a.filter) {
                    return a.filter(f);
                }
                /** @type {!Array} */
                var result = [];
                /** @type {number} */
                var i = 0;
                for (; i < a.length; i++) {
                    if (f(a[i], i, a)) {
                        result.push(a[i]);
                    }
                }
                return result;
            }
            /** @type {!RegExp} */
            var testFileRegex = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            /**
             * @param {?} filename
             * @return {?}
             */
            var splitPath = function(filename) {
                return testFileRegex.exec(filename).slice(1);
            };
            /**
             * @return {?}
             */
            exports.resolve = function() {
                /** @type {string} */
                var resolvedPath = "";
                /** @type {boolean} */
                var resolvedAbsolute = false;
                /** @type {number} */
                var i = arguments.length - 1;
                for (; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? arguments[i] : extra.cwd();
                    if ("string" != typeof path) {
                        throw new TypeError("Arguments to path.resolve must be strings");
                    }
                    if (path) {
                        /** @type {string} */
                        resolvedPath = path + "/" + resolvedPath;
                        /** @type {boolean} */
                        resolvedAbsolute = "/" === path.charAt(0);
                    }
                }
                return resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(canCreateDiscussions) {
                    return !!canCreateDiscussions;
                }), !resolvedAbsolute).join("/"), (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            };
            /**
             * @param {string} path
             * @return {?}
             */
            exports.normalize = function(path) {
                var isAbsolute = exports.isAbsolute(path);
                /** @type {boolean} */
                var synthetic = "/" === getInfoBoxData(path, -1);
                return path = normalizeArray(filter(path.split("/"), function(canCreateDiscussions) {
                    return !!canCreateDiscussions;
                }), !isAbsolute).join("/"), path || isAbsolute || (path = "."), path && synthetic && (path = path + "/"), (isAbsolute ? "/" : "") + path;
            };
            /**
             * @param {string} pathname
             * @return {?}
             */
            exports.isAbsolute = function(pathname) {
                return "/" === pathname.charAt(0);
            };
            /**
             * @return {?}
             */
            exports.join = function() {
                /** @type {!Array<?>} */
                var t = Array.prototype.slice.call(arguments, 0);
                return exports.normalize(filter(t, function(v, canCreateDiscussions) {
                    if ("string" != typeof v) {
                        throw new TypeError("Arguments to path.join must be strings");
                    }
                    return v;
                }).join("/"));
            };
            /**
             * @param {!Object} e
             * @param {!Object} parent
             * @return {?}
             */
            exports.relative = function(e, parent) {
                /**
                 * @param {!Array} s
                 * @return {?}
                 */
                function trim(s) {
                    /** @type {number} */
                    var i = 0;
                    for (; i < s.length && "" === s[i]; i++) {
                    }
                    /** @type {number} */
                    var k = s.length - 1;
                    for (; k >= 0 && "" === s[k]; k--) {
                    }
                    return i > k ? [] : s.slice(i, k - i + 1);
                }
                e = exports.resolve(e).substr(1);
                parent = exports.resolve(parent).substr(1);
                var fromParts = trim(e.split("/"));
                var toParts = trim(parent.split("/"));
                /** @type {number} */
                var KC = Math.min(fromParts.length, toParts.length);
                /** @type {number} */
                var t = KC;
                /** @type {number} */
                var i = 0;
                for (; i < KC; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        /** @type {number} */
                        t = i;
                        break;
                    }
                }
                /** @type {!Array} */
                var args = [];
                /** @type {number} */
                i = t;
                for (; i < fromParts.length; i++) {
                    args.push("..");
                }
                return args = args.concat(toParts.slice(t)), args.join("/");
            };
            /** @type {string} */
            exports.sep = "/";
            /** @type {string} */
            exports.delimiter = ":";
            /**
             * @param {?} path
             * @return {?}
             */
            exports.dirname = function(path) {
                var result = splitPath(path);
                var type = result[0];
                var i = result[1];
                return type || i ? (i && (i = i.substr(0, i.length - 1)), type + i) : ".";
            };
            /**
             * @param {?} path
             * @param {string} ext
             * @return {?}
             */
            exports.basename = function(path, ext) {
                var font = splitPath(path)[2];
                return ext && font.substr(-1 * ext.length) === ext && (font = font.substr(0, font.length - ext.length)), font;
            };
            /**
             * @param {?} path
             * @return {?}
             */
            exports.extname = function(path) {
                return splitPath(path)[3];
            };
            /** @type {function(string, number, ?): ?} */
            var getInfoBoxData = "b" === "ab".substr(-1) ? function(t, e, n) {
                return t.substr(e, n);
            } : function(p, i, n) {
                return i < 0 && (i = p.length + i), p.substr(i, n);
            };
        }).call(this);
    }, {
        27 : 27
    }],
    27 : [function(canCreateDiscussions, mixin, n) {
        return;
    }, {}],
    29 : [function($, mixin, utils) {
        var ref = $("26");
        var select = $("31");
        var _slic = $("30");
        var self = $("32");
        /** @type {function(): ?} */
        utils = mixin.exports = function() {
            var q = _slic(arguments).map(s);
            return self.isUri(q[0]) ? select.apply(select, q) : ref.join.apply(ref, q);
        };
        /** @type {function(!Array, ?, !Object): ?} */
        var s = (utils.isUrl = function(value) {
            return self.isUri(value) || "http://" === value || "https://" === value || "ftp://" === value;
        }, utils.replaceUndefined = function(t, value, key) {
            return void 0 === t || null === t ? self.isUri(key[0]) ? "/" : ref.sep : t;
        });
    }, {
        26 : 26,
        30 : 30,
        31 : 31,
        32 : 32
    }],
    30 : [function(canCreateDiscussions, mixin, n) {
        /**
         * @param {!Array} value
         * @return {?}
         */
        function eq(value) {
            return "[object Object]" === Object.prototype.toString.call(value);
        }
        /**
         * @param {!Array} value
         * @return {?}
         */
        function getStringTag(value) {
            return "[object Arguments]" === Object.prototype.toString.call(value);
        }
        /**
         * @param {!Array} cache
         * @return {?}
         */
        function makeStyleLoaders(cache) {
            return Object.keys(cache).map(function(colorSpace) {
                return cache[colorSpace];
            });
        }
        /**
         * @param {!Array} value
         * @param {!Object} result
         * @return {?}
         */
        mixin.exports = function(value, result) {
            return value || (value = []), getStringTag(value) && (value = [].splice.call(value, 0)), eq(value) && result && (value = makeStyleLoaders(value)), Array.isArray(value) ? value : [value];
        };
    }, {}],
    31 : [function(canCreateDiscussions, mixin, n) {
        /**
         * @param {string} name
         * @return {?}
         */
        function normalize(name) {
            return name.replace(/[\/]+/g, "/").replace(/\/\?/g, "?").replace(/\/#/g, "#").replace(/:\//g, "://");
        }
        /**
         * @return {?}
         */
        mixin.exports = function() {
            /** @type {string} */
            var joined = [].slice.call(arguments, 0).join("/");
            return normalize(joined);
        };
    }, {}],
    32 : [function(canCreateDiscussions, moduleTransport, n) {
        !function(module) {
            /**
             * @param {string} value
             * @return {?}
             */
            function is_iri(value) {
                if (value && !/[^a-z0-9:\/\?#\[\]@!\$&'\(\)\*\+,;=\.\-_~%]/i.test(value) && !/%[^0-9a-f]/i.test(value) && !/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) {
                    /** @type {!Array} */
                    var result = [];
                    /** @type {string} */
                    var n = "";
                    /** @type {string} */
                    var lang = "";
                    /** @type {string} */
                    var expression = "";
                    /** @type {string} */
                    var body = "";
                    /** @type {string} */
                    var prefix = "";
                    /** @type {string} */
                    var s = "";
                    if (result = splitUri(value), n = result[1], lang = result[2], expression = result[3], body = result[4], prefix = result[5], n && n.length && expression.length >= 0) {
                        if (lang && lang.length) {
                            if (0 !== expression.length && !/^\//.test(expression)) {
                                return;
                            }
                        } else {
                            if (/^\/\//.test(expression)) {
                                return;
                            }
                        }
                        if (/^[a-z][a-z0-9\+\-\.]*$/.test(n.toLowerCase())) {
                            return s = s + (n + ":"), lang && lang.length && (s = s + ("//" + lang)), s = s + expression, body && body.length && (s = s + ("?" + body)), prefix && prefix.length && (s = s + ("#" + prefix)), s;
                        }
                    }
                }
            }
            /**
             * @param {string} value
             * @param {boolean} _flexdatalist
             * @return {?}
             */
            function is_http_iri(value, _flexdatalist) {
                if (is_iri(value)) {
                    /** @type {!Array} */
                    var m = [];
                    /** @type {string} */
                    var prefix = "";
                    /** @type {string} */
                    var val = "";
                    /** @type {string} */
                    var append = "";
                    /** @type {string} */
                    var key = "";
                    /** @type {string} */
                    var code = "";
                    /** @type {string} */
                    var current = "";
                    /** @type {string} */
                    var result = "";
                    if (m = splitUri(value), prefix = m[1], val = m[2], append = m[3], code = m[4], current = m[5], prefix) {
                        if (_flexdatalist) {
                            if ("https" != prefix.toLowerCase()) {
                                return;
                            }
                        } else {
                            if ("http" != prefix.toLowerCase()) {
                                return;
                            }
                        }
                        if (val) {
                            return /:(\d+)$/.test(val) && (key = val.match(/:(\d+)$/)[0], val = val.replace(/:\d+$/, "")), result = result + (prefix + ":"), result = result + ("//" + val), key && (result = result + key), result = result + append, code && code.length && (result = result + ("?" + code)), current && current.length && (result = result + ("#" + current)), result;
                        }
                    }
                }
            }
            /**
             * @param {string} value
             * @return {?}
             */
            function is_https_iri(value) {
                return is_http_iri(value, true);
            }
            /**
             * @param {string} value
             * @return {?}
             */
            function is_web_iri(value) {
                return is_http_iri(value) || is_https_iri(value);
            }
            /** @type {function(string): ?} */
            module.exports.is_uri = is_iri;
            /** @type {function(string, boolean): ?} */
            module.exports.is_http_uri = is_http_iri;
            /** @type {function(string): ?} */
            module.exports.is_https_uri = is_https_iri;
            /** @type {function(string): ?} */
            module.exports.is_web_uri = is_web_iri;
            /** @type {function(string): ?} */
            module.exports.isUri = is_iri;
            /** @type {function(string, boolean): ?} */
            module.exports.isHttpUri = is_http_iri;
            /** @type {function(string): ?} */
            module.exports.isHttpsUri = is_https_iri;
            /** @type {function(string): ?} */
            module.exports.isWebUri = is_web_iri;
            /**
             * @param {string} uri
             * @return {?}
             */
            var splitUri = function(uri) {
                var components = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
                return components;
            };
        }(moduleTransport);
    }, {}],
    43 : [function(require, module, n) {
        var ref = require("1");
        var p = (require("50"));
        var PerspectiveCamera = (require("56"), require("58"));
        var SVGTable = (require("48"));
        var GlitchTextLetter = require("47");
        var PoloLender = require("52");
        var Zk = require("57");
        var TagHourlyStat = require("60");
        /**
         * @param {!Function} data
         * @return {undefined}
         */
        var _ = function(data) {
            ref.call(this, data);
            this.initCamera();
            this.gridCoords = new THREE.Vector2;
            this.cameraOffset = new THREE.Vector2;
            this.scene = new THREE.Scene;
        };
        _.inherit(ref, {
            start : function(_) {
                var root_width = _.getObjectByName("blocks").children;
                var root_height = _.getObjectByName("lanes").children;
                var table_options = _.getObjectByName("intersections").children;
                var contentTableRows = _.getObjectByName("cars").children;
                var childrenOfLast = _.getObjectByName("clouds").children;
                this.table = new SVGTable(root_width, root_height, table_options, contentTableRows, childrenOfLast);
                this.chunkScene = new GlitchTextLetter;
                window.x = window.x || 1
                this.scene.add(this.chunkScene);
                this.inputManager = new PoloLender(document.querySelector("canvas"));
                this.controls = new Zk(this.inputManager, this.chunkScene, this.camera);
                this.renderer.setClearColor(p.FOG_COLOR);
                this.initDirLight();
                this.initVignetting();
                this.controls.on("move", function(eastPx, vertSpeed) {
                    this.gridCoords.x += eastPx;
                    this.gridCoords.y += vertSpeed;
                    this.refreshChunkScene();
                }, this);
                this.refreshChunkScene();
                this.inputManager.on("startdrag", function() {
                    $("body").addClass("grabbing");
                });
                this.inputManager.on("enddrag", function() {
                    $("body").removeClass("grabbing");
                });
                this.inputManager.on("mousewheel", function(value) {
                    // this.camera.updateHeight(value);
                }, this);
                this.inputManager.on("pinchstart", function() {
                    /** @type {number} */
                    this._lastPinchScale = 1;
                    /** @type {boolean} */
                    this.controls.enabled = false;
                }, this);
                this.inputManager.on("pinchend", function() {
                    /** @type {boolean} */
                    this.controls.enabled = true;
                }, this);
                this.inputManager.on("pinchchange", function(uv3v) {
                    /** @type {number} */
                    var v1y = 10;
                    /** @type {number} */
                    var value = (uv3v - this._lastPinchScale) * v1y;
                    this.camera.updateHeight(value);
                    /** @type {number} */
                    this._lastPinchScale = uv3v;
                }, this);
                ref.prototype.start.call(this);
            },
            initDirLight : function() {
                var light = new THREE.DirectionalLight(16774618, 1.25);
                light.position.set(100, 150, -40);
                this.chunkScene.add(light);
                this.chunkScene.add(light.target);
                this.dirLight = light;
                /** @type {boolean} */
                light.castShadow = true;
                /** @type {number} */
                light.shadow.radius = 1;
                /** @type {number} */
                light.shadow.bias = -.001;
                light.shadow.mapSize.width = p.SHADOWMAP_RESOLUTION;
                light.shadow.mapSize.height = p.SHADOWMAP_RESOLUTION;
                /** @type {number} */
                light.shadow.camera.near = 50;
                /** @type {number} */
                light.shadow.camera.far = 300;
                this._resizeShadowMapFrustum(window.innerWidth, window.innerHeight);
                /** @type {boolean} */
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            },
            initVignetting : function() {
                this.vignetting = new TagHourlyStat;
            },
            setSize : function(size, val) {
                ref.prototype.setSize.call(this, size, val);
                if (this.dirLight) {
                    this._resizeShadowMapFrustum(size, val);
                }
            },
            initCamera : function() {
                /** @type {number} */
                var psisq = 120;
                Math.tan(p.CAMERA_ANGLE) * Math.sqrt(2 * Math.pow(psisq, 2));
                this.camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 10, 400);
                this.camera.position.set(80, 140, 80);
                this.camera.lookAt(new THREE.Vector3);
                /** @type {number} */
                this.camera.position.y = 200;
            },
            refreshChunkScene : function() {
                this.chunkScene.forEachChunk(function(results, columnGap, a) {
                    var body = this.gridCoords.x + columnGap;
                    var val = this.gridCoords.y + a;
                    var v = this.table.getChunkData(body, val);
                    results.remove(results.getObjectByName("chunk"));
                    results.add(v.node);
                }.bind(this));
            },
            update : function(val) {
                this.controls.update();
                this.table.update(val);
                this.camera.update();
                ref.prototype.update.call(this, val);
            },
            render : function(text) {
                /** @type {number} */
                var totalPlayers = 0;
                var mapFragmentAndProps = function() {
                    if (this.config.logCalls) {
                        totalPlayers = totalPlayers + this.renderer.info.render.calls;
                    }
                }.bind(this);
                this.renderer.clear();
                this.renderScene(this.scene, this.camera);
                mapFragmentAndProps();
                if (this.vignetting) {
                    this.vignetting.render(this.renderer);
                    mapFragmentAndProps();
                }
                if (this.config.logCalls) {
                    this.dcCounter.textContent = totalPlayers + " DC";
                }
            },
            _resizeShadowMapFrustum : function(count, steps) {
                /** @type {number} */
                var start = 1.25;
                /** @type {number} */
                var childStartView2 = Math.max(count / steps, start);
                /** @type {number} */
                var halfHeight = 75 * childStartView2;
                /** @type {number} */
                this.dirLight.shadow.camera.left = .9 * -halfHeight;
                /** @type {number} */
                this.dirLight.shadow.camera.right = 1.3 * halfHeight;
                /** @type {number} */
                this.dirLight.shadow.camera.top = halfHeight;
                /** @type {number} */
                this.dirLight.shadow.camera.bottom = -halfHeight;
                this.dirLight.shadow.camera.updateProjectionMatrix();
            }
        });
        /** @type {function(!Function): undefined} */
        module.exports = _;
    }, {
        1 : 1,
        47 : 47,
        48 : 48,
        50 : 50,
        52 : 52,
        54 : 54,
        56 : 56,
        57 : 57,
        58 : 58,
        60 : 60,
        8 : 8
    }],
    44 : [function(canCreateDiscussions, mixin, n) {
        mixin.exports = {
            "basic.fs" : "#ifdef USE_MAP\n  varying vec2 vUv;\n\n  uniform sampler2D map;\n#endif\n\nuniform vec3 diffuse;\nuniform float opacity;\n\nvoid main() {\n  gl_FragColor = vec4(diffuse, opacity);\n\n  #ifdef USE_MAP\n    vec4 mapTexel = texture2D(map, vUv, -2.0);\n\n    gl_FragColor *= mapTexel;\n  #endif\n}",
            "basic.vs" : "#ifdef USE_MAP\n  varying vec2 vUv;\n  uniform vec4 offsetRepeat;\n#endif\n\nvoid main() {\n  #ifdef USE_MAP\n    vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n  #endif\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
            "pbr.fs" : "#define MOBILE\n#define LUV\n\nuniform float uAOPBRFactor;\nuniform float uAlbedoPBRFactor;\nuniform float uEnvironmentExposure;\nuniform float uGlossinessPBRFactor;\nuniform float uMetalnessPBRFactor;\nuniform float uNormalMapFactor;\nuniform float uOpacityFactor;\nuniform float uSpecularF0Factor;\n\nuniform int uMode;\nuniform vec3 uColor;\nuniform float uAlphaTest;\n\nuniform int uFlipY;\nuniform int uOccludeSpecular;\nuniform int uOutputLinear;\n\nuniform sampler2D sTextureAlbedoMap;\nuniform sampler2D sTextureAlbedoMap2;\nuniform sampler2D sTextureNormalMap;\nuniform sampler2D sTextureNormalMap2;\nuniform sampler2D sTextureAOMap;\nuniform sampler2D sTextureAOMap2;\nuniform sampler2D sTextureEmissiveMap;\nuniform sampler2D sTexturePBRMaps;\n\nuniform vec2 uTextureEnvironmentSpecularPBRLodRange;\nuniform vec2 uTextureEnvironmentSpecularPBRTextureSize;\nuniform vec3 uDiffuseSPH[9];\nuniform mat4 uEnvironmentTransform;\n\n// varying vec3 FragPosition;\nvarying vec3 FragNormal;\nvarying vec4 FragTangent;\nvarying vec4 FragEyeVector;\nvarying vec2 vUv;\n\n#if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\nvarying vec2 vUvDetail;\n#endif\n\n#ifdef USE_LIGHTMAP\n  uniform sampler2D sTextureLightMap;\n  uniform sampler2D sTextureLightMapAlpha;\n#endif\n\nvarying vec2 vUv2;\n\n#ifdef USE_FOG\n\n  uniform vec3 fogColor;\n  varying float fogDepth;\n  uniform float fogNear;\n  uniform float fogFar;\n\n#endif\n\n\n// THREE.js common.glsl\n#define PI 3.14159265359\n#define PI2 6.28318530718\n#define PI_HALF 1.5707963267949\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nfloat pow2( const in float x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\n// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\n// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand( const in vec2 uv ) {\n  const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n  highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n  return fract(sin(sn) * c);\n}\n\nstruct IncidentLight {\n  vec3 color;\n  vec3 direction;\n  bool visible;\n};\n\nstruct ReflectedLight {\n  vec3 directDiffuse;\n  vec3 directSpecular;\n  vec3 indirectDiffuse;\n  vec3 indirectSpecular;\n};\n\nstruct GeometricContext {\n  vec3 position;\n  vec3 normal;\n  vec3 viewDir;\n};\n\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n  return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n}\n\n// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\n  return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n\n}\n\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  float distance = dot( planeNormal, point - pointOnPlane );\n\n  return - distance * planeNormal + point;\n\n}\n\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  return sign( dot( point - pointOnPlane, planeNormal ) );\n\n}\n\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n\n}\n\nmat3 transposeMat3( const in mat3 m ) {\n\n  mat3 tmp;\n\n  tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n  tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n  tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\n  return tmp;\n\n}\n\n// https://en.wikipedia.org/wiki/Relative_luminance\nfloat linearToRelativeLuminance( const in vec3 color ) {\n\n  vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\n\n  return dot( weights, color.rgb );\n\n}\n\n// end common.glsl\n\n// THREE.js packing\n\nvec3 packNormalToRGB( const in vec3 normal ) {\n  return normalize( normal ) * 0.5 + 0.5;\n}\n\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n  return 2.0 * rgb.xyz - 1.0;\n}\n\nconst float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n  vec4 r = vec4( fract( v * PackFactors ), v );\n  r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n  return r * PackUpscale;\n}\n\nfloat unpackRGBAToDepth( const in vec4 v ) {\n  return dot( v, UnpackFactors );\n}\n\n// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions\n\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n  return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n  return linearClipZ * ( near - far ) - near;\n}\n\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n  return ( near * far ) / ( ( far - near ) * invClipZ - far );\n}\n\n// end packing\n\nfloat blendOverlay(float base, float blend) {\n  return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend) {\n  return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend, float opacity) {\n  return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// references\n// https://www.khronos.org/registry/gles/extensions/EXT/EXT_sRGB.txt\n\n// approximation\n// http://chilliant.blogspot.fr/2012/08/srgb-approximations-for-hlsl.html\nfloat linearTosRGB(const in float c) {\n  if (c >= 1.0) return 1.0;\n  float S1 = sqrt(c);\n  float S2 = sqrt(S1);\n  float S3 = sqrt(S2);\n  return 0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * c;\n}\n\nvec3 linearTosRGB(const in vec3 c) {\n  // vec3 cm = min(c, 1.0);\n  vec3 cm = c;\n  vec3 S1 = sqrt(cm);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * cm;\n}\n\nvec4 linearTosRGB(const in vec4 c) {\n  vec3 cm = min(c.rgb, 1.0);\n  vec3 S1 = sqrt(cm);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return vec4(0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * cm, c.a);\n}\n\nfloat sRGBToLinear(const in float c) {\n  return c * (c * (c * 0.305306011 + 0.682171111) + 0.012522878);\n}\n\nvec3 sRGBToLinear(const in vec3 c) {\n  return c * (c * (c * 0.305306011 + 0.682171111) + 0.012522878);\n}\n\nvec4 sRGBToLinear(const in vec4 c) {\n  return vec4(c.rgb * (c.rgb * (c.rgb * 0.305306011 + 0.682171111) + 0.012522878), c.a);\n}\n\n//http://graphicrants.blogspot.fr/2009/04/rgbm-color-encoding.html\nvec3 RGBMToRGB(const in vec4 rgba) {\n  const float maxRange = 8.0;\n  return rgba.rgb * maxRange * rgba.a;\n}\n\nconst mat3 LUVInverse = mat3(6.0013,    -2.700,   -1.7995,\n                -1.332,    3.1029,   -5.7720,\n                0.3007,    -1.088,    5.6268);\n\nvec3 LUVToRGB(const in vec4 vLogLuv) {\n  float Le = vLogLuv.z * 255.0 + vLogLuv.w;\n  vec3 Xp_Y_XYZp;\n  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n  Xp_Y_XYZp.z = Xp_Y_XYZp.y / vLogLuv.y;\n  Xp_Y_XYZp.x = vLogLuv.x * Xp_Y_XYZp.z;\n  vec3 vRGB = LUVInverse * Xp_Y_XYZp;\n  return max(vRGB, 0.0);\n}\n\n// http://graphicrants.blogspot.fr/2009/04/rgbm-color-encoding.html\nvec4 encodeRGBM(const in vec3 col, const in float range) {\n  if(range <= 0.0)\n    return vec4(col, 1.0);\n  vec4 rgbm;\n  vec3 color = col / range;\n  rgbm.a = clamp(max(max(color.r, color.g), max(color.b, 1e-6)), 0.0, 1.0);\n  rgbm.a = ceil(rgbm.a * 255.0) / 255.0;\n  rgbm.rgb = color / rgbm.a;\n  return rgbm;\n}\n\nvec3 decodeRGBM(const in vec4 col, const in float range) {\n  if(range <= 0.0)\n    return col.rgb;\n  return range * col.rgb * col.a;\n}\n\nvec3 textureRGB(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).rgb;\n}\n\nvec4 textureRGBA(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).rgba;\n}\n\nfloat textureIntensity(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv).r;\n}\n\nfloat textureAlpha(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).a;\n}\n\nfloat adjustSpecular(const in float specular, const in vec3 normal) {\n  // Based on The Order : 1886 SIGGRAPH course notes implementation (page 21 notes)\n  float normalLen = length(normal);\n  if (normalLen < 1.0) {\n    float normalLen2 = normalLen * normalLen;\n    float kappa = (3.0 * normalLen -  normalLen2 * normalLen)/(1.0 - normalLen2);\n    // http://www.frostbite.com/2014/11/moving-frostbite-to-pbr/\n    // page 91 : they use 0.5/kappa instead\n    return 1.0-min(1.0, sqrt((1.0-specular) * (1.0-specular) + 1.0/kappa));\n  }\n  return specular;\n}\n\nvec3 mtexNspaceTangent(const in vec4 tangent, const in vec3 normal, const in vec3 texnormal) {\n  vec3 tang = vec3(0.0,1.0,0.0);\n  float l = length(tangent.xyz);\n  if (l != 0.0) {\n    //normalize reusing length computations\n    // tang =  normalize(tangent.xyz);\n    tang =  tangent.xyz / l;\n  }\n  vec3 B = tangent.w * normalize(cross(normal, tang));\n  return normalize(texnormal.x*tang + texnormal.y*B + texnormal.z*normal);\n}\n\nvec2 normalMatcap(const in vec3 normal, const in vec3 nm_z) {\n  vec3 nm_x = vec3(-nm_z.z, 0.0, nm_z.x);\n  vec3 nm_y = cross(nm_x, nm_z);\n  return vec2(dot(normal.xz, nm_x.xz), dot(normal, nm_y)) * vec2(0.5)  + vec2(0.5) ; //MADD vector form\n}\n\nvec3 rgbToNormal(const in vec3 texel, const in int flipNormalY) {\n  vec3 rgb = texel * vec3(2.0) + vec3(-1.0); // MADD vec form\n  rgb[1] = flipNormalY == 1 ? -rgb[1] : rgb[1];\n  return rgb;\n}\n\nvec3 bumpMap(const in vec4 tangent, const in vec3 normal, const in vec2 gradient) {\n  vec3 outnormal;\n  float l = length(tangent.xyz);\n  if (l != 0.0) {\n    //normalize reusing length computations\n    // vec3 tang =  normalize(tangent.xyz);\n    vec3 tang =  tangent.xyz / l;\n    vec3 binormal = tangent.w * normalize(cross(normal, tang));\n    outnormal = normal + gradient.x * tang + gradient.y * binormal;\n  }\n  else {\n     outnormal = vec3(normal.x + gradient.x, normal.y + gradient.y, normal.z);\n  }\n  return normalize(outnormal);\n}\n\nfloat specularOcclusion(const in int occlude, const in float ao, const in vec3 N, const in vec3 V) {\n  if(occlude == 0)\n    return 1.0;\n  // Yoshiharu Gotanda's specular occlusion approximation:\n  // cf http://research.tri-ace.com/Data/cedec2011_RealtimePBR_Implementation_e.pptx pg59\n  float d = dot(N, V) + ao;\n  return clamp((d * d) - 1.0 + ao, 0.0, 1.0);\n}\n\nfloat adjustRoughnessNormalMap(const in float roughness, const in vec3 normal) {\n  // Based on The Order : 1886 SIGGRAPH course notes implementation (page 21 notes)\n  float normalLen = length(normal);\n  if (normalLen < 1.0) {\n    float normalLen2 = normalLen * normalLen;\n    float kappa = (3.0 * normalLen -  normalLen2 * normalLen)/(1.0 - normalLen2);\n    // http://www.frostbite.com/2014/11/moving-frostbite-to-pbr/\n    // page 91 : they use 0.5/kappa instead\n    return min(1.0, sqrt(roughness * roughness + 1.0/kappa));\n  }\n  return roughness;\n}\n\nfloat adjustRoughnessGeometry(const in float roughness, const in vec3 normal) {\n  // Geometric Specular Aliasing (slide 43)\n  // http://alex.vlachos.com/graphics/Alex_Vlachos_Advanced_VR_Rendering_GDC2015.pdf\n// #ifdef GL_OES_standard_derivatives\n//     vec3 vDx = dFdx(normal.xyz);\n//     vec3 vDy = dFdy(normal.xyz);\n//     return max(roughness, pow(clamp(max(dot(vDx, vDx), dot(vDy, vDy)), 0.0, 1.0), 0.333));\n// #else\n  return roughness;\n// #endif\n}\n\nmat3 environmentTransformPBR(const in mat4 tr) {\n  // TODO trick from animation matrix transpose?\n  vec3 x = vec3(tr[0][0], tr[1][0], tr[2][0]);\n  vec3 y = vec3(tr[0][1], tr[1][1], tr[2][1]);\n  vec3 z = vec3(tr[0][2], tr[1][2], tr[2][2]);\n  mat3 m = mat3(x, y, z);\n  return m;\n}\n\nvec3 evaluateDiffuseSphericalHarmonics(const in vec3 s[9], const in mat3 envTrans, const in vec3 N) {\n  vec3 n = envTrans * N;\n  // https://github.com/cedricpinson/envtools/blob/master/Cubemap.cpp#L523\n  vec3 result = (s[0]+s[1]*n.y+s[2]*n.z+s[3]*n.x+s[4]*n.y*n.x+s[5]*n.y*n.z+s[6]*(3.0*n.z*n.z-1.0)+s[7]*(n.z*n.x)+s[8]*(n.x*n.x-n.y*n.y));\n  return max(result, vec3(0.0));\n}\n\n// Frostbite, Lagarde paper p67\n// http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf\nfloat linRoughnessToMipmap(const in float roughnessLinear) {\n  return sqrt(roughnessLinear);\n}\n\nvec3 integrateBRDF(const in vec3 specular, const in float r, const in float NoV, const in sampler2D tex) {\n  vec4 rgba = texture2D(tex, vec2(NoV, r));\n  float b = (rgba[3] * 65280.0 + rgba[2] * 255.0);\n  float a = (rgba[1] * 65280.0 + rgba[0] * 255.0);\n  const float div = 1.0/65535.0;\n  return (specular * a + b) * div;\n}\n\n// https://www.unrealengine.com/blog/physically-based-shading-on-mobile\n// TODO should we use somehow specular f0 ?\nvec3 integrateBRDFApprox(const in vec3 specular, const in float roughness, const in float NoV) {\n  const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);\n  const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04);\n  vec4 r = roughness * c0 + c1;\n  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;\n  vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;\n  return specular * AB.x + AB.y;\n}\n\nvec3 computeIBLDiffuseUE4(const in vec3 normal, const in vec3 albedo, const in mat3 envTrans, const in vec3 sphHarm[9]) {\n  return albedo * evaluateDiffuseSphericalHarmonics(sphHarm, envTrans, normal);\n}\n\n\n#ifdef CUBEMAP\nvec3 textureCubemapLod(const in samplerCube texture, const in vec3 dir, const in float lod) {\n  vec4 rgba = textureCubeLodEXT(texture, dir, lod);\n#ifdef FLOAT\n  return rgba.rgb;\n#endif\n#ifdef RGBM\n  return RGBMToRGB(rgba);\n#endif\n#ifdef LUV\n  return LUVToRGB(rgba);\n#endif\n}\n\nvec3 textureCubeLodEXTFixed(const in samplerCube texture, const in vec2 size, const in vec3 direction, const in float lodInput, const in float maxLod) {\n  vec3 dir = direction;\n  float lod = min(maxLod, lodInput);\n\n  // http://seblagarde.wordpress.com/2012/06/10/amd-cubemapgen-for-physically-based-rendering/\n  float scale = 1.0 - exp2(lod) / size.x;\n  vec3 absDir = abs(dir);\n  float M = max(max(absDir.x, absDir.y), absDir.z);\n\n  if (absDir.x != M) dir.x *= scale;\n  if (absDir.y != M) dir.y *= scale;\n  if (absDir.z != M) dir.z *= scale;\n\n  return textureCubemapLod(texture, dir, lod);\n}\n\nvec3 prefilterEnvMapCube(const in float rLinear, const in vec3 R, const in samplerCube tex, const in vec2 lodRange, const in vec2 size){\n  float lod = linRoughnessToMipmap(rLinear) * lodRange[1];\n  return textureCubeLodEXTFixed(tex, size, R, lod, lodRange[0]);\n}\n\n#define samplerEnv samplerCube\n#define prefilterEnvMap prefilterEnvMapCube\n\n#else\n#ifdef PANORAMA\nvec2 computeUVForMipmap(const in float level, const in vec2 uvBase, const in float size, const in float maxLOD) {\n  vec2 uv = uvBase;\n  float widthForLevel = exp2(maxLOD - level);\n  float heightForLevel = widthForLevel * 0.5;\n  float widthFactor = pow(0.5, level);\n  float heightFactor = widthFactor * 0.5;\n  float texelSize = 1.0 / size;\n\n  uv.y = 1.0 - uv.y;\n\n  float resizeX = (widthForLevel - 2.0) * texelSize;\n  float resizeY = (heightForLevel - 2.0) * texelSize;\n\n  float uvSpaceLocalX = texelSize + uv.x * resizeX;\n  float uvSpaceLocalY = texelSize + uv.y * resizeY;\n\n  uvSpaceLocalY += heightFactor;\n\n  return vec2(uvSpaceLocalX, uvSpaceLocalY);\n}\n\nvec2 normalToPanoramaUVY(const in vec3 dir) {\n  float n = length(dir.xz);\n\n  // to avoid bleeding the max(-1.0,dir.x / n) is needed\n  vec2 pos = vec2((n > 0.0000001) ? max(-1.0, dir.x / n) : 0.0, dir.y);\n\n  // fix edge bleeding\n  if (pos.x > 0.0) pos.x = min(0.999999, pos.x);\n\n  pos = acos(pos) * 0.3183098861837907; // inv_pi\n\n  pos.x = (dir.z > 0.0) ? pos.x * 0.5 : 1.0 - (pos.x * 0.5);\n\n  // shift u to center the panorama to -z\n  pos.x = mod(pos.x - 0.25 + 1.0, 1.0);\n  pos.y = 1.0 - pos.y;\n  return pos;\n}\n\nvec3 texturePanorama(const in sampler2D texture, const in vec2 uv) {\n  vec4 rgba = texture2D(texture, uv);\n#ifdef FLOAT\n  return rgba.rgb;\n#endif\n#ifdef RGBM\n  return RGBMToRGB(rgba);\n#endif\n#ifdef LUV\n  return LUVToRGB(rgba);\n#endif\n}\n\nvec3 texturePanoramaLod(const in sampler2D texture, const in vec2 size, const in vec3 direction, const in float lodInput, const in float maxLOD) {\n  float lod = min(maxLOD, lodInput);\n  vec2 uvBase = normalToPanoramaUVY(direction);\n\n  float lod0 = floor(lod);\n  vec2 uv0 = computeUVForMipmap(lod0, uvBase, size.x, maxLOD);\n  vec3 texel0 = texturePanorama(texture, uv0.xy);\n\n  float lod1 = ceil(lod);\n  vec2 uv1 = computeUVForMipmap(lod1, uvBase, size.x, maxLOD);\n  vec3 texel1 = texturePanorama(texture, uv1.xy);\n\n  return mix(texel0, texel1, fract(lod));\n}\n\nvec3 prefilterEnvMapPanorama(const in float rLinear, const in vec3 R, const in sampler2D tex, const in vec2 lodRange, const in vec2 size) {\n  float lod = linRoughnessToMipmap(rLinear) * lodRange[1]; //(uEnvironmentMaxLod - 1.0);\n  return texturePanoramaLod(tex, size, R, lod, lodRange[0]);\n}\n\n#define samplerEnv sampler2D\n#define prefilterEnvMap prefilterEnvMapPanorama\n\n#else\n// in case there is no environment node ?\nvec3 prefilterEnvMap(const in float rLinear, const in vec3 R, const in sampler2D tex, const in vec2 lodRange, const in vec2 size) {\n  return vec3(0.0);\n}\n#define samplerEnv sampler2D\n#endif // PANORAMA\n\n#endif // CUBEMAP\n\nvec3 getSpecularDominantDir(const in vec3 N, const in vec3 R, const in float realRoughness) {\n  float smoothness = 1.0 - realRoughness;\n  float lerpFactor = smoothness * (sqrt(smoothness) + realRoughness);\n  // The result is not normalized as we fetch in a cubemap\n  return mix(N, R, lerpFactor);\n}\n\n// samplerEnv and prefilterEnvMap are both defined above (cubemap or panorama)\nvec3 computeIBLSpecularUE4(\n  const in vec3 N,\n  const in vec3 V,\n  const in float rLinear,\n  const in vec3 specular,\n  const in mat3 envTrans,\n  const in samplerEnv texEnv,\n  const in vec2 lodRange,\n  const in vec2 size,\n  const in vec3 frontNormal\n  #ifdef MOBILE\n){\n  #else\n  ,const in sampler2D texBRDF) {\n  #endif\n\n  float rough = max(rLinear, 0.0);\n\n  float NoV = clamp(dot(N, V), 0.0, 1.0);\n  vec3 R = normalize(NoV * 2.0 * N - V);\n\n  R = getSpecularDominantDir(N, R, rLinear);\n  // could use that, especially if NoV comes from shared preCompSpec\n  // vec3 R = reflect(-V, N);\n\n  vec3 dir = envTrans * R;\n\n  vec3 prefilteredColor = prefilterEnvMap(rough, dir, texEnv, lodRange, size);\n  // http://marmosetco.tumblr.com/post/81245981087\n  // TODO we set a min value (10%) to avoid pure blackness (in case of pure metal)\n  float factor = clamp(1.0 + 1.3 * dot(R, frontNormal), 0.1, 1.0);\n  prefilteredColor *= factor * factor;\n  #ifdef MOBILE\n  return prefilteredColor * integrateBRDFApprox(specular, rough, NoV);\n  #else\n  return prefilteredColor * integrateBRDF(specular, rough, NoV, texBRDF);\n  #endif\n}\n\nvec4 linearToGamma(vec4 value, float gammaFactor) {\n  return vec4(pow(value.xyz, vec3(1.0 / gammaFactor)), value.w);\n}\n\nfloat luma(vec3 color) {\n  return dot(color, vec3(0.299, 0.587, 0.114));\n}\n\n// Lights \n\n#if NUM_DIR_LIGHTS > 0\n\n  varying vec3 vEyeLightDir;\n  varying float vDotNL;\n  varying vec3 vComputeGGXResult;\n\n  #define G1V(dotNV, k) (1.0/(dotNV*(1.0-k)+k))\n\n  void precomputeSun(\n          const in vec3 normal,\n          const in vec3 lightViewDirection,\n    \n          out float attenuation,\n          out vec3 eyeLightDir,\n          out float dotNL) {\n\n      attenuation = 1.0;\n      eyeLightDir = lightViewDirection;\n      dotNL = dot(eyeLightDir, normal);\n  }\n\n  vec4 precomputeGGX(const in vec3 normal, const in vec3 eyeVector, const in float roughness) {\n      float dotNV = saturate(dot(normal, eyeVector));\n      float alpha = roughness * roughness;\n      float k = alpha * 0.5;\n      float visNV = G1V(dotNV, k);\n\n      return vec4(alpha, alpha * alpha, k, visNV);\n  }\n\n  vec3 computeGGX(const vec4 precomputeGGX, const vec3 normal, const vec3 eyeVector, const vec3 eyeLightDir, const vec3 F0, const float dotNL) {\n\n      vec3 H = normalize(eyeVector + eyeLightDir);\n      float dotNH = saturate(dot(normal, H));\n      // D\n      float alphaSqr = precomputeGGX.y;\n      float denom = dotNH * dotNH * (alphaSqr - 1.0) + 1.0;\n      float D = alphaSqr / (PI * denom * denom);\n\n      // F\n      float dotLH = saturate(dot(eyeLightDir, H));\n      float dotLH5 = pow(1.0 - dotLH, 5.0);\n      vec3 F = vec3(F0) + (vec3(1.0) - F0) * (dotLH5);\n\n      // V\n      float visNL = G1V(dotNL, precomputeGGX.z);\n      return D * F * visNL * precomputeGGX.w;\n  }\n\n  void computeLightLambertGGX(\n      const in vec3 normal,\n      const in vec3 eyeVector,\n      const in float dotNL,\n      const in vec4 precomputeGGX,\n      \n      const in vec3 diffuse,\n      const in vec3 specular,\n      \n      const in float attenuation,\n      const in vec3 lightColor,\n      const in vec3 eyeLightDir,\n      const in float lightIntensity,\n      \n      out vec3 diffuseOut,\n      out vec3 specularOut,\n      out bool lighted) {\n\n      lighted = dotNL > 0.0;\n      if (lighted == false) {\n          specularOut = diffuseOut = vec3(0.0);\n          return;\n      }\n\n      vec3 colorAttenuate = attenuation * dotNL * lightColor * lightIntensity;\n      specularOut = colorAttenuate * vComputeGGXResult;\n      diffuseOut = colorAttenuate * diffuse;\n  }\n#endif\n\n// THREE.js lights_pars\nuniform vec3 ambientLightColor;\n\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\n  vec3 irradiance = ambientLightColor;\n\n  #ifndef PHYSICALLY_CORRECT_LIGHTS\n\n    irradiance *= PI;\n\n  #endif\n\n  return irradiance;\n\n}\n\n#if NUM_DIR_LIGHTS > 0\n\n  struct DirectionalLight {\n    vec3 direction;\n    vec3 color;\n\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n    float intensity;\n  };\n\n  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\n  void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\n    directLight.color = directionalLight.color;\n    directLight.direction = directionalLight.direction;\n    directLight.visible = true;\n\n  }\n\n#endif\n\n\n// Shadowmaps\n// THREE.js shadowmap_pars_fragment.fs\n\n#ifdef USE_SHADOWMAP\n\n  #if NUM_DIR_LIGHTS > 0\n\n    uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];\n    varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\n  #endif\n\n  #if NUM_SPOT_LIGHTS > 0\n\n    uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];\n    varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\n  #endif\n\n  #if NUM_POINT_LIGHTS > 0\n\n    uniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];\n    varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\n  #endif\n\n  /*\n  #if NUM_RECT_AREA_LIGHTS > 0\n\n    // TODO (abelnation): create uniforms for area light shadows\n\n  #endif\n  */\n\n  float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\n    return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\n  }\n\n  float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n\n    const vec2 offset = vec2( 0.0, 1.0 );\n\n    vec2 texelSize = vec2( 1.0 ) / size;\n    vec2 centroidUV = floor( uv * size + 0.5 ) / size;\n\n    float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );\n    float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );\n    float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );\n    float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );\n\n    vec2 f = fract( uv * size + 0.5 );\n\n    float a = mix( lb, lt, f.y );\n    float b = mix( rb, rt, f.y );\n    float c = mix( a, b, f.x );\n\n    return c;\n\n  }\n\n  float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\n    shadowCoord.xyz /= shadowCoord.w;\n    shadowCoord.z += shadowBias;\n\n    // if ( something && something ) breaks ATI OpenGL shader compiler\n    // if ( all( something, something ) ) using this instead\n\n    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n    bool inFrustum = all( inFrustumVec );\n\n    bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n    bool frustumTest = all( frustumTestVec );\n\n    if ( frustumTest ) {\n\n    #if defined( SHADOWMAP_TYPE_PCF )\n\n      vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\n      float dx0 = - texelSize.x * shadowRadius;\n      float dy0 = - texelSize.y * shadowRadius;\n      float dx1 = + texelSize.x * shadowRadius;\n      float dy1 = + texelSize.y * shadowRadius;\n\n      return (\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n      ) * ( 1.0 / 9.0 );\n\n    #elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n      vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\n      float dx0 = - texelSize.x * shadowRadius;\n      float dy0 = - texelSize.y * shadowRadius;\n      float dx1 = + texelSize.x * shadowRadius;\n      float dy1 = + texelSize.y * shadowRadius;\n\n      return (\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n      ) * ( 1.0 / 9.0 );\n\n    #else // no percentage-closer filtering:\n\n      return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\n    #endif\n\n    }\n\n    return 1.0;\n\n  }\n\n  // cubeToUV() maps a 3D direction vector suitable for cube texture mapping to a 2D\n  // vector suitable for 2D texture mapping. This code uses the following layout for the\n  // 2D texture:\n  //\n  // xzXZ\n  //  y Y\n  //\n  // Y - Positive y direction\n  // y - Negative y direction\n  // X - Positive x direction\n  // x - Negative x direction\n  // Z - Positive z direction\n  // z - Negative z direction\n  //\n  // Source and test bed:\n  // https://gist.github.com/tschw/da10c43c467ce8afd0c4\n\n  vec2 cubeToUV( vec3 v, float texelSizeY ) {\n\n    // Number of texels to avoid at the edge of each square\n\n    vec3 absV = abs( v );\n\n    // Intersect unit cube\n\n    float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n    absV *= scaleToCube;\n\n    // Apply scale to avoid seams\n\n    // two texels less per square (one texel will do for NEAREST)\n    v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\n    // Unwrap\n\n    // space: -1 ... 1 range for each square\n    //\n    // #X##   dim    := ( 4 , 2 )\n    //  # #   center := ( 1 , 1 )\n\n    vec2 planar = v.xy;\n\n    float almostATexel = 1.5 * texelSizeY;\n    float almostOne = 1.0 - almostATexel;\n\n    if ( absV.z >= almostOne ) {\n\n      if ( v.z > 0.0 )\n        planar.x = 4.0 - v.x;\n\n    } else if ( absV.x >= almostOne ) {\n\n      float signX = sign( v.x );\n      planar.x = v.z * signX + 2.0 * signX;\n\n    } else if ( absV.y >= almostOne ) {\n\n      float signY = sign( v.y );\n      planar.x = v.x + 2.0 * signY + 2.0;\n      planar.y = v.z * signY - 2.0;\n\n    }\n\n    // Transform to UV space\n\n    // scale := 0.5 / dim\n    // translate := ( center + 0.5 ) / dim\n    return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\n  }\n\n  float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\n    vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\n    // for point lights, the uniform @vShadowCoord is re-purposed to hold\n    // the distance from the light to the world-space position of the fragment.\n    vec3 lightToPosition = shadowCoord.xyz;\n\n    // bd3D = base direction 3D\n    vec3 bd3D = normalize( lightToPosition );\n    // dp = distance from light to fragment position\n    float dp = ( length( lightToPosition ) - shadowBias ) / 1000.0;\n\n    #if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n      vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\n      return (\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n      ) * ( 1.0 / 9.0 );\n\n    #else // no percentage-closer filtering\n\n      return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\n    #endif\n\n  }\n\n#endif\n\n\n\nvoid main() {\n  vec3 eyeVector = normalize(-FragEyeVector.rgb);\n  mat3 transform = environmentTransformPBR(uEnvironmentTransform);\n\n  vec4 frontTangent = gl_FrontFacing ? FragTangent : -FragTangent;\n  vec3 frontNormal = gl_FrontFacing ? FragNormal : -FragNormal;\n\n  vec3 normal = normalize(frontNormal);\n\n  // Normal map\n  #ifdef USE_NORMALMAP\n    vec3 nmTexel = rgbToNormal(textureRGB(sTextureNormalMap, vUv.xy), uFlipY);\n    vec3 normalMap = vec3(uNormalMapFactor * nmTexel.xy, nmTexel.z);\n    vec3 geoNormal = mtexNspaceTangent(frontTangent, normal, normalMap);\n    if (uMode == -1) {\n      geoNormal = normal;\n    }\n  #else\n    vec3 geoNormal = normal;\n  #endif\n\n  // Metalness / Glossiness\n  vec3 combinedTexel = textureRGB(sTexturePBRMaps, vUv.xy);\n  float metalness = combinedTexel.r;\n  float glossiness = combinedTexel.b;\n  float channelMetalnessPBR = metalness * uMetalnessPBRFactor;\n  float channelGlossinessPBR = glossiness * uGlossinessPBRFactor;\n  float roughness = 1.0 - channelGlossinessPBR;\n  float tmp_51 = max(1.e-4, roughness);\n  #ifdef USE_NORMALMAP\n    float tmp_52 = adjustRoughnessNormalMap(tmp_51, normalMap);\n    float materialRoughness = adjustRoughnessGeometry(tmp_52, normal);\n  #else\n    float materialRoughness = tmp_51;\n  #endif\n\n  // Albedo\n  vec4 albedoMap = vec4(uColor, 1.0);\n  #ifdef USE_ALBEDOMAP\n    albedoMap *= textureRGBA(sTextureAlbedoMap, vUv.xy);\n  #endif\n\n  vec3 channelAlbedoPBR = sRGBToLinear(albedoMap.rgb) * uAlbedoPBRFactor;\n  vec3 materialDiffusePBR = channelAlbedoPBR * (1.0 - channelMetalnessPBR);\n\n  // Ambient occlusion\n  float ao = textureIntensity(sTextureAOMap, vUv2.xy);\n  float channelAOPBR = mix(1.0, ao, uAOPBRFactor);\n\n  // Diffuse \n  vec3 diffuse = computeIBLDiffuseUE4(geoNormal, materialDiffusePBR, transform, uDiffuseSPH);\n\n  // Specular\n  float materialSpecularf0 = mix(0.0, 0.08, uSpecularF0Factor);\n  vec3 materialSpecularPBR = mix(vec3(materialSpecularf0), channelAlbedoPBR, channelMetalnessPBR);\n\n  // Optimization because we don't have reflective surfaces and a very simple environment\n  vec3 specular = vec3(0.004, 0.004, 0.012);\n\n  vec3 color = diffuse + specular;\n\n  color *= uEnvironmentExposure;\n\n  float shadow = 1.0;\n\n  #if NUM_DIR_LIGHTS > 0\n    DirectionalLight directionalLight;\n\n    // vec4 prepGGX = precomputeGGX( geoNormal, eyeVector, materialRoughness );\n    vec4 prepGGX = vec4(0.251, 0.063, 0.125, 1.0);\n\n    float attenuation; vec3 eyeLightDir; float dotNL; vec3 lightDiffuse; vec3 lightSpecular; bool lighted; vec3 lightCol;\n\n    directionalLight = directionalLights[ 0 ];\n\n    lightCol = directionalLight.color;\n\n    // Do this in the vertex shader because we have no normal map in this project\n    // precomputeSun( geoNormal, directionalLight.direction, attenuation, eyeLightDir, dotNL );\n    attenuation = 1.0;\n    eyeLightDir = vEyeLightDir;\n    dotNL = vDotNL;\n\n    computeLightLambertGGX( geoNormal, eyeVector, dotNL, prepGGX, materialDiffusePBR, materialSpecularPBR, attenuation, lightCol, eyeLightDir, 1.0, lightDiffuse, lightSpecular, lighted );\n\n    #ifdef USE_SHADOWMAP\n      // TODO: should check wether light has shadows enabled via directionalLight.shadow property\n      shadow = getShadow( directionalShadowMap[ 0 ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ 0 ] );\n      lightDiffuse *= shadow;\n    #endif\n\n    color += lightDiffuse;\n\n    color += lightSpecular;\n  #endif\n\n  color *= channelAOPBR;\n\n  float channelOpacity = mix(albedoMap.a * uOpacityFactor, 1.0, luma(specular) * 2.0);\n\n  #ifdef USE_EMISSIVEMAP\n    color += sRGBToLinear(emissive);\n  #endif\n\n  if (uMode <= 0) {\n    gl_FragColor = vec4(linearTosRGB(color), channelOpacity);\n  } else if (uMode == 1) {\n    gl_FragColor = vec4(geoNormal, 1.0);\n  } else if (uMode == 2) {\n    #ifdef USE_LIGHTMAP\n    gl_FragColor = vec4(linearTosRGB(lightmap), 1.0);\n    #else\n    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\n    #endif\n  } else if (uMode == 3) {\n    gl_FragColor = vec4(vec3(channelAOPBR), 1.0);\n  } else if (uMode == 4) {\n    gl_FragColor = vec4(vec3(channelMetalnessPBR), 1.0);\n  } else if (uMode == 5) {\n    gl_FragColor = vec4(vec3(channelGlossinessPBR), 1.0);\n  } else if (uMode == 6) {\n    gl_FragColor = vec4(channelAlbedoPBR, 1.0);\n  }\n\n  #ifdef ALPHATEST\n    if (gl_FragColor.a < uAlphaTest) {\n      discard;\n    } else {\n      gl_FragColor.a = 1.0;\n    }\n  #endif\n\n  #ifdef USE_FOG\n    float fogFactor = smoothstep( fogNear, fogFar, fogDepth );\n    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n  #endif\n}",
            "pbr.vs" : "#define PI 3.14159265359\n#define PI2 6.28318530718\n#define PI_HALF 1.5707963267949\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec4 tangent;\nattribute vec2 uv;\nattribute vec2 uv2;\n\nuniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\nuniform vec4 offsetRepeat;\nuniform vec4 offsetRepeatDetail;\n\n// varying vec3 FragPosition;\nvarying vec3 FragNormal;\nvarying vec4 FragTangent;\nvarying vec4 FragEyeVector;\nvarying vec2 vUv;\n\n// Optimization just for this experiment\nvarying vec3 vEyeLightDir;\nvarying float vDotNL;\nvarying vec3 vComputeGGXResult;\n\n#if NUM_DIR_LIGHTS > 0\n  #define G1V(dotNV, k) (1.0/(dotNV*(1.0-k)+k))\n\n  struct DirectionalLight {\n    vec3 direction;\n    vec3 color;\n\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n    float intensity;\n  };\n\n  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\n  vec3 computeGGX(const vec4 precomputeGGX, const vec3 normal, const vec3 eyeVector, const vec3 eyeLightDir, const vec3 F0, const float dotNL) {\n\n      vec3 H = normalize(eyeVector + eyeLightDir);\n      float dotNH = saturate(dot(normal, H));\n      // D\n      float alphaSqr = precomputeGGX.y;\n      float denom = dotNH * dotNH * (alphaSqr - 1.0) + 1.0;\n      float D = alphaSqr / (PI * denom * denom);\n\n      // F\n      float dotLH = saturate(dot(eyeLightDir, H));\n      float dotLH5 = pow(1.0 - dotLH, 5.0);\n      vec3 F = vec3(F0) + (vec3(1.0) - F0) * (dotLH5);\n\n      // V\n      float visNL = G1V(dotNL, precomputeGGX.z);\n      return D * F * visNL * precomputeGGX.w;\n  }\n\n#endif\n\n#if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\nvarying vec2 vUvDetail;\n#endif\n\nvarying vec2 vUv2;\n\n#ifdef USE_SHADOWMAP\n\n  #if NUM_DIR_LIGHTS > 0\n\n    uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];\n    varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\n  #endif\n\n  #if NUM_SPOT_LIGHTS > 0\n\n    uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];\n    varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\n  #endif\n\n  #if NUM_POINT_LIGHTS > 0\n\n    uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];\n    varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\n  #endif\n#endif\n\n#ifdef USE_FOG\n\n  varying float fogDepth;\n\n#endif\n\nvoid main() {\n  vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n\n  FragEyeVector = viewMatrix * worldPosition;\n\n  // FragPosition = worldPosition.xyz;\n\n  gl_Position = projectionMatrix * FragEyeVector;\n\n  vUv = uv.xy * offsetRepeat.zw + offsetRepeat.xy;\n\n  #if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\n  vUvDetail = uv.xy * offsetRepeatDetail.zw + offsetRepeatDetail.xy;\n  #endif\n\n  FragNormal = normalMatrix * normal;\n  FragTangent.xyz = normalMatrix * tangent.xyz;\n  FragTangent.w = tangent.w;\n\n  vUv2 = uv2.xy;\n\n  #ifdef USE_SHADOWMAP\n\n    #if NUM_DIR_LIGHTS > 0\n\n      vDirectionalShadowCoord[ 0 ] = directionalShadowMatrix[ 0 ] * worldPosition;\n\n    #endif\n\n  #endif\n\n\n  #ifdef USE_FOG\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    fogDepth = -mvPosition.z;\n  #endif\n\n\n  #if NUM_DIR_LIGHTS > 0\n\n    // Precompute sun in VS because we have no normal map\n\n    DirectionalLight dirLight;\n\n    dirLight = directionalLights[0];\n\n    vec3 normalizedNormal = normalize(FragNormal);\n\n    vEyeLightDir = dirLight.direction;\n    vDotNL = dot(dirLight.direction, normalizedNormal);\n\n    vec3 eyeVector = normalize(-FragEyeVector.rgb);\n\n    vec4 prepGGX = vec4(0.251, 0.063, 0.125, 1.0);\n\n    vComputeGGXResult = computeGGX(prepGGX, normalizedNormal, eyeVector, dirLight.direction, vec3(0.05), vDotNL);\n\n  #endif\n\n}\n"
        };
    }, {}],
    46 : [function($, module, n) {
        var result = $("59");
        var self = $("55");
        var normal = new THREE.Vector3(0, 1, 0);
        /**
         * @param {!Function} obj
         * @param {!Object} data
         * @param {!Object} transform
         * @return {undefined}
         */
        var update = function(obj, data, transform) {
            self.call(this, obj);
            /** @type {string} */
            this.name = "car";
            /** @type {number} */
            this.maxSpeed = .25;
            /** @type {number} */
            this.minSpeed = 0;
            /** @type {number} */
            this.speed = this.maxSpeed;
            /** @type {boolean} */
            this.stuck = false;
            /** @type {null} */
            this.restartTimer = null;
            this.add(data);
            /** @type {!Object} */
            this.mesh = data;
            /** @type {number} */
            this.radarRadius = (this._isLargeVehicle(), 20);
            this.position.copy(transform.position);
            var point = new THREE.Vector3(3.4, 0, 0);
            data.rotation.copy(transform.rotation);
            point.applyAxisAngle(normal, data.rotation.y);
            if (result.random() > .5) {
                this.position.add(point);
            } else {
                data.rotation.y += Math.PI;
                this.position.sub(point);
            }
            this.direction = data.getWorldDirection().negate();
            this.direction.set(Math.round(this.direction.x), Math.round(this.direction.y), Math.round(this.direction.z));
            this._initCollisionPoints();
        };
        update.inherit(self, {
            addRadarHelper : function() {
                var pregeom = new THREE.CircleGeometry(this.radarRadius, 32, 0, Math.PI / 2);
                var wrapper = new THREE.MeshBasicMaterial({
                    color : 16711935
                });
                var el = new THREE.Mesh(pregeom, wrapper);
                /** @type {string} */
                el.rotation.order = "YXZ";
                /** @type {number} */
                el.position.y = 1;
                /** @type {number} */
                el.rotation.x = -Math.PI / 2;
                el.rotation.y = this.mesh.rotation.y;
                this.add(el);
                this.helper = el;
            },
            detectCars : function(_data) {
                /** @type {number} */
                var _speed = .0075;
                /** @type {boolean} */
                var n = true;
                /** @type {null} */
                this.detectedCar = null;
                /** @type {number} */
                var dataIndex = 0;
                for (; dataIndex < _data.length; dataIndex++) {
                    var i = this.detectCar(_data[dataIndex]);
                    if (i) {
                        /** @type {boolean} */
                        n = false;
                        this.detectedCar = i;
                        break;
                    }
                }
                if (n) {
                    if (this.speed < this.maxSpeed) {
                        this.speed += _speed;
                        /** @type {number} */
                        this.speed = Math.min(this.speed, this.maxSpeed);
                    }
                    if (this.stuck) {
                        clearTimeout(this.restartTimer);
                        /** @type {boolean} */
                        this.stuck = false;
                        /** @type {number} */
                        this.minSpeed = 0;
                    }
                } else {
                    this.speed -= _speed;
                    /** @type {number} */
                    this.speed = Math.max(this.speed, this.minSpeed);
                    if (!(this.stuck || 0 !== this.speed)) {
                        /** @type {boolean} */
                        this.stuck = true;
                        /** @type {number} */
                        this.restartTimer = setTimeout(function() {
                            /** @type {number} */
                            this.minSpeed = .25 * this.maxSpeed;
                        }.bind(this), 2E3);
                    }
                }
            },
            detectCar : function() {
                var v1 = new THREE.Vector3;
                var v2 = new THREE.Vector3;
                var startGround = new THREE.Vector3;
                var endGround = new THREE.Vector3;
                var orig = new THREE.Vector3;
                return function(obj) {
                    /** @type {boolean} */
                    var c = obj.detectedCar === this;
                    /** @type {boolean} */
                    var length = false;
                    if (c) {
                        return null;
                    }
                    if (this.isOnIntersection() && !obj.isOnIntersection() && !this.direction.equals(obj.direction)) {
                        return null;
                    }
                    obj.updateMatrix();
                    v1.copy(this.direction);
                    v1.applyAxisAngle(normal, -Math.PI / 4);
                    result.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, startGround);
                    /** @type {number} */
                    var i = 0;
                    for (; i < obj.collisionPoints.length; i++) {
                        var pos = obj.collisionPoints[i];
                        orig.copy(pos).applyMatrix4(obj.matrix);
                        result.getTablePosition(orig, obj.parent.tableX, obj.parent.tableY, endGround);
                        var length = startGround.distanceTo(endGround);
                        if (length <= this.radarRadius) {
                            v2.subVectors(endGround, startGround).normalize();
                            var delta = v1.dot(v2);
                            if (delta > .5) {
                                /** @type {boolean} */
                                length = true;
                                break;
                            }
                        }
                    }
                    return length ? obj : null;
                };
            }(),
            update : function() {
                var value = new THREE.Vector3;
                return function() {
                    value.copy(this.direction).multiplyScalar(this.speed);
                    this.position.add(value);
                    result.roundVector(this.position, 2);
                    this._updateTablePosition();
                    var fakeMutation = this.table.getNeighboringCars(this);
                    this.detectCars(fakeMutation);
                };
            }(),
            isOnIntersection : function() {
                return this.position.x < -20 && this.position.x > -40 && this.position.z < -20 && this.position.z > -40;
            },
            _initCollisionPoints : function() {
                var self = new THREE.Box3;
                self.setFromObject(this.mesh);
                var p = new THREE.Vector3;
                p.copy(self.min);
                this.worldToLocal(p);
                /** @type {number} */
                p.y = 1;
                if (Math.abs(this.direction.x) > 0) {
                    /** @type {number} */
                    p.z = 0;
                } else {
                    /** @type {number} */
                    p.x = 0;
                }
                var b = new THREE.Vector3;
                b.copy(self.max);
                this.worldToLocal(b);
                /** @type {number} */
                b.y = 1;
                if (Math.abs(this.direction.x) > 0) {
                    /** @type {number} */
                    b.z = 0;
                } else {
                    /** @type {number} */
                    b.x = 0;
                }
                /** @type {!Array} */
                this.collisionPoints = [p, b];
                this.collisionPoints.forEach(function(canCreateDiscussions) {
                }, this);
            },
            _isLargeVehicle : function() {
                return this.mesh.name.indexOf("Bus") !== -1 || this.mesh.name.indexOf("Container") !== -1 || this.mesh.name.indexOf("Truck") !== -1;
            }
        });
        /** @type {function(!Function, !Object, !Object): undefined} */
        module.exports = update;
    }, {
        55 : 55,
        59 : 59
    }],
    47 : [function(propertyFactory, module, n) {
        var properties = propertyFactory("50");
        /**
         * @return {undefined}
         */
        var Application = function() {
            THREE.Scene.call(this);
            /** @type {!Array} */
            this._pickables = [];
            /** @type {!Array} */
            this.chunks = [];
            this._initChunks();
        };
        Application.inherit(THREE.Scene, {
            _initChunks : function() {
                /** @type {number} */
                var j = 0;
                for (; j < properties.CHUNK_COUNT; j++) {
                    /** @type {number} */
                    var i = 0;
                    for (; i < properties.CHUNK_COUNT; i++) {
                        if (void 0 === this.chunks[i]) {
                            /** @type {!Array} */
                            this.chunks[i] = [];
                        }
                        var id = this._createChunkAt(i, j);
                        this.chunks[i][j] = id;
                        this.add(id);
                    }
                }
            },
            _createChunkAt : function(x, time) {
                var settings = new THREE.Object3D;
                var pregeom = new THREE.PlaneGeometry(properties.CHUNK_SIZE, properties.CHUNK_SIZE, 1, 1);
                var wheelAxisMat = new THREE.MeshBasicMaterial;
                var data = new THREE.Mesh(pregeom, wheelAxisMat);
                /** @type {number} */
                var left = (properties.CHUNK_COUNT - 1) / 2 * -properties.CHUNK_SIZE;
                /** @type {number} */
                var i = left;
                return data.rotation.x = -Math.PI / 2, data.centeredX = x - Math.floor(properties.CHUNK_COUNT / 2), data.centeredY = time - Math.floor(properties.CHUNK_COUNT / 2), data.material.visible = false, this._pickables.push(data), settings.position.x = left + x * properties.CHUNK_SIZE, settings.position.z = i + time * properties.CHUNK_SIZE, settings.centeredX = data.centeredX, settings.centeredY = data.centeredY, settings.material = data.material, settings.add(data), settings;
            },
            getPickables : function() {
                return this._pickables;
            },
            forEachChunk : function(func) {
                /** @type {number} */
                var i = 0;
                for (; i < properties.CHUNK_COUNT; i++) {
                    /** @type {number} */
                    var j = 0;
                    for (; j < properties.CHUNK_COUNT; j++) {
                        var value = this.chunks[i][j];
                        func(value, value.centeredX, value.centeredY);
                    }
                }
            }
        });
        /** @type {function(): undefined} */
        module.exports = Application;
    }, {
        50 : 50
    }],
    48 : [function(require, module, n) {
        /**
         * @param {!Object} options
         * @return {?}
         */
        function _(options) {
            return options[Math.floor(Common.random() * options.length)];
        }
        var options = require("50");
        var Tab = require("46");
        var Buffer = require("49");
        var Common = require("59");
        /**
         * @param {!Function} data
         * @param {!Object} options
         * @param {number} prop
         * @param {?} index
         * @param {?} vertices
         * @return {undefined}
         */
        var update = function(data, options, prop, index, vertices) {
            /** @type {boolean} */
            this._containsStadium = false;
            /** @type {!Function} */
            this.blocks = data;
            /** @type {!Array} */
            this.lanes = [];
            /** @type {number} */
            this.intersections = prop;
            this.carObjects = index;
            /** @type {!Array} */
            this.mobs = [];
            /** @type {!Array} */
            this.chunks = [];
            this.cloudObjects = vertices;
            options.forEach(function(t) {
                switch(t.name) {
                    case "Road_Lane_01_fixed":
                        /** @type {number} */
                        var e = 0;
                        for (; e < 10; e++) {
                            this.lanes.push(t);
                        }
                        break;
                    case "Road_Lane_03_fixed":
                        /** @type {number} */
                        e = 0;
                        for (; e < 5; e++) {
                            this.lanes.push(t);
                        }
                }
            }, this);
            this._generate();
        };
        update.inherit(Object, {
            getChunkData : function(i, x) {
                return i = i % options.TABLE_SIZE, x = x % options.TABLE_SIZE, i < 0 && (i = options.TABLE_SIZE + i), x < 0 && (x = options.TABLE_SIZE + x), void 0 !== this.chunks[i] && (void 0 !== this.chunks[i][x] && this.chunks[i][x]);
            },
            getNeighboringCars : function() {
                /** @type {!Array} */
                var exports = [];
                return function(s) {
                    return exports.length = 0, s.parent.traverse(function(sub) {
                        if ("car" === sub.name && sub !== s) {
                            exports.push(sub);
                        }
                    }), this._forEachNeighboringChunk(s.parent.tableX, s.parent.tableY, function(spUtils) {
                        spUtils.traverse(function(e) {
                            if ("car" === e.name) {
                                exports.push(e);
                            }
                        });
                    }), exports;
                };
            }(),
            update : function(target) {
                this.mobs.forEach(function(e) {
                    e.update(target);
                });
            },
            _forEachNeighboringChunk : function() {
                var menu = new THREE.Vector2;
                /** @type {!Array} */
                var pipelets = [new THREE.Vector2(-1, -1), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1), new THREE.Vector2(0, 1), new THREE.Vector2(-1, 0), new THREE.Vector2(-1, 0), new THREE.Vector2(0, -1)];
                return function(n, r, expect) {
                    menu.set(n, r);
                    pipelets.forEach(function(e) {
                        menu.add(e);
                        var each1 = this.getChunkData(menu.x, menu.y);
                        if (each1) {
                            expect(each1.node);
                        }
                    }, this);
                };
            }(),
            _getNeighboringBlocks : function() {
                /** @type {!Array} */
                var parkNames = [];
                return function(e, n) {
                    return parkNames.length = 0, this._forEachNeighboringChunk(e, n, function(dep) {
                        parkNames.push(dep.block.name);
                    }), parkNames;
                };
            }(),
            _getRandomBlockAt : function(pieceX, pieceY) {
                var fileTooLarge;
                /** @type {number} */
                var i = 0;
                var piece = this._getNeighboringBlocks(pieceX, pieceY);
                for (; i < 100;) {
                    var file = _(this.blocks).clone();
                    var type = file.name;
                    if ("block_8_merged" === type) {
                        if (this._containsStadium) {
                            i++;
                            continue;
                        }
                        /** @type {boolean} */
                        this._containsStadium = true;
                        fileTooLarge = file;
                        break;
                    }
                    if (piece.indexOf(type) === -1) {
                        fileTooLarge = file;
                        break;
                    }
                    i++;
                }
                return fileTooLarge;
            },
            _getRandomChunk : function(x, y) {
                var matrix = new THREE.Matrix4;
                var matrixWorldInverse = (new THREE.Matrix4).makeRotationY(Math.PI / 2);
                var self = new THREE.Object3D;
                /** @type {string} */
                self.name = "chunk";
                var block = this._getRandomBlockAt(x, y);
                /** @type {number} */
                var defaultYPos = Math.round(4 * Common.random()) * (Math.PI / 2);
                /** @type {number} */
                block.rotation.y = defaultYPos;
                block.position.set(0, 0, 0);
                self.add(block);
                self.block = block;
                /** @type {!Array} */
                var d = [];
                var result = _(this.lanes).clone();
                result.position.set(-30, 0, 10);
                self.add(result);
                d.push(result);
                var object = _(this.lanes).clone();
                object.position.set(-30, 0, -10);
                matrix.makeTranslation(0, 0, -20);
                object.geometry = object.geometry.clone();
                result.geometry = result.geometry.clone();
                object.geometry.applyMatrix(matrix);
                d.push(object);
                var mesh = _(this.lanes).clone();
                mesh.position.set(-10, 0, -30);
                /** @type {number} */
                mesh.rotation.y = Math.PI / 2;
                d.push(mesh);
                matrix.makeTranslation(20, 0, -40);
                mesh.geometry = mesh.geometry.clone();
                mesh.geometry.applyMatrix(matrixWorldInverse);
                mesh.geometry.applyMatrix(matrix);
                var o = _(this.lanes).clone();
                o.geometry = o.geometry.clone();
                o.position.set(10, 0, -30);
                /** @type {number} */
                o.rotation.y = Math.PI / 2;
                matrix.makeTranslation(40, 0, -40);
                o.geometry.applyMatrix(matrixWorldInverse);
                o.geometry.applyMatrix(matrix);
                d.push(o);
                var g = result.geometry.join([object.geometry, mesh.geometry, o.geometry]);
                result.geometry = g;
                var r = _(this.intersections).clone();
                if (r.position.set(-30, 0, 30), self.add(r), d.forEach(function(index) {
                    /** @type {number} */
                    var e = window.isMobile ? .2 : .35;
                    if (Common.random() < e) {
                        var id = _(this.carObjects).clone();
                        var tab = new Tab(this, id, index);
                        self.add(tab);
                        this.mobs.push(tab);
                    }
                }, this), Common.random() > .65) {
                    var hex = _(this.cloudObjects).clone();
                    var b = new Buffer(this, hex);
                    self.add(b);
                    this.mobs.push(b);
                }
                return self.traverse(function(object) {
                    if (object instanceof THREE.Mesh && object.material && object.material.pbr) {
                        /** @type {boolean} */
                        object.material.defines.USE_FOG = true;
                        if (object instanceof Buffer == false) {
                            /** @type {boolean} */
                            object.receiveShadow = true;
                            /** @type {boolean} */
                            object.material.defines.USE_SHADOWMAP = true;
                            /** @type {boolean} */
                            object.material.defines[options.SHADOWMAP_TYPE] = true;
                        }
                    }
                }), self;
            },
            _generate : function() {
                /** @type {number} */
                var i = 0;
                for (; i < options.TABLE_SIZE; i++) {
                    /** @type {number} */
                    var x = 0;
                    for (; x < options.TABLE_SIZE; x++) {
                        if (void 0 === this.chunks[x]) {
                            /** @type {!Array} */
                            this.chunks[x] = [];
                        }
                        var n = this._getRandomChunk(x, i);
                        /** @type {number} */
                        n.tableX = x;
                        /** @type {number} */
                        n.tableY = i;
                        this.chunks[x][i] = {
                            node : n
                        };
                    }
                }
            }
        });
        /** @type {function(!Function, !Object, number, ?, ?): undefined} */
        module.exports = update;
    }, {
        46 : 46,
        49 : 49,
        50 : 50,
        59 : 59
    }],
    49 : [function(floor, module, n) {
        var startYNew = floor("50");
        var a = floor("55");
        var w = floor("59");
        /** @type {number} */
        var ratio = .05;
        /** @type {number} */
        var planetsSpeed = 2;
        /**
         * @param {!Function} name
         * @param {!Object} obj
         * @return {undefined}
         */
        var render = function(name, obj) {
            a.call(this, name);
            this.add(obj);
            this.position.set(w.random() * startYNew.CHUNK_SIZE - startYNew.CHUNK_SIZE / 2, 60, w.random() * startYNew.CHUNK_SIZE - startYNew.CHUNK_SIZE / 2);
            /** @type {number} */
            this.delay = 5 * w.random();
            /** @type {number} */
            this.speedModifier = .25 * w.random() + 1;
            /** @type {number} */
            this.moveSpeed = .05 * this.speedModifier;
            this.maxScalar = this.scale.x + this.scale.x * ratio;
            /** @type {number} */
            this.minScalar = this.scale.x - this.scale.x * ratio;
            /** @type {number} */
            this.rotation.y = .25;
            this.direction = new THREE.Vector3(-1, 0, .3);
        };
        render.inherit(a, {
            update : function() {
                var value = new THREE.Vector3;
                return function(event) {
                    var n = THREE.Math.mapLinear(Math.sin((this.delay + event.elapsed) * planetsSpeed), -1, 1, 0, 1);
                    this.scale.setScalar(this.minScalar + (this.maxScalar - this.minScalar) * n);
                    value.copy(this.direction).multiplyScalar(this.moveSpeed);
                    this.position.add(value);
                    this._updateTablePosition();
                };
            }()
        });
        /** @type {function(!Function, !Object): undefined} */
        module.exports = render;
    }, {
        50 : 50,
        55 : 55,
        59 : 59
    }],
    50 : [function(canCreateDiscussions, context, n) {
        var state = {
            FPS : false,
            LOG_CALLS : false,
            RANDOM_SEED : "infinitown",
            RANDOM_SEED_ENABLED : false,
            MAX_PIXEL_RATIO : 1.25,
            SHADOWMAP_RESOLUTION : window.isMobile ? 1024 : 2048,
            SHADOWMAP_TYPE : "SHADOWMAP_TYPE_PCF",
            TABLE_SIZE : 9,
            CHUNK_COUNT : 9,
            CHUNK_SIZE : 60,
            CAMERA_ANGLE : .5,
            PAN_SPEED : window.isMobile ? .4 : .1,
            FOG_NEAR : 225,
            FOG_FAR : 325,
            FOG_COLOR : 10676479
        };
        context.exports = state;
    }, {}],
    51 : [function(canCreateDiscussions, mixin, n) {
        /** @type {!Array} */
        mixin.exports = ["textures/white.png", "textures/normal.png", "textures/vignetting.png"];
    }, {}],
    52 : [function(require, context, n) {
        /**
         * @param {!Object} touches
         * @return {?}
         */
        function getDistance(touches) {
            return Math.sqrt((touches[0].clientX - touches[1].clientX) * (touches[0].clientX - touches[1].clientX) + (touches[0].clientY - touches[1].clientY) * (touches[0].clientY - touches[1].clientY));
        }
        var canvas = require("3");
        // require("33")($);
        /**
         * @param {!Object} obj
         * @return {undefined}
         */
        var init = function(obj) {
            /** @type {boolean} */
            var e = false;
            /** @type {number} */
            var radius = 0;
            obj = void 0 !== obj ? obj : window;
            $(obj).on("mousedown", function(event) {
                var e = {
                    x : event.pageX,
                    y : event.pageY
                };
                this.trigger("startdrag", e);
            }.bind(this));
            $(obj).on("mouseup", function(event) {
                var e = {
                    x : event.pageX,
                    y : event.pageY
                };
                this.trigger("enddrag", e);
            }.bind(this));
            $(obj).on("mousemove", function(event) {
                var e = {
                    x : event.pageX,
                    y : event.pageY
                };
                this.trigger("drag", e);
            }.bind(this));
            $(obj).on("mouseleave", function(event) {
                var e = {
                    x : event.pageX,
                    y : event.pageY
                };
                this.trigger("enddrag", e);
            }.bind(this));
            $(obj).on("touchstart", function(event) {
                if (2 === event.touches.length) {
                    /** @type {boolean} */
                    e = true;
                    radius = getDistance(event.originalEvent.touches);
                    this.trigger("pinchstart");
                } else {
                    if (1 === event.touches.length) {
                        var startP1 = {
                            x : event.touches[0].pageX,
                            y : event.touches[0].pageY
                        };
                        this.trigger("startdrag", startP1);
                    }
                }
            }.bind(this));
            $(obj).on("touchend", function(event) {
                var startP1 = {
                    x : 0,
                    y : 0
                };
                if (0 === event.originalEvent.touches.length) {
                    if (e) {
                        /** @type {boolean} */
                        e = false;
                        this.trigger("pinchend");
                    }
                    this.trigger("enddrag", startP1);
                }
            }.bind(this));
            $(obj).on("touchmove", function(event) {
                if (e) {
                    var touches = event.originalEvent.touches;
                    if (2 === touches.length) {
                        /** @type {number} */
                        var y1 = getDistance(touches) - radius;
                        /** @type {number} */
                        var sql_date = Math.max(1 + y1 / 100, 0);
                        this.trigger("pinchchange", sql_date);
                    }
                } else {
                    var startP1 = {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                    this.trigger("drag", startP1);
                }
                event.preventDefault();
            }.bind(this));
            $(obj).on("mousewheel", function(touch) {
                var dy = touch.deltaY;
                this.trigger("mousewheel", dy);
            }.bind(this));
        };
        init.mixin(canvas);
        /** @type {function(!Object): undefined} */
        context.exports = init;
    }, {
        3 : 3,
        33 : 33
    }],
    53 : [function(require, canCreateDiscussions, n) {
        /**
         * @param {string} name
         * @param {!Object} options
         * @param {string} time
         * @param {!Function} r
         * @return {undefined}
         */
        function initialize(name, options, time, r) {
            var _infoMemory = {
                geometries : [name],
                textures : p,
                sh : [time]
            };
            var downloader = new EventEmitter(_infoMemory);
            downloader.load().then(function(n) {
                /** @type {string} */
                scope.texturePath = "assets/" + name + "/";
                THREE.MaterialLoader.setShaders(albumInfoUrl);
                instance.loadScene(name, "assets/scenes/", options).then(r);
            });
        }
        /**
         * @return {undefined}
         */
        function load() {
            /** @type {string} */
            var container = "main";
            /** @type {string} */
            var step = "envProbe";
            options = new Scene({
                canvas : document.querySelector("canvas"),
                autoClear : false,
                fps : Config.FPS || false,
                logCalls : Config.LOG_CALLS || false,
                maxPixelRatio : Config.MAX_PIXEL_RATIO || 2
            });
            initialize(container, options, step, function(t) {
                window.api.trigger("loaded");
                setTimeout(function() {
                    options.start(t);
                    window.api.trigger("started");
                }, 20);
            });
            $(document).on("click", function() {
                window.api.trigger("click");
            });
        }
        require("18");
        var o = require("3");
        var EventEmitter = require("14");
        var scope = require("15");
        var instance = require("17");
        var Scene = require("43");
        var Config = require("50");
        var albumInfoUrl = require("44");
        var p = require("51");
        $("canvas");
        /**
         * @param {?} status
         * @param {number} e
         * @param {?} i
         * @return {undefined}
         */
        scope.manager.onProgress = function(status, e, i) {
            /** @type {number} */
            var patternLen = 57;
            /** @type {number} */
            var modifiedEventData = Math.ceil(e / patternLen * 100);
            window.api.trigger("loadingprogress", modifiedEventData);
        };
        var options;
        if (window.parent === window) {
            load();
        }
        /**
         * @return {undefined}
         */
        var utils = function() {
        };
        utils.inherit(Object, {
            pause : function() {
                options.pause();
            },
            resume : function() {
                options.resume();
            },
            load : load
        });
        utils.mixin(o);
        window.api = new utils;
    }, {
        14 : 14,
        15 : 15,
        17 : 17,
        18 : 18,
        28 : 28,
        3 : 3,
        43 : 43,
        44 : 44,
        50 : 50,
        51 : 51
    }],
    54 : [
    ],
    55 : [function(require, module, n) {
        var rect = require("50");
        var $ = require("59");
        /** @type {number} */
        var MIN_BUFFER_ROWS = rect.CHUNK_SIZE * rect.TABLE_SIZE;
        var clamp = THREE.Math.euclideanModulo;
        /**
         * @param {string} data
         * @return {undefined}
         */
        var render = function(data) {
            THREE.Object3D.call(this);
            /** @type {null} */
            this.previousChunk = null;
            /** @type {string} */
            this.table = data;
            this.tablePosition = new THREE.Vector3;
            this.lastTablePosition = new THREE.Vector3;
            this.lastPosition = new THREE.Vector3;
        };
        render.inherit(THREE.Object3D, {
            _updateTablePosition : function() {
                $.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, this.tablePosition);
                if (0 === this.lastTablePosition.length()) {
                    this.lastTablePosition.copy(this.tablePosition);
                }
                /** @type {number} */
                var t = this.tablePosition.x - this.lastTablePosition.x;
                /** @type {number} */
                var e = this.tablePosition.z - this.lastTablePosition.z;
                this.lastTablePosition.copy(this.tablePosition);
                /** @type {number} */
                var i = Math.floor(clamp(this.tablePosition.x + 40, MIN_BUFFER_ROWS) / rect.CHUNK_SIZE);
                /** @type {number} */
                var name = Math.floor(clamp(this.tablePosition.z + 40, MIN_BUFFER_ROWS) / rect.CHUNK_SIZE);
                var context = this.parent;
                var dom = this.table.chunks[i][name].node;
                if (Math.abs(t) < 500 && Math.abs(t) > 20 && console.log("warp on X", t, context.tableX, dom.tableX), Math.abs(e) < 500 && Math.abs(e) > 20 && console.log("warp on Z", e, context.tableY, dom.tableY), this.previousChunk !== context && context !== dom, this.lastPosition.copy(this.position), dom !== context) {
                    dom.add(this);
                    /** @type {number} */
                    var min_x = clamp(this.position.x + 40, rect.CHUNK_SIZE) - 40;
                    /** @type {number} */
                    var _depth = clamp(this.position.z + 40, rect.CHUNK_SIZE) - 40;
                    /** @type {number} */
                    this.position.x = min_x;
                    /** @type {number} */
                    this.position.z = _depth;
                }
                this.previousChunk = context;
            }
        });
        /** @type {function(string): undefined} */
        module.exports = render;
    }, {
        50 : 50,
        59 : 59
    }],
    56 : [function(saveNotifs, module, n) {
        var Base = THREE.OrthographicCamera;
        /** @type {function(number): undefined} */
        var $ = (saveNotifs("7"), function(hValue) {
            Base.call(this);
            /** @type {number} */
            var r = window.innerWidth / window.innerHeight;
            /** @type {number} */
            this.left = hValue / -2 * r;
            /** @type {number} */
            this.right = hValue / 2 * r;
            /** @type {number} */
            this.top = hValue / 2;
            /** @type {number} */
            this.bottom = hValue / -2;
            /** @type {number} */
            this.near = .01;
            /** @type {number} */
            this.far = 500;
            this.updateProjectionMatrix();
        });
        $.inherit(Base, {
            update : function() {
            }
        });
        /** @type {function(number): undefined} */
        module.exports = $;
    }, {
        7 : 7
    }],
    57 : [function($, context, n) {
        var et = $("50");
        var canvas = $("3");
        var ndc = new THREE.Vector2;
        /**
         * @param {!Function} obj
         * @param {!Object} scene
         * @param {!Object} camera
         * @return {undefined}
         */
        var init = function(obj, scene, camera) {
            /** @type {boolean} */
            this._panning = false;
            this._startCoords = new THREE.Vector2;
            this._lastOffset = new THREE.Vector2;
            this._offset = new THREE.Vector2;
            this._speed = new THREE.Vector3(et.PAN_SPEED, 0, et.PAN_SPEED);
            this._sceneOffset = new THREE.Vector3;
            this._worldOffset = new THREE.Vector3;
            /** @type {!Function} */
            this.inputManager = obj;
            /** @type {!Object} */
            this._scene = scene;
            this.inputManager.on("startdrag", this._onStartDrag, this);
            this.inputManager.on("enddrag", this._onEndDrag, this);
            this.inputManager.on("drag", this._onDrag, this);
            /** @type {!Object} */
            this._camera = camera;
            this._raycaster = new THREE.Raycaster;
            /** @type {boolean} */
            this.enabled = true;
        };
        init.inherit(Object, {
            _onStartDrag : function(e) {
                if (this.enabled) {
                    /** @type {boolean} */
                    this._panning = true;
                    this._startCoords.set(e.x, e.y);
                }
            },
            _onEndDrag : function(e) {
                if (this.enabled) {
                    /** @type {boolean} */
                    this._panning = false;
                    this._lastOffset.copy(this._offset);
                }
            },
            _onDrag : function(canCreateDiscussions) {
                var vector = new THREE.Vector2;
                return function(planeOrigin) {
                    if (this.enabled && this._panning) {
                        vector.subVectors(planeOrigin, this._startCoords);
                        this._offset.addVectors(this._lastOffset, vector);
                    }
                };
            }(),
            raycast : function() {
                this._raycaster.setFromCamera(ndc, this._camera);
                var intersectors = this._raycaster.intersectObjects(this._scene.getPickables());
                if (intersectors.length > 0) {
                    var settings = intersectors[0].object;
                    this._sceneOffset.x += settings.centeredX * et.CHUNK_SIZE;
                    this._sceneOffset.z += settings.centeredY * et.CHUNK_SIZE;
                    if (!(0 === settings.centeredX && 0 === settings.centeredY)) {
                        this.trigger("move", settings.centeredX, settings.centeredY);
                    }
                }
            },
            update : function() {
                var offset = new THREE.Vector2;
                var angle = new THREE.Vector2;
                var point = new THREE.Vector3;
                return function() {
                    this.raycast();
                    offset.copy(this._offset);
                    offset.rotateAround(angle, -Math.PI / 4);
                    this._worldOffset.set(offset.x, 0, offset.y).multiply(this._speed);
                    point.lerp(this._worldOffset, .05);
                    this._scene.position.addVectors(this._sceneOffset, point);
                };
            }()
        });
        init.mixin(canvas);
        /** @type {function(!Function, !Object, !Object): undefined} */
        context.exports = init;
    }, {
        3 : 3,
        50 : 50
    }],
    58 : [function(canCreateDiscussions, module, n) {
        var ctor = THREE.PerspectiveCamera;
        var value = new THREE.Vector3;
        /**
         * @return {undefined}
         */
        var $ = function() {
            ctor.apply(this, arguments);
            /** @type {number} */
            this.targetHeight = 140;
        };
        $.inherit(ctor, {
            updateHeight : function() {
                /** @type {number} */
                var length = 1E3;
                /** @type {number} */
                var vertCoords = -100;
                return function(i, canCreateDiscussions) {
                    /** @type {number} */
                    i = i * vertCoords;
                    length = length + i;
                    /** @type {number} */
                    length = Math.min(Math.max(length + i, 0), 1E3);
                    this.targetHeight = THREE.Math.mapLinear(length, 0, 1E3, 30, 140);
                    if (canCreateDiscussions) {
                        this.position.y = this.targetHeight;
                    }
                };
            }(),
            update : function() {
                this.position.y += .05 * (this.targetHeight - this.position.y);
                this.lookAt(value);
            }
        });
        /** @type {function(): undefined} */
        module.exports = $;
    }, {}],
    59 : [function($, module, n) {
        var seg = $("50");
        var types = {
            random : function() {
                return function() {
                    return seg.RANDOM_SEED_ENABLED ? colContentLeft() : Math.random();
                };
            }(),
            roundVector : function(center, size) {
                if (void 0 === size || 0 === size) {
                    return center.round(), center;
                }
                /** @type {number} */
                var scale = Math.pow(10, size);
                return center.x = Math.round(center.x * scale) / scale, center.y = Math.round(center.y * scale) / scale, center.z = Math.round(center.z * scale) / scale, center;
            },
            getTablePosition : function(origin, scale, radius, first) {
                return first.x = seg.CHUNK_SIZE * scale + origin.x, first.z = seg.CHUNK_SIZE * radius + origin.z, first;
            }
        };
        module.exports = types;
    }, {
        35 : 35,
        50 : 50
    }],
    60 : [function(parseValueFn, context, n) {
        var value = parseValueFn("15");
        /**
         * @return {undefined}
         */
        var init = function() {
            this._quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
            /** @type {boolean} */
            this._quad.frustumCulled = false;
            this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            this._scene = new THREE.Scene;
            this._scene.add(this._quad);
            this._quad.material = new THREE.MeshBasicMaterial({
                map : value.getTexture("textures/vignetting.png"),
                transparent : true,
                opacity : .25
            });
        };
        init.inherit(Object, {
            render : function(renderer) {
                renderer.render(this._scene, this._camera);
            }
        });
        /** @type {function(): undefined} */
        context.exports = init;
    }, {
        15 : 15
    }]
}, {}, [53]);
