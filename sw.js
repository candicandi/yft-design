if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,d)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let r={};const n=e=>i(e,c),f={module:{uri:c},exports:r,require:n};s[c]=Promise.all(a.map((e=>f[e]||n(e)))).then((e=>(d(...e),r)))}}define(["./workbox-55ed8c96"],(function(e){"use strict";e.setCacheNameDetails({prefix:"yft-design-cache"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/401-B_ETy57d.js",revision:"dc4f86bd837391db45948fcb99b2c554"},{url:"assets/401-BMX2p3yr.css",revision:"f998d7a33315beebe022d41299b588b0"},{url:"assets/404-Cr2HKakX.css",revision:"28974868014ebcce41b3949a6fd0010c"},{url:"assets/404-FmqMoseS.js",revision:"59aaa6586a49d152f88abb6e7a311fab"},{url:"assets/clipper-lib-dkorA9At.js",revision:"aa717096bcda1f45d943ef1b8ddd2f22"},{url:"assets/element-plus-Dwf9Yy3q.js",revision:"ce57888ee3bbff501740e308b295aaad"},{url:"assets/fabric-CpZ4BdJ_.js",revision:"cae7410b3ee435220f21610839f7d98e"},{url:"assets/github-CyipQpMw.js",revision:"d8820dac6c59b35d9588957bf1d318df"},{url:"assets/index-B3n3xgsx.js",revision:"d2f82d7d6874bd24eea91c16bb355012"},{url:"assets/index-B79acZXj.css",revision:"ef0ec1df7088ddac3024c0a5709f54e3"},{url:"assets/index-BNtXSVnp.css",revision:"db43eb5c8f6a99b5967138d9d282a294"},{url:"assets/index-cGl088mR.js",revision:"e304e96aae7efa22672171857f4ca6ad"},{url:"assets/index-CpEXgh05.js",revision:"2b7a0f947fbc804f04bd5d91f9356779"},{url:"assets/index-iGQSJmqi.js",revision:"30bfb3e3ae12965c4db73e4639b33096"},{url:"assets/index-xZqyV2e4.css",revision:"55bc5727659515d8452cc768379dcc30"},{url:"assets/lodash-es-D5yfcteI.js",revision:"9b2808368b456d1ba8e60fe04b652646"},{url:"assets/opentype.js-6MulV7FB.js",revision:"e9715d776a4acab052b326eab9e56612"},{url:"assets/pixi-CeYSAs8E.js",revision:"26687da80593656904e60c725bfc23ea"},{url:"assets/vue-admgRyDP.js",revision:"2adc9118fd0ac05b7f0634216ed2cd27"},{url:"assets/workbox-window.prod.es5-p40uij6f.js",revision:"5e446deae04a3e71f9ff4020a827a493"},{url:"index.html",revision:"0020d3b8909eac9003e4cf009afc2ce7"},{url:"img/icons/yft-design-192x192.png",revision:"9e4ff4f2c2ad88ba102bdc924f71a993"},{url:"img/icons/yft-design-512x512.png",revision:"59ad554042e1d1e3e2e5f8b25788f3de"},{url:"manifest.webmanifest",revision:"78ee5d33f4217faa1ba27e4cc2d45b1f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/.*/i,new e.NetworkFirst({cacheName:"interface-cache",plugins:[]}),"GET"),e.registerRoute(/(.*?)\.(js|css|ts)/,new e.CacheFirst({cacheName:"js-css-cache",plugins:[]}),"GET"),e.registerRoute(/(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,new e.CacheFirst({cacheName:"image-cache",plugins:[]}),"GET")}));
