/** 
 * @projectDescription   A set of reuseable cross-platform components
 *
 * @author               Rob Griffiths <rob@bytespider.eu>
 * @version              0.3
 */

(function (W){
    var NS = W.NS = (typeof W.NS != 'undefined') ? W.NS : {};

    /* Private variables */
    var cache, cache_id;
    
    /**
     * Simple wrapper for DOM LocalStorage
     */
    NS.Cache = function (){
        cache_id = '';
        cache = null;
        
        // check we can actually do this
        if (typeof W.localStorage == 'undefined') {
            throw this + ' No compatable storage method was found';
        }
    };
    
    NS.Cache.prototype = {
        toString: function () {
            return cache;
        },
        
        /**
         * Loads cache from storage
         * @param {String} id
         */
        load: function (id) {
            cache_id = id || cache_id || '';
            cache = W.localStorage.getItem(cache_id);
            return cache;  
        },
        
        /**
         * Saves data to cache, if  no id passed, last loaded ID will be used
         * @param {Object} data
         * @param {String} id
         */
        save: function (data) {
            cache_id = id || cache_id || '';
            if (!cache_id) {
                throw this + " Expects id to be set";
            }
            cache = data ? cache : {};
            W.localStorage.setItem(cache_id, cache);
        },
        toString: function () {
            return '[NS.Cache]';
        }
    };
})(window);