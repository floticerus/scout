scout
=====

this was developed because i needed (wanted) a simple way to fire javascript through incoming html, without any extra requests. it requires a modern browser with querySelectorAll and getComputedStyle ( chrome, ff 3.5+, opera 10+, ie 9+, safari 3.2+ ).

for example, let's say you have a basic website using ajax which returns plain html from a server.

> one of the pages could look like this
>
> ```html
> <p class="foo">i am a paragraph, i contain some information.</p>
> ```

&nbsp;

> to setup a trigger with scout, you could do
>
> ```javascript
> scout.on( '.foo', function ( element, index )
>     {
>         element.innerHTML = 'updated html'
>     }
> )
> ```

&nbsp;

> to check triggers, you have to tell scout when to look. for example, in an ajax or statechange handler.
> ```javascript
> $( window ).on( 'statechange', function ( e )
>     {
>         // ... do some stuff ...
> 
>         // passing no arguments checks all of the triggers
>         scout.check()
> 
>         // passing a string will check for specific selectors that have already been defined
>         scout.check( '.foo' )
>     }
> )
> ```

in order for the trigger to fire, the element must be visible. i.e. the elements `display` style must not be set to `none`. if `visibility` is set to `hidden`, or `opacity` to `0`, the trigger will still fire.

> chainable for your convenience
> 
> ```javascript
> scout
>     .on( '.foo', doClass )
>     .on( '[data-bar]', doAttribute )
>     .once( '#once', doIdOnce )
> ```

license
----
The MIT License (MIT)

Copyright (c) 2014 kevin von flotow
