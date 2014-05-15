/*
  scout v0.0.1
  copyright 2014 - kevin von flotow
  MIT license
*/
(function(d){function f(a,b){this.selector=a;this.fn=b}function g(){this.length=0}if(d){var h="undefined"!==typeof d.jQuery,k=h?d.jQuery.find:d.document.querySelectorAll,l=function(){return h?function(a){return 0===$(a).filter(":visible").length}:d.getComputedStyle?function(a){return"none"===d.getComputedStyle(a,null).display}:function(){return!1}}();f.prototype={check:function(){for(var a=k(this.selector),b=0,c=a.length;b<c;++b)l(a[b])||this.fn(a[b],b)}};g.prototype={add:function(a,b){var c=new f(a,
b);this[this.length++]=c;c.check()},get:function(a,b){for(var c=null,e=0,d=this.length;e<d;++e)if(this[e].selector===a){c=this[e];break}b(c)},remove:function(a){for(var b=!1,c=0,e=this.length;c<e;++c)if(this[c].selector===a){this[c]=void 0;delete this[c];--this.length;b=!0;break}return b},checkAll:function(){for(var a=0,b=this.length;a<b;++a)for(var c=this[a],e=k(c.selector),d=0,f=e.length;d<f;++d)l(e[d])||c.fn(e[d],d)},check:function(a){this.get(a,function(a){a&&a.check()})}};d.scout=new g}})(window);
