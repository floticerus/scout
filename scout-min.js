/*
  scout v0.0.2
  copyright 2014 - kevin von flotow
  MIT license
*/
(function(d){function f(a,b){this.selector=a;this.fn=b}function g(a){this.creator=a;this.data={}}function h(){this.length=0;this.cache=new g(this)}if(!d)return console.log("scout: fatal! window object was not found");if(!d.document.querySelectorAll)return console.log("scout: fatal! window.querySelectorAll was not found");var k=d.document.querySelectorAll.bind(d.document),l=function(){if(d.getComputedStyle)return function(a){return"none"===d.getComputedStyle(a,null).display};console.log("scout: window.getComputedStyle is not available, could cause issues depending on usage");
return function(){return!1}}();f.prototype={check:function(){for(var a=k(this.selector),b=0,c=a.length;b<c;++b)l(a[b])||this.fn(a[b],b)}};g.prototype={update:function(){this.data={};var a=this;a.creator.each(function(b,c){a.data[b.selector]=c});return this},add:function(a,b){this.data[a]=b},has:function(a){return"undefined"!==typeof a&&this.data.hasOwnProperty(a)},get:function(a){return this.has(a)?this.data[a]:-1}};h.prototype={each:function(a){for(var b=0,c=this.length;b<c;++b)a(this[b],b);return this},
on:function(a,b){var c=new f(a,b),e=this.cache.get(a),e=-1<e?e:this.length++;this[e]=c;this.cache.add(a,e);c.check();return this},once:function(a,b){var c=this;c.on(a,function(e,d){c.off(a);b(e,d)});return this},off:function(a){a=this.cache.get(a);-1<a&&(Array.prototype.splice.apply(this,[a,1]),this.cache.update());return this},get:function(a,b){var c=!1,e=this.cache.get(a);-1<e&&(c=this[e]);b&&b(c);return c},check:function(a){"undefined"===typeof a?this.each(function(a,c){for(var e=k(a.selector),
d=0,f=e.length;d<f;++d)l(e[d])||a.fn(e[d],d)}):this.get(a,function(a){a&&a.check()});return this}};d.scout=new h})(this.window);
