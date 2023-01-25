(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ProtonPlayer = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	var es5 = createCommonjsModule(function (module, exports) {
	!function(e,t){module.exports=t();}(commonjsGlobal,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n});},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=90)}({17:function(e,t,r){t.__esModule=!0,t.default=void 0;var n=r(18),i=function(){function e(){}return e.getFirstMatch=function(e,t){var r=t.match(e);return r&&r.length>0&&r[1]||""},e.getSecondMatch=function(e,t){var r=t.match(e);return r&&r.length>1&&r[2]||""},e.matchAndReturnConst=function(e,t,r){if(e.test(t))return r},e.getWindowsVersionName=function(e){switch(e){case"NT":return "NT";case"XP":return "XP";case"NT 5.0":return "2000";case"NT 5.1":return "XP";case"NT 5.2":return "2003";case"NT 6.0":return "Vista";case"NT 6.1":return "7";case"NT 6.2":return "8";case"NT 6.3":return "8.1";case"NT 10.0":return "10";default:return}},e.getMacOSVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),10===t[0])switch(t[1]){case 5:return "Leopard";case 6:return "Snow Leopard";case 7:return "Lion";case 8:return "Mountain Lion";case 9:return "Mavericks";case 10:return "Yosemite";case 11:return "El Capitan";case 12:return "Sierra";case 13:return "High Sierra";case 14:return "Mojave";case 15:return "Catalina";default:return}},e.getAndroidVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),!(1===t[0]&&t[1]<5))return 1===t[0]&&t[1]<6?"Cupcake":1===t[0]&&t[1]>=6?"Donut":2===t[0]&&t[1]<2?"Eclair":2===t[0]&&2===t[1]?"Froyo":2===t[0]&&t[1]>2?"Gingerbread":3===t[0]?"Honeycomb":4===t[0]&&t[1]<1?"Ice Cream Sandwich":4===t[0]&&t[1]<4?"Jelly Bean":4===t[0]&&t[1]>=4?"KitKat":5===t[0]?"Lollipop":6===t[0]?"Marshmallow":7===t[0]?"Nougat":8===t[0]?"Oreo":9===t[0]?"Pie":void 0},e.getVersionPrecision=function(e){return e.split(".").length},e.compareVersions=function(t,r,n){void 0===n&&(n=!1);var i=e.getVersionPrecision(t),s=e.getVersionPrecision(r),a=Math.max(i,s),o=0,u=e.map([t,r],(function(t){var r=a-e.getVersionPrecision(t),n=t+new Array(r+1).join(".0");return e.map(n.split("."),(function(e){return new Array(20-e.length).join("0")+e})).reverse()}));for(n&&(o=a-Math.min(i,s)),a-=1;a>=o;){if(u[0][a]>u[1][a])return 1;if(u[0][a]===u[1][a]){if(a===o)return 0;a-=1;}else if(u[0][a]<u[1][a])return -1}},e.map=function(e,t){var r,n=[];if(Array.prototype.map)return Array.prototype.map.call(e,t);for(r=0;r<e.length;r+=1)n.push(t(e[r]));return n},e.find=function(e,t){var r,n;if(Array.prototype.find)return Array.prototype.find.call(e,t);for(r=0,n=e.length;r<n;r+=1){var i=e[r];if(t(i,r))return i}},e.assign=function(e){for(var t,r,n=e,i=arguments.length,s=new Array(i>1?i-1:0),a=1;a<i;a++)s[a-1]=arguments[a];if(Object.assign)return Object.assign.apply(Object,[e].concat(s));var o=function(){var e=s[t];"object"==typeof e&&null!==e&&Object.keys(e).forEach((function(t){n[t]=e[t];}));};for(t=0,r=s.length;t<r;t+=1)o();return e},e.getBrowserAlias=function(e){return n.BROWSER_ALIASES_MAP[e]},e.getBrowserTypeByAlias=function(e){return n.BROWSER_MAP[e]||""},e}();t.default=i,e.exports=t.default;},18:function(e,t,r){t.__esModule=!0,t.ENGINE_MAP=t.OS_MAP=t.PLATFORMS_MAP=t.BROWSER_MAP=t.BROWSER_ALIASES_MAP=void 0;t.BROWSER_ALIASES_MAP={"Amazon Silk":"amazon_silk","Android Browser":"android",Bada:"bada",BlackBerry:"blackberry",Chrome:"chrome",Chromium:"chromium",Electron:"electron",Epiphany:"epiphany",Firefox:"firefox",Focus:"focus",Generic:"generic","Google Search":"google_search",Googlebot:"googlebot","Internet Explorer":"ie","K-Meleon":"k_meleon",Maxthon:"maxthon","Microsoft Edge":"edge","MZ Browser":"mz","NAVER Whale Browser":"naver",Opera:"opera","Opera Coast":"opera_coast",PhantomJS:"phantomjs",Puffin:"puffin",QupZilla:"qupzilla",QQ:"qq",QQLite:"qqlite",Safari:"safari",Sailfish:"sailfish","Samsung Internet for Android":"samsung_internet",SeaMonkey:"seamonkey",Sleipnir:"sleipnir",Swing:"swing",Tizen:"tizen","UC Browser":"uc",Vivaldi:"vivaldi","WebOS Browser":"webos",WeChat:"wechat","Yandex Browser":"yandex",Roku:"roku"};t.BROWSER_MAP={amazon_silk:"Amazon Silk",android:"Android Browser",bada:"Bada",blackberry:"BlackBerry",chrome:"Chrome",chromium:"Chromium",electron:"Electron",epiphany:"Epiphany",firefox:"Firefox",focus:"Focus",generic:"Generic",googlebot:"Googlebot",google_search:"Google Search",ie:"Internet Explorer",k_meleon:"K-Meleon",maxthon:"Maxthon",edge:"Microsoft Edge",mz:"MZ Browser",naver:"NAVER Whale Browser",opera:"Opera",opera_coast:"Opera Coast",phantomjs:"PhantomJS",puffin:"Puffin",qupzilla:"QupZilla",qq:"QQ Browser",qqlite:"QQ Browser Lite",safari:"Safari",sailfish:"Sailfish",samsung_internet:"Samsung Internet for Android",seamonkey:"SeaMonkey",sleipnir:"Sleipnir",swing:"Swing",tizen:"Tizen",uc:"UC Browser",vivaldi:"Vivaldi",webos:"WebOS Browser",wechat:"WeChat",yandex:"Yandex Browser"};t.PLATFORMS_MAP={tablet:"tablet",mobile:"mobile",desktop:"desktop",tv:"tv"};t.OS_MAP={WindowsPhone:"Windows Phone",Windows:"Windows",MacOS:"macOS",iOS:"iOS",Android:"Android",WebOS:"WebOS",BlackBerry:"BlackBerry",Bada:"Bada",Tizen:"Tizen",Linux:"Linux",ChromeOS:"Chrome OS",PlayStation4:"PlayStation 4",Roku:"Roku"};t.ENGINE_MAP={EdgeHTML:"EdgeHTML",Blink:"Blink",Trident:"Trident",Presto:"Presto",Gecko:"Gecko",WebKit:"WebKit"};},90:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(91))&&n.__esModule?n:{default:n},s=r(18);function a(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}var o=function(){function e(){}var t,r,n;return e.getParser=function(e,t){if(void 0===t&&(t=!1),"string"!=typeof e)throw new Error("UserAgent should be a string");return new i.default(e,t)},e.parse=function(e){return new i.default(e).getResult()},t=e,n=[{key:"BROWSER_MAP",get:function(){return s.BROWSER_MAP}},{key:"ENGINE_MAP",get:function(){return s.ENGINE_MAP}},{key:"OS_MAP",get:function(){return s.OS_MAP}},{key:"PLATFORMS_MAP",get:function(){return s.PLATFORMS_MAP}}],(r=null)&&a(t.prototype,r),n&&a(t,n),e}();t.default=o,e.exports=t.default;},91:function(e,t,r){t.__esModule=!0,t.default=void 0;var n=u(r(92)),i=u(r(93)),s=u(r(94)),a=u(r(95)),o=u(r(17));function u(e){return e&&e.__esModule?e:{default:e}}var d=function(){function e(e,t){if(void 0===t&&(t=!1),null==e||""===e)throw new Error("UserAgent parameter can't be empty");this._ua=e,this.parsedResult={},!0!==t&&this.parse();}var t=e.prototype;return t.getUA=function(){return this._ua},t.test=function(e){return e.test(this._ua)},t.parseBrowser=function(){var e=this;this.parsedResult.browser={};var t=o.default.find(n.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.browser=t.describe(this.getUA())),this.parsedResult.browser},t.getBrowser=function(){return this.parsedResult.browser?this.parsedResult.browser:this.parseBrowser()},t.getBrowserName=function(e){return e?String(this.getBrowser().name).toLowerCase()||"":this.getBrowser().name||""},t.getBrowserVersion=function(){return this.getBrowser().version},t.getOS=function(){return this.parsedResult.os?this.parsedResult.os:this.parseOS()},t.parseOS=function(){var e=this;this.parsedResult.os={};var t=o.default.find(i.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.os=t.describe(this.getUA())),this.parsedResult.os},t.getOSName=function(e){var t=this.getOS().name;return e?String(t).toLowerCase()||"":t||""},t.getOSVersion=function(){return this.getOS().version},t.getPlatform=function(){return this.parsedResult.platform?this.parsedResult.platform:this.parsePlatform()},t.getPlatformType=function(e){void 0===e&&(e=!1);var t=this.getPlatform().type;return e?String(t).toLowerCase()||"":t||""},t.parsePlatform=function(){var e=this;this.parsedResult.platform={};var t=o.default.find(s.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.platform=t.describe(this.getUA())),this.parsedResult.platform},t.getEngine=function(){return this.parsedResult.engine?this.parsedResult.engine:this.parseEngine()},t.getEngineName=function(e){return e?String(this.getEngine().name).toLowerCase()||"":this.getEngine().name||""},t.parseEngine=function(){var e=this;this.parsedResult.engine={};var t=o.default.find(a.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.engine=t.describe(this.getUA())),this.parsedResult.engine},t.parse=function(){return this.parseBrowser(),this.parseOS(),this.parsePlatform(),this.parseEngine(),this},t.getResult=function(){return o.default.assign({},this.parsedResult)},t.satisfies=function(e){var t=this,r={},n=0,i={},s=0;if(Object.keys(e).forEach((function(t){var a=e[t];"string"==typeof a?(i[t]=a,s+=1):"object"==typeof a&&(r[t]=a,n+=1);})),n>0){var a=Object.keys(r),u=o.default.find(a,(function(e){return t.isOS(e)}));if(u){var d=this.satisfies(r[u]);if(void 0!==d)return d}var c=o.default.find(a,(function(e){return t.isPlatform(e)}));if(c){var f=this.satisfies(r[c]);if(void 0!==f)return f}}if(s>0){var l=Object.keys(i),h=o.default.find(l,(function(e){return t.isBrowser(e,!0)}));if(void 0!==h)return this.compareVersion(i[h])}},t.isBrowser=function(e,t){void 0===t&&(t=!1);var r=this.getBrowserName().toLowerCase(),n=e.toLowerCase(),i=o.default.getBrowserTypeByAlias(n);return t&&i&&(n=i.toLowerCase()),n===r},t.compareVersion=function(e){var t=[0],r=e,n=!1,i=this.getBrowserVersion();if("string"==typeof i)return ">"===e[0]||"<"===e[0]?(r=e.substr(1),"="===e[1]?(n=!0,r=e.substr(2)):t=[],">"===e[0]?t.push(1):t.push(-1)):"="===e[0]?r=e.substr(1):"~"===e[0]&&(n=!0,r=e.substr(1)),t.indexOf(o.default.compareVersions(i,r,n))>-1},t.isOS=function(e){return this.getOSName(!0)===String(e).toLowerCase()},t.isPlatform=function(e){return this.getPlatformType(!0)===String(e).toLowerCase()},t.isEngine=function(e){return this.getEngineName(!0)===String(e).toLowerCase()},t.is=function(e,t){return void 0===t&&(t=!1),this.isBrowser(e,t)||this.isOS(e)||this.isPlatform(e)},t.some=function(e){var t=this;return void 0===e&&(e=[]),e.some((function(e){return t.is(e)}))},e}();t.default=d,e.exports=t.default;},92:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n};var s=/version\/(\d+(\.?_?\d+)+)/i,a=[{test:[/googlebot/i],describe:function(e){var t={name:"Googlebot"},r=i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/opera/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/opr\/|opios/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/SamsungBrowser/i],describe:function(e){var t={name:"Samsung Internet for Android"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Whale/i],describe:function(e){var t={name:"NAVER Whale Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/MZBrowser/i],describe:function(e){var t={name:"MZ Browser"},r=i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/focus/i],describe:function(e){var t={name:"Focus"},r=i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/swing/i],describe:function(e){var t={name:"Swing"},r=i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/coast/i],describe:function(e){var t={name:"Opera Coast"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/opt\/\d+(?:.?_?\d+)+/i],describe:function(e){var t={name:"Opera Touch"},r=i.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/yabrowser/i],describe:function(e){var t={name:"Yandex Browser"},r=i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/ucbrowser/i],describe:function(e){var t={name:"UC Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Maxthon|mxios/i],describe:function(e){var t={name:"Maxthon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/epiphany/i],describe:function(e){var t={name:"Epiphany"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/puffin/i],describe:function(e){var t={name:"Puffin"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sleipnir/i],describe:function(e){var t={name:"Sleipnir"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/k-meleon/i],describe:function(e){var t={name:"K-Meleon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/micromessenger/i],describe:function(e){var t={name:"WeChat"},r=i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qqbrowser/i],describe:function(e){var t={name:/qqbrowserlite/i.test(e)?"QQ Browser Lite":"QQ Browser"},r=i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/msie|trident/i],describe:function(e){var t={name:"Internet Explorer"},r=i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/\sedg\//i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/edg([ea]|ios)/i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/vivaldi/i],describe:function(e){var t={name:"Vivaldi"},r=i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/seamonkey/i],describe:function(e){var t={name:"SeaMonkey"},r=i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sailfish/i],describe:function(e){var t={name:"Sailfish"},r=i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i,e);return r&&(t.version=r),t}},{test:[/silk/i],describe:function(e){var t={name:"Amazon Silk"},r=i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/phantom/i],describe:function(e){var t={name:"PhantomJS"},r=i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/slimerjs/i],describe:function(e){var t={name:"SlimerJS"},r=i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t={name:"BlackBerry"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t={name:"WebOS Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/bada/i],describe:function(e){var t={name:"Bada"},r=i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/tizen/i],describe:function(e){var t={name:"Tizen"},r=i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qupzilla/i],describe:function(e){var t={name:"QupZilla"},r=i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/firefox|iceweasel|fxios/i],describe:function(e){var t={name:"Firefox"},r=i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/electron/i],describe:function(e){var t={name:"Electron"},r=i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/MiuiBrowser/i],describe:function(e){var t={name:"Miui"},r=i.default.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/chromium/i],describe:function(e){var t={name:"Chromium"},r=i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/chrome|crios|crmo/i],describe:function(e){var t={name:"Chrome"},r=i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/GSA/i],describe:function(e){var t={name:"Google Search"},r=i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t={name:"Android Browser"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/playstation 4/i],describe:function(e){var t={name:"PlayStation 4"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/safari|applewebkit/i],describe:function(e){var t={name:"Safari"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/.*/i],describe:function(e){var t=-1!==e.search("\\(")?/^(.*)\/(.*)[ \t]\((.*)/:/^(.*)\/(.*) /;return {name:i.default.getFirstMatch(t,e),version:i.default.getSecondMatch(t,e)}}}];t.default=a,e.exports=t.default;},93:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:[/Roku\/DVP/],describe:function(e){var t=i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i,e);return {name:s.OS_MAP.Roku,version:t}}},{test:[/windows phone/i],describe:function(e){var t=i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.WindowsPhone,version:t}}},{test:[/windows /i],describe:function(e){var t=i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i,e),r=i.default.getWindowsVersionName(t);return {name:s.OS_MAP.Windows,version:t,versionName:r}}},{test:[/Macintosh(.*?) FxiOS(.*?)\//],describe:function(e){var t={name:s.OS_MAP.iOS},r=i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/,e);return r&&(t.version=r),t}},{test:[/macintosh/i],describe:function(e){var t=i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i,e).replace(/[_\s]/g,"."),r=i.default.getMacOSVersionName(t),n={name:s.OS_MAP.MacOS,version:t};return r&&(n.versionName=r),n}},{test:[/(ipod|iphone|ipad)/i],describe:function(e){var t=i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i,e).replace(/[_\s]/g,".");return {name:s.OS_MAP.iOS,version:t}}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t=i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i,e),r=i.default.getAndroidVersionName(t),n={name:s.OS_MAP.Android,version:t};return r&&(n.versionName=r),n}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t=i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i,e),r={name:s.OS_MAP.WebOS};return t&&t.length&&(r.version=t),r}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t=i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i,e)||i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i,e)||i.default.getFirstMatch(/\bbb(\d+)/i,e);return {name:s.OS_MAP.BlackBerry,version:t}}},{test:[/bada/i],describe:function(e){var t=i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.Bada,version:t}}},{test:[/tizen/i],describe:function(e){var t=i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.Tizen,version:t}}},{test:[/linux/i],describe:function(){return {name:s.OS_MAP.Linux}}},{test:[/CrOS/],describe:function(){return {name:s.OS_MAP.ChromeOS}}},{test:[/PlayStation 4/],describe:function(e){var t=i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.PlayStation4,version:t}}}];t.default=a,e.exports=t.default;},94:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:[/googlebot/i],describe:function(){return {type:"bot",vendor:"Google"}}},{test:[/huawei/i],describe:function(e){var t=i.default.getFirstMatch(/(can-l01)/i,e)&&"Nova",r={type:s.PLATFORMS_MAP.mobile,vendor:"Huawei"};return t&&(r.model=t),r}},{test:[/nexus\s*(?:7|8|9|10).*/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Nexus"}}},{test:[/ipad/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/Macintosh(.*?) FxiOS(.*?)\//],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/kftt build/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Amazon",model:"Kindle Fire HD 7"}}},{test:[/silk/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Amazon"}}},{test:[/tablet(?! pc)/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet}}},{test:function(e){var t=e.test(/ipod|iphone/i),r=e.test(/like (ipod|iphone)/i);return t&&!r},describe:function(e){var t=i.default.getFirstMatch(/(ipod|iphone)/i,e);return {type:s.PLATFORMS_MAP.mobile,vendor:"Apple",model:t}}},{test:[/nexus\s*[0-6].*/i,/galaxy nexus/i],describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"Nexus"}}},{test:[/[^-]mobi/i],describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "blackberry"===e.getBrowserName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"BlackBerry"}}},{test:function(e){return "bada"===e.getBrowserName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "windows phone"===e.getBrowserName()},describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"Microsoft"}}},{test:function(e){var t=Number(String(e.getOSVersion()).split(".")[0]);return "android"===e.getOSName(!0)&&t>=3},describe:function(){return {type:s.PLATFORMS_MAP.tablet}}},{test:function(e){return "android"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "macos"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop,vendor:"Apple"}}},{test:function(e){return "windows"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return "linux"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return "playstation 4"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.tv}}},{test:function(e){return "roku"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.tv}}}];t.default=a,e.exports=t.default;},95:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:function(e){return "microsoft edge"===e.getBrowserName(!0)},describe:function(e){if(/\sedg\//i.test(e))return {name:s.ENGINE_MAP.Blink};var t=i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i,e);return {name:s.ENGINE_MAP.EdgeHTML,version:t}}},{test:[/trident/i],describe:function(e){var t={name:s.ENGINE_MAP.Trident},r=i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){return e.test(/presto/i)},describe:function(e){var t={name:s.ENGINE_MAP.Presto},r=i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=e.test(/gecko/i),r=e.test(/like gecko/i);return t&&!r},describe:function(e){var t={name:s.ENGINE_MAP.Gecko},r=i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(apple)?webkit\/537\.36/i],describe:function(){return {name:s.ENGINE_MAP.Blink}}},{test:[/(apple)?webkit/i],describe:function(e){var t={name:s.ENGINE_MAP.WebKit},r=i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}}];t.default=a,e.exports=t.default;}})}));
	});

	var Bowser = /*@__PURE__*/getDefaultExportFromCjs(es5);

	class ProtonPlayerError extends Error {
	  constructor(message) {
	    super(message);
	    this.name = 'ProtonPlayerError';
	  }
	}

	function debug(...args) {
	  {
	    console.log(`%c[ProtonPlayer]`, 'color: #e26014; font-weight: bold;', ...args);
	  }
	}

	function warn(...args) {
	  console.warn(`%c[ProtonPlayer]`, 'color: yellow; font-weight: bold;', ...args);
	}

	function error$1(...args) {
	  console.error(`%c[ProtonPlayer]`, 'color: red; font-weight: bold;', ...args);
	}

	let context;
	function getContext() {
	  if (context) return context;

	  context = new (typeof AudioContext !== 'undefined'
	    ? window.AudioContext
	    : window.webkitAudioContext)();
	  return context;
	}

	function noop$1() {}

	let _cachedURL = null;

	const getSilenceURL = () => {
	  if (!_cachedURL) {
	    _cachedURL = URL.createObjectURL(
	      new Blob([getRawSilenceBuffer()], { type: 'audio/mpeg' })
	    );
	  }

	  return _cachedURL;
	};

	const getRawSilenceBuffer = () => {
	  const rawMP3Bytes = hexToBytes(_RAW_SILENCE_MP3);
	  const buffer = new ArrayBuffer(rawMP3Bytes.length);
	  const bufferView = new DataView(buffer);

	  for (let i = 0; i < rawMP3Bytes.length; i++) {
	    bufferView.setUint8(i, rawMP3Bytes[i]);
	  }

	  return buffer;
	};

	const hexToBytes = (s) =>
	  s
	    .split('\n')
	    .join('')
	    .match(/.{1,2}/g)
	    .map((x) => parseInt(x, 16));

	/**
	 * An extremely short hex-encoded MP3 file containing only silence.
	 */
	const _RAW_SILENCE_MP3 = `
fffb7004000ff00000690000000800000d20000001000001a400000020000034800000044c414d45
332e39382e3455555555555555555555555555555555555555555555555555555555555555555555
4c414d45332e39382e34555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555555555555555fffb72047u48ff
00000690000000800000d20000001000001a40000002000003480000004555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555554c414d45332e3
9382e345555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555555555
`;

	// Compatibility: Safari iOS
	// There are many restrictions around how you are able to use the Web Audio
	// API on a mobile device, especially on iOS. One of those restrictions is that
	// initial playback must be initiated within a user gesture handler (`click` or
	// `touchstart`). Since many applications today use things like synthetic
	// event systems, it can be difficult and/or messy to guarantee that the
	// Web Audio API is properly initialized. Worse, when it is not properly
	// initialized, it does not fail loudly: the entire API works, the audio simply
	// does not play.
	//
	// This "hack" hooks into a raw DOM event for the `touchstart` gesture and
	// initializes the Web Audio API by playing a silent audio file. It is
	// guaranteed to trigger when the user interacts with the page, even if the
	// Player itself has not been initialized yet. After the API has been used
	// ONCE within a user gesture handler, it can then be freely utilized in any
	// context across the app.
	//

	let iOSAudioIsInitialized = false;

	function initializeiOSAudioEngine() {
	  if (iOSAudioIsInitialized) return;

	  debug('Initializing iOS Web Audio API');

	  const audioElement = new Audio(getSilenceURL());
	  audioElement.play();

	  iOSAudioIsInitialized = true;
	  window.removeEventListener('touchstart', initializeiOSAudioEngine, false);

	  debug('iOS Web Audio API successfully initialized');
	}

	function initializeiOSAudioEngine$1 () {
	  window.addEventListener('touchstart', initializeiOSAudioEngine, false);
	}

	const SLEEP_CANCELLED = 'SLEEP_CANCELLED';

	class CancellableSleep {
	  constructor(timeout) {
	    this._timeout = timeout;
	    this._sleepOnCancel = noop$1;
	  }

	  wait() {
	    return new Promise((resolve, reject) => {
	      if (this._timeout <= 0) {
	        resolve();
	        return;
	      }
	      const sleepTimeout = setTimeout(resolve, this._timeout);
	      this._sleepOnCancel = () => {
	        reject(SLEEP_CANCELLED);
	        clearTimeout(sleepTimeout);
	      };
	    });
	  }

	  cancel() {
	    this._sleepOnCancel();
	  }
	}

	const mpegVersionLookup = {
	  0: 2,
	  1: 1,
	};
	const mpegLayerLookup = {
	  1: 3,
	  2: 2,
	  3: 1,
	};
	const sampleRateLookup = {
	  0: 44100,
	  1: 48000,
	  2: 32000,
	};
	const channelModeLookup = {
	  0: 'stereo',
	  1: 'joint stereo',
	  2: 'dual channel',
	  3: 'mono',
	};
	function parseMetadata(metadata) {
	  const mpegVersion = mpegVersionLookup[metadata.mpegVersion >> 3];
	  return {
	    mpegVersion,
	    mpegLayer: mpegLayerLookup[metadata.mpegLayer >> 1],
	    sampleRate: sampleRateLookup[metadata.sampleRate >> 2] / mpegVersion,
	    channelMode: channelModeLookup[metadata.channelMode >> 6],
	  };
	}

	class EventEmitter {
	  constructor() {
	    this.callbacks = {};
	  }

	  offAll(eventName) {
	    if (this.callbacks[eventName]) {
	      this.callbacks[eventName] = [];
	    }
	  }

	  off(eventName, cb) {
	    const callbacks = this.callbacks[eventName];
	    if (!callbacks) return;
	    const index = callbacks.indexOf(cb);
	    if (~index) callbacks.splice(index, 1);
	  }

	  on(eventName, cb) {
	    const callbacks = this.callbacks[eventName] || (this.callbacks[eventName] = []);
	    callbacks.push(cb);
	    return {
	      cancel: () => this.off(eventName, cb),
	    };
	  }

	  once(eventName, cb) {
	    const _cb = (data) => {
	      cb(data);
	      this.off(eventName, _cb);
	    };
	    return this.on(eventName, _cb);
	  }

	  _fire(eventName, data) {
	    const callbacks = this.callbacks[eventName];
	    if (!callbacks) return;
	    callbacks.slice().forEach((cb) => cb(data));
	  }
	}

	function bind(fn, thisArg) {
	  return function wrap() {
	    return fn.apply(thisArg, arguments);
	  };
	}

	// utils is a library of generic helper functions non-specific to axios

	const {toString} = Object.prototype;
	const {getPrototypeOf} = Object;

	const kindOf = (cache => thing => {
	    const str = toString.call(thing);
	    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
	})(Object.create(null));

	const kindOfTest = (type) => {
	  type = type.toLowerCase();
	  return (thing) => kindOf(thing) === type
	};

	const typeOfTest = type => thing => typeof thing === type;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 *
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	const {isArray} = Array;

	/**
	 * Determine if a value is undefined
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	const isUndefined = typeOfTest('undefined');

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	const isArrayBuffer = kindOfTest('ArrayBuffer');


	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  let result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	const isString = typeOfTest('string');

	/**
	 * Determine if a value is a Function
	 *
	 * @param {*} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	const isFunction = typeOfTest('function');

	/**
	 * Determine if a value is a Number
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	const isNumber = typeOfTest('number');

	/**
	 * Determine if a value is an Object
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	const isObject = (thing) => thing !== null && typeof thing === 'object';

	/**
	 * Determine if a value is a Boolean
	 *
	 * @param {*} thing The value to test
	 * @returns {boolean} True if value is a Boolean, otherwise false
	 */
	const isBoolean = thing => thing === true || thing === false;

	/**
	 * Determine if a value is a plain Object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a plain Object, otherwise false
	 */
	const isPlainObject = (val) => {
	  if (kindOf(val) !== 'object') {
	    return false;
	  }

	  const prototype = getPrototypeOf(val);
	  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
	};

	/**
	 * Determine if a value is a Date
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	const isDate = kindOfTest('Date');

	/**
	 * Determine if a value is a File
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFile = kindOfTest('File');

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	const isBlob = kindOfTest('Blob');

	/**
	 * Determine if a value is a FileList
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFileList = kindOfTest('FileList');

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	const isStream = (val) => isObject(val) && isFunction(val.pipe);

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	const isFormData = (thing) => {
	  const pattern = '[object FormData]';
	  return thing && (
	    (typeof FormData === 'function' && thing instanceof FormData) ||
	    toString.call(thing) === pattern ||
	    (isFunction(thing.toString) && thing.toString() === pattern)
	  );
	};

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	const isURLSearchParams = kindOfTest('URLSearchParams');

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 *
	 * @returns {String} The String freed of excess whitespace
	 */
	const trim = (str) => str.trim ?
	  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 *
	 * @param {Boolean} [allOwnKeys = false]
	 * @returns {void}
	 */
	function forEach(obj, fn, {allOwnKeys = false} = {}) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  let i;
	  let l;

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
	    const len = keys.length;
	    let key;

	    for (i = 0; i < len; i++) {
	      key = keys[i];
	      fn.call(null, obj[key], key, obj);
	    }
	  }
	}

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 *
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  const result = {};
	  const assignValue = (val, key) => {
	    if (isPlainObject(result[key]) && isPlainObject(val)) {
	      result[key] = merge(result[key], val);
	    } else if (isPlainObject(val)) {
	      result[key] = merge({}, val);
	    } else if (isArray(val)) {
	      result[key] = val.slice();
	    } else {
	      result[key] = val;
	    }
	  };

	  for (let i = 0, l = arguments.length; i < l; i++) {
	    arguments[i] && forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 *
	 * @param {Boolean} [allOwnKeys]
	 * @returns {Object} The resulting value of object a
	 */
	const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
	  forEach(b, (val, key) => {
	    if (thisArg && isFunction(val)) {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  }, {allOwnKeys});
	  return a;
	};

	/**
	 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	 *
	 * @param {string} content with BOM
	 *
	 * @returns {string} content value without BOM
	 */
	const stripBOM = (content) => {
	  if (content.charCodeAt(0) === 0xFEFF) {
	    content = content.slice(1);
	  }
	  return content;
	};

	/**
	 * Inherit the prototype methods from one constructor into another
	 * @param {function} constructor
	 * @param {function} superConstructor
	 * @param {object} [props]
	 * @param {object} [descriptors]
	 *
	 * @returns {void}
	 */
	const inherits = (constructor, superConstructor, props, descriptors) => {
	  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
	  constructor.prototype.constructor = constructor;
	  Object.defineProperty(constructor, 'super', {
	    value: superConstructor.prototype
	  });
	  props && Object.assign(constructor.prototype, props);
	};

	/**
	 * Resolve object with deep prototype chain to a flat object
	 * @param {Object} sourceObj source object
	 * @param {Object} [destObj]
	 * @param {Function|Boolean} [filter]
	 * @param {Function} [propFilter]
	 *
	 * @returns {Object}
	 */
	const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
	  let props;
	  let i;
	  let prop;
	  const merged = {};

	  destObj = destObj || {};
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  if (sourceObj == null) return destObj;

	  do {
	    props = Object.getOwnPropertyNames(sourceObj);
	    i = props.length;
	    while (i-- > 0) {
	      prop = props[i];
	      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
	        destObj[prop] = sourceObj[prop];
	        merged[prop] = true;
	      }
	    }
	    sourceObj = filter !== false && getPrototypeOf(sourceObj);
	  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

	  return destObj;
	};

	/**
	 * Determines whether a string ends with the characters of a specified string
	 *
	 * @param {String} str
	 * @param {String} searchString
	 * @param {Number} [position= 0]
	 *
	 * @returns {boolean}
	 */
	const endsWith = (str, searchString, position) => {
	  str = String(str);
	  if (position === undefined || position > str.length) {
	    position = str.length;
	  }
	  position -= searchString.length;
	  const lastIndex = str.indexOf(searchString, position);
	  return lastIndex !== -1 && lastIndex === position;
	};


	/**
	 * Returns new array from array like object or null if failed
	 *
	 * @param {*} [thing]
	 *
	 * @returns {?Array}
	 */
	const toArray = (thing) => {
	  if (!thing) return null;
	  if (isArray(thing)) return thing;
	  let i = thing.length;
	  if (!isNumber(i)) return null;
	  const arr = new Array(i);
	  while (i-- > 0) {
	    arr[i] = thing[i];
	  }
	  return arr;
	};

	/**
	 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
	 * thing passed in is an instance of Uint8Array
	 *
	 * @param {TypedArray}
	 *
	 * @returns {Array}
	 */
	// eslint-disable-next-line func-names
	const isTypedArray = (TypedArray => {
	  // eslint-disable-next-line func-names
	  return thing => {
	    return TypedArray && thing instanceof TypedArray;
	  };
	})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

	/**
	 * For each entry in the object, call the function with the key and value.
	 *
	 * @param {Object<any, any>} obj - The object to iterate over.
	 * @param {Function} fn - The function to call for each entry.
	 *
	 * @returns {void}
	 */
	const forEachEntry = (obj, fn) => {
	  const generator = obj && obj[Symbol.iterator];

	  const iterator = generator.call(obj);

	  let result;

	  while ((result = iterator.next()) && !result.done) {
	    const pair = result.value;
	    fn.call(obj, pair[0], pair[1]);
	  }
	};

	/**
	 * It takes a regular expression and a string, and returns an array of all the matches
	 *
	 * @param {string} regExp - The regular expression to match against.
	 * @param {string} str - The string to search.
	 *
	 * @returns {Array<boolean>}
	 */
	const matchAll = (regExp, str) => {
	  let matches;
	  const arr = [];

	  while ((matches = regExp.exec(str)) !== null) {
	    arr.push(matches);
	  }

	  return arr;
	};

	/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
	const isHTMLForm = kindOfTest('HTMLFormElement');

	const toCamelCase = str => {
	  return str.toLowerCase().replace(/[_-\s]([a-z\d])(\w*)/g,
	    function replacer(m, p1, p2) {
	      return p1.toUpperCase() + p2;
	    }
	  );
	};

	/* Creating a function that will check if an object has a property. */
	const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

	/**
	 * Determine if a value is a RegExp object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a RegExp object, otherwise false
	 */
	const isRegExp = kindOfTest('RegExp');

	const reduceDescriptors = (obj, reducer) => {
	  const descriptors = Object.getOwnPropertyDescriptors(obj);
	  const reducedDescriptors = {};

	  forEach(descriptors, (descriptor, name) => {
	    if (reducer(descriptor, name, obj) !== false) {
	      reducedDescriptors[name] = descriptor;
	    }
	  });

	  Object.defineProperties(obj, reducedDescriptors);
	};

	/**
	 * Makes all methods read-only
	 * @param {Object} obj
	 */

	const freezeMethods = (obj) => {
	  reduceDescriptors(obj, (descriptor, name) => {
	    const value = obj[name];

	    if (!isFunction(value)) return;

	    descriptor.enumerable = false;

	    if ('writable' in descriptor) {
	      descriptor.writable = false;
	      return;
	    }

	    if (!descriptor.set) {
	      descriptor.set = () => {
	        throw Error('Can not read-only method \'' + name + '\'');
	      };
	    }
	  });
	};

	const toObjectSet = (arrayOrString, delimiter) => {
	  const obj = {};

	  const define = (arr) => {
	    arr.forEach(value => {
	      obj[value] = true;
	    });
	  };

	  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

	  return obj;
	};

	const noop = () => {};

	const toFiniteNumber = (value, defaultValue) => {
	  value = +value;
	  return Number.isFinite(value) ? value : defaultValue;
	};

	var utils = {
	  isArray,
	  isArrayBuffer,
	  isBuffer,
	  isFormData,
	  isArrayBufferView,
	  isString,
	  isNumber,
	  isBoolean,
	  isObject,
	  isPlainObject,
	  isUndefined,
	  isDate,
	  isFile,
	  isBlob,
	  isRegExp,
	  isFunction,
	  isStream,
	  isURLSearchParams,
	  isTypedArray,
	  isFileList,
	  forEach,
	  merge,
	  extend,
	  trim,
	  stripBOM,
	  inherits,
	  toFlatObject,
	  kindOf,
	  kindOfTest,
	  endsWith,
	  toArray,
	  forEachEntry,
	  matchAll,
	  isHTMLForm,
	  hasOwnProperty,
	  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
	  reduceDescriptors,
	  freezeMethods,
	  toObjectSet,
	  toCamelCase,
	  noop,
	  toFiniteNumber
	};

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [config] The config.
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 *
	 * @returns {Error} The created error.
	 */
	function AxiosError$1(message, code, config, request, response) {
	  Error.call(this);

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, this.constructor);
	  } else {
	    this.stack = (new Error()).stack;
	  }

	  this.message = message;
	  this.name = 'AxiosError';
	  code && (this.code = code);
	  config && (this.config = config);
	  request && (this.request = request);
	  response && (this.response = response);
	}

	utils.inherits(AxiosError$1, Error, {
	  toJSON: function toJSON() {
	    return {
	      // Standard
	      message: this.message,
	      name: this.name,
	      // Microsoft
	      description: this.description,
	      number: this.number,
	      // Mozilla
	      fileName: this.fileName,
	      lineNumber: this.lineNumber,
	      columnNumber: this.columnNumber,
	      stack: this.stack,
	      // Axios
	      config: this.config,
	      code: this.code,
	      status: this.response && this.response.status ? this.response.status : null
	    };
	  }
	});

	const prototype$1 = AxiosError$1.prototype;
	const descriptors = {};

	[
	  'ERR_BAD_OPTION_VALUE',
	  'ERR_BAD_OPTION',
	  'ECONNABORTED',
	  'ETIMEDOUT',
	  'ERR_NETWORK',
	  'ERR_FR_TOO_MANY_REDIRECTS',
	  'ERR_DEPRECATED',
	  'ERR_BAD_RESPONSE',
	  'ERR_BAD_REQUEST',
	  'ERR_CANCELED',
	  'ERR_NOT_SUPPORT',
	  'ERR_INVALID_URL'
	// eslint-disable-next-line func-names
	].forEach(code => {
	  descriptors[code] = {value: code};
	});

	Object.defineProperties(AxiosError$1, descriptors);
	Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

	// eslint-disable-next-line func-names
	AxiosError$1.from = (error, code, config, request, response, customProps) => {
	  const axiosError = Object.create(prototype$1);

	  utils.toFlatObject(error, axiosError, function filter(obj) {
	    return obj !== Error.prototype;
	  }, prop => {
	    return prop !== 'isAxiosError';
	  });

	  AxiosError$1.call(axiosError, error.message, code, config, request, response);

	  axiosError.cause = error;

	  axiosError.name = error.name;

	  customProps && Object.assign(axiosError, customProps);

	  return axiosError;
	};

	/* eslint-env browser */
	var browser = typeof self == 'object' ? self.FormData : window.FormData;

	/**
	 * Determines if the given thing is a array or js object.
	 *
	 * @param {string} thing - The object or array to be visited.
	 *
	 * @returns {boolean}
	 */
	function isVisitable(thing) {
	  return utils.isPlainObject(thing) || utils.isArray(thing);
	}

	/**
	 * It removes the brackets from the end of a string
	 *
	 * @param {string} key - The key of the parameter.
	 *
	 * @returns {string} the key without the brackets.
	 */
	function removeBrackets(key) {
	  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
	}

	/**
	 * It takes a path, a key, and a boolean, and returns a string
	 *
	 * @param {string} path - The path to the current key.
	 * @param {string} key - The key of the current object being iterated over.
	 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
	 *
	 * @returns {string} The path to the current key.
	 */
	function renderKey(path, key, dots) {
	  if (!path) return key;
	  return path.concat(key).map(function each(token, i) {
	    // eslint-disable-next-line no-param-reassign
	    token = removeBrackets(token);
	    return !dots && i ? '[' + token + ']' : token;
	  }).join(dots ? '.' : '');
	}

	/**
	 * If the array is an array and none of its elements are visitable, then it's a flat array.
	 *
	 * @param {Array<any>} arr - The array to check
	 *
	 * @returns {boolean}
	 */
	function isFlatArray(arr) {
	  return utils.isArray(arr) && !arr.some(isVisitable);
	}

	const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
	  return /^is[A-Z]/.test(prop);
	});

	/**
	 * If the thing is a FormData object, return true, otherwise return false.
	 *
	 * @param {unknown} thing - The thing to check.
	 *
	 * @returns {boolean}
	 */
	function isSpecCompliant(thing) {
	  return thing && utils.isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator];
	}

	/**
	 * Convert a data object to FormData
	 *
	 * @param {Object} obj
	 * @param {?Object} [formData]
	 * @param {?Object} [options]
	 * @param {Function} [options.visitor]
	 * @param {Boolean} [options.metaTokens = true]
	 * @param {Boolean} [options.dots = false]
	 * @param {?Boolean} [options.indexes = false]
	 *
	 * @returns {Object}
	 **/

	/**
	 * It converts an object into a FormData object
	 *
	 * @param {Object<any, any>} obj - The object to convert to form data.
	 * @param {string} formData - The FormData object to append to.
	 * @param {Object<string, any>} options
	 *
	 * @returns
	 */
	function toFormData$1(obj, formData, options) {
	  if (!utils.isObject(obj)) {
	    throw new TypeError('target must be an object');
	  }

	  // eslint-disable-next-line no-param-reassign
	  formData = formData || new (browser || FormData)();

	  // eslint-disable-next-line no-param-reassign
	  options = utils.toFlatObject(options, {
	    metaTokens: true,
	    dots: false,
	    indexes: false
	  }, false, function defined(option, source) {
	    // eslint-disable-next-line no-eq-null,eqeqeq
	    return !utils.isUndefined(source[option]);
	  });

	  const metaTokens = options.metaTokens;
	  // eslint-disable-next-line no-use-before-define
	  const visitor = options.visitor || defaultVisitor;
	  const dots = options.dots;
	  const indexes = options.indexes;
	  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
	  const useBlob = _Blob && isSpecCompliant(formData);

	  if (!utils.isFunction(visitor)) {
	    throw new TypeError('visitor must be a function');
	  }

	  function convertValue(value) {
	    if (value === null) return '';

	    if (utils.isDate(value)) {
	      return value.toISOString();
	    }

	    if (!useBlob && utils.isBlob(value)) {
	      throw new AxiosError$1('Blob is not supported. Use a Buffer instead.');
	    }

	    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
	      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
	    }

	    return value;
	  }

	  /**
	   * Default visitor.
	   *
	   * @param {*} value
	   * @param {String|Number} key
	   * @param {Array<String|Number>} path
	   * @this {FormData}
	   *
	   * @returns {boolean} return true to visit the each prop of the value recursively
	   */
	  function defaultVisitor(value, key, path) {
	    let arr = value;

	    if (value && !path && typeof value === 'object') {
	      if (utils.endsWith(key, '{}')) {
	        // eslint-disable-next-line no-param-reassign
	        key = metaTokens ? key : key.slice(0, -2);
	        // eslint-disable-next-line no-param-reassign
	        value = JSON.stringify(value);
	      } else if (
	        (utils.isArray(value) && isFlatArray(value)) ||
	        (utils.isFileList(value) || utils.endsWith(key, '[]') && (arr = utils.toArray(value))
	        )) {
	        // eslint-disable-next-line no-param-reassign
	        key = removeBrackets(key);

	        arr.forEach(function each(el, index) {
	          !(utils.isUndefined(el) || el === null) && formData.append(
	            // eslint-disable-next-line no-nested-ternary
	            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
	            convertValue(el)
	          );
	        });
	        return false;
	      }
	    }

	    if (isVisitable(value)) {
	      return true;
	    }

	    formData.append(renderKey(path, key, dots), convertValue(value));

	    return false;
	  }

	  const stack = [];

	  const exposedHelpers = Object.assign(predicates, {
	    defaultVisitor,
	    convertValue,
	    isVisitable
	  });

	  function build(value, path) {
	    if (utils.isUndefined(value)) return;

	    if (stack.indexOf(value) !== -1) {
	      throw Error('Circular reference detected in ' + path.join('.'));
	    }

	    stack.push(value);

	    utils.forEach(value, function each(el, key) {
	      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
	        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
	      );

	      if (result === true) {
	        build(el, path ? path.concat(key) : [key]);
	      }
	    });

	    stack.pop();
	  }

	  if (!utils.isObject(obj)) {
	    throw new TypeError('data must be an object');
	  }

	  build(obj);

	  return formData;
	}

	/**
	 * It encodes a string by replacing all characters that are not in the unreserved set with
	 * their percent-encoded equivalents
	 *
	 * @param {string} str - The string to encode.
	 *
	 * @returns {string} The encoded string.
	 */
	function encode$1(str) {
	  const charMap = {
	    '!': '%21',
	    "'": '%27',
	    '(': '%28',
	    ')': '%29',
	    '~': '%7E',
	    '%20': '+',
	    '%00': '\x00'
	  };
	  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
	    return charMap[match];
	  });
	}

	/**
	 * It takes a params object and converts it to a FormData object
	 *
	 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
	 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
	 *
	 * @returns {void}
	 */
	function AxiosURLSearchParams(params, options) {
	  this._pairs = [];

	  params && toFormData$1(params, this, options);
	}

	const prototype = AxiosURLSearchParams.prototype;

	prototype.append = function append(name, value) {
	  this._pairs.push([name, value]);
	};

	prototype.toString = function toString(encoder) {
	  const _encode = encoder ? function(value) {
	    return encoder.call(this, value, encode$1);
	  } : encode$1;

	  return this._pairs.map(function each(pair) {
	    return _encode(pair[0]) + '=' + _encode(pair[1]);
	  }, '').join('&');
	};

	/**
	 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
	 * URI encoded counterparts
	 *
	 * @param {string} val The value to be encoded.
	 *
	 * @returns {string} The encoded value.
	 */
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @param {?object} options
	 *
	 * @returns {string} The formatted url
	 */
	function buildURL(url, params, options) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	  
	  const _encode = options && options.encode || encode;

	  const serializeFn = options && options.serialize;

	  let serializedParams;

	  if (serializeFn) {
	    serializedParams = serializeFn(params, options);
	  } else {
	    serializedParams = utils.isURLSearchParams(params) ?
	      params.toString() :
	      new AxiosURLSearchParams(params, options).toString(_encode);
	  }

	  if (serializedParams) {
	    const hashmarkIndex = url.indexOf("#");

	    if (hashmarkIndex !== -1) {
	      url = url.slice(0, hashmarkIndex);
	    }
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	}

	class InterceptorManager {
	  constructor() {
	    this.handlers = [];
	  }

	  /**
	   * Add a new interceptor to the stack
	   *
	   * @param {Function} fulfilled The function to handle `then` for a `Promise`
	   * @param {Function} rejected The function to handle `reject` for a `Promise`
	   *
	   * @return {Number} An ID used to remove interceptor later
	   */
	  use(fulfilled, rejected, options) {
	    this.handlers.push({
	      fulfilled,
	      rejected,
	      synchronous: options ? options.synchronous : false,
	      runWhen: options ? options.runWhen : null
	    });
	    return this.handlers.length - 1;
	  }

	  /**
	   * Remove an interceptor from the stack
	   *
	   * @param {Number} id The ID that was returned by `use`
	   *
	   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
	   */
	  eject(id) {
	    if (this.handlers[id]) {
	      this.handlers[id] = null;
	    }
	  }

	  /**
	   * Clear all interceptors from the stack
	   *
	   * @returns {void}
	   */
	  clear() {
	    if (this.handlers) {
	      this.handlers = [];
	    }
	  }

	  /**
	   * Iterate over all the registered interceptors
	   *
	   * This method is particularly useful for skipping over any
	   * interceptors that may have become `null` calling `eject`.
	   *
	   * @param {Function} fn The function to call for each interceptor
	   *
	   * @returns {void}
	   */
	  forEach(fn) {
	    utils.forEach(this.handlers, function forEachHandler(h) {
	      if (h !== null) {
	        fn(h);
	      }
	    });
	  }
	}

	var transitionalDefaults = {
	  silentJSONParsing: true,
	  forcedJSONParsing: true,
	  clarifyTimeoutError: false
	};

	var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

	var FormData$1 = FormData;

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 * nativescript
	 *  navigator.product -> 'NativeScript' or 'NS'
	 *
	 * @returns {boolean}
	 */
	const isStandardBrowserEnv = (() => {
	  let product;
	  if (typeof navigator !== 'undefined' && (
	    (product = navigator.product) === 'ReactNative' ||
	    product === 'NativeScript' ||
	    product === 'NS')
	  ) {
	    return false;
	  }

	  return typeof window !== 'undefined' && typeof document !== 'undefined';
	})();

	var platform = {
	  isBrowser: true,
	  classes: {
	    URLSearchParams: URLSearchParams$1,
	    FormData: FormData$1,
	    Blob
	  },
	  isStandardBrowserEnv,
	  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
	};

	function toURLEncodedForm(data, options) {
	  return toFormData$1(data, new platform.classes.URLSearchParams(), Object.assign({
	    visitor: function(value, key, path, helpers) {

	      return helpers.defaultVisitor.apply(this, arguments);
	    }
	  }, options));
	}

	/**
	 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
	 *
	 * @param {string} name - The name of the property to get.
	 *
	 * @returns An array of strings.
	 */
	function parsePropPath(name) {
	  // foo[x][y][z]
	  // foo.x.y.z
	  // foo-x-y-z
	  // foo x y z
	  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
	    return match[0] === '[]' ? '' : match[1] || match[0];
	  });
	}

	/**
	 * Convert an array to an object.
	 *
	 * @param {Array<any>} arr - The array to convert to an object.
	 *
	 * @returns An object with the same keys and values as the array.
	 */
	function arrayToObject(arr) {
	  const obj = {};
	  const keys = Object.keys(arr);
	  let i;
	  const len = keys.length;
	  let key;
	  for (i = 0; i < len; i++) {
	    key = keys[i];
	    obj[key] = arr[key];
	  }
	  return obj;
	}

	/**
	 * It takes a FormData object and returns a JavaScript object
	 *
	 * @param {string} formData The FormData object to convert to JSON.
	 *
	 * @returns {Object<string, any> | null} The converted object.
	 */
	function formDataToJSON(formData) {
	  function buildPath(path, value, target, index) {
	    let name = path[index++];
	    const isNumericKey = Number.isFinite(+name);
	    const isLast = index >= path.length;
	    name = !name && utils.isArray(target) ? target.length : name;

	    if (isLast) {
	      if (utils.hasOwnProp(target, name)) {
	        target[name] = [target[name], value];
	      } else {
	        target[name] = value;
	      }

	      return !isNumericKey;
	    }

	    if (!target[name] || !utils.isObject(target[name])) {
	      target[name] = [];
	    }

	    const result = buildPath(path, value, target[name], index);

	    if (result && utils.isArray(target[name])) {
	      target[name] = arrayToObject(target[name]);
	    }

	    return !isNumericKey;
	  }

	  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
	    const obj = {};

	    utils.forEachEntry(formData, (name, value) => {
	      buildPath(parsePropPath(name), value, obj, 0);
	    });

	    return obj;
	  }

	  return null;
	}

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 *
	 * @returns {object} The response.
	 */
	function settle(resolve, reject, response) {
	  const validateStatus = response.config.validateStatus;
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(new AxiosError$1(
	      'Request failed with status code ' + response.status,
	      [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
	      response.config,
	      response.request,
	      response
	    ));
	  }
	}

	var cookies = platform.isStandardBrowserEnv ?

	// Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        const cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));

	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }

	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }

	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }

	        if (secure === true) {
	          cookie.push('secure');
	        }

	        document.cookie = cookie.join('; ');
	      },

	      read: function read(name) {
	        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },

	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :

	// Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })();

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 *
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
	}

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 *
	 * @returns {string} The combined URL
	 */
	function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	}

	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 *
	 * @returns {string} The combined full path
	 */
	function buildFullPath(baseURL, requestedURL) {
	  if (baseURL && !isAbsoluteURL(requestedURL)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	}

	var isURLSameOrigin = platform.isStandardBrowserEnv ?

	// Standard browser envs have full support of the APIs needed to test
	// whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    const msie = /(msie|trident)/i.test(navigator.userAgent);
	    const urlParsingNode = document.createElement('a');
	    let originURL;

	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      let href = url;

	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }

	      urlParsingNode.setAttribute('href', href);

	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	          urlParsingNode.pathname :
	          '/' + urlParsingNode.pathname
	      };
	    }

	    originURL = resolveURL(window.location.href);

	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	          parsed.host === originURL.host);
	    };
	  })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })();

	/**
	 * A `CanceledError` is an object that is thrown when an operation is canceled.
	 *
	 * @param {string=} message The message.
	 * @param {Object=} config The config.
	 * @param {Object=} request The request.
	 *
	 * @returns {CanceledError} The created error.
	 */
	function CanceledError$1(message, config, request) {
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  AxiosError$1.call(this, message == null ? 'canceled' : message, AxiosError$1.ERR_CANCELED, config, request);
	  this.name = 'CanceledError';
	}

	utils.inherits(CanceledError$1, AxiosError$1, {
	  __CANCEL__: true
	});

	function parseProtocol(url) {
	  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
	  return match && match[1] || '';
	}

	// RawAxiosHeaders whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	const ignoreDuplicateOf = utils.toObjectSet([
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	]);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} rawHeaders Headers needing to be parsed
	 *
	 * @returns {Object} Headers parsed into an object
	 */
	var parseHeaders = rawHeaders => {
	  const parsed = {};
	  let key;
	  let val;
	  let i;

	  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
	    i = line.indexOf(':');
	    key = line.substring(0, i).trim().toLowerCase();
	    val = line.substring(i + 1).trim();

	    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
	      return;
	    }

	    if (key === 'set-cookie') {
	      if (parsed[key]) {
	        parsed[key].push(val);
	      } else {
	        parsed[key] = [val];
	      }
	    } else {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};

	const $internals = Symbol('internals');
	const $defaults = Symbol('defaults');

	function normalizeHeader(header) {
	  return header && String(header).trim().toLowerCase();
	}

	function normalizeValue(value) {
	  if (value === false || value == null) {
	    return value;
	  }

	  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
	}

	function parseTokens(str) {
	  const tokens = Object.create(null);
	  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
	  let match;

	  while ((match = tokensRE.exec(str))) {
	    tokens[match[1]] = match[2];
	  }

	  return tokens;
	}

	function matchHeaderValue(context, value, header, filter) {
	  if (utils.isFunction(filter)) {
	    return filter.call(this, value, header);
	  }

	  if (!utils.isString(value)) return;

	  if (utils.isString(filter)) {
	    return value.indexOf(filter) !== -1;
	  }

	  if (utils.isRegExp(filter)) {
	    return filter.test(value);
	  }
	}

	function formatHeader(header) {
	  return header.trim()
	    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
	      return char.toUpperCase() + str;
	    });
	}

	function buildAccessors(obj, header) {
	  const accessorName = utils.toCamelCase(' ' + header);

	  ['get', 'set', 'has'].forEach(methodName => {
	    Object.defineProperty(obj, methodName + accessorName, {
	      value: function(arg1, arg2, arg3) {
	        return this[methodName].call(this, header, arg1, arg2, arg3);
	      },
	      configurable: true
	    });
	  });
	}

	function findKey(obj, key) {
	  key = key.toLowerCase();
	  const keys = Object.keys(obj);
	  let i = keys.length;
	  let _key;
	  while (i-- > 0) {
	    _key = keys[i];
	    if (key === _key.toLowerCase()) {
	      return _key;
	    }
	  }
	  return null;
	}

	function AxiosHeaders(headers, defaults) {
	  headers && this.set(headers);
	  this[$defaults] = defaults || null;
	}

	Object.assign(AxiosHeaders.prototype, {
	  set: function(header, valueOrRewrite, rewrite) {
	    const self = this;

	    function setHeader(_value, _header, _rewrite) {
	      const lHeader = normalizeHeader(_header);

	      if (!lHeader) {
	        throw new Error('header name must be a non-empty string');
	      }

	      const key = findKey(self, lHeader);

	      if (key && _rewrite !== true && (self[key] === false || _rewrite === false)) {
	        return;
	      }

	      self[key || _header] = normalizeValue(_value);
	    }

	    if (utils.isPlainObject(header)) {
	      utils.forEach(header, (_value, _header) => {
	        setHeader(_value, _header, valueOrRewrite);
	      });
	    } else {
	      setHeader(valueOrRewrite, header, rewrite);
	    }

	    return this;
	  },

	  get: function(header, parser) {
	    header = normalizeHeader(header);

	    if (!header) return undefined;

	    const key = findKey(this, header);

	    if (key) {
	      const value = this[key];

	      if (!parser) {
	        return value;
	      }

	      if (parser === true) {
	        return parseTokens(value);
	      }

	      if (utils.isFunction(parser)) {
	        return parser.call(this, value, key);
	      }

	      if (utils.isRegExp(parser)) {
	        return parser.exec(value);
	      }

	      throw new TypeError('parser must be boolean|regexp|function');
	    }
	  },

	  has: function(header, matcher) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = findKey(this, header);

	      return !!(key && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
	    }

	    return false;
	  },

	  delete: function(header, matcher) {
	    const self = this;
	    let deleted = false;

	    function deleteHeader(_header) {
	      _header = normalizeHeader(_header);

	      if (_header) {
	        const key = findKey(self, _header);

	        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
	          delete self[key];

	          deleted = true;
	        }
	      }
	    }

	    if (utils.isArray(header)) {
	      header.forEach(deleteHeader);
	    } else {
	      deleteHeader(header);
	    }

	    return deleted;
	  },

	  clear: function() {
	    return Object.keys(this).forEach(this.delete.bind(this));
	  },

	  normalize: function(format) {
	    const self = this;
	    const headers = {};

	    utils.forEach(this, (value, header) => {
	      const key = findKey(headers, header);

	      if (key) {
	        self[key] = normalizeValue(value);
	        delete self[header];
	        return;
	      }

	      const normalized = format ? formatHeader(header) : String(header).trim();

	      if (normalized !== header) {
	        delete self[header];
	      }

	      self[normalized] = normalizeValue(value);

	      headers[normalized] = true;
	    });

	    return this;
	  },

	  toJSON: function(asStrings) {
	    const obj = Object.create(null);

	    utils.forEach(Object.assign({}, this[$defaults] || null, this),
	      (value, header) => {
	        if (value == null || value === false) return;
	        obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value;
	      });

	    return obj;
	  }
	});

	Object.assign(AxiosHeaders, {
	  from: function(thing) {
	    if (utils.isString(thing)) {
	      return new this(parseHeaders(thing));
	    }
	    return thing instanceof this ? thing : new this(thing);
	  },

	  accessor: function(header) {
	    const internals = this[$internals] = (this[$internals] = {
	      accessors: {}
	    });

	    const accessors = internals.accessors;
	    const prototype = this.prototype;

	    function defineAccessor(_header) {
	      const lHeader = normalizeHeader(_header);

	      if (!accessors[lHeader]) {
	        buildAccessors(prototype, _header);
	        accessors[lHeader] = true;
	      }
	    }

	    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

	    return this;
	  }
	});

	AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent']);

	utils.freezeMethods(AxiosHeaders.prototype);
	utils.freezeMethods(AxiosHeaders);

	/**
	 * Calculate data maxRate
	 * @param {Number} [samplesCount= 10]
	 * @param {Number} [min= 1000]
	 * @returns {Function}
	 */
	function speedometer(samplesCount, min) {
	  samplesCount = samplesCount || 10;
	  const bytes = new Array(samplesCount);
	  const timestamps = new Array(samplesCount);
	  let head = 0;
	  let tail = 0;
	  let firstSampleTS;

	  min = min !== undefined ? min : 1000;

	  return function push(chunkLength) {
	    const now = Date.now();

	    const startedAt = timestamps[tail];

	    if (!firstSampleTS) {
	      firstSampleTS = now;
	    }

	    bytes[head] = chunkLength;
	    timestamps[head] = now;

	    let i = tail;
	    let bytesCount = 0;

	    while (i !== head) {
	      bytesCount += bytes[i++];
	      i = i % samplesCount;
	    }

	    head = (head + 1) % samplesCount;

	    if (head === tail) {
	      tail = (tail + 1) % samplesCount;
	    }

	    if (now - firstSampleTS < min) {
	      return;
	    }

	    const passed = startedAt && now - startedAt;

	    return  passed ? Math.round(bytesCount * 1000 / passed) : undefined;
	  };
	}

	function progressEventReducer(listener, isDownloadStream) {
	  let bytesNotified = 0;
	  const _speedometer = speedometer(50, 250);

	  return e => {
	    const loaded = e.loaded;
	    const total = e.lengthComputable ? e.total : undefined;
	    const progressBytes = loaded - bytesNotified;
	    const rate = _speedometer(progressBytes);
	    const inRange = loaded <= total;

	    bytesNotified = loaded;

	    const data = {
	      loaded,
	      total,
	      progress: total ? (loaded / total) : undefined,
	      bytes: progressBytes,
	      rate: rate ? rate : undefined,
	      estimated: rate && total && inRange ? (total - loaded) / rate : undefined
	    };

	    data[isDownloadStream ? 'download' : 'upload'] = true;

	    listener(data);
	  };
	}

	function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    let requestData = config.data;
	    const requestHeaders = AxiosHeaders.from(config.headers).normalize();
	    const responseType = config.responseType;
	    let onCanceled;
	    function done() {
	      if (config.cancelToken) {
	        config.cancelToken.unsubscribe(onCanceled);
	      }

	      if (config.signal) {
	        config.signal.removeEventListener('abort', onCanceled);
	      }
	    }

	    if (utils.isFormData(requestData) && platform.isStandardBrowserEnv) {
	      requestHeaders.setContentType(false); // Let the browser set it
	    }

	    let request = new XMLHttpRequest();

	    // HTTP basic authentication
	    if (config.auth) {
	      const username = config.auth.username || '';
	      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
	      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
	    }

	    const fullPath = buildFullPath(config.baseURL, config.url);

	    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

	    // Set the request timeout in MS
	    request.timeout = config.timeout;

	    function onloadend() {
	      if (!request) {
	        return;
	      }
	      // Prepare the response
	      const responseHeaders = AxiosHeaders.from(
	        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
	      );
	      const responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
	        request.responseText : request.response;
	      const response = {
	        data: responseData,
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config,
	        request
	      };

	      settle(function _resolve(value) {
	        resolve(value);
	        done();
	      }, function _reject(err) {
	        reject(err);
	        done();
	      }, response);

	      // Clean up request
	      request = null;
	    }

	    if ('onloadend' in request) {
	      // Use onloadend if available
	      request.onloadend = onloadend;
	    } else {
	      // Listen for ready state to emulate onloadend
	      request.onreadystatechange = function handleLoad() {
	        if (!request || request.readyState !== 4) {
	          return;
	        }

	        // The request errored out and we didn't get a response, this will be
	        // handled by onerror instead
	        // With one exception: request that using file: protocol, most browsers
	        // will return status as 0 even though it's a successful request
	        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	          return;
	        }
	        // readystate handler is calling before onerror or ontimeout handlers,
	        // so we should call onloadend on the next 'tick'
	        setTimeout(onloadend);
	      };
	    }

	    // Handle browser request cancellation (as opposed to a manual cancellation)
	    request.onabort = function handleAbort() {
	      if (!request) {
	        return;
	      }

	      reject(new AxiosError$1('Request aborted', AxiosError$1.ECONNABORTED, config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
	      const transitional = config.transitional || transitionalDefaults;
	      if (config.timeoutErrorMessage) {
	        timeoutErrorMessage = config.timeoutErrorMessage;
	      }
	      reject(new AxiosError$1(
	        timeoutErrorMessage,
	        transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
	        config,
	        request));

	      // Clean up request
	      request = null;
	    };

	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (platform.isStandardBrowserEnv) {
	      // Add xsrf header
	      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
	        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

	      if (xsrfValue) {
	        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
	      }
	    }

	    // Remove Content-Type if data is undefined
	    requestData === undefined && requestHeaders.setContentType(null);

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
	        request.setRequestHeader(key, val);
	      });
	    }

	    // Add withCredentials to request if needed
	    if (!utils.isUndefined(config.withCredentials)) {
	      request.withCredentials = !!config.withCredentials;
	    }

	    // Add responseType to request if needed
	    if (responseType && responseType !== 'json') {
	      request.responseType = config.responseType;
	    }

	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
	    }

	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
	    }

	    if (config.cancelToken || config.signal) {
	      // Handle cancellation
	      // eslint-disable-next-line func-names
	      onCanceled = cancel => {
	        if (!request) {
	          return;
	        }
	        reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
	        request.abort();
	        request = null;
	      };

	      config.cancelToken && config.cancelToken.subscribe(onCanceled);
	      if (config.signal) {
	        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
	      }
	    }

	    const protocol = parseProtocol(fullPath);

	    if (protocol && platform.protocols.indexOf(protocol) === -1) {
	      reject(new AxiosError$1('Unsupported protocol ' + protocol + ':', AxiosError$1.ERR_BAD_REQUEST, config));
	      return;
	    }


	    // Send the request
	    request.send(requestData || null);
	  });
	}

	const adapters = {
	  http: xhrAdapter,
	  xhr: xhrAdapter
	};

	var adapters$1 = {
	  getAdapter: (nameOrAdapter) => {
	    if(utils.isString(nameOrAdapter)){
	      const adapter = adapters[nameOrAdapter];

	      if (!nameOrAdapter) {
	        throw Error(
	          utils.hasOwnProp(nameOrAdapter) ?
	            `Adapter '${nameOrAdapter}' is not available in the build` :
	            `Can not resolve adapter '${nameOrAdapter}'`
	        );
	      }

	      return adapter
	    }

	    if (!utils.isFunction(nameOrAdapter)) {
	      throw new TypeError('adapter is not a function');
	    }

	    return nameOrAdapter;
	  },
	  adapters
	};

	const DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	/**
	 * If the browser has an XMLHttpRequest object, use the XHR adapter, otherwise use the HTTP
	 * adapter
	 *
	 * @returns {Function}
	 */
	function getDefaultAdapter() {
	  let adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = adapters$1.getAdapter('xhr');
	  } else if (typeof process !== 'undefined' && utils.kindOf(process) === 'process') {
	    // For node use HTTP adapter
	    adapter = adapters$1.getAdapter('http');
	  }
	  return adapter;
	}

	/**
	 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
	 * of the input
	 *
	 * @param {any} rawValue - The value to be stringified.
	 * @param {Function} parser - A function that parses a string into a JavaScript object.
	 * @param {Function} encoder - A function that takes a value and returns a string.
	 *
	 * @returns {string} A stringified version of the rawValue.
	 */
	function stringifySafely(rawValue, parser, encoder) {
	  if (utils.isString(rawValue)) {
	    try {
	      (parser || JSON.parse)(rawValue);
	      return utils.trim(rawValue);
	    } catch (e) {
	      if (e.name !== 'SyntaxError') {
	        throw e;
	      }
	    }
	  }

	  return (encoder || JSON.stringify)(rawValue);
	}

	const defaults = {

	  transitional: transitionalDefaults,

	  adapter: getDefaultAdapter(),

	  transformRequest: [function transformRequest(data, headers) {
	    const contentType = headers.getContentType() || '';
	    const hasJSONContentType = contentType.indexOf('application/json') > -1;
	    const isObjectPayload = utils.isObject(data);

	    if (isObjectPayload && utils.isHTMLForm(data)) {
	      data = new FormData(data);
	    }

	    const isFormData = utils.isFormData(data);

	    if (isFormData) {
	      if (!hasJSONContentType) {
	        return data;
	      }
	      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
	    }

	    if (utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
	      return data.toString();
	    }

	    let isFileList;

	    if (isObjectPayload) {
	      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
	        return toURLEncodedForm(data, this.formSerializer).toString();
	      }

	      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
	        const _FormData = this.env && this.env.FormData;

	        return toFormData$1(
	          isFileList ? {'files[]': data} : data,
	          _FormData && new _FormData(),
	          this.formSerializer
	        );
	      }
	    }

	    if (isObjectPayload || hasJSONContentType ) {
	      headers.setContentType('application/json', false);
	      return stringifySafely(data);
	    }

	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    const transitional = this.transitional || defaults.transitional;
	    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
	    const JSONRequested = this.responseType === 'json';

	    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
	      const silentJSONParsing = transitional && transitional.silentJSONParsing;
	      const strictJSONParsing = !silentJSONParsing && JSONRequested;

	      try {
	        return JSON.parse(data);
	      } catch (e) {
	        if (strictJSONParsing) {
	          if (e.name === 'SyntaxError') {
	            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
	          }
	          throw e;
	        }
	      }
	    }

	    return data;
	  }],

	  /**
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */
	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,
	  maxBodyLength: -1,

	  env: {
	    FormData: platform.classes.FormData,
	    Blob: platform.classes.Blob
	  },

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  },

	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    }
	  }
	};

	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Array|Function} fns A single function or Array of functions
	 * @param {?Object} response The response object
	 *
	 * @returns {*} The resulting transformed data
	 */
	function transformData(fns, response) {
	  const config = this || defaults;
	  const context = response || config;
	  const headers = AxiosHeaders.from(context.headers);
	  let data = context.data;

	  utils.forEach(fns, function transform(fn) {
	    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
	  });

	  headers.normalize();

	  return data;
	}

	function isCancel$1(value) {
	  return !!(value && value.__CANCEL__);
	}

	/**
	 * Throws a `CanceledError` if cancellation has been requested.
	 *
	 * @param {Object} config The config that is to be used for the request
	 *
	 * @returns {void}
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }

	  if (config.signal && config.signal.aborted) {
	    throw new CanceledError$1();
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 *
	 * @returns {Promise} The Promise to be fulfilled
	 */
	function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  config.headers = AxiosHeaders.from(config.headers);

	  // Transform request data
	  config.data = transformData.call(
	    config,
	    config.transformRequest
	  );

	  const adapter = config.adapter || defaults.adapter;

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData.call(
	      config,
	      config.transformResponse,
	      response
	    );

	    response.headers = AxiosHeaders.from(response.headers);

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel$1(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData.call(
	          config,
	          config.transformResponse,
	          reason.response
	        );
	        reason.response.headers = AxiosHeaders.from(reason.response.headers);
	      }
	    }

	    return Promise.reject(reason);
	  });
	}

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 *
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  const config = {};

	  function getMergedValue(target, source) {
	    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
	      return utils.merge(target, source);
	    } else if (utils.isPlainObject(source)) {
	      return utils.merge({}, source);
	    } else if (utils.isArray(source)) {
	      return source.slice();
	    }
	    return source;
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDeepProperties(prop) {
	    if (!utils.isUndefined(config2[prop])) {
	      return getMergedValue(config1[prop], config2[prop]);
	    } else if (!utils.isUndefined(config1[prop])) {
	      return getMergedValue(undefined, config1[prop]);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function valueFromConfig2(prop) {
	    if (!utils.isUndefined(config2[prop])) {
	      return getMergedValue(undefined, config2[prop]);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function defaultToConfig2(prop) {
	    if (!utils.isUndefined(config2[prop])) {
	      return getMergedValue(undefined, config2[prop]);
	    } else if (!utils.isUndefined(config1[prop])) {
	      return getMergedValue(undefined, config1[prop]);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDirectKeys(prop) {
	    if (prop in config2) {
	      return getMergedValue(config1[prop], config2[prop]);
	    } else if (prop in config1) {
	      return getMergedValue(undefined, config1[prop]);
	    }
	  }

	  const mergeMap = {
	    'url': valueFromConfig2,
	    'method': valueFromConfig2,
	    'data': valueFromConfig2,
	    'baseURL': defaultToConfig2,
	    'transformRequest': defaultToConfig2,
	    'transformResponse': defaultToConfig2,
	    'paramsSerializer': defaultToConfig2,
	    'timeout': defaultToConfig2,
	    'timeoutMessage': defaultToConfig2,
	    'withCredentials': defaultToConfig2,
	    'adapter': defaultToConfig2,
	    'responseType': defaultToConfig2,
	    'xsrfCookieName': defaultToConfig2,
	    'xsrfHeaderName': defaultToConfig2,
	    'onUploadProgress': defaultToConfig2,
	    'onDownloadProgress': defaultToConfig2,
	    'decompress': defaultToConfig2,
	    'maxContentLength': defaultToConfig2,
	    'maxBodyLength': defaultToConfig2,
	    'beforeRedirect': defaultToConfig2,
	    'transport': defaultToConfig2,
	    'httpAgent': defaultToConfig2,
	    'httpsAgent': defaultToConfig2,
	    'cancelToken': defaultToConfig2,
	    'socketPath': defaultToConfig2,
	    'responseEncoding': defaultToConfig2,
	    'validateStatus': mergeDirectKeys
	  };

	  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
	    const merge = mergeMap[prop] || mergeDeepProperties;
	    const configValue = merge(prop);
	    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
	  });

	  return config;
	}

	const VERSION$1 = "1.1.3";

	const validators$1 = {};

	// eslint-disable-next-line func-names
	['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
	  validators$1[type] = function validator(thing) {
	    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
	  };
	});

	const deprecatedWarnings = {};

	/**
	 * Transitional option validator
	 *
	 * @param {function|boolean?} validator - set to false if the transitional option has been removed
	 * @param {string?} version - deprecated version / removed since version
	 * @param {string?} message - some message with additional info
	 *
	 * @returns {function}
	 */
	validators$1.transitional = function transitional(validator, version, message) {
	  function formatMessage(opt, desc) {
	    return '[Axios v' + VERSION$1 + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
	  }

	  // eslint-disable-next-line func-names
	  return (value, opt, opts) => {
	    if (validator === false) {
	      throw new AxiosError$1(
	        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
	        AxiosError$1.ERR_DEPRECATED
	      );
	    }

	    if (version && !deprecatedWarnings[opt]) {
	      deprecatedWarnings[opt] = true;
	      // eslint-disable-next-line no-console
	      console.warn(
	        formatMessage(
	          opt,
	          ' has been deprecated since v' + version + ' and will be removed in the near future'
	        )
	      );
	    }

	    return validator ? validator(value, opt, opts) : true;
	  };
	};

	/**
	 * Assert object's properties type
	 *
	 * @param {object} options
	 * @param {object} schema
	 * @param {boolean?} allowUnknown
	 *
	 * @returns {object}
	 */

	function assertOptions(options, schema, allowUnknown) {
	  if (typeof options !== 'object') {
	    throw new AxiosError$1('options must be an object', AxiosError$1.ERR_BAD_OPTION_VALUE);
	  }
	  const keys = Object.keys(options);
	  let i = keys.length;
	  while (i-- > 0) {
	    const opt = keys[i];
	    const validator = schema[opt];
	    if (validator) {
	      const value = options[opt];
	      const result = value === undefined || validator(value, opt, options);
	      if (result !== true) {
	        throw new AxiosError$1('option ' + opt + ' must be ' + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
	      }
	      continue;
	    }
	    if (allowUnknown !== true) {
	      throw new AxiosError$1('Unknown option ' + opt, AxiosError$1.ERR_BAD_OPTION);
	    }
	  }
	}

	var validator = {
	  assertOptions,
	  validators: validators$1
	};

	const validators = validator.validators;

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 *
	 * @return {Axios} A new instance of Axios
	 */
	class Axios$1 {
	  constructor(instanceConfig) {
	    this.defaults = instanceConfig;
	    this.interceptors = {
	      request: new InterceptorManager(),
	      response: new InterceptorManager()
	    };
	  }

	  /**
	   * Dispatch a request
	   *
	   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
	   * @param {?Object} config
	   *
	   * @returns {Promise} The Promise to be fulfilled
	   */
	  request(configOrUrl, config) {
	    /*eslint no-param-reassign:0*/
	    // Allow for axios('example/url'[, config]) a la fetch API
	    if (typeof configOrUrl === 'string') {
	      config = config || {};
	      config.url = configOrUrl;
	    } else {
	      config = configOrUrl || {};
	    }

	    config = mergeConfig(this.defaults, config);

	    const {transitional, paramsSerializer} = config;

	    if (transitional !== undefined) {
	      validator.assertOptions(transitional, {
	        silentJSONParsing: validators.transitional(validators.boolean),
	        forcedJSONParsing: validators.transitional(validators.boolean),
	        clarifyTimeoutError: validators.transitional(validators.boolean)
	      }, false);
	    }

	    if (paramsSerializer !== undefined) {
	      validator.assertOptions(paramsSerializer, {
	        encode: validators.function,
	        serialize: validators.function
	      }, true);
	    }

	    // Set config.method
	    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

	    // Flatten headers
	    const defaultHeaders = config.headers && utils.merge(
	      config.headers.common,
	      config.headers[config.method]
	    );

	    defaultHeaders && utils.forEach(
	      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	      function cleanHeaderConfig(method) {
	        delete config.headers[method];
	      }
	    );

	    config.headers = new AxiosHeaders(config.headers, defaultHeaders);

	    // filter out skipped interceptors
	    const requestInterceptorChain = [];
	    let synchronousRequestInterceptors = true;
	    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
	        return;
	      }

	      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

	      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
	    });

	    const responseInterceptorChain = [];
	    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
	    });

	    let promise;
	    let i = 0;
	    let len;

	    if (!synchronousRequestInterceptors) {
	      const chain = [dispatchRequest.bind(this), undefined];
	      chain.unshift.apply(chain, requestInterceptorChain);
	      chain.push.apply(chain, responseInterceptorChain);
	      len = chain.length;

	      promise = Promise.resolve(config);

	      while (i < len) {
	        promise = promise.then(chain[i++], chain[i++]);
	      }

	      return promise;
	    }

	    len = requestInterceptorChain.length;

	    let newConfig = config;

	    i = 0;

	    while (i < len) {
	      const onFulfilled = requestInterceptorChain[i++];
	      const onRejected = requestInterceptorChain[i++];
	      try {
	        newConfig = onFulfilled(newConfig);
	      } catch (error) {
	        onRejected.call(this, error);
	        break;
	      }
	    }

	    try {
	      promise = dispatchRequest.call(this, newConfig);
	    } catch (error) {
	      return Promise.reject(error);
	    }

	    i = 0;
	    len = responseInterceptorChain.length;

	    while (i < len) {
	      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
	    }

	    return promise;
	  }

	  getUri(config) {
	    config = mergeConfig(this.defaults, config);
	    const fullPath = buildFullPath(config.baseURL, config.url);
	    return buildURL(fullPath, config.params, config.paramsSerializer);
	  }
	}

	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios$1.prototype[method] = function(url, config) {
	    return this.request(mergeConfig(config || {}, {
	      method,
	      url,
	      data: (config || {}).data
	    }));
	  };
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/

	  function generateHTTPMethod(isForm) {
	    return function httpMethod(url, data, config) {
	      return this.request(mergeConfig(config || {}, {
	        method,
	        headers: isForm ? {
	          'Content-Type': 'multipart/form-data'
	        } : {},
	        url,
	        data
	      }));
	    };
	  }

	  Axios$1.prototype[method] = generateHTTPMethod();

	  Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
	});

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @param {Function} executor The executor function.
	 *
	 * @returns {CancelToken}
	 */
	class CancelToken$1 {
	  constructor(executor) {
	    if (typeof executor !== 'function') {
	      throw new TypeError('executor must be a function.');
	    }

	    let resolvePromise;

	    this.promise = new Promise(function promiseExecutor(resolve) {
	      resolvePromise = resolve;
	    });

	    const token = this;

	    // eslint-disable-next-line func-names
	    this.promise.then(cancel => {
	      if (!token._listeners) return;

	      let i = token._listeners.length;

	      while (i-- > 0) {
	        token._listeners[i](cancel);
	      }
	      token._listeners = null;
	    });

	    // eslint-disable-next-line func-names
	    this.promise.then = onfulfilled => {
	      let _resolve;
	      // eslint-disable-next-line func-names
	      const promise = new Promise(resolve => {
	        token.subscribe(resolve);
	        _resolve = resolve;
	      }).then(onfulfilled);

	      promise.cancel = function reject() {
	        token.unsubscribe(_resolve);
	      };

	      return promise;
	    };

	    executor(function cancel(message, config, request) {
	      if (token.reason) {
	        // Cancellation has already been requested
	        return;
	      }

	      token.reason = new CanceledError$1(message, config, request);
	      resolvePromise(token.reason);
	    });
	  }

	  /**
	   * Throws a `CanceledError` if cancellation has been requested.
	   */
	  throwIfRequested() {
	    if (this.reason) {
	      throw this.reason;
	    }
	  }

	  /**
	   * Subscribe to the cancel signal
	   */

	  subscribe(listener) {
	    if (this.reason) {
	      listener(this.reason);
	      return;
	    }

	    if (this._listeners) {
	      this._listeners.push(listener);
	    } else {
	      this._listeners = [listener];
	    }
	  }

	  /**
	   * Unsubscribe from the cancel signal
	   */

	  unsubscribe(listener) {
	    if (!this._listeners) {
	      return;
	    }
	    const index = this._listeners.indexOf(listener);
	    if (index !== -1) {
	      this._listeners.splice(index, 1);
	    }
	  }

	  /**
	   * Returns an object that contains a new `CancelToken` and a function that, when called,
	   * cancels the `CancelToken`.
	   */
	  static source() {
	    let cancel;
	    const token = new CancelToken$1(function executor(c) {
	      cancel = c;
	    });
	    return {
	      token,
	      cancel
	    };
	  }
	}

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 *
	 * @returns {Function}
	 */
	function spread$1(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	}

	/**
	 * Determines whether the payload is an error thrown by Axios
	 *
	 * @param {*} payload The value to test
	 *
	 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
	 */
	function isAxiosError$1(payload) {
	  return utils.isObject(payload) && (payload.isAxiosError === true);
	}

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 *
	 * @returns {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  const context = new Axios$1(defaultConfig);
	  const instance = bind(Axios$1.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

	  // Copy context to instance
	  utils.extend(instance, context, null, {allOwnKeys: true});

	  // Factory for creating new instances
	  instance.create = function create(instanceConfig) {
	    return createInstance(mergeConfig(defaultConfig, instanceConfig));
	  };

	  return instance;
	}

	// Create the default instance to be exported
	const axios = createInstance(defaults);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios$1;

	// Expose Cancel & CancelToken
	axios.CanceledError = CanceledError$1;
	axios.CancelToken = CancelToken$1;
	axios.isCancel = isCancel$1;
	axios.VERSION = VERSION$1;
	axios.toFormData = toFormData$1;

	// Expose AxiosError class
	axios.AxiosError = AxiosError$1;

	// alias for CanceledError for backward compatibility
	axios.Cancel = axios.CanceledError;

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};

	axios.spread = spread$1;

	// Expose isAxiosError
	axios.isAxiosError = isAxiosError$1;

	axios.formToJSON = thing => {
	  return formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
	};

	// Keep top-level export same with static properties
	// so that it can keep same with es module or cjs
	const {
	  Axios,
	  AxiosError,
	  CanceledError,
	  isCancel,
	  CancelToken,
	  VERSION,
	  all,
	  Cancel,
	  isAxiosError,
	  spread,
	  toFormData
	} = axios;

	class DecodingError extends Error {
	  constructor(message) {
	    super(message);
	    this.name = 'DecodingError';
	  }
	}

	function seconds(secs = 0) {
	  return secs * 1000;
	}

	class FetchJob {
	  constructor(url, createChunk, chunkIndex, start, end) {
	    this._url = url;
	    this._createChunk = createChunk;
	    this._chunkIndex = chunkIndex;
	    this._start = start;
	    this._end = end;
	    this._cancelled = false;
	    this._controller = new AbortController();
	  }

	  cancel() {
	    this._cancelled = true;
	    this._controller.abort();
	    this._sleep && this._sleep.cancel();
	  }

	  fetch(retryCount = 0) {
	    if (this._cancelled) return Promise.resolve(null);

	    if (!Number.isInteger(this._start) || !Number.isInteger(this._end)) {
	      const message = 'Range header is not valid';
	      error$1(message, { start: this._start, end: this._end });
	      return Promise.reject(new Error(message));
	    }

	    // Compatibility: Safari
	    // This causes files fetched from Blob storage to omit the range header.
	    // In Safari, this header is incorrectly implemented in the Service Worker
	    // API and responds with a `416` error code.
	    const headers = this._url.startsWith('blob:')
	      ? undefined
	      : { range: `${this._start}-${this._end}` };

	    const options = {
	      headers,
	      timeout: seconds(5),
	      responseType: 'arraybuffer',
	      signal: this._controller.signal,
	    };

	    return axios
	      .get(this._url, options)
	      .then((response) => {
	        if (this._cancelled) return null;
	        if (!(response.data instanceof ArrayBuffer)) {
	          throw new Error('Bad response body');
	        }
	        const uint8Array = new Uint8Array(response.data);
	        return this._createChunk(uint8Array, this._chunkIndex);
	      })
	      .catch((error) => {
	        if (error instanceof CanceledError) return;
	        const timedOut = error.code === 'ECONNABORTED';
	        const networkError = error.message === 'Network Error';
	        const decodingError = error instanceof DecodingError;
	        const tooManyRequests = error.response && error.response.status === 429;
	        if (timedOut || networkError || decodingError || tooManyRequests) {
	          if (!networkError && retryCount >= 10) {
	            throw new Error(`Chunk fetch/decode failed after ${retryCount} retries`);
	          }
	          const message = timedOut
	            ? `Timed out fetching chunk`
	            : decodingError
	            ? `Decoding error when creating chunk`
	            : `Too many requests when fetching chunk`;
	          debug(`${message}. Retrying...`);
	          const timeout = tooManyRequests ? seconds(10) : seconds(retryCount); // TODO: use `X-RateLimit-Reset` header if error was "tooManyRequests"
	          this._sleep = new CancellableSleep(timeout);
	          return this._sleep
	            .wait()
	            .then(() => this.fetch(retryCount + 1))
	            .catch((err) => {
	              if (err !== SLEEP_CANCELLED) throw err;
	            });
	        }

	        debug(`Unexpected error when fetching chunk`);
	        throw error;
	      });
	  }
	}

	function slice(view, start, end) {
	  if (view.slice) {
	    return view.slice(start, end);
	  }
	  let clone = new Uint8Array(end - start);
	  let p = 0;
	  for (let i = start; i < end; i += 1) {
	    clone[p++] = view[i];
	  }
	  return clone;
	}

	function concat(a, b) {
	  if (!b) return a;

	  const c = new Uint8Array(a.length + b.length);
	  c.set(a);
	  c.set(b, a.length);

	  return c;
	}

	// http://www.mp3-tech.org/programmer/frame_header.html
	// frame header starts with 'frame sync' – eleven 1s
	function isFrameHeader(data, i, metadata) {
	  if (data[i + 0] !== 0b11111111 || (data[i + 1] & 0b11110000) !== 0b11110000)
	    return false;
	  return (
	    (data[i + 1] & 0b00000110) !== 0b00000000 &&
	    (data[i + 2] & 0b11110000) !== 0b11110000 &&
	    (data[i + 2] & 0b00001100) !== 0b00001100 &&
	    (data[i + 3] & 0b00000011) !== 0b00000010 &&
	    (data[i + 1] & 0b00001000) === metadata.mpegVersion &&
	    (data[i + 1] & 0b00000110) === metadata.mpegLayer &&
	    (data[i + 2] & 0b00001100) === metadata.sampleRate &&
	    (data[i + 3] & 0b11000000) === metadata.channelMode
	  );
	}

	// http://mpgedit.org/mpgedit/mpeg_format/mpeghdr.htm
	const bitrateLookup = {
	  11: [null, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
	  12: [null, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
	  13: [null, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
	  21: [null, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
	  22: [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
	};
	bitrateLookup[23] = bitrateLookup[22];
	function getFrameLength(data, i, metadata) {
	  const mpegVersion = metadata.mpegVersion;
	  const mpegLayer = metadata.mpegLayer;
	  const sampleRate = metadata.sampleRate;
	  const bitrateCode = (data[i + 2] & 0b11110000) >> 4;
	  const bitrate = bitrateLookup[`${mpegVersion}${mpegLayer}`][bitrateCode] * 1e3;
	  const padding = (data[2] & 0b00000010) >> 1;
	  const length = ~~(mpegLayer === 1
	    ? ((12 * bitrate) / sampleRate + padding) * 4
	    : (144 * bitrate) / sampleRate + padding);
	  return length;
	}

	function durationForAudioBuffer(buffer, clip, offset = 0) {
	  let frameCount = 0;
	  for (let i = offset; i < buffer.length; i++) {
	    if (isFrameHeader(buffer, i, clip._referenceHeader)) {
	      const frameLength = getFrameLength(buffer, i, clip.metadata);
	      i += frameLength - Math.min(frameLength, 4);
	      frameCount++;
	    }
	  }
	  return (frameCount * 1152) / clip.metadata.sampleRate;
	}

	// A Chunk is a container object for working with incomplete pieces of an
	// audio source. The contained audio data may not be aligned on a frame boundary
	// at all and may not even be decoded.
	class Chunk {
	  constructor({ index, raw, duration, byteOffset = 0 }) {
	    // Index of this chunk relative to the entire audio source.
	    this.index = index;

	    // Raw audio data for this chunk.
	    this.raw = raw;

	    // Index to start at when reading audio data from the raw byte buffer.
	    this.byteOffset = byteOffset;

	    // Duration of the audio in this chunk's buffer.
	    this.duration = duration;
	  }

	  toString() {
	    return `index: ${this.index} duration: ${this.duration}`;
	  }

	  buffer() {
	    return slice(this.raw, this.byteOffset, this.raw.length);
	  }

	  concat(chunk) {
	    return concat(this.buffer(), chunk && chunk.raw);
	  }
	}

	// NOTE: The way that this constructor calculates the duration of the provided
	//       audio buffer is MP3-specific. Must be changed for other formats.
	const createChunk = ({ index, clip, byteOffset, raw }) =>
	  new Chunk({
	    index,
	    byteOffset,
	    raw,
	    duration: durationForAudioBuffer(raw, clip, byteOffset),
	  });

	const LOAD_BATCH_SIZE = 2;
	const PRELOAD_BATCH_SIZE = 4;

	const FetchStrategy = {
	  PRELOAD_ONLY: 'FETCH_STRATEGY__PRELOAD_ONLY',
	  GREEDY: 'FETCH_STRATEGY__GREEDY',
	  LAZY: 'FETCH_STRATEGY__LAZY',
	};

	// A FetchCursor should be thought of as a pointer to some position within a
	// remote file. When streaming large files, it is necessary to keep track of
	// which file segments still need to be fetched. The semantics of the different
	// cursor subtypes are as follows (note that this code does not actually DO
	// the fetching, it only provides instructions on which chunks to fetch):
	//
	// ; PreloadCursor ; fetch exactly one batch of chunks, then exhaust
	// ; GreedyCursor ; fetch N chunks from the current index
	// ; LazyCursor ; fetch N chunks from the provided index (the playhead)
	// ; ExhaustedCursor ; fetch zero chunks
	//
	// !! NOTE !! The base class is never instantiated.
	//
	class FetchCursor {
	  constructor(index, size, batchSize) {
	    this.index = Math.min(index, size);
	    this.size = size;
	    this.batchSize = batchSize;
	  }

	  chunks() {
	    const chunkCount = Math.min(this.batchSize, this.size - this.index);
	    return Array(chunkCount)
	      .fill(this.index)
	      .map((x, i) => x + i);
	  }
	}

	class PreloadCursor extends FetchCursor {
	  seek() {
	    return new ExhaustedCursor(this.index, this.size, this.batchSize);
	  }
	}

	class GreedyCursor extends FetchCursor {
	  seek() {
	    const nextIndex = this.index + this.batchSize;
	    return nextIndex >= this.size
	      ? new ExhaustedCursor(this.size, this.size, this.batchSize)
	      : new GreedyCursor(nextIndex, this.size, this.batchSize);
	  }
	}

	class LazyCursor extends FetchCursor {
	  seek(playheadIndex) {
	    return playheadIndex > this.size
	      ? new ExhaustedCursor(this.size, this.size, this.batchSize)
	      : new LazyCursor(playheadIndex, this.size, this.batchSize);
	  }
	}

	class ExhaustedCursor extends FetchCursor {
	  chunks() {
	    return [];
	  }
	  seek() {
	    return this;
	  }
	}

	const createFetchCursor = ({
	  index = 0,
	  size,
	  strategy = FetchStrategy.GREEDY,
	}) => {
	  switch (strategy) {
	    case FetchStrategy.PRELOAD_ONLY:
	      return new PreloadCursor(index, size, PRELOAD_BATCH_SIZE);
	    case FetchStrategy.LAZY:
	      return new LazyCursor(index, size, LOAD_BATCH_SIZE * 2);
	    case FetchStrategy.GREEDY:
	      return new GreedyCursor(index, size, LOAD_BATCH_SIZE);
	  }
	};

	const kilobytes = (x) => x * 1024;
	const megabytes = (x) => kilobytes(x) * 1024;

	function useMediaSource() {
	  return (
	    typeof window.MediaSource !== 'undefined' &&
	    typeof window.MediaSource.isTypeSupported === 'function' &&
	    window.MediaSource.isTypeSupported('audio/mpeg')
	  );
	}

	const DELAY_BETWEEN_FETCHES = 400; // milliseconds

	class Loader extends EventEmitter {
	  constructor(chunkSize, url, clipState, audioMetadata = {}) {
	    super();
	    this._chunkSize = chunkSize;
	    this._url = url;
	    this._fileSize = clipState.fileSize;
	    this._chunks = clipState.chunks;
	    this._clipState = clipState;
	    this._referenceHeader = audioMetadata.referenceHeader;
	    this.metadata = audioMetadata.metadata;
	    this._loadStarted = false;
	    this._canPlayThrough = false;
	    this.context = getContext();
	    this.buffered = 0;
	    this._chunksDuration = 0;
	    this._chunksCount = 0;
	    this._jobs = {};
	    this._sleep = null;
	    this._fetchStrategy =
	      clipState.fileSize > megabytes(30)
	        ? FetchStrategy.LAZY
	        : FetchStrategy.GREEDY;
	    this._cancelled = false;

	    this._clipState.on('chunkIndexManuallyChanged', (newIndex) => {
	      this.cancel();
	      this._initialChunk = newIndex;
	      this._canPlayThrough = false;
	      this._cursor = createFetchCursor({
	        index: newIndex,
	        size: this._clipState.totalChunksCount,
	        strategy: this._fetchStrategy,
	      });
	      this.buffer(false, newIndex);
	    });
	  }

	  get audioMetadata() {
	    return {
	      referenceHeader: this._referenceHeader,
	      metadata: this.metadata,
	    };
	  }

	  get averageChunkDuration() {
	    return this._chunksCount > 0 ? this._chunksDuration / this._chunksCount : 0;
	  }

	  cancel() {
	    this._cancelled = true;
	    this._sleep && this._sleep.cancel();
	    Object.keys(this._jobs).forEach((chunkIndex) => {
	      this._jobs[chunkIndex].cancel();
	      delete this._jobs[chunkIndex];
	    });
	    this._loadStarted = false;
	  }

	  _getRange(chunkIndex) {
	    const start = chunkIndex * this._chunkSize + chunkIndex;
	    const end = Math.min(this._fileSize, start + this._chunkSize);
	    return { start, end };
	  }

	  buffer(preloadOnly = false, initialChunk = 0) {
	    if (!this._loadStarted) {
	      this._loadStarted = !preloadOnly;
	      this._initialChunk = initialChunk;
	      this._canPlayThrough = false;
	      this._preloadOnly = preloadOnly;
	      this._cancelled = false;

	      this._cursor = createFetchCursor({
	        index: initialChunk,
	        size: this._clipState.totalChunksCount,
	        strategy: preloadOnly ? FetchStrategy.PRELOAD_ONLY : this._fetchStrategy,
	      });

	      this._fetchNextChunks();
	    }
	    return new Promise((resolve, reject) => {
	      const ready = preloadOnly ? this._canPlayThrough : this.loaded;
	      if (ready) {
	        resolve();
	      } else {
	        this.once(preloadOnly ? 'canPlayThrough' : 'load', resolve);
	        this.once('loaderror', reject);
	      }
	    });
	  }

	  _checkCanplaythrough() {
	    if (this._canPlayThrough || !this.length) return;
	    let loadedChunksCount = 0;
	    const preloadBatchSize = Math.min(
	      PRELOAD_BATCH_SIZE,
	      this._clipState.totalChunksCount - this._initialChunk
	    );
	    for (let i = this._initialChunk; i < this._clipState.totalChunksCount; i++) {
	      const chunk = this._chunks[i];
	      if (!chunk || !chunk.duration) break;
	      if (++loadedChunksCount >= preloadBatchSize) {
	        this._canPlayThrough = true;
	        this._fire('canPlayThrough');
	        debug('Can play through 1');
	        break;
	      }
	    }
	  }

	  _calculateMetadata(uint8Array) {
	    if (
	      !this.metadata ||
	      !this._referenceHeader ||
	      Object.keys(this.metadata).length === 0 ||
	      Object.keys(this._referenceHeader).length === 0
	    ) {
	      for (let i = 0; i < uint8Array.length; i += 1) {
	        // determine some facts about this mp3 file from the initial header
	        if (
	          uint8Array[i] === 0b11111111 &&
	          (uint8Array[i + 1] & 0b11110000) === 0b11110000
	        ) {
	          // http://www.datavoyage.com/mpgscript/mpeghdr.htm
	          this._referenceHeader = {
	            mpegVersion: uint8Array[i + 1] & 0b00001000,
	            mpegLayer: uint8Array[i + 1] & 0b00000110,
	            sampleRate: uint8Array[i + 2] & 0b00001100,
	            channelMode: uint8Array[i + 3] & 0b11000000,
	          };
	          this.metadata = parseMetadata(this._referenceHeader);
	          // TODO: do the following checks based on arguments to the library?
	          if (
	            this.metadata.sampleRate === 44100 &&
	            this.metadata.channelMode === 'stereo'
	          )
	            break;
	        }
	      }
	    }
	  }

	  _createChunk(uint8Array, index) {
	    if (!uint8Array || !Number.isInteger(index)) {
	      debug('Loader#_createChunk: Invalid arguments. Resolving with null.');
	      return Promise.resolve(null);
	    }
	    this._calculateMetadata(uint8Array);
	    const clip = {
	      context: this.context,
	      metadata: this.metadata,
	      _referenceHeader: this._referenceHeader,
	    };
	    const chunk = createChunk({
	      index,
	      clip,
	      raw: uint8Array,
	    });

	    if (useMediaSource()) {
	      return Promise.resolve(chunk);
	    } else {
	      return decodeChunk(chunk, clip);
	    }
	  }

	  _onData(chunk) {
	    this._chunks[chunk.index] = chunk;

	    if (!this._canPlayThrough) {
	      this._checkCanplaythrough();
	    }
	    if (chunk.raw.length === this._chunkSize + 1 && chunk.duration > 0) {
	      this._chunksDuration += chunk.duration;
	      this._chunksCount += 1;
	    }
	  }

	  _onProgress(chunkLength, total) {
	    this.buffered += chunkLength;
	    this.length = total;
	    this._fire('loadprogress', { buffered: this.buffered, total });
	  }

	  _onLoad() {
	    const firstChunk = this._chunks[this._initialChunk];
	    if (firstChunk && !this.loaded) {
	      if (!this._canPlayThrough) {
	        this._canPlayThrough = true;
	        this._fire('canPlayThrough');
	        debug('Can play through 2');
	      }
	      this.loaded = true;
	      this._fire('load');
	    }
	  }

	  _seekFetchCursor() {
	    this._cursor = this._cursor.seek(this._clipState.chunkIndex);
	  }

	  _fetchNextChunks() {
	    if (this._cancelled) return Promise.resolve();

	    const startTime = Date.now();
	    const nextChunks = this._cursor.chunks().map(this._fetchChunk.bind(this));

	    if (nextChunks.length === 0) {
	      return Promise.resolve();
	    }

	    this._sleep = new CancellableSleep(
	      LOAD_BATCH_SIZE * DELAY_BETWEEN_FETCHES - (Date.now() - startTime)
	    );

	    return Promise.all(nextChunks)
	      .then(() => this._sleep.wait())
	      .then(() => this._seekFetchCursor())
	      .then(() => this._fetchNextChunks())
	      .catch((err) => {
	        if (err !== SLEEP_CANCELLED) throw err;
	      });
	  }

	  _fetchChunk(chunkIndex) {
	    if (!!this._clipState.chunks[chunkIndex]) {
	      return Promise.resolve();
	    }

	    const { start, end } = this._getRange(chunkIndex);
	    const job = new FetchJob(
	      this._url,
	      this._createChunk.bind(this),
	      chunkIndex,
	      start,
	      end
	    );
	    this._jobs[chunkIndex] = job;
	    return job
	      .fetch()
	      .then((chunk) => {
	        if (!chunk) return;

	        if (this._jobs[chunk.index]) {
	          delete this._jobs[chunk.index];
	        }

	        if (!chunk || !chunk.raw || chunk.raw.length === 0) {
	          return Promise.resolve();
	        }

	        this._onData(chunk);
	        this._onProgress(chunk.raw.length, this._fileSize);

	        const isLastChunk = chunk.index === this._clipState.totalChunksCount - 1;
	        if (isLastChunk) {
	          this._onLoad();
	        }

	        return Promise.resolve();
	      })
	      .catch((err = {}) => {
	        err.url = this.url;
	        err.customCode = 'COULD_NOT_LOAD';
	        this._fire('loaderror', err);
	        this._loadStarted = false;
	      });
	  }
	}

	const decodeChunk = (chunk, clip) => {
	  const { buffer } = chunk.buffer();
	  return decodeAudioData(buffer)
	    .then(checkDecodedAudio(chunk))
	    .catch(attemptDecodeRecovery(chunk, clip));
	};

	// Compatibility: Safari iOS
	// Mobile Safari does not implement the Promise-based AudioContext APIs, so
	// we have to wrap the callback-based version ourselves to utilize it.
	const decodeAudioData = (buffer) =>
	  new Promise((res, rej) => getContext().decodeAudioData(buffer, res, rej));

	const checkDecodedAudio = (chunk) => () =>
	  chunk.duration > 0
	    ? chunk
	    : Promise.reject(new DecodingError('Got 0 frames when decoding audio buffer'));

	// Compatibility: Safari iOS
	// The MP3 decoding capabilities of Webkit are limited compared to other
	// browsers. When you attempt to use `decodeAudioData` on any MP3 chunk that is
	// not aligned to a frame boundary, the operation fails and calls the error
	// callback with a `null` error value. Since our chunks are fixed-size blocks
	// that do not respect frame boundaries, this will occur for nearly EVERY
	// chunk of audio.
	//
	// With this in mind, this error handler detects this specific `null` failure
	// case and realigns the chunk to the first frame header it is able to decode
	// from. Then, during playback, chunks are stitched together in a manner
	// that respects this realignment so that we never attempt to decode partial
	// or incomplete frames.
	const attemptDecodeRecovery = (chunk, clip) => (err) => {
	  if (err) {
	    return Promise.reject(err);
	  }

	  for (let i = chunk.byteOffset; i < chunk.raw.length - 1; i++) {
	    if (isFrameHeader(chunk.raw, i, clip._referenceHeader)) {
	      return decodeChunk(createChunk({ ...chunk, byteOffset: i, clip }), clip);
	    }
	  }
	};

	// This is for the temporary suppression of errors caused by synchronously
	// interacting with a `MediaSource` while it is asynchronously loading. Doing so
	// does not cause any incorrect behavior in our case, so it is safe to just
	// ignore for now.
	function suppressAbortError (e) {
	  if (e.name === 'AbortError') {
	    debug('AbortError suppressed', e.message);
	  } else {
	    throw e;
	  }
	}

	const CHUNK_SIZE = 64 * 1024;

	class ClipState extends EventEmitter {
	  constructor(fileSize, initialPosition = 0, lastAllowedPosition = 1) {
	    super();
	    this.reset();
	    this._fileSize = fileSize;
	    this._totalChunksCount = Math.ceil(fileSize / CHUNK_SIZE);
	    this._chunkIndex = this.getChunkIndexByPosition(initialPosition);
	    this._lastAllowedChunkIndex = this.getLastChunkIndexByPosition(lastAllowedPosition);
	  }

	  reset() {
	    this._chunks = [];
	    this._chunkIndex = 0;
	    this._chunksBufferingFinished = false;
	  }

	  isChunkReady(wantedChunk) {
	    const chunk = this._chunks[wantedChunk];
	    return chunk && !Number.isNaN(chunk.duration);
	  }

	  getChunkIndexByPosition(position = 0) {
	    const initialChunk = Math.floor(this._totalChunksCount * position);
	    return initialChunk >= this._totalChunksCount
	      ? this._totalChunksCount - 1
	      : initialChunk;
	  }

	  getLastChunkIndexByPosition(position = 1) {
	    return Math.max(
	      Math.min(Math.ceil(this._totalChunksCount * position), this._totalChunksCount - 1),
	      1
	    );
	  }

	  logChunks() {
	    debug(
	      '\n' +
	        this._chunks
	          .map((chunk, index) => `[${index}] = ` + chunk.toString())
	          .filter((val) => !!val)
	          .join('\n')
	    );
	  }

	  get fileSize() {
	    return this._fileSize;
	  }

	  get totalChunksCount() {
	    return this._totalChunksCount;
	  }

	  get lastAllowedChunkIndex() {
	    return this._lastAllowedChunkIndex;
	  }

	  get chunks() {
	    return this._chunks;
	  }

	  get chunkIndex() {
	    return this._chunkIndex;
	  }

	  get chunksBufferingFinished() {
	    return this._chunksBufferingFinished;
	  }

	  set chunkIndex(index) {
	    this._chunksBufferingFinished =
	      index >= this._totalChunksCount || index >= this._lastAllowedChunkIndex;
	    if (this._chunksBufferingFinished) {
	      return;
	    }
	    const diff = index - this._chunkIndex;
	    this._chunkIndex = index;
	    if (diff !== 1) {
	      this._fire('chunkIndexManuallyChanged', this._chunkIndex);
	    }
	  }

	  set lastAllowedChunkIndex(position) {
	    const newLastAllowedChunkIndex = this.getLastChunkIndexByPosition(position);
	    if (
	      this._chunksBufferingFinished &&
	      newLastAllowedChunkIndex > this._lastAllowedChunkIndex &&
	      newLastAllowedChunkIndex < this._totalChunksCount
	    ) {
	      this._chunksBufferingFinished = false;
	    }
	    this._lastAllowedChunkIndex = newLastAllowedChunkIndex;
	  }
	}

	const OVERLAP = 0.2;
	const TIMEOUT_SAFE_OFFSET = 50;

	const PLAYBACK_STATE = {
	  STOPPED: 'STOPPED',
	  PLAYING: 'PLAYING',
	  PAUSED: 'PAUSED',
	};

	class Clip extends EventEmitter {
	  constructor({
	    url,
	    fileSize,
	    initialPosition = 0,
	    lastAllowedPosition = 1,
	    silenceChunks = [],
	    volume = 1,
	    audioMetadata = {},
	    osName,
	    browserName,
	    useMediaSource,
	  }) {
	    super();

	    this.osName = osName;
	    this.browserName = browserName;
	    this._useMediaSource = useMediaSource;

	    if (this._useMediaSource) {
	      this._audioElement = document.querySelector('audio');
	    } else {
	      this.context = getContext();
	      this._gain = this.context.createGain();
	      this._gain.connect(this.context.destination);
	    }

	    this.length = 0;
	    this.loaded = false;
	    this._playbackState = PLAYBACK_STATE.STOPPED;
	    this.ended = false;
	    this.url = url;
	    this.volume = volume;
	    this._silenceChunks = silenceChunks;
	    this._lastPlayedChunk = null;
	    this._tickTimeout = null;
	    this._mediaSourceTimeout = null;

	    this._lastContextTimeAtStart = null;
	    this._scheduledEndTime = null;
	    this._playbackProgress = 0;
	    this._bufferingOffset = 0;
	    this._lastBufferChange = null;

	    this._shouldStopBuffering = false;
	    this._preBuffering = false;
	    this._preBuffered = false;
	    this._buffering = false;
	    this._buffered = false;

	    this._clipState = new ClipState(fileSize, initialPosition, lastAllowedPosition);
	    this._initialChunk = this._clipState.chunkIndex;
	    this._initialByte = this._initialChunk * CHUNK_SIZE;

	    if (initialPosition !== 0 && Object.keys(audioMetadata).length === 0) {
	      this._preBuffering = true;
	      const initialChunkClipState = new ClipState(CHUNK_SIZE);
	      const initialChunkLoader = new Loader(CHUNK_SIZE, this.url, initialChunkClipState);
	      initialChunkLoader.on('loaderror', (err) => {
	        this._preBuffering = false;
	        this._fire('loaderror', err);
	      });
	      initialChunkLoader.on('load', () => {
	        this._preBuffering = false;
	        this._initLoader(initialChunkLoader.audioMetadata);
	      });
	      initialChunkLoader.buffer();
	    } else {
	      this._initLoader(audioMetadata);
	    }
	  }

	  _initLoader(audioMetadata) {
	    this._loader = new Loader(CHUNK_SIZE, this.url, this._clipState, audioMetadata);
	    this._loader.on('canPlayThrough', () => {
	      if (this._buffering && !this._preBuffering) {
	        this._preBuffered = true;
	      }
	      this._fire('canPlayThrough');
	    });
	    this._loader.on('loadprogress', ({ buffered, total }) => {
	      const bufferedWithOffset = buffered + this._initialByte;
	      this._fire('loadprogress', {
	        total,
	        initialPosition: this._initialChunk / this._clipState.totalChunksCount,
	        buffered: bufferedWithOffset,
	        progress: bufferedWithOffset / total,
	      });
	    });
	    this._loader.on('playbackerror', (error) => this._fire('playbackerror', error));
	    this._loader.on('loaderror', (error) => this._fire('loaderror', error));
	    this._loader.on('load', () => this._fire('load'));
	  }

	  preBuffer(isRetrying = false) {
	    if (isRetrying && this._shouldStopBuffering) {
	      return Promise.reject(new ProtonPlayerError('Clip was paused or disposed'));
	    }

	    if (this._preBuffered || this._buffered) {
	      return Promise.resolve();
	    }

	    this._shouldStopBuffering = false;

	    if (this._preBuffering || this._buffering || !this._loader) {
	      return new Promise((resolve, reject) => {
	        setTimeout(() => this.preBuffer(true).then(resolve).catch(reject), 1);
	      });
	    }

	    this._preBuffering = true;
	    const preloadOnly = true;
	    return this._loader
	      .buffer(preloadOnly, this._initialChunk)
	      .then(() => {
	        this._preBuffering = false;
	        this._preBuffered = true;
	      })
	      .catch((err) => {
	        this._preBuffering = false;
	        this._preBuffered = false;
	        throw err;
	      });
	  }

	  buffer(isRetrying = false) {
	    if (isRetrying && this._shouldStopBuffering) {
	      return Promise.reject(new ProtonPlayerError('Clip was paused or disposed'));
	    }

	    if (this._buffered) {
	      return Promise.resolve();
	    }

	    this._shouldStopBuffering = false;

	    if (this._preBuffering || this._buffering || !this._loader) {
	      return new Promise((resolve, reject) => {
	        setTimeout(() => this.buffer(true).then(resolve).catch(reject), 1);
	      });
	    }

	    this._onBufferChange(true);
	    this._buffering = true;
	    const preloadOnly = false;
	    return this._loader
	      .buffer(preloadOnly, this._initialChunk)
	      .then(() => {
	        this._buffering = false;
	        this._buffered = true;
	      })
	      .catch((err) => {
	        this._buffering = false;
	        this._buffered = false;
	        throw err;
	      });
	  }

	  connect(destination, output, input) {
	    if (!this._connected) {
	      this._gain.disconnect();
	      this._connected = true;
	    }
	    this._gain.connect(destination, output, input);
	    return this;
	  }

	  disconnect(destination, output, input) {
	    this._gain.disconnect(destination, output, input);
	  }

	  dispose() {
	    this.stop();
	    this._preBuffering = false;
	    this._preBuffered = false;
	    this._buffering = false;
	    this._buffered = false;
	    this.loaded = false;
	    this._clipState.reset();
	    this._fire('dispose');
	  }

	  play() {
	    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
	      const message = `clip.play() was called on a clip that was already playing (${this.url})`;
	      warn(message);
	      return Promise.reject(message);
	    }

	    this.buffer().then(noop$1).catch(noop$1);

	    let promise;

	    if (this._useMediaSource) {
	      const self = this;
	      this._mediaSource = new MediaSource();
	      this._mediaSource.addEventListener('sourceopen', function () {
	        self._sourceBuffer = this.addSourceBuffer('audio/mpeg');
	        self._playUsingMediaSource();
	      });
	      this._audioElement.src = URL.createObjectURL(this._mediaSource);
	      promise = this._audioElement.play().catch(suppressAbortError);
	    } else {
	      this._gain = this.context.createGain();
	      this._gain.connect(this.context.destination);
	      this.context.resume();
	      this._playUsingAudioContext();
	      promise = Promise.resolve();
	    }

	    this.volume = this._volume;
	    this._playbackState = PLAYBACK_STATE.PLAYING;
	    this.ended = false;
	    return promise;
	  }

	  resume() {
	    let promise;
	    if (this._useMediaSource) {
	      this._audioElement.volume = this.volume;
	      promise = this._audioElement.play().catch(suppressAbortError);
	    } else {
	      this._gain = this.context.createGain();
	      this._gain.connect(this.context.destination);
	      this.context.resume();
	      this._playUsingAudioContext();
	      promise = Promise.resolve();
	    }
	    this._playbackState = PLAYBACK_STATE.PLAYING;
	    return promise;
	  }

	  pause() {
	    if (this._useMediaSource) {
	      this._pauseUsingMediaSource();
	    } else {
	      this._stopUsingAudioContext();
	    }
	    this._playbackState = PLAYBACK_STATE.PAUSED;
	  }

	  stop() {
	    this._shouldStopBuffering = true;

	    if (this._useMediaSource) {
	      this._stopUsingMediaSource();
	    } else {
	      this._stopUsingAudioContext();
	    }

	    if (this._loader) {
	      this._loader.cancel();
	    }

	    this._preBuffering = false;
	    this._buffering = false;
	    this._playbackState = PLAYBACK_STATE.STOPPED;
	    this._fire('stop');

	    return this;
	  }

	  playbackEnded() {
	    debug('Clip#playbackEnded');
	    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
	      this._playbackState = PLAYBACK_STATE.STOPPED;
	      this.ended = true;
	      this._fire('ended');
	    }
	  }

	  setCurrentPosition(position = 0, lastAllowedPosition = 1) {
	    if (this._useMediaSource) {
	      this._stopUsingMediaSource();
	    } else {
	      this._stopUsingAudioContext();
	    }

	    this._playbackState = PLAYBACK_STATE.STOPPED;
	    this._fire('stop');

	    this._initialChunk = this._clipState.getChunkIndexByPosition(position);
	    this._clipState.lastAllowedChunkIndex = lastAllowedPosition;
	    this._clipState.chunkIndex = this._initialChunk;

	    let promise;

	    if (this._useMediaSource) {
	      this._mediaSource = new MediaSource();
	      this._audioElement.src = URL.createObjectURL(this._mediaSource);
	      promise = this._audioElement.play().catch(suppressAbortError);
	      const self = this;
	      this._mediaSource.addEventListener('sourceopen', function () {
	        self._sourceBuffer = this.addSourceBuffer('audio/mpeg');
	        self._playUsingMediaSource();
	      });
	    } else {
	      this._gain = this.context.createGain();
	      this._gain.connect(this.context.destination);
	      this.context.resume();
	      this._playUsingAudioContext();
	      promise = Promise.resolve();
	    }

	    this.volume = this._volume;
	    this._playbackState = PLAYBACK_STATE.PLAYING;
	    this.ended = false;
	    return promise;
	  }

	  get currentTime() {
	    if (this._playbackState !== PLAYBACK_STATE.PLAYING) {
	      return 0;
	    }

	    const averageChunkDuration = this._loader ? this._loader.averageChunkDuration : 0;
	    const offset = averageChunkDuration * this._initialChunk;

	    if (this._useMediaSource) {
	      return offset + this._audioElement.currentTime;
	    }

	    const isPlayingSilence =
	      this._scheduledEndTime == null || this.context.currentTime > this._scheduledEndTime;

	    if (isPlayingSilence) {
	      if (this._clipState.chunksBufferingFinished) {
	        // Playback has finished.
	        this.playbackEnded();
	        return averageChunkDuration * this._clipState.totalChunksCount;
	      }

	      // Player is buffering.
	      this._onBufferChange(true);

	      if (this._scheduledEndTime != null) {
	        this._bufferingOffset = this._playbackProgress;
	      }

	      return offset + this._playbackProgress;
	    }

	    // Player is playing back.
	    this._onBufferChange(false);

	    if (this._contextTimeAtStart === this._lastContextTimeAtStart) {
	      this._playbackProgress +=
	        this.context.currentTime -
	        this._contextTimeAtStart -
	        this._playbackProgress +
	        this._bufferingOffset;
	    } else {
	      this._playbackProgress = this._bufferingOffset;
	    }

	    this._lastContextTimeAtStart = this._contextTimeAtStart;

	    return offset + this._playbackProgress;
	  }

	  get duration() {
	    if (!this._loader) return 0;
	    return (this._clipState.fileSize / CHUNK_SIZE) * this._loader.averageChunkDuration;
	  }

	  get paused() {
	    return this._playbackState === PLAYBACK_STATE.PAUSED;
	  }

	  get volume() {
	    return this._volume;
	  }

	  set volume(volume) {
	    this._volume = volume;

	    if (this._useMediaSource && this._audioElement) {
	      this._audioElement.volume = this._volume;
	    } else if (this._gain && this._gain.gain) {
	      this._gain.gain.value = this._volume;
	    }
	  }

	  get audioMetadata() {
	    if (!this._loader) return {};
	    return this._loader.audioMetadata;
	  }

	  _playUsingAudioContext() {
	    debug('#_playUsingAudioContext');
	    this._playbackProgress = 0;
	    this._scheduledEndTime = null;

	    if (this._playbackState !== PLAYBACK_STATE.PAUSED) {
	      this._bufferingOffset = 0;
	    }

	    const timeOffset = 0;
	    let playing = true;

	    const stopSources = () => {
	      try {
	        if (previousSource) previousSource.stop();
	        if (currentSource) currentSource.stop();
	      } catch (e) {
	        if (e.name === 'InvalidStateError') {
	          warn(`Ignored error: ${e.toString()}`);
	        } else {
	          throw e;
	        }
	      }
	    };

	    const stopListener = this.on('stop', () => {
	      playing = false;
	      stopSources();
	      stopListener.cancel();
	    });

	    let _playingSilence = !this._clipState.isChunkReady(this._clipState.chunkIndex);
	    let chunk = _playingSilence
	      ? this._silenceChunks[0]
	      : this._clipState.chunks[this._clipState.chunkIndex];
	    chunk.isSilence = _playingSilence;

	    let previousSource;
	    let currentSource;

	    this._createSourceFromChunk(chunk, timeOffset, (err, source) => {
	      if (err) {
	        err.url = this.url;
	        err.customCode = 'COULD_NOT_START_PLAYBACK';
	        this._fire('playbackerror', err);
	        return;
	      }

	      if (Number.isNaN(chunk.duration)) {
	        this._fire(
	          'playbackerror',
	          'Error playing initial chunk because duration is NaN'
	        );
	        return;
	      }

	      source.loop = chunk.isSilence;
	      currentSource = source;

	      let nextStart;

	      try {
	        const gain = this.context.createGain();
	        gain.connect(this._gain);

	        this._contextTimeAtStart = this.context.currentTime;
	        nextStart = this._contextTimeAtStart + (chunk.duration - timeOffset);
	        if (!chunk.isSilence) {
	          this._scheduledEndTime = nextStart + OVERLAP;
	        }

	        gain.gain.setValueAtTime(0, nextStart + OVERLAP);
	        source.connect(gain);
	        source.start(this._contextTimeAtStart);
	      } catch (e) {
	        if (e.name === 'TypeError') {
	          warn(`Ignored error: ${e.toString()}`);
	        } else {
	          throw e;
	        }
	      }

	      this._lastPlayedChunk =
	        _playingSilence && this._clipState.chunkIndex === this._initialChunk
	          ? null
	          : this._clipState.chunkIndex;

	      const advance = () => {
	        if (!playing) return;

	        if (!_playingSilence && this._lastPlayedChunk === this._clipState.chunkIndex) {
	          this._clipState.chunkIndex += 1;
	        }

	        if (this._clipState.chunksBufferingFinished) {
	          this._scheduledEndTime = null;
	          return;
	        }

	        chunk = _playingSilence
	          ? this._silenceChunks[0]
	          : this._clipState.chunks[this._clipState.chunkIndex];
	        chunk.isSilence = _playingSilence;

	        if (!chunk) {
	          return;
	        }

	        this._createSourceFromChunk(chunk, 0, (err, source) => {
	          if (err) {
	            err.url = this.url;
	            err.customCode = 'COULD_NOT_CREATE_SOURCE';
	            this._fire('playbackerror', err);
	            return;
	          }

	          if (Number.isNaN(chunk.duration)) {
	            this._fire('playbackerror', 'Error playing chunk because duration is NaN');
	            return;
	          }

	          source.loop = chunk.isSilence;

	          if (this._wasPlayingSilence && !_playingSilence) {
	            this._wasPlayingSilence = false;
	            stopSources();
	            this._contextTimeAtStart = this.context.currentTime;
	            nextStart = this.context.currentTime;
	          }

	          previousSource = currentSource;
	          currentSource = source;

	          try {
	            const gain = this.context.createGain();
	            gain.connect(this._gain);
	            gain.gain.setValueAtTime(0, nextStart);
	            gain.gain.setValueAtTime(1, nextStart + OVERLAP);
	            source.connect(gain);
	            source.start(nextStart);
	            nextStart += chunk.duration;
	            if (!chunk.isSilence) {
	              this._scheduledEndTime = nextStart + OVERLAP;
	            }
	            gain.gain.setValueAtTime(0, nextStart + OVERLAP);
	          } catch (e) {
	            if (e.name === 'TypeError') {
	              warn(`Ignored error: ${e.toString()}`);
	            } else {
	              throw e;
	            }
	          }

	          this._lastPlayedChunk =
	            _playingSilence && this._clipState.chunkIndex === this._initialChunk
	              ? null
	              : this._clipState.chunkIndex;
	        });
	      };

	      const tick = (scheduledAt = 0, scheduledTimeout = 0) => {
	        if (
	          this._playbackState !== PLAYBACK_STATE.PLAYING ||
	          this._clipState.chunksBufferingFinished
	        ) {
	          return;
	        }

	        const i =
	          this._lastPlayedChunk === this._clipState.chunkIndex
	            ? this._clipState.chunkIndex + 1
	            : this._clipState.chunkIndex;

	        _playingSilence = !this._clipState.isChunkReady(i);

	        if (_playingSilence) {
	          this._wasPlayingSilence = true;
	        } else {
	          advance();
	        }

	        const timeout = this._calculateNextChunkTimeout(i, scheduledAt, scheduledTimeout);
	        this._tickTimeout = setTimeout(tick.bind(this, Date.now(), timeout), timeout);
	      };

	      const frame = () => {
	        if (this._playbackState !== PLAYBACK_STATE.PLAYING) return;
	        requestAnimationFrame(frame);
	        this._fire('progress');
	      };

	      tick();
	      frame();
	    });
	  }

	  _playUsingMediaSource() {
	    if (this._playbackState === PLAYBACK_STATE.STOPPED) return;

	    if (this._clipState.chunksBufferingFinished) {
	      debug('this._mediaSource.endOfStream()');
	      this._mediaSource.endOfStream();
	      return;
	    }

	    const isChunkReady = this._clipState.isChunkReady(this._clipState.chunkIndex);

	    const useSilence =
	      !isChunkReady &&
	      this._clipState.chunkIndex === this._initialChunk &&
	      !this._wasPlayingSilence &&
	      (this.browserName === 'safari' || this.osName === 'ios');

	    const chunk = useSilence
	      ? this._silenceChunks[0]
	      : isChunkReady && this._clipState.chunks[this._clipState.chunkIndex];

	    if (chunk) {
	      try {
	        this._sourceBuffer.appendBuffer(chunk.raw);
	        if (isChunkReady) {
	          this._clipState.chunkIndex += 1;
	          this._wasPlayingSilence = false;
	        } else if (useSilence) {
	          this._wasPlayingSilence = true;
	        }
	      } catch (e) {
	        // SourceBuffer might be full, remove segments that have already been played.
	        debug('Exception when running SourceBuffer#appendBuffer', e);
	        try {
	          this._sourceBuffer.remove(0, this._audioElement.currentTime);
	        } catch (e) {
	          debug('Exception when running SourceBuffer#remove', e);
	        }
	      }
	    }

	    const timeout = isChunkReady ? Math.min(500, chunk.duration * 1000) : 100;
	    this._mediaSourceTimeout = setTimeout(this._playUsingMediaSource.bind(this), timeout);
	  }

	  _pauseUsingMediaSource() {
	    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
	      this._audioElement.pause();
	      this._audioElement.volume = 0;
	    }
	  }

	  _stopUsingMediaSource() {
	    clearTimeout(this._mediaSourceTimeout);
	    this._pauseUsingMediaSource();
	  }

	  _stopUsingAudioContext() {
	    this._bufferingOffset = this._playbackProgress;
	    clearTimeout(this._tickTimeout);
	    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
	      this._gain.gain.value = 0;
	      this._gain.disconnect(this.context.destination);
	      this._gain = null;
	    }
	  }

	  _calculateNextChunkTimeout(chunkIndex = 0, scheduledAt = 0, scheduledTimeout = 0) {
	    const playingSilence = !this._clipState.isChunkReady(chunkIndex);
	    if (playingSilence) {
	      return 100;
	    }
	    const timeoutDiff = this._calculateTimeoutDiff(scheduledAt, scheduledTimeout);
	    const chunk = this._clipState.chunks[chunkIndex];
	    return chunk && typeof chunk.duration === 'number' && chunk.duration > 0
	      ? Math.max(chunk.duration * 1000 - TIMEOUT_SAFE_OFFSET - timeoutDiff, 0)
	      : 500;
	  }

	  _calculateTimeoutDiff(scheduledAt = 0, scheduledTimeout = 0) {
	    if (scheduledAt === 0 && scheduledTimeout === 0) {
	      return TIMEOUT_SAFE_OFFSET;
	    }
	    return Math.max(
	      Date.now() - Math.max(scheduledAt, 0) - Math.max(scheduledTimeout, 0),
	      0
	    );
	  }

	  _onBufferChange(isBuffering) {
	    if (this._lastBufferChange === isBuffering) {
	      return;
	    }
	    this._fire('bufferchange', isBuffering);
	    this._lastBufferChange = isBuffering;
	  }

	  _createSourceFromChunk(chunk, timeOffset, callback) {
	    debug('_createSourceFromChunk');
	    const context = getContext();

	    if (!chunk) {
	      const message = 'Something went wrong! Chunk was not ready in time for playback';
	      error(message);
	      callback(new Error(message));
	      return;
	    }

	    const nextChunk = this._clipState._chunks[chunk.index + 1];
	    const extendedBuffer = chunk.concat(nextChunk);
	    const { buffer } = slice(extendedBuffer, 0, extendedBuffer.length);

	    context.decodeAudioData(
	      buffer,
	      (decoded) => {
	        if (timeOffset) {
	          const sampleOffset = ~~(timeOffset * decoded.sampleRate);
	          const numChannels = decoded.numberOfChannels;
	          const lengthWithOffset = decoded.length - sampleOffset;
	          const length = lengthWithOffset >= 0 ? lengthWithOffset : decoded.length;
	          const offset = context.createBuffer(numChannels, length, decoded.sampleRate);
	          for (let chan = 0; chan < numChannels; chan += 1) {
	            const sourceData = decoded.getChannelData(chan);
	            const targetData = offset.getChannelData(chan);
	            for (let i = 0; i < sourceData.length - sampleOffset; i += 1) {
	              targetData[i] = sourceData[i + sampleOffset];
	            }
	          }
	          decoded = offset;
	        }
	        const source = context.createBufferSource();
	        source.buffer = decoded;
	        callback(null, source);
	      },
	      (err) => {
	        err = err || {}; // Safari might error out without an error object
	        callback(err);
	      }
	    );
	  }
	}

	const canUseMediaSource = () =>
	  typeof window.MediaSource !== 'undefined' &&
	  typeof window.MediaSource.isTypeSupported === 'function' &&
	  window.MediaSource.isTypeSupported('audio/mpeg');

	class Player {
	  constructor({
	    // Triggered whenever an error occurs.
	    onError,

	    // Triggered when the Player automatically transitions to the queued track.
	    onNextTrack,

	    // Triggered when there is no more queued audio to play.
	    onPlaybackEnded,

	    // Triggered every ~250ms while audio is playing.
	    onPlaybackProgress,

	    // Triggered whenever a new track begins playing.
	    onTrackChanged,

	    // Triggered once when the Player is ready to begin playing audio.
	    onReady,

	    browserName,
	    osName,
	    volume,
	  }) {
	    this.browserName = browserName;
	    this.osName = osName;
	    this.volume = volume;

	    this.onError = onError;
	    this.onNextTrack = onNextTrack;
	    this.onPlaybackEnded = onPlaybackEnded;
	    this.onPlaybackProgress = onPlaybackProgress;
	    this.onTrackChanged = onTrackChanged;
	    this.onReady = onReady;
	    this.ready = false;

	    // Database of cached audio data and track metadata.
	    this.clips = {};

	    this.currentlyPlaying = null;
	    this.nextTrack = null;

	    const silenceChunkSize = 64 * 64;
	    this.silenceClipState = new ClipState(silenceChunkSize);

	    if (canUseMediaSource()) {
	      const audioElement = document.createElement('audio');
	      audioElement.autoplay = false;

	      document.body.appendChild(audioElement);

	      audioElement.addEventListener('ended', () => {
	        this.currentlyPlaying?.clip?.playbackEnded();
	      });

	      audioElement.addEventListener('waiting', () => {
	        this.currentlyPlaying?.onBufferChange(true);
	      });

	      ['canplay', 'canplaythrough', 'playing'].forEach((eventName) => {
	        audioElement.addEventListener(eventName, () => {
	          this.currentlyPlaying?.onBufferChange(false);
	        });
	      });
	    }

	    const silenceLoader = new Loader(
	      silenceChunkSize,
	      getSilenceURL(),
	      this.silenceClipState
	    );
	    silenceLoader.on('loaderror', (err) => {
	      this.ready = false;
	      this.onError(err);
	    });
	    silenceLoader.on('load', () => {
	      this.ready = true;
	      this.onReady();
	    });
	    silenceLoader.buffer();
	  }

	  reset() {
	    this.currentlyPlaying = null;
	    this.nextTrack = null;

	    this.disposeAll();
	  }

	  playNext(track) {
	    if (!track) return;

	    this._dispose(track.url);

	    this.nextTrack = track;
	    this.preLoad(
	      track.url,
	      track.fileSize,
	      track.initialPosition,
	      track.lastAllowedPosition
	    );
	  }

	  preLoad(url, fileSize, initialPosition = 0, lastAllowedPosition = 1) {
	    // TODO: allow preloading on iOS by making preloading more efficient (aka: load and process 1 chunk at a time when preloading)
	    if (this.osName === 'ios') {
	      return Promise.resolve();
	    }

	    try {
	      return this._getClip(
	        url,
	        fileSize,
	        initialPosition,
	        lastAllowedPosition
	      ).preBuffer();
	    } catch (err) {
	      this.onError(err);
	      return Promise.reject(err);
	    }
	  }

	  playTrack(track) {
	    if (!track) return;

	    const currentTrack = this.currentlyPlaying?.track || {};

	    if (track.url !== currentTrack.url) {
	      this.__DEPRECATED__playTrack(track, track);
	      this.onTrackChanged(currentTrack, track);

	      if (currentTrack.url) {
	        this._dispose(currentTrack.url);
	      }
	    }
	  }

	  __DEPRECATED__playTrack(
	    {
	      url,
	      fileSize,
	      onBufferChange = noop$1,
	      onBufferProgress = noop$1,
	      initialPosition = 0,
	      lastAllowedPosition = 1,
	      audioMetadata = {},
	      fromSetPlaybackPosition = false,
	    },
	    track = null
	  ) {
	    if (!this.ready) {
	      const message = 'Player not ready';
	      warn(message);
	      return Promise.reject(message);
	    }

	    if (
	      this.currentlyPlaying &&
	      this.currentlyPlaying.clip &&
	      this.currentlyPlaying.url === url &&
	      fromSetPlaybackPosition === false
	    ) {
	      debug('ProtonPlayer#play -> resume');
	      return this.currentlyPlaying.clip.resume() || Promise.resolve();
	    }

	    onBufferProgress(0, 0);
	    this.onPlaybackProgress(initialPosition);

	    this.stopAll();

	    try {
	      const clip = this._getClip(
	        url,
	        fileSize,
	        initialPosition,
	        lastAllowedPosition,
	        audioMetadata
	      );

	      this.currentlyPlaying = {
	        track,
	        clip,
	        url,
	        fileSize,
	        onBufferChange,
	        onBufferProgress,
	        lastAllowedPosition,
	        lastReportedProgress: initialPosition,
	      };

	      clip.on('loadprogress', ({ initialPosition, progress }) =>
	        onBufferProgress(initialPosition, progress)
	      );

	      clip.once('ended', () => {
	        if (this.nextTrack) {
	          let nextTrack = this.nextTrack;
	          let currentTrack = this.currentlyPlaying?.track;
	          this.nextTrack = null;

	          this.playTrack(nextTrack);
	          this.onNextTrack(currentTrack, nextTrack);
	        } else {
	          this.stopAll();
	          this.onPlaybackEnded();
	        }
	        this.onPlaybackProgress(1);
	      });

	      clip.on('bufferchange', (isBuffering) => onBufferChange(isBuffering));

	      this._playbackPositionInterval = setInterval(() => {
	        const { duration, currentTime } = clip;
	        if (duration === 0 || duration < currentTime) return;
	        let progress = currentTime / duration;

	        if (progress < 0) {
	          progress = 0;
	        } else if (progress > 1) {
	          progress = 1; // Prevent playback progress from exceeding 1 (100%)
	        }

	        if (
	          !this.currentlyPlaying ||
	          progress < this.currentlyPlaying.lastReportedProgress // Prevent playback progress from going backwards
	        ) {
	          return;
	        }

	        this.currentlyPlaying.lastReportedProgress = progress;
	        this.onPlaybackProgress(progress);
	      }, 250);

	      return clip.play() || Promise.resolve();
	    } catch (err) {
	      this.onError(err);
	      return Promise.reject(err.toString());
	    }
	  }

	  _getClip(
	    url,
	    fileSize,
	    initialPosition = 0,
	    lastAllowedPosition = 1,
	    audioMetadata = {}
	  ) {
	    if (typeof url !== 'string') {
	      throw new ProtonPlayerError('Invalid URL');
	    }

	    if (typeof fileSize !== 'number') {
	      throw new ProtonPlayerError('Invalid file size');
	    }

	    if (this.clips[url]) {
	      return this.clips[url];
	    }

	    const clip = new Clip({
	      url,
	      fileSize,
	      initialPosition,
	      lastAllowedPosition,
	      audioMetadata,
	      silenceChunks: this.silenceClipState.chunks,
	      volume: this.volume,
	      osName: this.osName,
	      browserName: this.browserName,
	      useMediaSource: canUseMediaSource(),
	    });

	    clip.on('loaderror', (err) => {
	      error$1('Clip failed to load', err);
	    });

	    clip.on('playbackerror', (err) => {
	      error$1('Something went wrong during playback', err);
	    });

	    this.clips[url] = clip;
	    return clip;
	  }

	  stopAll() {
	    this.currentlyPlaying = null;
	    this._clearIntervals();
	    Object.keys(this.clips).forEach((k) => {
	      this.clips[k].offAll('loadprogress');
	      this.clips[k].stop();
	    });
	  }

	  resume() {
	    this.currentlyPlaying?.clip?.resume();
	  }

	  pause() {
	    this.currentlyPlaying?.clip?.pause();
	  }

	  setVolume(volume = 1) {
	    this.volume = volume;
	    Object.keys(this.clips).forEach((k) => {
	      this.clips[k].volume = this.volume;
	    });
	  }

	  setPlaybackPosition(percent, newLastAllowedPosition = null) {
	    if (!this.currentlyPlaying || percent > 1) {
	      return Promise.resolve();
	    }

	    this.currentlyPlaying.lastReportedProgress = percent;

	    const {
	      url,
	      fileSize,
	      onBufferChange,
	      onBufferProgress,
	      onPlaybackProgress,
	      onPlaybackEnded,
	      lastAllowedPosition,
	    } = this.currentlyPlaying;

	    newLastAllowedPosition = newLastAllowedPosition || lastAllowedPosition;

	    const clip = this.clips[url];

	    if (clip) {
	      return (
	        clip.setCurrentPosition(percent, newLastAllowedPosition) || Promise.resolve()
	      );
	    }

	    const audioMetadata = clip?.audioMetadata;

	    this._dispose(url);

	    return this.playTrack({
	      url,
	      fileSize,
	      onBufferChange,
	      onBufferProgress,
	      onPlaybackProgress,
	      onPlaybackEnded,
	      audioMetadata,
	      initialPosition: percent,
	      lastAllowedPosition: newLastAllowedPosition,
	      fromSetPlaybackPosition: true,
	    });
	  }

	  _dispose(url) {
	    if (url && this.currentlyPlaying?.url === url) {
	      this.currentlyPlaying = null;
	      this._clearIntervals();
	    }

	    if (!this.clips[url]) return;

	    this.clips[url].offAll('loadprogress');
	    this.clips[url].dispose();
	    delete this.clips[url];
	  }

	  disposeAll(urls = []) {
	    Object.keys(this.clips).forEach((k) => this._dispose(k));
	  }

	  _clearIntervals() {
	    clearInterval(this._playbackPositionInterval);
	  }
	}

	// A Cursor is a very specific type of ordered list that maintains a cursor
	// or currently active index. This can be used for situations where the entire
	// contents of a list need to be available, but only one element is active at
	// any given time.

	class Cursor {
	  constructor(xs, index = 0) {
	    this.xs = xs;
	    this.index = index;
	  }

	  forward() {
	    const nextIndex = this.index + 1;
	    if (nextIndex >= this.xs.length) return [null, this];
	    return [this.xs[nextIndex], new Cursor(this.xs, nextIndex)];
	  }

	  back() {
	    const previousIndex = this.index - 1;
	    if (previousIndex < 0) return [null, this];
	    return [this.xs[previousIndex], new Cursor(this.xs, previousIndex)];
	  }

	  current() {
	    return this.xs[this.index];
	  }

	  tail() {
	    return this.xs.slice(this.index + 1, this.xs.length);
	  }

	  head() {
	    return this.xs.slice(0, this.index);
	  }

	  unwrap() {
	    return this.xs;
	  }
	}

	initializeiOSAudioEngine$1();

	class ProtonPlayer {
	  constructor({
	    onReady = noop$1,
	    onError = noop$1,
	    onPlaybackProgress = noop$1,
	    onPlaybackEnded = noop$1,
	    onTrackChanged = noop$1,
	    volume = 1,
	  }) {
	    debug('ProtonPlayer#constructor');

	    const browser = Bowser.getParser(window.navigator.userAgent);
	    const browserName = browser.getBrowserName().toLowerCase();
	    const osName = browser.getOSName().toLowerCase();

	    // Firefox is not supported because it cannot decode MP3 files.
	    if (browserName === 'firefox') {
	      throw new ProtonPlayerError(`${browserName} is not supported.`);
	    }

	    // Check if the AudioContext API can be instantiated.
	    try {
	      getContext();
	    } catch (e) {
	      throw new ProtonPlayerError(
	        `${browserName} does not support the AudioContext API.`
	      );
	    }

	    this.player = new Player({
	      onPlaybackEnded,
	      onPlaybackProgress,
	      onTrackChanged,
	      onNextTrack: () => this._moveToNextTrack(),
	      onReady,
	      onError,
	      volume,
	      osName,
	      browserName,
	    });

	    this.playlist = new Cursor([]);
	  }

	  _moveToNextTrack() {
	    const [_, playlist] = this.playlist.forward();
	    this.playlist = playlist;

	    const [nextTrack] = this.playlist.forward();
	    if (nextTrack) {
	      this.player.playNext(nextTrack);
	    }
	  }

	  playTrack(track) {
	    debug('ProtonPlayer#playTrack');

	    this.reset();
	    this.player.reset();
	    return this.player.playTrack(track);
	  }

	  play(playlist, index = 0) {
	    debug('ProtonPlayer#play');

	    if (!Array.isArray(playlist)) {
	      playlist = [playlist];
	    }

	    this.playlist = new Cursor(playlist, index);

	    const [nextTrack] = this.playlist.forward();
	    this.player.playNext(nextTrack);

	    return this.player.playTrack(this.playlist.current());
	  }

	  pause() {
	    debug('ProtonPlayer#pause');

	    this.player.pause();
	  }

	  resume() {
	    debug('ProtonPlayer#resume');

	    this.player.resume();
	  }

	  skip() {
	    debug('ProtonPlayer#skip');

	    const [nextTrack, playlist] = this.playlist.forward();
	    this.playlist = playlist;

	    if (nextTrack) {
	      this.player.playTrack(nextTrack);

	      const [followingTrack] = this.playlist.forward();
	      if (followingTrack) {
	        this.player.playNext(followingTrack);
	      }
	    } else {
	      this.player.stopAll();
	      this.player.onPlaybackEnded();
	    }
	  }

	  back() {
	    debug('ProtonPlayer#back');

	    const currentTrack = this.playlist.current();
	    const [previousTrack, playlist] = this.playlist.back();

	    this.playlist = playlist;
	    this.player.playTrack(previousTrack);
	    this.player.playNext(currentTrack);
	  }

	  currentTrack() {
	    debug('ProtonPlayer#currentTrack');

	    return this.playlist.current();
	  }

	  previousTracks() {
	    debug('ProtonPlayer#previousTracks');

	    return this.playlist.head();
	  }

	  nextTracks() {
	    debug('ProtonPlayer#nextTracks');

	    return this.playlist.tail();
	  }

	  setPlaybackPosition(percent, newLastAllowedPosition = null) {
	    debug('ProtonPlayer#setPlaybackPosition');

	    this.player.setPlaybackPosition(percent, newLastAllowedPosition);
	  }

	  setVolume(volume) {
	    debug('ProtonPlayer#setVolume');

	    this.player.setVolume(volume);
	  }

	  reset() {
	    debug('ProtonPlayer#reset');

	    this.playlist = new Cursor([]);
	    this.player.disposeAll();
	  }
	}

	return ProtonPlayer;

})));
//# sourceMappingURL=proton-player.umd.js.map
