<p align="center">
   <a href="https://www.npmjs.com/package/h5-json-edit">
   		<img src="https://img.shields.io/npm/v/h5-json-edit.svg?style=flat" alt="npm">
   </a>
   <a href="https://www.npmjs.com/package/h5-json-edit">
   		<img src="https://img.shields.io/npm/dm/h5-json-edit.svg?style=flat" alt="npm">
   </a>
</p>

## h5-json-edit

提供页面编辑 json 字符串的能力

## 运行 demo

-   npm install
-   npm install gulp -g (安装过可以忽略)
-   gulp
-   浏览器中输入http://127.0.0.1:3102 (PC)
-   浏览器中输入http://ip:3102 (手机浏览器)

## 获取 h5-json-edit

-   npm i h5-json-edit
-   github 下载 zip 包，dist/lib/json-edit.js，可以直接引入 到页面
-   主要：引入的 JS，无样式，样式参照 src/res/style.less 或者 dist/res/style.less

## 实例

```html
<!-- 按钮输出 -->
<span class="btn" id="output">输出</span>
<!-- 需要设置好固定的宽和高 -->
<div id="app" class="app"></div>
```

```javascript
// 第一个参数是id 或者 dom
let jsonEdit = new JsonEdit("app");

// 初始化数据
jsonEdit.renderByData({ a: "zz", b: "xx", c: ["x", "y", "z", true, false, null, { k: 1, l: "1" }] });

// 点击按钮，输出编辑的json字符串
document.getElementById("output").onclick = function() {
    let out = jsonEdit.getData();
    console.log("out for edit >>>.", out);
};
```

## 样式参照

```less
// json-edit 样式
@main-color: #1c3e64;
@main-height: 22px;
.locus-json-edit {
    height: 100%;
    overflow: auto;
    padding: 5px 0;
    box-sizing: border-box;
    .lje {
        &-line {
            &.the-root {
                > .lje-cols {
                    .sub-key,
                    .sub-is {
                        display: block !important;
                    }
                    .sub-remove {
                        display: none !important;
                    }
                }
            }
        }
        &-cols {
            padding: 1px 10px;
            display: flex;
            &.sub-type-object,
            &.sub-type-array {
                .sub-full {
                    display: none;
                }
            }
            &.sub-type-string,
            &.sub-type-number {
                .sub-add {
                    display: none;
                }
            }
            &.sub-type-null,
            &.sub-type-true,
            &.sub-type-false {
                .sub-add,
                .sub-full {
                    display: none;
                }
            }
        }
        &-col {
            float: left;
            margin-left: 2px;
            &.sub-full {
                flex: 1;
            }
            &.sub-key {
                width: 80px;
            }
            &.sub-icon {
                width: @main-height + 2;
            }
            &.sub-key,
            &.sub-is {
                display: none;
            }
        }
        &-select {
            .-select(@main-color, @main-height);
            border-radius: 3px;
        }
        &-ipt {
            .-ipt(@main-color, @main-height);
            input {
                border-radius: 3px;
            }
        }
        &-remove {
            height: @main-height - 2;
            border: 1px solid #dedede;
            position: relative;
            border-radius: 3px;
            margin: 1px;
            &:before {
                height: 2px;
                background-color: #dedede;
                width: 70%;
                display: block;
                content: "";
                left: 15%;
                top: 9px;
                position: absolute;
            }

            &:hover {
                border-color: @main-color;
                &:before {
                    background-color: @main-color;
                }
            }
        }
        &-add {
            height: @main-height - 2;
            border: 1px solid #dedede;
            position: relative;
            border-radius: 3px;
            margin: 1px;
            &:before {
                height: 2px;
                background-color: #dedede;
                width: 70%;
                display: block;
                content: "";
                left: 15%;
                top: 9px;
                position: absolute;
            }
            &:after {
                width: 2px;
                background-color: #dedede;
                height: 70%;
                display: block;
                content: "";
                left: 9px;
                top: 15%;
                position: absolute;
            }

            &:hover {
                border-color: @main-color;
                &:before,
                &:after {
                    background-color: @main-color;
                }
            }
        }

        &-is {
            height: @main-height;
            border: 1px solid transparent;
            position: relative;
            border-radius: 3px;
            text-align: center;
        }

        &-child {
            padding: 5px 0 5px 15px;
            position: relative;
            &:before {
                content: "";
                width: 0;
                position: absolute;
                top: 5px;
                bottom: 15px;
                border-left: 1px dashed #cccccc;
            }
            &.the-key > .lje-line > .lje-cols {
                .key,
                .is {
                    display: block;
                }
            }
        }
    }
}
```

## 截图

<img src="./img.png" />
