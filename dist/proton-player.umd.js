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

	function noop() {}

	const SLEEP_CANCELLED = 'SLEEP_CANCELLED';

	class CancellableSleep {
	  constructor(timeout) {
	    this._timeout = timeout;
	    this._sleepOnCancel = noop;
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

	var bind = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};

	// utils is a library of generic helper functions non-specific to axios

	var toString = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}

	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a plain Object
	 *
	 * @param {Object} val The value to test
	 * @return {boolean} True if value is a plain Object, otherwise false
	 */
	function isPlainObject(val) {
	  if (toString.call(val) !== '[object Object]') {
	    return false;
	  }

	  var prototype = Object.getPrototypeOf(val);
	  return prototype === null || prototype === Object.prototype;
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}

	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	}

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
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
	                                           navigator.product === 'NativeScript' ||
	                                           navigator.product === 'NS')) {
	    return false;
	  }
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined'
	  );
	}

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
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
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
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (isPlainObject(result[key]) && isPlainObject(val)) {
	      result[key] = merge(result[key], val);
	    } else if (isPlainObject(val)) {
	      result[key] = merge({}, val);
	    } else if (isArray(val)) {
	      result[key] = val.slice();
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}

	/**
	 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	 *
	 * @param {string} content with BOM
	 * @return {string} content value without BOM
	 */
	function stripBOM(content) {
	  if (content.charCodeAt(0) === 0xFEFF) {
	    content = content.slice(1);
	  }
	  return content;
	}

	var utils = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isPlainObject: isPlainObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim,
	  stripBOM: stripBOM
	};

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
	 * @returns {string} The formatted url
	 */
	var buildURL = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }

	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];

	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }

	      if (utils.isArray(val)) {
	        key = key + '[]';
	      } else {
	        val = [val];
	      }

	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });

	    serializedParams = parts.join('&');
	  }

	  if (serializedParams) {
	    var hashmarkIndex = url.indexOf('#');
	    if (hashmarkIndex !== -1) {
	      url = url.slice(0, hashmarkIndex);
	    }

	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	};

	function InterceptorManager() {
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
	InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected,
	    synchronous: options ? options.synchronous : false,
	    runWhen: options ? options.runWhen : null
	  });
	  return this.handlers.length - 1;
	};

	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};

	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	var InterceptorManager_1 = InterceptorManager;

	var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};

	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	var enhanceError = function enhanceError(error, config, code, request, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }

	  error.request = request;
	  error.response = response;
	  error.isAxiosError = true;

	  error.toJSON = function toJSON() {
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
	      code: this.code
	    };
	  };
	  return error;
	};

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	var createError = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	var settle = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response.request,
	      response
	    ));
	  }
	};

	var cookies = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs support document.cookie
	    (function standardBrowserEnv() {
	      return {
	        write: function write(name, value, expires, path, domain, secure) {
	          var cookie = [];
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
	          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
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
	    })()
	);

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	var isAbsoluteURL = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	var combineURLs = function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	};

	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 * @returns {string} The combined full path
	 */
	var buildFullPath = function buildFullPath(baseURL, requestedURL) {
	  if (baseURL && !isAbsoluteURL(requestedURL)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	};

	// Headers whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	var ignoreDuplicateOf = [
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	];

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
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	var parseHeaders = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;

	  if (!headers) { return parsed; }

	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));

	    if (key) {
	      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
	        return;
	      }
	      if (key === 'set-cookie') {
	        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
	      } else {
	        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	      }
	    }
	  });

	  return parsed;
	};

	var isURLSameOrigin = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	    (function standardBrowserEnv() {
	      var msie = /(msie|trident)/i.test(navigator.userAgent);
	      var urlParsingNode = document.createElement('a');
	      var originURL;

	      /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	      function resolveURL(url) {
	        var href = url;

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
	        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	        return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	      };
	    })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	    (function nonStandardBrowserEnv() {
	      return function isURLSameOrigin() {
	        return true;
	      };
	    })()
	);

	var xhr = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	    var responseType = config.responseType;

	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }

	    var request = new XMLHttpRequest();

	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }

	    var fullPath = buildFullPath(config.baseURL, config.url);
	    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

	    // Set the request timeout in MS
	    request.timeout = config.timeout;

	    function onloadend() {
	      if (!request) {
	        return;
	      }
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
	        request.responseText : request.response;
	      var response = {
	        data: responseData,
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };

	      settle(resolve, reject, response);

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

	      reject(createError('Request aborted', config, 'ECONNABORTED', request));

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config, null, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
	      if (config.timeoutErrorMessage) {
	        timeoutErrorMessage = config.timeoutErrorMessage;
	      }
	      reject(createError(
	        timeoutErrorMessage,
	        config,
	        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
	        request));

	      // Clean up request
	      request = null;
	    };

	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
	        cookies.read(config.xsrfCookieName) :
	        undefined;

	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
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
	      request.addEventListener('progress', config.onDownloadProgress);
	    }

	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }

	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }

	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }

	    if (!requestData) {
	      requestData = null;
	    }

	    // Send the request
	    request.send(requestData);
	  });
	};

	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}

	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = xhr;
	  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
	    // For node use HTTP adapter
	    adapter = xhr;
	  }
	  return adapter;
	}

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

	var defaults = {

	  transitional: {
	    silentJSONParsing: true,
	    forcedJSONParsing: true,
	    clarifyTimeoutError: false
	  },

	  adapter: getDefaultAdapter(),

	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Accept');
	    normalizeHeaderName(headers, 'Content-Type');

	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
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
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
	      setContentTypeIfUnset(headers, 'application/json');
	      return stringifySafely(data);
	    }
	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    var transitional = this.transitional;
	    var silentJSONParsing = transitional && transitional.silentJSONParsing;
	    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
	    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

	    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
	      try {
	        return JSON.parse(data);
	      } catch (e) {
	        if (strictJSONParsing) {
	          if (e.name === 'SyntaxError') {
	            throw enhanceError(e, this, 'E_JSON_PARSE');
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

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};

	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};

	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});

	var defaults_1 = defaults;

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	var transformData = function transformData(data, headers, fns) {
	  var context = this || defaults_1;
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn.call(context, data, headers);
	  });

	  return data;
	};

	var isCancel = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	var dispatchRequest = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  // Ensure headers exist
	  config.headers = config.headers || {};

	  // Transform request data
	  config.data = transformData.call(
	    config,
	    config.data,
	    config.headers,
	    config.transformRequest
	  );

	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers
	  );

	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );

	  var adapter = config.adapter || defaults_1.adapter;

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData.call(
	      config,
	      response.data,
	      response.headers,
	      config.transformResponse
	    );

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData.call(
	          config,
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }

	    return Promise.reject(reason);
	  });
	};

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	var mergeConfig = function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  var config = {};

	  var valueFromConfig2Keys = ['url', 'method', 'data'];
	  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
	  var defaultToConfig2Keys = [
	    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
	    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
	    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
	    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
	    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
	  ];
	  var directMergeKeys = ['validateStatus'];

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

	  function mergeDeepProperties(prop) {
	    if (!utils.isUndefined(config2[prop])) {
	      config[prop] = getMergedValue(config1[prop], config2[prop]);
	    } else if (!utils.isUndefined(config1[prop])) {
	      config[prop] = getMergedValue(undefined, config1[prop]);
	    }
	  }

	  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
	    if (!utils.isUndefined(config2[prop])) {
	      config[prop] = getMergedValue(undefined, config2[prop]);
	    }
	  });

	  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

	  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
	    if (!utils.isUndefined(config2[prop])) {
	      config[prop] = getMergedValue(undefined, config2[prop]);
	    } else if (!utils.isUndefined(config1[prop])) {
	      config[prop] = getMergedValue(undefined, config1[prop]);
	    }
	  });

	  utils.forEach(directMergeKeys, function merge(prop) {
	    if (prop in config2) {
	      config[prop] = getMergedValue(config1[prop], config2[prop]);
	    } else if (prop in config1) {
	      config[prop] = getMergedValue(undefined, config1[prop]);
	    }
	  });

	  var axiosKeys = valueFromConfig2Keys
	    .concat(mergeDeepPropertiesKeys)
	    .concat(defaultToConfig2Keys)
	    .concat(directMergeKeys);

	  var otherKeys = Object
	    .keys(config1)
	    .concat(Object.keys(config2))
	    .filter(function filterAxiosKeys(key) {
	      return axiosKeys.indexOf(key) === -1;
	    });

	  utils.forEach(otherKeys, mergeDeepProperties);

	  return config;
	};

	var name = "axios";
	var version = "0.21.4";
	var description = "Promise based HTTP client for the browser and node.js";
	var main = "index.js";
	var scripts = {
		test: "grunt test",
		start: "node ./sandbox/server.js",
		build: "NODE_ENV=production grunt build",
		preversion: "npm test",
		version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
		postversion: "git push && git push --tags",
		examples: "node ./examples/server.js",
		coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
		fix: "eslint --fix lib/**/*.js"
	};
	var repository = {
		type: "git",
		url: "https://github.com/axios/axios.git"
	};
	var keywords = [
		"xhr",
		"http",
		"ajax",
		"promise",
		"node"
	];
	var author = "Matt Zabriskie";
	var license = "MIT";
	var bugs = {
		url: "https://github.com/axios/axios/issues"
	};
	var homepage = "https://axios-http.com";
	var devDependencies = {
		coveralls: "^3.0.0",
		"es6-promise": "^4.2.4",
		grunt: "^1.3.0",
		"grunt-banner": "^0.6.0",
		"grunt-cli": "^1.2.0",
		"grunt-contrib-clean": "^1.1.0",
		"grunt-contrib-watch": "^1.0.0",
		"grunt-eslint": "^23.0.0",
		"grunt-karma": "^4.0.0",
		"grunt-mocha-test": "^0.13.3",
		"grunt-ts": "^6.0.0-beta.19",
		"grunt-webpack": "^4.0.2",
		"istanbul-instrumenter-loader": "^1.0.0",
		"jasmine-core": "^2.4.1",
		karma: "^6.3.2",
		"karma-chrome-launcher": "^3.1.0",
		"karma-firefox-launcher": "^2.1.0",
		"karma-jasmine": "^1.1.1",
		"karma-jasmine-ajax": "^0.1.13",
		"karma-safari-launcher": "^1.0.0",
		"karma-sauce-launcher": "^4.3.6",
		"karma-sinon": "^1.0.5",
		"karma-sourcemap-loader": "^0.3.8",
		"karma-webpack": "^4.0.2",
		"load-grunt-tasks": "^3.5.2",
		minimist: "^1.2.0",
		mocha: "^8.2.1",
		sinon: "^4.5.0",
		"terser-webpack-plugin": "^4.2.3",
		typescript: "^4.0.5",
		"url-search-params": "^0.10.0",
		webpack: "^4.44.2",
		"webpack-dev-server": "^3.11.0"
	};
	var browser = {
		"./lib/adapters/http.js": "./lib/adapters/xhr.js"
	};
	var jsdelivr = "dist/axios.min.js";
	var unpkg = "dist/axios.min.js";
	var typings = "./index.d.ts";
	var dependencies = {
		"follow-redirects": "^1.14.0"
	};
	var bundlesize = [
		{
			path: "./dist/axios.min.js",
			threshold: "5kB"
		}
	];
	var pkg = {
		name: name,
		version: version,
		description: description,
		main: main,
		scripts: scripts,
		repository: repository,
		keywords: keywords,
		author: author,
		license: license,
		bugs: bugs,
		homepage: homepage,
		devDependencies: devDependencies,
		browser: browser,
		jsdelivr: jsdelivr,
		unpkg: unpkg,
		typings: typings,
		dependencies: dependencies,
		bundlesize: bundlesize
	};

	var validators$1 = {};

	// eslint-disable-next-line func-names
	['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
	  validators$1[type] = function validator(thing) {
	    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
	  };
	});

	var deprecatedWarnings = {};
	var currentVerArr = pkg.version.split('.');

	/**
	 * Compare package versions
	 * @param {string} version
	 * @param {string?} thanVersion
	 * @returns {boolean}
	 */
	function isOlderVersion(version, thanVersion) {
	  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
	  var destVer = version.split('.');
	  for (var i = 0; i < 3; i++) {
	    if (pkgVersionArr[i] > destVer[i]) {
	      return true;
	    } else if (pkgVersionArr[i] < destVer[i]) {
	      return false;
	    }
	  }
	  return false;
	}

	/**
	 * Transitional option validator
	 * @param {function|boolean?} validator
	 * @param {string?} version
	 * @param {string} message
	 * @returns {function}
	 */
	validators$1.transitional = function transitional(validator, version, message) {
	  var isDeprecated = version && isOlderVersion(version);

	  function formatMessage(opt, desc) {
	    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
	  }

	  // eslint-disable-next-line func-names
	  return function(value, opt, opts) {
	    if (validator === false) {
	      throw new Error(formatMessage(opt, ' has been removed in ' + version));
	    }

	    if (isDeprecated && !deprecatedWarnings[opt]) {
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
	 * @param {object} options
	 * @param {object} schema
	 * @param {boolean?} allowUnknown
	 */

	function assertOptions(options, schema, allowUnknown) {
	  if (typeof options !== 'object') {
	    throw new TypeError('options must be an object');
	  }
	  var keys = Object.keys(options);
	  var i = keys.length;
	  while (i-- > 0) {
	    var opt = keys[i];
	    var validator = schema[opt];
	    if (validator) {
	      var value = options[opt];
	      var result = value === undefined || validator(value, opt, options);
	      if (result !== true) {
	        throw new TypeError('option ' + opt + ' must be ' + result);
	      }
	      continue;
	    }
	    if (allowUnknown !== true) {
	      throw Error('Unknown option ' + opt);
	    }
	  }
	}

	var validator = {
	  isOlderVersion: isOlderVersion,
	  assertOptions: assertOptions,
	  validators: validators$1
	};

	var validators = validator.validators;
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager_1(),
	    response: new InterceptorManager_1()
	  };
	}

	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = arguments[1] || {};
	    config.url = arguments[0];
	  } else {
	    config = config || {};
	  }

	  config = mergeConfig(this.defaults, config);

	  // Set config.method
	  if (config.method) {
	    config.method = config.method.toLowerCase();
	  } else if (this.defaults.method) {
	    config.method = this.defaults.method.toLowerCase();
	  } else {
	    config.method = 'get';
	  }

	  var transitional = config.transitional;

	  if (transitional !== undefined) {
	    validator.assertOptions(transitional, {
	      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
	      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
	      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
	    }, false);
	  }

	  // filter out skipped interceptors
	  var requestInterceptorChain = [];
	  var synchronousRequestInterceptors = true;
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
	      return;
	    }

	    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

	    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });

	  var responseInterceptorChain = [];
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
	  });

	  var promise;

	  if (!synchronousRequestInterceptors) {
	    var chain = [dispatchRequest, undefined];

	    Array.prototype.unshift.apply(chain, requestInterceptorChain);
	    chain = chain.concat(responseInterceptorChain);

	    promise = Promise.resolve(config);
	    while (chain.length) {
	      promise = promise.then(chain.shift(), chain.shift());
	    }

	    return promise;
	  }


	  var newConfig = config;
	  while (requestInterceptorChain.length) {
	    var onFulfilled = requestInterceptorChain.shift();
	    var onRejected = requestInterceptorChain.shift();
	    try {
	      newConfig = onFulfilled(newConfig);
	    } catch (error) {
	      onRejected(error);
	      break;
	    }
	  }

	  try {
	    promise = dispatchRequest(newConfig);
	  } catch (error) {
	    return Promise.reject(error);
	  }

	  while (responseInterceptorChain.length) {
	    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
	  }

	  return promise;
	};

	Axios.prototype.getUri = function getUri(config) {
	  config = mergeConfig(this.defaults, config);
	  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
	};

	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(mergeConfig(config || {}, {
	      method: method,
	      url: url,
	      data: (config || {}).data
	    }));
	  };
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(mergeConfig(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});

	var Axios_1 = Axios;

	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}

	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};

	Cancel.prototype.__CANCEL__ = true;

	var Cancel_1 = Cancel;

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }

	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });

	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }

	    token.reason = new Cancel_1(message);
	    resolvePromise(token.reason);
	  });
	}

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};

	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};

	var CancelToken_1 = CancelToken;

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
	 * @returns {Function}
	 */
	var spread = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};

	/**
	 * Determines whether the payload is an error thrown by Axios
	 *
	 * @param {*} payload The value to test
	 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
	 */
	var isAxiosError = function isAxiosError(payload) {
	  return (typeof payload === 'object') && (payload.isAxiosError === true);
	};

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios_1(defaultConfig);
	  var instance = bind(Axios_1.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios_1.prototype, context);

	  // Copy context to instance
	  utils.extend(instance, context);

	  return instance;
	}

	// Create the default instance to be exported
	var axios$1 = createInstance(defaults_1);

	// Expose Axios class to allow class inheritance
	axios$1.Axios = Axios_1;

	// Factory for creating new instances
	axios$1.create = function create(instanceConfig) {
	  return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
	};

	// Expose Cancel & CancelToken
	axios$1.Cancel = Cancel_1;
	axios$1.CancelToken = CancelToken_1;
	axios$1.isCancel = isCancel;

	// Expose all/spread
	axios$1.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios$1.spread = spread;

	// Expose isAxiosError
	axios$1.isAxiosError = isAxiosError;

	var axios_1 = axios$1;

	// Allow use of default import syntax in TypeScript
	var _default = axios$1;
	axios_1.default = _default;

	var axios = axios_1;

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
	    this._cancelTokenSource = axios.CancelToken.source();
	  }

	  cancel() {
	    this._cancelled = true;
	    this._cancelTokenSource.cancel();
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
	      cancelToken: this._cancelTokenSource.token,
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
	        if (error instanceof axios.Cancel) return;

	        const timedOut = error.code === 'ECONNABORTED';
	        const networkError = error.message === 'Network Error';
	        const decodingError = error instanceof DecodingError;
	        const tooManyRequests = error.response && error.response.status === 429;
	        if (timedOut || networkError || decodingError || tooManyRequests) {
	          if (!networkError && retryCount >= 10) {
	            throw new Error(`Chunk fetch/decode failed after ${retryCount} retries`);
	          }
	          const timeout = tooManyRequests ? seconds(10) : seconds(retryCount); // TODO: use `X-RateLimit-Reset` header if error was "tooManyRequests"
	          this._sleep = new CancellableSleep(timeout);
	          return this._sleep
	            .wait()
	            .then(() => this.fetch(retryCount + 1))
	            .catch((err) => {
	              if (err !== SLEEP_CANCELLED) throw err;
	            });
	        }
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

	    this.buffer().then(noop).catch(noop);

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
	        try {
	          this._sourceBuffer.remove(0, this._audioElement.currentTime);
	        } catch (e) {
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

	  const audioElement = new Audio(getSilenceURL());
	  audioElement.play();

	  iOSAudioIsInitialized = true;
	  window.removeEventListener('touchstart', initializeiOSAudioEngine, false);
	}

	function initializeiOSAudioEngine$1 () {
	  window.addEventListener('touchstart', initializeiOSAudioEngine, false);
	}

	initializeiOSAudioEngine$1();

	class ProtonPlayer {
	  constructor({ volume = 1, onReady = noop, onError = noop }) {

	    const browser = Bowser.getParser(window.navigator.userAgent);
	    this.browserName = browser.getBrowserName().toLowerCase();
	    this.osName = browser.getOSName().toLowerCase();

	    // Firefox is not supported because it cannot decode MP3 files.
	    if (this.browserName === 'firefox') {
	      throw new ProtonPlayerError(`${this.browserName} is not supported.`);
	    }

	    // Check if the AudioContext API can be instantiated.
	    try {
	      getContext();
	    } catch (e) {
	      throw new ProtonPlayerError(
	        `${this.browserName} does not support the AudioContext API.`
	      );
	    }

	    this._onReady = onReady;
	    this._onError = onError;
	    this._volume = volume;
	    this._ready = false;
	    const silenceChunkSize = 64 * 64;
	    this._silenceChunksClipState = new ClipState(silenceChunkSize);
	    this._clips = {};
	    this._currentlyPlaying = null;
	    this._playbackPositionInterval = null;
	    this._useMediaSource =
	      typeof window.MediaSource !== 'undefined' &&
	      typeof window.MediaSource.isTypeSupported === 'function' &&
	      window.MediaSource.isTypeSupported('audio/mpeg');

	    if (this._useMediaSource) {
	      const audioElement = document.createElement('audio');
	      audioElement.autoplay = false;

	      document.body.appendChild(audioElement);

	      audioElement.addEventListener('ended', () => {
	        if (this._currentlyPlaying && this._currentlyPlaying.clip) {
	          this._currentlyPlaying.clip.playbackEnded();
	        }
	      });

	      audioElement.addEventListener('waiting', () => {
	        if (this._currentlyPlaying) {
	          this._currentlyPlaying.onBufferChange(true);
	        }
	      });

	      ['canplay', 'canplaythrough', 'playing'].forEach((eventName) => {
	        audioElement.addEventListener(eventName, () => {
	          if (this._currentlyPlaying) {
	            this._currentlyPlaying.onBufferChange(false);
	          }
	        });
	      });
	    }

	    const silenceLoader = new Loader(
	      silenceChunkSize,
	      getSilenceURL(),
	      this._silenceChunksClipState
	    );
	    silenceLoader.on('loaderror', (err) => {
	      this._ready = false;
	      this._onError(err);
	    });
	    silenceLoader.on('load', () => {
	      this._ready = true;
	      this._onReady();
	    });
	    silenceLoader.buffer();
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
	      this._onError(err);
	      return Promise.reject(err);
	    }
	  }

	  play({
	    url,
	    fileSize,
	    onBufferChange = noop,
	    onBufferProgress = noop,
	    onPlaybackProgress = noop,
	    onPlaybackEnded = noop,
	    initialPosition = 0,
	    lastAllowedPosition = 1,
	    audioMetadata = {},
	    fromSetPlaybackPosition = false,
	  }) {

	    if (!this._ready) {
	      const message = 'Player not ready';
	      warn(message);
	      return Promise.reject(message);
	    }

	    if (
	      this._currentlyPlaying &&
	      this._currentlyPlaying.clip &&
	      this._currentlyPlaying.url === url &&
	      fromSetPlaybackPosition === false
	    ) {
	      return this._currentlyPlaying.clip.resume() || Promise.resolve();
	    }

	    onBufferProgress(0, 0);
	    onPlaybackProgress(initialPosition);

	    this.stopAll();

	    try {
	      const clip = this._getClip(
	        url,
	        fileSize,
	        initialPosition,
	        lastAllowedPosition,
	        audioMetadata
	      );

	      this._currentlyPlaying = {
	        clip,
	        url,
	        fileSize,
	        onBufferChange,
	        onBufferProgress,
	        onPlaybackProgress,
	        onPlaybackEnded,
	        lastAllowedPosition,
	        lastReportedProgress: initialPosition,
	      };

	      clip.on('loadprogress', ({ initialPosition, progress }) =>
	        onBufferProgress(initialPosition, progress)
	      );

	      clip.once('ended', () => {
	        this.stopAll();
	        onPlaybackProgress(1);
	        onPlaybackEnded();
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
	          !this._currentlyPlaying ||
	          progress < this._currentlyPlaying.lastReportedProgress // Prevent playback progress from going backwards
	        ) {
	          return;
	        }

	        this._currentlyPlaying.lastReportedProgress = progress;
	        onPlaybackProgress(progress);
	      }, 250);

	      return clip.play() || Promise.resolve();
	    } catch (err) {
	      this._onError(err);
	      return Promise.reject(err.toString());
	    }
	  }

	  pauseAll() {

	    if (this._currentlyPlaying && this._currentlyPlaying.clip) {
	      this._currentlyPlaying.clip.pause();
	    }
	  }

	  stopAll() {

	    this._currentlyPlaying = null;
	    this._clearIntervals();
	    Object.keys(this._clips).forEach((k) => {
	      this._clips[k].offAll('loadprogress');
	      this._clips[k].stop();
	    });
	  }

	  dispose(url) {

	    if (this._currentlyPlaying && this._currentlyPlaying.url === url) {
	      this._currentlyPlaying = null;
	      this._clearIntervals();
	    }

	    if (!this._clips[url]) return;

	    this._clips[url].offAll('loadprogress');
	    this._clips[url].dispose();
	    delete this._clips[url];
	  }

	  disposeAll() {

	    this.disposeAllExcept();
	  }

	  disposeAllExcept(urls = []) {

	    Object.keys(this._clips)
	      .filter((k) => urls.indexOf(k) < 0)
	      .forEach((k) => this.dispose(k));
	  }

	  setPlaybackPosition(percent, newLastAllowedPosition = null) {

	    if (!this._currentlyPlaying || percent > 1) {
	      return Promise.resolve();
	    }

	    this._currentlyPlaying.lastReportedProgress = percent;

	    const {
	      url,
	      fileSize,
	      onBufferChange,
	      onBufferProgress,
	      onPlaybackProgress,
	      onPlaybackEnded,
	      lastAllowedPosition,
	    } = this._currentlyPlaying;

	    newLastAllowedPosition = newLastAllowedPosition || lastAllowedPosition;

	    const clip = this._clips[url];

	    if (clip) {
	      return (
	        clip.setCurrentPosition(percent, newLastAllowedPosition) || Promise.resolve()
	      );
	    }

	    const audioMetadata = clip && clip.audioMetadata;

	    this.dispose(url);

	    return this.play({
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

	  setVolume(volume = 1) {

	    this._volume = volume;
	    Object.keys(this._clips).forEach((k) => {
	      this._clips[k].volume = this._volume;
	    });
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

	    if (this._clips[url]) {
	      return this._clips[url];
	    }

	    const clip = new Clip({
	      url,
	      fileSize,
	      initialPosition,
	      lastAllowedPosition,
	      audioMetadata,
	      silenceChunks: this._silenceChunksClipState.chunks,
	      volume: this._volume,
	      osName: this.osName,
	      browserName: this.browserName,
	      useMediaSource: this._useMediaSource,
	    });

	    clip.on('loaderror', (err) => {
	      error$1('Clip failed to load', err);
	    });

	    clip.on('playbackerror', (err) => {
	      error$1('Something went wrong during playback', err);
	    });

	    this._clips[url] = clip;
	    return clip;
	  }

	  _clearIntervals() {
	    clearInterval(this._playbackPositionInterval);
	  }
	}

	return ProtonPlayer;

})));
//# sourceMappingURL=proton-player.umd.js.map
