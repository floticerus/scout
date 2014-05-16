/*
  scout v0.0.2
  copyright 2014 - kevin von flotow
  MIT license
*/
(function(f){function g(a,b){this.selector=a;this.fn=b}function h(a){this.creator=a;this.data={}}function k(){this.length=0;this.cache=new h(this)}if(f){var l=function(){if(f.getComputedStyle)return function(a){return"none"===f.getComputedStyle(a,null).display};console.log("scout: window.getComputedStyle is not available, could cause issues depending on usage");return function(){return!1}}();g.prototype={check:function(){for(var a=f.document.querySelectorAll(this.selector),b=0,c=a.length;b<c;++b)l(a[b])||
this.fn(a[b],b)}};h.prototype={update:function(){this.data={};for(var a=0,b=this.creator.length;a<b;++a)this.data[this.creator[a].selector]=a;return this},add:function(a,b){this.data[a]=b},has:function(a){return"undefined"!==typeof a&&this.data.hasOwnProperty(a)},get:function(a){return this.has(a)?this.data[a]:-1}};k.prototype={on:function(a,b){var c=new g(a,b),d=this.cache.get(a),d=-1<d?d:this.length++;this[d]=c;this.cache.add(a,d);c.check();return this},once:function(a,b){var c=this;c.on(a,function(d,
e){c.off(a);b(d,e)});return this},off:function(a){a=this.cache.get(a);-1<a&&(Array.prototype.splice.apply(this,[a,1]),this.cache.update());return this},get:function(a,b){var c=!1,d=this.cache.get(a);-1<d&&(c=this[d]);b&&b(c);return c},check:function(a){if("undefined"===typeof a){a=0;for(var b=this.length;a<b;++a)for(var c=this[a],d=f.document.querySelectorAll(c.selector),e=0,g=d.length;e<g;++e)l(d[e])||c.fn(d[e],e)}else this.get(a,function(a){a&&a.check()});return this}};f.scout=new k}})(window);
