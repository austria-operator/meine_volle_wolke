"use strict";
/* hi, dies ist ein kleines programm dass den Nextcloudlink der FPÖ mit ddg image results vollspammen kann
//
// Was man braucht: nodejs, npm, bash, internet, keine Mitglidschaft in der FPÖ
//
// wie man installiert:
// - diese datei in einen ordner herunterladen
// - diesen Ordner im Terminal öffnen
// - Ausführen: "npm init" (einfach überall einter drücken)
// - Ausführen: "npm add ddgimages-node"
// - Ausführen: "node index.js" (oder wie auch immer die datei bei euch heißt)
//
// fertig installiert, nun nur noch ausführen:
// node index.js <rounds> <searchterm...>
// rounds - anzahl an bildern die man hochlät
// searchterm... nach was gesucht werden soll (alles danach ist auch searchterm)
// ---
// beispiele:
// node index.js 10 FPÖ nazis		- sucht nach "FPÖ nazis"	und nimmt die obersten 10 Bilder
// node index.js 40 corona virus	- sucht nach "corona virus"	und nimmt die obersten 40 Bilder
//
// ich empfehle euch eine VPN oder noch besser TOR zu nutzen, dass man nicht zurückverfolgt wird.
//
// dieses Programm läuft nur auf Linux mit bash installiert (wahrscheinlich auch auf minGW aber seht selbst)
// für minGW muss die datei "./cloudsend.sh" angepasst werden.
//
// Viel Spaß, aus DE!
// ---
// natürlich dürft ihr die datei bearbeiten und weiter verbreiten
// LICENSE: public-domain
// ---
// ich als Autor will (aus rechtlichen Gründen) unbekannt bleiben, danke!
//
// fun facts:
// - hab gedacht die Partei heist ÖVP
// - dieses Programm ist nicht gut geschrieben
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var ddgimages_node_1 = require("ddgimages-node");
var http_1 = require("http");
var https_1 = require("https");
var util_1 = require("util");
var child_process_1 = require("child_process");
var exec = util_1["default"].promisify(child_process_1.exec);
var http_get = util_1["default"].promisify(http_1["default"].get);
var https_get = util_1["default"].promisify(https_1["default"].get);
// config:
var ul = "https://meinewolke.fpoe-klub.at/s/ycMtLXi7aEKQk3L";
var uploader = "./cloudsend.sh <file> " + ul;
var delay = 10000; //ms (1000ms = 1s)
var tmpdir = "./tmp"; // temp str for pictures
var searchterm = process.argv[3];
for (var i = 0; i < process.argv.length - 4; i++) {
    searchterm += " " + process.argv[i + 4];
}
var rounds = Number(process.argv[2]);
if (!searchterm || !rounds) {
    console.log("Usage: index.js <rounds> <searchterm...>");
    process.exit();
}
console.log("[CONF] uploading dest: \"".concat(ul, "\""));
console.log("[CONF] search term:    \"".concat(searchterm, "\""));
console.log("[SCHEDULER] scheduling ".concat(rounds, " ").concat(delay, "ms apart."));
var _loop_1 = function (i) {
    setTimeout(function () { return doround(i)
        .then(function (msg) {
        console.log(msg);
    })["catch"](function (msg) {
        console.error(msg);
    }); }, delay * i);
};
for (var i = 0; i < rounds; i++) {
    _loop_1(i);
}
var downloadFile = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    var client, res, time, d, path;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = https_get;
                if (result.image.includes('http://'))
                    client = http_get;
                return [4 /*yield*/, http_get(result.image)];
            case 1:
                res = _a.sent();
                console.log(res);
                time = Math.floor(Math.random() * (Date.now() / 1000 - 1637303408)) + 1637303408;
                d = new Date(time * 1000);
                path = "".concat(tmpdir, "/IMG_2021").concat((d.getMonth() + 1).toString().padStart(2, '')).concat(d.getDate().toString().padStart(2, ''), "_").concat(d.getHours().toString().padStart(2, '')).concat(d.getMinutes().toString().padStart(2, '')).concat(d.getSeconds().toString().padStart(2, ''), ".jpg");
                console.log("[SEARCH] downloaded picture! storing in ".concat(path));
                fs_1["default"].writeFileSync(path, String(res));
                return [2 /*return*/, (path)];
        }
    });
}); };
function doround(i) {
    return __awaiter(this, void 0, void 0, function () {
        var results, path, cmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SEARCH] searchingfor \"".concat(searchterm, "\""));
                    return [4 /*yield*/, ddgimages_node_1["default"].search(searchterm)];
                case 1:
                    results = _a.sent();
                    console.log("[SEARCH] results: ".concat(results[i].image));
                    return [4 /*yield*/, downloadFile(results[i])];
                case 2:
                    path = _a.sent();
                    cmd = uploader.replace("<file>", path);
                    console.log("[UPLOAD] starting uploading process with command \"".concat(cmd, "\""));
                    return [4 /*yield*/, exec(cmd)];
                case 3:
                    _a.sent();
                    console.log("[UPLOAD] uploaded file \"".concat(path, "\" to ").concat(ul));
                    fs_1["default"].unlinkSync(path);
                    return [2 /*return*/];
            }
        });
    });
}
