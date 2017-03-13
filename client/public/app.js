(function(){
    
    angular.module('CertMgt', ['datatables'])
    .controller('CertMgtController', CertMgtController)
    .service('CertMgtService', CertMgtService);
    
    CertMgtController.$inject = ['CertMgtService'];
    
    function CertMgtController(CertMgtService){
        var certCtrl = this;
        certCtrl.certs=[];
        certCtrl.selectedEnv="";
        certCtrl.envList = ["US-Dev1", "US-Dev2", "SA-Dev", "Sandbox-02", "EU-Dev"]
        certCtrl.update = function(){
          
        }
        
     
     CertMgtService.getCerts()
            .then(function(response){
                //certCtrl.certs = JSON.parse(JSON.parse(response.data));
                certCtrl.certs=response.data;
               
            })
            .catch(function(error){
                console.log("Could not get the certs");
            });
            
     
       certCtrl.download = function(name){
           
       CertMgtService.download(name)
        .then(function(response){
                var headers = response.headers();
                var contentType = headers['content-type'];
         
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([response.data], { type: contentType });
                    var url = window.URL.createObjectURL(blob);
         
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", name);
         
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                    console.log(ex);
                }
            
            //     console.log(data);
            // })
    
            console.log(response)
            
        })
        .catch(function(error){
            console.log("Error is ", error)
        })
    
       }
};
    
    
    CertMgtService.$inject =['$http'];
    function CertMgtService($http) {
        var certService = this;
        
        certService.getCerts = function(){
       var response  = $http({
                method : "GET",
                url :"/certs"
                
            });
        return response;    
            
        }
        certService.download = function(name){
             var response = $http({
                    method: 'GET',
                    url: '/download',
                    params: { name: name },
                    responseType: 'arraybuffer'
                    });
            return response;        
};
        
    }
    })();
