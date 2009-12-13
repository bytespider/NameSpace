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
 * @constructor
 */
NS.MessageBus = function NS_MessageBus() {
    var _messageBus = {};
    
    /**
     * Adds a component to the messaging system
     * 
     * @param {Object} subscriber
     * @param {String} topic
     * @param {Object} scope
     * @param {Function} callback
     * @param {Array} args
     */
    this.subscribe = function NS_MessageBus_subscribe(subscriber, topic, scope, callback, args) {
        if (!defined(_messageBus[topic])) {
            _messageBus[topic] = {};
        }
        _messageBus[topic][subscriber] = {
            'callback': callback || function(){},
            'scope': scope || subscriber || this,
            'arguments': args || {}
        };
    };
    
    this.publish = function NS_MessageBus_publish(topic, data) {
        if (!defined(_messageBus[topic])) {
            return false;
        }
        for (var i in _messageBus[topic]) {
            var subscriber = _messageBus[topic][i];
            
            subscriber.arguments.data = data;
            return subscriber.callback.call(subscriber.scope, subscriber.arguments);
        }
    };
};

// Singleton
NS.MessageBus.getInstance = new (function () {
    var instance = new NS.MessageBus();
    return function() {return instance};
});
