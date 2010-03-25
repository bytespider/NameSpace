/** 
 * @projectDescription   A set of reuseable cross-platform components
 *
 * @author               Rob Griffiths <rob@bytespider.eu>
 * @version              0.3
 */

(function (W){
    var NS = W.NS = (typeof W.NS != 'undefined') ? W.NS : {};
    
    /* Private variables */
    var xml;
    
    /**
     * XML to JSON parser
     * @param {Object} config
     */
    NS.XMLParser = function (config) {
        xml = config.xml;
        if (typeof xml == "string") {
            if (typeof W.DOMParser != 'undefined') {
                xml = (new DOMParser()).parseFromString(xml, 'text/xml');
            } else {
                try {
                    xml = (new ActiveXObject("Microsoft.XMLDOM")).loadXML(xml);
                } catch (e) {
                    throw this + ' No compatable XML DOM parser found';
                }
            }
        }
    };
    
    NS.XMLParser.prototype = {
        toXMLString: function () {
            return ''; /* @todo: impliment xml string output */
        },
        toJSONString: function () {
            return nodesToJSONOnject(xml.childNodes);
        }
    };
    
    /* Private methods */
    function nodesToJSONOnject(nodes, parent) {
        for (var n = 0; n < nodes.length; n++) {
            if (nodes[n].nodeType == 7) {
                continue;
            }

            var tmp = {};
            var nodeName = nodes[n].nodeName;
            
            if (nodes[n].nodeType == 3 || nodes[n].nodeType == 4) {              
                tmp.text = "";
                if (nodes[n].childNodes.length > 0) {
                    for (var i = 0; i < nodes[n].childNodes.length; i++) {
                        tmp.text += nodes[n].childNodes[i].nodeValue;
                    }
                } else {
                    tmp.text = nodes[n].nodeValue;
                }
                tmp.attributes = attributesToJSONObject(nodes[n].attributes);
                return tmp;
            } else {
                tmp = nodesToJSONOnject(nodes[n].childNodes, {});
                tmp.attributes = attributesToJSONObject(nodes[n].attributes);
            }
            
            if (!(nodeName in parent)) {
                parent[nodeName] = tmp;
            } else {
                if (!(parent[nodeName] instanceof Array)) {
                    parent[nodeName] = [parent[nodeName]];            
                }
                parent[nodeName].push(tmp);
            }
        }

        return parent;
    }
    
    function attributesToJSONObject(attributes) {
        if (!attributes) {return {};}

        var attribs = {};
        for (var i = 0; i < attributes.length; i++) {
            attribs[attributes[i].nodeName] = attributes[i].nodeValue;
        }
        return attribs;
    }
    
})(window);