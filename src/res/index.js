let jsonEdit = new JsonEdit("app");

jsonEdit.renderByData({ a: "zz", b: "xx", c: ["x", "y", "z", true, false, null, { k: 1, l: "1" }] });

document.getElementById("output").onclick = function() {
    let out = jsonEdit.getData();
    console.log("out", out);
};
