/** @preserve  scout v0.0.1
 *  copyright 2014 - kevin von flotow
 *  MIT license
 */
;( function ( window )
    {
        if ( !window )
        {
            // window is not set - trying to run in nodejs or something? hmmm
            return
        }

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
            // build an array-like object for fast iterations
            // need to set initial length to 0
            this.length = 0

            // build a cache for searching without loops
            this.cache = {}
        }

        Scout.prototype = {
            updateCache: function ()
            {
                // reset the cache
                this.cache = {}

                // build a new cache
                for ( var i = 0, l = this.length; i < l; ++i )
                {
                    this.cache[ this[ i ].selector ] = i
                }

                return this
            },

            on: function ( selector, fn )
            {
                var trigger = new Trigger( selector, fn ),

                    // if selector is cached, grab the existing index
                    newLen = this.cache[ selector ] ? this.cache[ selector ] : this.length++

                // save the trigger
                this[ newLen ] = trigger

                // add index to cache - no need for a full rebuild
                this.cache[ selector ] = newLen

                // run an initial check on this trigger - should be optional
                trigger.check()

                return this
            },

            once: function ( selector, fn )
            {
                var that = this

                that.on( selector, function ( element, index )
                    {
                        that.off( selector )

                        fn( element, index )
                    }
                )

                return this
            },

            off: function ( selector )
            {
                if ( this.cache.hasOwnProperty( selector ) && this[ this.cache[ selector ] ] )
                {
                    // hopefully this works without issues
                    Array.prototype.splice.apply( this, [ this.cache[ selector ], 1 ] )

                    this.updateCache()
                }

                return this
            },

            get: function ( selector, fn )
            {
                var trigger = null

                if ( this.cache.hasOwnProperty( selector ) && this[ this.cache[ selector ] ] )
                {
                    trigger = this[ this.cache[ selector ] ]
                }

                if ( fn )
                {
                    fn( trigger )
                }

                return trigger
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

                return this
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

                return this
            }
        }

        window.scout = new Scout()
    }
)( window );