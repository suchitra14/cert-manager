(function(){
    
    
    /*global angular*/
    angular.module('CertMgt', ['datatables', 'ui.router'])
    .controller('CertMgtController', CertMgtController)
    .controller('CreateCertsCtrl', CreateCertsCtrl)
    .service('CertMgtService', CertMgtService);
    
    angular.module('CertMgt')
    .config(RoutesConfig);
    
    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider']
    
    function RoutesConfig($stateProvider, $urlRouterProvider){
        
        $urlRouterProvider.otherwise('/view');
        
        $stateProvider
        .state('view', {
            url : '/view',
            templateUrl : 'viewCerts.html'
        })
        .state('create',{
           // url : '/create',
            templateUrl : 'createCerts.html'
        })
        
        
    }
    
    
    CertMgtController.$inject = ['CertMgtService'];
    
    function CertMgtController(CertMgtService){
        var certCtrl = this;
        certCtrl.certs=[];
        certCtrl.selectedEnv="";
        certCtrl.envList = ["US-Dev1", "US-Dev2", "SA-Dev", "Sandbox-02", "EU-Dev"]
        certCtrl.update = function(){
          console.log("The env is ", certCtrl.selectedEnv);
        }
        
     
     /*global $*/
   
     CertMgtService.getCerts()
            .then(function(response){
                //certCtrl.certs = JSON.parse(JSON.parse(response.data));
                $.each(response.data, function(index, item){
                    var cert =[];
                    cert.push("");
                    cert.push(item.name);
                    cert.push(item.env);
                    cert.push(item.link);
                    certCtrl.certs.push(cert);
                });
                
                 certCtrl.search = {
                            queryStr: '',
                            update: function () {
                                var table = $("#cert_table").DataTable();
                                table.search(certCtrl.search.queryStr).draw();
                            }
                        };
                
                certCtrl.dtable = $("#cert_table").dataTable({
                    columns: [
                            {'title' : "" },
                            {'title': "Certificate Name"},
                            {'title': "Certificate Environment"},
                            {'title': "Certificate DNS"}],
                    data : certCtrl.certs,
                    paging:true,
                    info: false,
                     columnDefs : [{
                          targets: 0,
                                orderable: false,
                                render: function (data, type, row, meta) {
                                   // return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                                 return '<input type="checkbox" name="id[]" value="'+row[3]+'" onclick="canDownload()">';
                                    
                                }
                          },
                          {
                              targets: 1,
                              orderable: true,
                              render: function(data, type, row, meta){
                                   return "<div class='tname'>" + data + "</div>";
                              }
                          } 
                          ],
                  'order': [[2, 'asc']]
               });
            })
            .catch(function(error){
                console.log("Could not get the certs");
            });
      
  
        $('.download').attr("disabled", true);       
        
        
       certCtrl.download = function(){
           /*global table */
            var selectedCerts = [];
            certCtrl.dtable.$('input[type="checkbox"]').each(function(){
            // If checkbox is checked
            if(this.checked){
                
                selectedCerts.push(this.value);
            }
            })     
           for(var cert of selectedCerts){
             let name = cert;
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
           }      
    }    
//};

  
     CreateCertsCtrl.$inject =['CertMgtService'];
     
     function CreateCertsCtrl(CertMgtService){
         var createCtrl = this;
         createCtrl.certificate = {
             cn : '',
             ou:'',
             org: '',
             state: '',
             city:'',
             country:''
         };
         
         createCtrl.createCerts = function(certificate){
             console.log("The certificate is ", certificate);
             CertMgtService.create(certificate)
             .then(function(response){
                 console.log("The response is ",response.data);
             })
             .catch(function(error){
                 console.log(error);
             })
         }
     }
    
    
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
 
 certService.create = function(certificate){
   
   var data = {
           cn : certificate.cn,
           ou: certificate.ou,
           org: certificate.org,
           city: certificate.city,
           state: certificate.state,
           country: certificate.country
   };
   
   var config = {
        headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
   };
  var response = $http.post('/certs/create', data, config);
  return response;
   
   
 }       
    }
    
    

    })();

     var canDownload = function(){
            if($('input[type="checkbox"]:checked').length > 0){
                $('.download').attr("disabled", false);       
            }else{
                $('.download').attr("disabled", true);       
            }
        };
       