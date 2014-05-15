/*
  scout v0.0.1
  copyright 2014 - kevin von flotow
  MIT license
*/
(function(e){function g(a,b){this.selector=a;this.fn=b}function h(){this.length=0}var k="undefined"!==typeof e.jQuery,l=k?e.jQuery.find:e.document.querySelectorAll,m=function(){return k?function(a){return 0===$(a).filter(":visible").length}:e.getComputedStyle?function(a){return"none"===e.getComputedStyle(a,null).display}:function(){return!1}}();g.prototype={check:function(){for(var a=l(this.selector),b=0,c=a.length;b<c;++b)m(a[b])||this.fn(a[b],b)}};h.prototype={add:function(a,b){var c=new g(a,b);
this[this.length++]=c;c.check()},get:function(a,b){for(var c=null,d=0,f=this.length;d<f;++d)if(this[d].selector===a){c=this[d];break}b(c)},remove:function(a){for(var b=!1,c=0,d=this.length;c<d;++c)if(this[c].selector===a){this[c]=void 0;delete this[c];--this.length;b=!0;break}return b},checkAll:function(){for(var a=0,b=this.length;a<b;++a)for(var c=this[a],d=l(c.selector),f=0,e=d.length;f<e;++f)m(d[f])||c.fn(d[f],f)},check:function(a){this.get(a,function(a){a&&a.check()})}};e.Scout=h})(window);
