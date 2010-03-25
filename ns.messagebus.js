/** 
* @projectDescription   A set of reuseable cross-platform components
*
* @author               Rob Griffiths <rob@bytespider.eu>
* @version              0.3
*/

(function (W){
    var NS = W.NS = (typeof W.NS != 'undefined') ? W.NS : {};
    
    /* Private variables */
    var message_bus;
    
    /**
     * @constructor
     */
    NS.MessageBus = function () {
        message_bus = {};
    };
    
    NS.MessageBus.prototype = {
        /**
         * Adds a component to the messaging system
         * 
         * @param {Object} subscriber
         * @param {String} topic
         * @param {Object} scope
         * @param {Function} callback
         * @param {Array} args
         */
        subscribe: function (subscriber, topic, scope, callback, args) {
            if (typeof message_bus[topic] != 'undefined') {
                message_bus[topic] = {};
            }
            message_bus[topic][subscriber] = {
                'callback': callback || function(){},
                'scope': scope || subscriber || this,
                'arguments': args || {}
            };
        },
        
        publish: function (topic, data) {
            if (typeof message_bus[topic] != 'undefined') {
                return false;
            }
            for (var i in message_bus[topic]) {
                var subscriber = message_bus[topic][i];
                
                subscriber.arguments.data = data;
                return subscriber.callback.call(subscriber.scope, subscriber.arguments);
            }
        }
    };
    
    // Singleton
    NS.MessageBus.getInstance = new (function () {
        var instance = new NS.MessageBus();
        return function() {
            return instance;
        };
    });
    
})(window);