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

    let lineString = `<div class="lje-line {#isRoot}">
                        <div class="lje-cols type-{#type}">
                            <div class="lje-col key">
                                <div class="lje-ipt">
                                    <input type="text" {#keyDis} value="{#key}" />
                                </div>
                            </div>
                            <div class="lje-col icon is">
                                <div class="lje-is">:</div>
                            </div>
                            <div class="lje-col select">
                                <div class="lje-select">
                                    <span class="select-c">
                                        <select lje="sel">
                                            <option value="sting" {#stringType}>string</option>
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
                            <div class="lje-col full">
                                <div class="lje-ipt">
                                    <input type="text" lje="val" value="{#value}" />
                                </div>
                            </div>
                            <div class="lje-col icon add">
                                <div class="lje-add" lje-click="add"></div>
                            </div>
                            <div class="lje-col icon remove">
                                <div class="lje-remove" lje-click="remove"></div>
                            </div>
                        </div>
                        <div class="lje-child {#isKey}">{#child}</div>
                    </div>`.replace(/>\s+</g, "><");
    function getLineStr(type, value, key, child) {
        // console.log("xxxx>>>>", type, value, key);
        let obj = {
            type
        };
        if (key == "#") {
            obj.isRoot = "the-key";
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

    let domCache = document.createElement("div");
    function getDomByData(value, key) {
        domCache.innerHTML = getHTMLByData(value, key);
        return domCache.firstChild;
    }

    function getDomByLJE(cols) {
        let doms = cols.getElementsByTagName("*");
        let domObj = {
            $: cols.parentNode,
            $cols: cols,
            $child: cols.nextElementSibling
        };
        for (let i = 0; i < doms.length; i += 1) {
            let dom = doms[i];
            let key = dom.getAttribute("lje");
            if (key) {
                domObj[key] = dom;
            }
        }
        return domObj;
    }

    let events = {
        change(cols, type) {
            let $ = getDomByLJE(cols);
            $.$cols.className = "lje-cols type-" + type;
            $.$child.className = "lje-child" + (type == "object" ? " the-key" : "");
            if (type == "number") {
                $.val.value = $.val.value.replace(/\D/g, "") || 0;
                return;
            }
            if (["object", "array"].indexOf(type) < 0) {
                $.$child.innerHTML = "";
            }
        },
        add(cols) {
            let $ = getDomByLJE(cols);
            let theNew = getDomByData("");
            $.$child.appendChild(theNew);
        },
        remove(cols) {
            let line = cols.parentNode;
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
                    events.change(target.parentNode.parentNode.parentNode.parentNode, type);
                }
            };
            this.$.onclick = function(event) {
                let target = event.target;
                let fn = events[target.getAttribute("lje-click")];
                fn && fn(target.parentNode.parentNode);
            };
        }

        renderByData(json = {}) {
            this.$.innerHTML = '<div class="locus-json-edit">' + getHTMLByData(json, "#") + "</div>";
        }
    }

    return JsonEdit;
});
