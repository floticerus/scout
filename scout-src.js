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

        // use jQuery (or a clone) if it's available
        // look for window.$ and window.$.extend since that is the universal jQuery syntax
        // and all clones should have the extend method
        // could interfere with other libraries using window.$
        var USING_JQUERY = typeof window.$ !== 'undefined' && window.$.extend,

            QUERY = USING_JQUERY ? window.$ : window.document.querySelectorAll,

            // use anonymous function to determine how to test the style
            IS_HIDDEN = ( function ()
                {
                    // check for jquery and filter method
                    if ( USING_JQUERY && QUERY( 'scout' ).filter )
                    {
                        // using jQuery, test with .filter()
                        return function ( elem )
                        {
                            return QUERY( elem ).filter( ':visible' ).length === 0
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
                        // no jQuery and window.getComputedStyle is not available
                        console.log( 'scout: unable to find compatible library (such as jQuery) or window.getComputedStyle, could cause issues depending on usage' )
                        
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
                var elems = QUERY( this.selector )

                for ( var i = 0, l = elems.length; i < l; ++i )
                {
                    if ( IS_HIDDEN( elems[ i ] ) )
                    {
                        continue
                    }

                    this.fn( elems[ i ], i )
                }
            }
        }

        /** @constructor */
        function ScoutCache( scoutObject )
        {
            this.creator = scoutObject

            this.data = {}
        }

        ScoutCache.prototype = {
            update: function ()
            {
                // reset the cache
                this.data = {}

                // build a new cache
                for ( var i = 0, l = this.creator.length; i < l; ++i )
                {
                    this.data[ this.creator[ i ].selector ] = i
                }

                return this
            },

            add: function ( selector, index )
            {
                this.data[ selector ] = index
            },

            has: function ( selector )
            {
                return typeof selector !== 'undefined' && this.data.hasOwnProperty( selector )
            },

            // returns index or -1
            get: function ( selector )
            {
                return this.has( selector ) ? this.data[ selector ] : -1
            }
        }

        /** @constructor */
        function Scout()
        {
            // build an array-like object for fast iterations
            // need to set initial length to 0
            this.length = 0

            // build a cache for searching without loops
            this.cache = new ScoutCache( this )
        }

        Scout.prototype = {
            on: function ( selector, fn )
            {
                var trigger = new Trigger( selector, fn ),
                    
                    // check for existing index
                    c = this.cache.get( selector ),

                    // if index exists, use it, otherwise generate a new one
                    i = c > -1 ? c : this.length++

                // save the trigger
                this[ i ] = trigger

                // add index to cache - no need for a full rebuild
                this.cache.add( selector, i )

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
                var cached = this.cache.get( selector )

                if ( cached > -1 )
                {
                    // hopefully this works without issues
                    Array.prototype.splice.apply( this, [ cached, 1 ] )

                    this.cache.update()
                }

                return this
            },

            get: function ( selector, fn )
            {
                var trigger = false,

                    cached = this.cache.get( selector )

                if ( cached > -1 )
                {
                    trigger = this[ cached ]
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

                        elems = QUERY( c.selector )

                    for ( var i2 = 0, l2 = elems.length; i2 < l2; ++i2 )
                    {
                        if ( IS_HIDDEN( elems[ i2 ] ) )
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
