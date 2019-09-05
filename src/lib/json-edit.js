(function(global, factory) {
    // UMD 加载方案
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
        return;
    }
    if (typeof define === "function" && define.amd) {
        define(factory);
        return;
    }
    global.JsonEdit = factory();
})(window, function() {
    "use strict";
    let toString = Object.prototype.toString;
    // 类型判断
    function getValueType(value) {
        let type = toString.call(value).toLowerCase();
        switch (type) {
            case "[object object]":
                return "object";
            case "[object array]":
                return "array";
            case "[object null]":
                return "null";
            case "[object string]":
                return "string";
            case "[object number]":
                return "number";
            case "[object boolean]":
                return value ? "true" : "false";
        }
        return "";
    }

    // 生成唯一的数字
    let keyIndex = 10;
    // 没一行的html结构
    let lineString = `<div class="lje-line {#isRoot}" key="{#id}">
                        <div class="lje-cols sub-type-{#type}" lje{#id}="cols">
                            <div class="lje-col sub-key">
                                <div class="lje-ipt">
                                    <input type="text" lje{#id}="key" {#keyDis} value="{#key}" />
                                </div>
                            </div>
                            <div class="lje-col sub-icon sub-is">
                                <div class="lje-is">:</div>
                            </div>
                            <div class="lje-col sub-select">
                                <div class="lje-select">
                                    <span class="select-c">
                                        <select lje{#id}="sel">
                                            <option value="string" {#stringType}>string</option>
                                            <option value="number" {#numberType}>number</option>
                                            <option value="object" {#objectType}>object</option>
                                            <option value="array" {#arrayType}>array</option>
                                            <option value="null" {#nullType}>null</option>
                                            <option value="true" {#trueType}>true</option>
                                            <option value="false" {#falseType}>false</option>
                                        </select>
                                    </span>
                                </div>
                            </div>
                            <div class="lje-col sub-full">
                                <div class="lje-ipt">
                                    <input type="text" lje{#id}="val" value="{#value}" />
                                </div>
                            </div>
                            <div class="lje-col sub-icon sub-add">
                                <div class="lje-add" lje-click="add"></div>
                            </div>
                            <div class="lje-col sub-icon sub-remove">
                                <div class="lje-remove" lje-click="remove"></div>
                            </div>
                        </div>
                        <div class="lje-child {#isKey}" lje{#id}="child">{#child}</div>
                    </div>`.replace(/>\s+</g, "><");
    
    // 按照数据生成一行数据
    function getLineStr(type, value, key, child) {
        // console.log("xxxx>>>>", type, value, key);
        let obj = {
            type,
            id: keyIndex++
        };
        if (key == "#") {
            obj.isRoot = "the-root";
            obj.key = "root";
            obj.keyDis = "disabled";
        } else if (key) {
            obj.key = key;
        }

        obj[type + "Type"] = "selected";
        obj.child = child;

        if (["number", "string"].indexOf(type) >= 0) {
            obj.value = value;
        }

        if (type == "object") {
            obj.isKey = "the-key";
        }

        return lineString.replace(/\{\#(\w+)\}/g, function(s0, s1) {
            let val = obj[s1];
            return val === undefined ? "" : val;
        });
    }

    // 将数据转换为UI界面（递归）
    function getHTMLByData(value, key) {
        let type = getValueType(value);
        // console.log(type, value);
        if (type == "") {
            return "";
        }
        if (type == "object") {
            let child = [];
            for (let n in value) {
                // console.log(n, value[n]);
                child.push(getHTMLByData(value[n], n));
            }
            // console.log(child);
            return getLineStr(type, value, key, child.join(""));
        }
        if (type == "array") {
            let child = [];
            for (let i = 0; i < value.length; i += 1) {
                child.push(getHTMLByData(value[i]));
            }
            return getLineStr(type, value, key, child.join(""));
        }

        return getLineStr(type, value, key, "");
    }

    // 获取一行的dom
    let domCache = document.createElement("div");
    function getDomByData(value, key) {
        domCache.innerHTML = getHTMLByData(value, key);
        return domCache.firstChild;
    }

    // 获取的定的dom引用
    function getDomByLJE(line) {
        let id = "lje" + line.getAttribute("key");
        let doms = line.querySelectorAll("[" + id + "]");
        let domObj = {
            $: line
        };
        for (let i = 0; i < doms.length; i += 1) {
            let dom = doms[i];
            let key = dom.getAttribute(id);
            if (key) {
                domObj[key] = dom;
            }
        }
        return domObj;
    }

    function getDataByLine(line) {
        let $ = getDomByLJE(line);
        // console.log($);
        let type = $.sel.value;
        if (type == "object") {
            // console.log($.val, 1)
            let val = {};
            $.child.childNodes.forEach(function(item) {
                if (item.nodeType == 1) {
                    let [v, k] = getDataByLine(item);
                    // console.log("zzzzz")
                    if(k) {
                        val[k] = v;
                    }

                    // TODO 需要处理重复字符串
                }
            });
            return [val, $.key.value.trim()];
        }
        if (type == "array") {
            // console.log($.val, 2)
            let arr = [];
            $.child.childNodes.forEach(function(item) {
                if (item.nodeType == 1) {
                    let [v] = getDataByLine(item);
                    arr.push(v);
                }
            });
            return [arr, $.key.value.trim()];
        }

        if (type == "null") {
            // console.log($.val, 3)
            return [null, $.key.value.trim()];
        }

        if (type == "false") {
            // console.log($.val, 4)
            return [false, $.key.value.trim()];
        }

        if (type == "true") {
            // console.log($.val, 5)
            return [true, $.key.value.trim()];
        }

        if (type == "string") {
            // console.log($, 6)
            return [$.val.value.trim(), $.key.value.trim()];
        }
        if (type == "number") {
            // console.log($.val, 7)
            return [Number($.val.value.replace(/\W+/g, "")) || 0, $.key.value.trim()];
        }
        return [undefined, ""];
    }

    let events = {
        // select change
        change(line, type) {
            let $ = getDomByLJE(line);
            $.cols.className = "lje-cols sub-type-" + type;
            $.child.className = "lje-child" + (type == "object" ? " the-key" : "");
            if (type == "number") {
                $.val.value = $.val.value.replace(/\D/g, "") || 0;
                return;
            }
            if (["object", "array"].indexOf(type) < 0) {
                $.child.innerHTML = "";
            }
        },
        // add 按钮
        add(line) {
            let $ = getDomByLJE(line);
            let theNew = getDomByData("");
            $.child.appendChild(theNew);
        },
        // 移除当前行
        remove(line) {
            line.parentNode.removeChild(line);
        }
    };

    class JsonEdit {
        constructor(id) {
            this.$ = typeof id == "string" ? document.getElementById(id) : id;
            this.$.onchange = function(event) {
                let target = event.target;
                if (target.tagName.toLowerCase() == "select") {
                    let type = target.value;
                    events.change(target.parentNode.parentNode.parentNode.parentNode.parentNode, type);
                }
            };
            this.$.onclick = function(event) {
                let target = event.target;
                let fn = events[target.getAttribute("lje-click")];
                fn && fn(target.parentNode.parentNode.parentNode);
            };

            // TODO
            // 对number类型的输入做控制
            // this.$.onkeydown = function(event) {
            //     console.log(event.target);
            // };
        }

        // 将数据传染UI
        renderByData(json = {}) {
            this.$.innerHTML = '<div class="locus-json-edit">' + getHTMLByData(json, "#") + "</div>";
            this.key = keyIndex - 1;
        }

        // 获取UI编辑后的数据
        getData() {
            return getDataByLine(this.$.querySelector('[key="' + this.key + '"]'))[0];
            // let $ = getDomByLJE(this.$.querySelector(".lje-line > .lje-cols"))
            // console.log($)
        }
    }

    return JsonEdit;
});
