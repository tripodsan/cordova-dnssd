/*
 * Bonjour DNS-SD plugin for Cordova.
 * Allows browsing and resolving of local ad-hoc services
 *
 * jarnoh@komplex.org - March 2012
 *
 */

function DNSSD()
{
}

DNSSD.prototype.browse=function(regType, domain, serviceFound, serviceLost) { 
    console.log("browse "+regType);

    function success(result)
    {
        if(result.serviceFound)
            serviceFound(result.serviceName, result.regType, result.domain, result.moreComing);
        if(result.serviceLost)
            serviceLost(result.serviceName, result.regType, result.domain, result.moreComing);
    }
    
	return cordova.exec(success, function(){}, "fi.peekpoke.cordova.dnssd", "browse", [regType, domain]);
}

DNSSD.prototype.resolve = function (serviceName, regType, domain, serviceResolved) {
    // check for alternate signature: "object, fn"
    var success;
    if (serviceName === Object(serviceName) && (typeof(regType) == 'function')) {
        var svc = serviceName;
        success = regType;
        serviceName = svc.serviceName;
        regType = svc.regType;
        domain = svc.domain;
    } else {
        success = function (result) {
            if (result.serviceResolved) {
                serviceResolved(result.hostName, result.port, result.serviceName, result.regType, result.domain);
            }
        }
    }

    console.log("resolve " + serviceName);
    return cordova.exec(success, function () {}, "fi.peekpoke.cordova.dnssd", "resolve", [serviceName, regType, domain]);
};

cordova.addConstructor(function() {
	console.log('initializing window.plugins.dnssd'); 
	if(!window.plugins)	{
		window.plugins = {};
	}
	window.plugins.dnssd = new DNSSD();
});

/*

API for callbacks:
                  
function serviceResolved(hostName, port, serviceName, regType, domain)
function serviceFound(serviceName, regType, domain, moreComing) 
function serviceLost(serviceName, regType, domain, moreComing) 

*/
