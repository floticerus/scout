/** @preserve  scout v0.0.1
 *  copyright 2014 - kevin von flotow
 *  MIT license
 */
( function ( window )
    {
        // use jQuery if it's available
        var usingJQuery = typeof window.jQuery !== 'undefined',

            query = usingJQuery ? window.jQuery.find : window.document.querySelectorAll,

            // use anonymous function to determine how to test the style
            isHidden = ( function ()
                {
                    if ( usingJQuery )
                    {
                        // using jquery, test with .filter()
                        return function ( elem )
                        {
                            return $( elem ).filter( ':visible' ).length === 0
                        }
                    }
                    else if ( window.getComputedStyle )
                    {
                        // no jQuery, window.getComputedStyle is available
                        return function ( elem )
                        {
                            return window.getComputedStyle( elem, null ).display === 'none'
                        }
                    }
                    else
                    {
                        // no jQuery and window.getComputedStyle is not available,
                        // assume the element is visible
                        return function ()
                        {
                            return false
                        }
                    }
                }
            )()

        /** @constructor */
        function Trigger( selector, fn )
        {
            this.selector = selector

            this.fn = fn
        }

        Trigger.prototype = {
            // check this trigger
            check: function ()
            {
                var elems = query( this.selector )

                for ( var i = 0, l = elems.length; i < l; ++i )
                {
                    if ( isHidden( elems[ i ] ) )
                    {
                        continue
                    }

                    this.fn( elems[ i ], i )
                }
            }
        }

        /** @constructor */
        function Scout()
        {
            this.length = 0
        }

        Scout.prototype = {
            add: function ( selector, fn )
            {
                var trigger = new Trigger( selector, fn )

                this[ this.length++ ] = trigger

                trigger.check()
            },

            get: function ( selector, fn )
            {
                var trigger = null

                for ( var i = 0, l = this.length; i < l; ++i )
                {
                    if ( this[ i ].selector !== selector )
                    {
                        continue
                    }

                    trigger = this[ i ]

                    break
                }

                fn( trigger )
            },

            // returns true if removed, false if not
            remove: function ( selector )
            {
                var ret = false

                for ( var i = 0, l = this.length; i < l; ++i )
                {
                    if ( this[ i ].selector !== selector )
                    {
                        continue
                    }

                    this[ i ] = undefined

                    delete this[ i ]

                    --this.length

                    ret = true

                    break
                }

                return ret
            },

            // check all triggers in this instance
            checkAll: function ()
            {
                for ( var i = 0, l = this.length; i < l; ++i )
                {
                    var c = this[ i ],

                        elems = query( c.selector )

                    for ( var i2 = 0, l2 = elems.length; i2 < l2; ++i2 )
                    {
                        if ( isHidden( elems[ i2 ] ) )
                        {
                            continue
                        }

                        c.fn( elems[ i2 ], i2 )
                    }
                }
            },

            // check for one trigger
            check: function ( selector )
            {
                this.get( selector, function ( trigger )
                    {
                        if ( !trigger )
                        {
                            return
                        }

                        trigger.check()
                    }
                )
            }
        }

        window.scout = new Scout()
    }
)( window )
