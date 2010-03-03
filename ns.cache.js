/** 
* @projectDescription   A set of reuseable cross-platform components
*
* @author               Rob Griffiths <rob@bytespider.eu>
* @version              0.1 
*/

var NS = NS || {};
var undefined = window.undefined;
var defined = window.defined ||
function(variable) {
    return variable !== undefined;
};

/**
 * Simple wrapper for DOM LocalStorage
 * @param {Object} config
 */
NS.Cache = function NS_Cache(config){
    var cache_id = '';
    var cache_data;
    
    /**
     * Loads cache from storage
     * @param {String} id
     */
	this.load = function (id) {
        cache_id = id || cache_id || '';
        cache_data = window.localStorage.getItem(cache_id);
        return cache_data;
    };

    /**
     * Saves data to cache, if  no id passed, last loaded ID will be used
     * @param {Object} data
     * @param {String} id
     */
    this.save = function (data, id) {
        cache_id = id || cache_id || '';
		if (!cache_id) {
			throw "[NS.Cache] expects id to be set";
		}
        cache_data = data ? cache_data : {};
        window.localStorage.setItem(cache_id, cache_data);
    };
    
    this.toString = function () {
        return cache_data;
    }
};