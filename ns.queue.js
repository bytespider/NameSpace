/**
 * @projectDescription A set of reuseable cross-platform components
 *
 * @author               Rob Griffiths <rob@bytespider.eu>
 * @version              0.3
 */

(function (W){
    var NS = W.NS = (typeof W.NS != 'undefined') ? W.NS : {};
    
    /* Private variables */
    var queue, max_length, current;
    
    /**
     * Standard FIFO Queue implimentation
     * @param {Number} max_length
     */
   	NS.Queue = function (max_length) {
    	queue = [];
    	max_length = max_length || 4294967295;
    	current = null;
    };
    
    NS.Queue.prototype = {
    	length: 0,
    	isEmpty: function () {
    		return queue.length > 0 ? true : false;
    	},
    	isFull: function () {
    		return queue.length == max_length ? true : false;
    	},
    	put: function (item) {
    		if (!this.isFull()) {
    			queue.push(item);
    		}
    		this.length = queue.length;
    	},
    	get: function () {
    		if (!this.isEmpty()) {
    			current = queue[0];
    		}
    		
    		return current;
    	},
    	taskDone: function(){
            current = null;
            queue.shift();
            this.length = queue.length;
        },
        toString: function () {
            return '[NS.Queue]';
        }
    };
    
})(window);