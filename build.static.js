const fs = require("fs");
const join = require("path").join;
const basename = require("path").basename;
const extname = require("path").extname;
const rootdir = process.cwd();


function unique(list) {
    var res = [];
    var json = {};
    for (var i = 0; i < list.length; i++) {
        if (!json[list[i]]) {
            res.push(list[i]);
            json[list[i]] = 1;
        }
    }
    return res;
}

function removeXImage(list) {
    var expr = /\@[123]x\./i;
    for (var i = 0; i < list.length; i++) {
        if (expr.test(list[i])) {
            list[i] = list[i].replace(expr, ".");
        }
    }
    return unique(list);
}

function build(dirname, outfile, ignoreExt, globalName, requireDir, isImage) {
    if (!fs.existsSync(dirname)) return;
    dirname = join(rootdir, dirname);
    outfile = join(rootdir, outfile);

    var content = "";
    if (globalName != null) {
        content += "global." + globalName + "={};\n";
    }

    var list = fs.readdirSync(dirname);
    if (isImage) {
        list = removeXImage(list);
    }
    list.forEach(function (item) {
        if (item == ".DS_Store" || item == "index.js") {
            return;
        }
        var ext = extname(item);
        if (ext.length == 0) {
            var dirList = fs.readdirSync(join(dirname, item));
            dirList.forEach((v) => {
                if (v == ".DS_Store" || v == "index.js") {
                    return;
                }
                if (item == "ui") return;
                var name = basename(v, ignoreExt ? extname(v) : "");
                var exportName = (name.indexOf(".") >= 0 || name.indexOf("/") >= 0) ? ("['" + name + "']") : ("." + name)
                var exportStr = globalName != null ? ("global." + globalName + exportName) : ("exports" + exportName);
                v = requireDir ? (requireDir + "/" + v) : v;
                if (globalName) {
                    content += exportStr + " = require('./" + v + "');\n";
                }
                else {
                    content += 'export { default as ' + name + ' } from "./' + item + '/' + name + '";\n';
                }
            });
        } else {
            var name = basename(item, ignoreExt ? extname(item) : "");
            var exportName = (name.indexOf(".") >= 0 || name.indexOf("/") >= 0) ? ("['" + name + "']") : ("." + name)
            var exportStr = globalName != null ? ("global." + globalName + exportName) : ("exports" + exportName);
            item = requireDir ? (requireDir + "/" + item) : item;
            if (globalName) {
                content += exportStr + " = require('./" + item + "');\n";
            }
            else {
                content += 'export { default as ' + name + ' } from "./' + name + '";\n';
            }
        }
    });

    fs.writeFileSync(outfile, content);
}

build("images", "images/index.js", false, "STATIC_IMAGES", null, true);
