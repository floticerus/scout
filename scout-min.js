/*
  scout v0.0.1
  copyright 2014 - kevin von flotow
  MIT license
*/
(function(d){function f(a,b){this.selector=a;this.fn=b}function h(){this.length=0;this.cache={}}if(d){var k="undefined"!==typeof d.jQuery,l=k?d.jQuery.find:d.document.querySelectorAll,m=function(){return k?function(a){return 0===$(a).filter(":visible").length}:d.getComputedStyle?function(a){return"none"===d.getComputedStyle(a,null).display}:function(){return!1}}();f.prototype={check:function(){for(var a=l(this.selector),b=0,c=a.length;b<c;++b)m(a[b])||this.fn(a[b],b)}};h.prototype={updateCache:function(){this.cache=
{};for(var a=0,b=this.length;a<b;++a)this.cache[this[a].selector]=a;return this},on:function(a,b){var c=new f(a,b),g=this.cache[a]?this.cache[a]:this.length++;this[g]=c;this.cache[a]=g;c.check();return this},once:function(a,b){var c=this;c.on(a,function(g,d){c.off(a);b(g,d)});return this},off:function(a){this.cache.hasOwnProperty(a)&&this[this.cache[a]]&&(Array.prototype.splice.apply(this,[this.cache[a],1]),this.updateCache());return this},get:function(a,b){var c=null;this.cache.hasOwnProperty(a)&&
this[this.cache[a]]&&(c=this[this.cache[a]]);b&&b(c);return c},checkAll:function(){for(var a=0,b=this.length;a<b;++a)for(var c=this[a],d=l(c.selector),e=0,f=d.length;e<f;++e)m(d[e])||c.fn(d[e],e);return this},check:function(a){this.get(a,function(a){a&&a.check()});return this}};d.scout=new h}})(window);
