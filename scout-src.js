/** @preserve  scout v0.0.5
 *  copyright 2014 - kevin von flotow
 *  MIT license
 */
;( function ( window )
    {
        if ( !window )
        {
            // window is not set - trying to run in nodejs or something? hmmm
            return console.log( 'scout: fatal! window object was not found' )
        }

        var doc = window.document
        
        if ( !doc.querySelectorAll )
        {
            // querySelectorAll is required for scout to function
            console.log( 'scout: window.querySelectorAll was not found, could cause issues depending on usage' )
        }

        // add other compatible libraries as needed
        var jq = window.jQuery || window.jqMobi || window.Zepto || window.af

        var QUERIES = {
                id:
                {
                    regex: /^#[-A-Za-z0-9_][-A-Za-z0-9_:.]*$/,

                    fn: function ( selector )
                    {
                        var result = doc.getElementById( selector.substr( 1 ) )

                        return result ? [ result ] : []
                    }
                },

                cls:
                {
                    regex: /^\.[-A-Za-z0-9_:.]*$/,

                    fn: function ( selector )
                    {
                        return doc.getElementsByClassName( selector.substr( 1 ) )
                    }
                },

                tag:
                {
                    regex: /^[A-Za-z][-A-Za-z0-9_:.]*$/,

                    fn: doc.getElementsByTagName.bind( doc )
                },

                qsa:
                {
                    regex: null,

                    fn: doc.querySelectorAll.bind( doc )
                }
            },

            // use anonymous function to determine how to test element styles
            IS_HIDDEN = ( function ()
            {
                // use jquery if it's available
                /* if ( jq )
                {
                    return function ( elem )
                    {
                        // why is this backwards
                        return $( elem ).is( ':visible' )
                    }
                } */

                // use native javascript
                if ( window.getComputedStyle )
                {
                    // window.getComputedStyle is available
                    return function ( elem )
                    {
                        var styles = window.getComputedStyle( elem, null ),

                            ret = true

                        while ( ret === true && ( !styles || styles.display !== 'none' ) )
                        {
                            if ( elem && elem.parentNode )
                            {
                                elem = elem.parentNode

                                // firefox will throw an error on the top level element,
                                // so check that parentNode exists
                                if ( elem.parentNode )
                                {
                                    styles = window.getComputedStyle( elem, null )
                                }
                                else
                                {
                                    styles = null
                                }
                            }
                            else
                            {
                                ret = false
                            }
                        }

                        return ret
                    }
                }
                
                // window.getComputedStyle is not available
                console.log( 'scout: window.getComputedStyle is not available, could cause issues depending on usage' )
                    
                // assume the element is visible
                // definitely unwanted but i'm not aware of a simple workaround
                return function ()
                {
                    return false
                }
            }
        )()

        function SET_QUERY()
        {
            // is jquery or similar available?
            if ( jq )
            {
                // return jquery object as selector function
                return jq
            }

            // jquery not available, use native javascript
            for ( var key in QUERIES )
            {
                var c = QUERIES[ key ]

                if ( !c.regex || !c.regex.test( this.selector ) )
                {
                    // no match found, carry on to next regex
                    continue
                }

                // match, return it
                return c.fn
            }

            // no match yet, so return querySelectorAll
            return QUERIES.qsa.fn
        }

        /** @constructor */
        function ScoutTrigger( selector, fn )
        {
            this.selector = selector

            // set the query once instead of checking every time
            this.queryFn = SET_QUERY.call( this )

            this.fn = fn
        }

        // check this trigger
        ScoutTrigger.prototype.check = function ()
        {
            if ( !this.queryFn )
            {
                return
            }

            // call the query selector
            var elems = this.queryFn( this.selector )

            // look for elements
            for ( var i = 0, l = elems.length; i < l; ++i )
            {
                if ( IS_HIDDEN( elems[ i ] ) )
                {
                    continue
                }

                this.fn( elems[ i ], i )
            }
        }

        /** @constructor */
        function ScoutCache( scoutTrigger )
        {
            this.creator = scoutTrigger

            this.data = {}
        }

        ScoutCache.prototype.update = function ()
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
        }

        ScoutCache.prototype.add = function ( selector, index )
        {
            this.data[ selector ] = index
        }

        ScoutCache.prototype.has = function ( selector )
        {
            return typeof selector !== 'undefined' && this.data.hasOwnProperty( selector )
        }

        // like indexOf, returns index or -1
        ScoutCache.prototype.get = function ( selector )
        {
            return this.has( selector ) ? this.data[ selector ] : -1
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

        Scout.prototype.each = function ( fn )
        {
            for ( var i = 0, l = this.length; i < l; ++i )
            {
                fn( this[ i ], i )
            }

            return this
        }

        Scout.prototype.on = function ( selector, fn )
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
        }

        Scout.prototype.once = function ( selector, fn )
        {
            var that = this

            that.on( selector, function ( element, index )
                {
                    that.off( selector )

                    fn( element, index )
                }
            )

            return this
        }

        Scout.prototype.off = function ( selector )
        {
            var cached = this.cache.get( selector )

            if ( cached > -1 )
            {
                // hopefully this works without issues
                Array.prototype.splice.apply( this, [ cached, 1 ] )

                this.cache.update()
            }

            return this
        }

        Scout.prototype.get = function ( selector, fn )
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
        }

        Scout.prototype.check = function ( selector )
        {
            if ( typeof selector === 'undefined' )
            {
                // check all triggers
                this.each( function ( trigger )
                    {
                        trigger.check()
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

        window.scout = new Scout()
    }
)( this.window );
