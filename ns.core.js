/** 
* @projectDescription   A set of reuseable cross-platform components
*
* @author               Rob Griffiths <rob@bytespider.eu>
* @version              0.1 
*/

(function(window) {
    
    /**
     * @namespace
     */
    var NS = {};
    
    NS.Core = {};
    /**
     * 
     * @param {Mixed} value
     * @return Boolean
     */
    NS.Core.defined = function NS_Core_defined(variable) {
        return variable !== undefined;
    };
    
    if (!window.defined) {
        window['defined'] = NS.Core.defined;
    }
    
    NS.TYPEOF = {};
    NS.TYPEOF.UNDEFINED                     = 'undefined';
    NS.TYPEOF.STRING                        = 'string';
    NS.TYPEOF.ARRAY                         = 'array';
    NS.TYPEOF.OBJECT                        = 'object';
    
    /** @see ns.messagebus.js */
    //file:ns.messagebus.js
    
    /** @see ns.xmlhttprequest.js */
    //file:ns.xmlhttprequest.js

})(window);
