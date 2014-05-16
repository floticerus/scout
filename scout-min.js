/*
  scout v0.0.1
  copyright 2014 - kevin von flotow
  MIT license
*/
(function(c){function f(a,b){this.selector=a;this.fn=b}function h(a){this.creator=a;this.data={}}function k(){this.length=0;this.cache=new h(this)}if(c){var l="undefined"!==typeof c.$&&c.$.extend,g=l?c.$:c.document.querySelectorAll,m=function(){if(l&&g("scout").filter)return function(a){return 0!==g(a).filter(":hidden").length};if(c.getComputedStyle)return function(a){return"none"===c.getComputedStyle(a,null).display};console.log("scout: unable to find compatible library (such as jQuery) or window.getComputedStyle, could cause issues depending on usage");
return function(){return!1}}();f.prototype={check:function(){for(var a=g(this.selector),b=0,d=a.length;b<d;++b)m(a[b])||this.fn(a[b],b)}};h.prototype={update:function(){this.data={};for(var a=0,b=this.creator.length;a<b;++a)this.data[this.creator[a].selector]=a;return this},add:function(a,b){this.data[a]=b},has:function(a){return"undefined"!==typeof a&&this.data.hasOwnProperty(a)},get:function(a){return this.has(a)?this.data[a]:-1}};k.prototype={on:function(a,b){var d=new f(a,b),e=this.cache.get(a),
e=-1<e?e:this.length++;this[e]=d;this.cache.add(a,e);d.check();return this},once:function(a,b){var d=this;d.on(a,function(e,c){d.off(a);b(e,c)});return this},off:function(a){a=this.cache.get(a);-1<a&&(Array.prototype.splice.apply(this,[a,1]),this.cache.update());return this},get:function(a,b){var d=!1,e=this.cache.get(a);-1<e&&(d=this[e]);b&&b(d);return d},check:function(a){if("undefined"===typeof a){a=0;for(var b=this.length;a<b;++a)for(var d=this[a],e=g(d.selector),c=0,f=e.length;c<f;++c)m(e[c])||
d.fn(e[c],c)}else this.get(a,function(a){a&&a.check()});return this}};c.scout=new k}})(window);
