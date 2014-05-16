scout
=====

this was developed because i needed (wanted) a simple way to fire javascript through incoming html, without any extra requests. it requires a modern browser with querySelectorAll and getComputedStyle ( chrome, ff 3.5+, opera 10+, ie 9+, safari 3.2+ ).

for example, let's say you have a basic website using ajax which returns standard html from a server.

one of the pages could look like this:

```html
<p class="foo">i am a paragraph, i contain some information.</p>
```

to setup a trigger with scout, you could do

```javascript
scout.on( '.foo', function ( element, index )
    {
        element.innerHTML = 'updated html'
    }
)
```

to check triggers, you have to tell scout when to look. for example, in an ajax or statechange handler.
```
$( window ).on( 'statechange', function ( e )
    {
        // passing no arguments checks all of the triggers
        scout.check()

        // passing a string will check for specific selectors that have already been defined
        scout.check( '.foo' )
    }
)
```


chainable for your convenience

```javascript
scout
    .on( '.foo', doClass )
    .on( '[data-bar]', doAttribute )
    .once( '.once', doOnce )
```
