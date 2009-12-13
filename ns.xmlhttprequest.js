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
 * Returns a XMLHttpRequest wrapper for the browsers native capabilities
 * 
 * @constructor
 * @classDescription    Creates a W3C compatable XMLHttpRequest
 * 
 * @param               [{Object}] config
 * 
 * @return              {NS.XMLHttpRequest}
 * @type                {Object}
 * @author              Rob Griffiths
 * @version             0.2
 */
NS.XMLHttpRequest = function NS_XMLHttpRequest(config) {
    config = config || {};
    
    // Private variables
    var self = this;
    
    var _ns = NS; /** @type {NS} */
    var _nsmb = {}
    
    try {
        var _nsmb = NS.MessageBus.getInstance(); /** @type {NS.MessageBus} */
    } catch (err) {}
    
    var _proto = NS.XMLHttpRequest; /** @type {NS.XMLHttpRequest} */
    var _xhr = _XHRFactory(); /** @type {XMLHttpRequest} */
    var _headers = {};
    
    // Public variables
    this.url = config.url || '';
    this.method = config.url || '';
    this.async = defined(config.async) ? config.async : true;
    this.user = config.user || null;
    this.password = config.password || null;
    
    this.proxy = config.proxy || '';
    this.onreadystatechange = config.onreadystatechange || null;
    
    this.status = 0;
    this.statusText = '';
    this.readyState = _proto.UNSENT;
    this.responseText = '';
    this.responseXML = '';
    
    // Public methods
    
    /**
     * 
     * @memberOf NS.XMLHttpRequest
     * 
     * @param {String} [method]
     * @param {String} [url]
     * @param {String} [async]
     * @param {String} [user]
     * @param {String} [password]
     */
    this.open = function (method, url, async, user, password) {
        this.url = url || this.url;
        this.method = method || this.method;
        this.async = defined(async) ? async : this.async;
        this.user = user || this.user;
        this.password = password || this.password;
        
        var basicAuth = this.user && this.password;
        
        if (basicAuth === true) {
            _xhr.open(this.method, this.url, this.async, this.user, this.password);
        } else {
            _xhr.open(this.method, this.url, this.async);
        }
        
        this.readyState = _xhr.readyState;
        return this; // allow chaining
    };
    
    /**
     * 
     * @param {String} header
     * @param {String} value
     * 
     * @memberOf NS.XMLHttpRequest
     */
    this.setRequestHeader = function (header, value) {
        _headers[header] = value;
        return this; // allow chaining
    };
    
    /**
     * @return {Object}
     * @type {Object}
     * 
     * @memberOf NS.XMLHttpRequest
     */
    this.getAllRequestHeaders = function () {
        return _headers;
    };
    
    /**
     * 
     * @param {Object|String} data
     * @memberOf NS.XMLHttpRequest
     */
    this.send = function (data) {
        data = data || null;
        if (this.readyState === _proto.UNSENT) {
            // We'll assume that this was a configured request
            this.open();
        }
        
        _xhr.onreadystatechange = _XHROnReadyStateChange;
        
        _headers['Via'] = this.proxy;
        for (var i in _headers) {
            _xhr.setRequestHeader(i, _headers[i]);
        }
        
        return _xhr.send(data);
    };
    
    /**
     * @memberOf NS.XMLHttpRequest
     */
    this.abort = function () {
        _xhr.abort();
        this.readyState = _proto.OPENED;
        
        try {
            _nsmb.publish(topic + '.' + _proto.ABORTED, {});
        } catch(err) {}
        
        return this; // allow chaining
    };
    
    /**
     * Simple wrapper for XMLHttpRequest's version
     * 
     * @type {Object}
     * @memberOf NS.XMLHttpRequest
     */
    this.getAllResponseHeaders = function () {
        return _xhr.getAllResponseHeaders();
    };
    
    /**
     * Simple wrapper for XMLHttpRequest's version
     * 
     * @param {String} header
     * @type {String}
     * @memberOf NS.XMLHttpRequest
     */
    this.getResponseHeader = function (header) {
        return _xhr.getResponseHeader(header);
    };
    
    this.toString = function (){
        return 'NS.XMLHttpRequest';
    };
        
    function _XHRFactory() {
        if (defined(window.XDomainRequest)) {
            // IE proprietary but it's W3C compliant
            return new window.XDomainRequest();
        } else if (defined(window.XMLHttpRequest)) {
            // W3C compliant
            return new window.XMLHttpRequest();
        } else {
            // IE
            try {
                return new ActiveXObject('MSXML2.XMLHTTP');
            } catch (err) {
                try {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                } catch (err) {
                    throw 'NS.XMLHttpRequest: No compliant XMLHttpRequest object found';
                }
            }
        }
    }
    
    function _XHROnReadyStateChange() {
        // Copy XHR stuff over to us
        self.status = this.status;
        self.statusText = this.statusText;
        self.readyState = this.readyState;
        self.responseText = this.responseText || '';
        self.responseXML = this.responseXML || '';
        
        var response = {
            'status': self.status + ' ' + self.statusText,
            'data': {
                'text': self.responseText,
                'xml': self.responseXML
            }
        };
        
        try {
            _nsmb.publish(_proto.READY_STATE_CHANGE, response);
            if (self.readyState == _proto.DONE) {
                if (_xhr.status == 0 || _xhr.status == 200 || _xhr.status == 304) {
                    _nsmb.publish(_proto.SUCCESS, response);
                } else {
                    _nsmb.publish(_proto.FAILURE, response);
                }
            }
        } catch (err){};
        
        if(self.onreadystatechange !== null){
            self.onreadystatechange();
        }
    }
    
    return this;
};

// Constants
// States
NS.XMLHttpRequest.UNSENT                = 0;
NS.XMLHttpRequest.OPENED                = 1;
NS.XMLHttpRequest.HEADERS_RECEIVED      = 2;
NS.XMLHttpRequest.LOADING               = 3;
NS.XMLHttpRequest.DONE                  = 4;

// Request methods
NS.XMLHttpRequest.GET                   = 'GET';
NS.XMLHttpRequest.POST                  = 'POST';
NS.XMLHttpRequest.PUT                   = 'PUT';
NS.XMLHttpRequest.UPDATE                = 'UPDATE';
NS.XMLHttpRequest.DELETE                = 'DELETE';
NS.XMLHttpRequest.OPTIONS               = 'OPTIONS';

// Loose coupling flags
NS.XMLHttpRequest.READY_STATE_CHANGE    = 'ready-state-change';
NS.XMLHttpRequest.SUCCESS               = 'success';
NS.XMLHttpRequest.FAILURE               = 'failure';
NS.XMLHttpRequest.ABORTED               = 'aborted';
