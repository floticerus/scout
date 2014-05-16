/** @preserve  scout v0.0.2
 *  copyright 2014 - kevin von flotow
 *  MIT license
 */
;( function ( window )
    {
        if ( !window )
        {
            // window is not set - trying to run in nodejs or something? hmmm
            return console.error( 'scout: window object was not found' )
        }
        
        if ( !window.document.querySelectorAll )
        {
            // querySelectorAll is required for scout to function
            return console.error( 'scout: window.querySelectorAll was not found' )
        }

        // use anonymous function to determine how to test element styles
        var IS_HIDDEN = ( function ()
            {
                if ( window.getComputedStyle )
                {
                    // window.getComputedStyle is available
                    return function ( elem )
                    {
                        return window.getComputedStyle( elem, null ).display === 'none'
                    }
                }
                else
                {
                    // window.getComputedStyle is not available
                    console.log( 'scout: window.getComputedStyle is not available, could cause issues depending on usage' )
                    
                    // assume the element is visible
                    // definitely unwanted but i'm not aware of a simple workaround
                    return function ()
                    {
                        return false
                    }
                }
            }
        )()

        /** @constructor */
        function ScoutTrigger( selector, fn )
        {
            this.selector = selector

            this.fn = fn
        }

        ScoutTrigger.prototype = {
            // check this trigger
            check: function ()
            {
                var elems = window.document.querySelectorAll( this.selector )

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
        function ScoutCache( scoutTrigger )
        {
            this.creator = scoutTrigger

            this.data = {}
        }

        ScoutCache.prototype = {
            update: function ()
            {
                // reset the cache
                this.data = {}

                var that = this

                // build a new cache
                that.creator.each( function ( trigger, index )
                    {
                        that.data[ trigger.selector ] = index
                    }
                )

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
            each: function ( fn )
            {
                for ( var i = 0, l = this.length; i < l; ++i )
                {
                    fn( this[ i ], i )
                }

                return this
            },

            on: function ( selector, fn )
            {
                var trigger = new ScoutTrigger( selector, fn ),
                    
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

            check: function ( selector )
            {
                if ( typeof selector === 'undefined' )
                {
                    // check all triggers
                    this.each( function ( trigger, index )
                        {
                            var elems = window.document.querySelectorAll( trigger.selector )

                            for ( var i = 0, l = elems.length; i < l; ++i )
                            {
                                if ( IS_HIDDEN( elems[ i ] ) )
                                {
                                    continue
                                }

                                trigger.fn( elems[ i ], i )
                            }
                        }
                    )
                }
                else
                {
                    // check specific trigger
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

                return this
            }
        }

        window.scout = new Scout()
    }
)( this.window );
