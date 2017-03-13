var fs = require("fs")
var express = require("express")
var path = require("path")
var app = express();

var sys = require('sys');
var exec = require('child_process').exec;

var child;


app.get('/certs', function(req, res){
    exec(__dirname +"/test.sh", function(error, stdout, stderr){
    sys.print(stdout);
    sys.print(stderr)
    if(error != null){
        console.log(error);
    }
    
    // stdout will be a string separated by /n
    
    var op = stdout.replace(/\n/g,',').split(',')
    var out = op.map(function(val){
        // all the logic to form the object
         var ret = {}
         ret.name = getName(val)
         ret.env =  getEnv(val)
        ret.link = val
        return ret  
        })
    
    res.writeHead(200)
    res.write(JSON.stringify(out))
    res.end()
   })
    
})

app.get('/download', function(req, res){

  var file = fs.readFileSync(__dirname + '/certs/consumer-keystore.jks', 'binary');
 res.setHeader('Content-disposition', 'attachment; filename=consumer-keystore.jks');
 res.setHeader('Content-type', 'text');
  res.setHeader('Content-Length', file.length);
  res.write(file, 'binary');
  res.end();

    
    
    
    
    
    
});



function getName(val){
    var name = "";
      if(val.indexOf("ws")!== -1){
            name = "Axon Manager"
        }else if(val.indexOf("sr")!== -1){
            name ="Axon Schema Registry"
        }else if(val.indexOf("rt")!== -1){
            name ="Axon Broker"
        }else if(val.indexOf("axon")!== -1){
            name = "Axon CP UI"
        } else {
            name ="Axon"
        }
    return name;    
}

function getEnv(val){
    var env=""
    if(val.indexOf("sandbox")!== -1){
        env = "Sandbox-02"
    }else if(val.indexOf("axon01")!== -1){
        env = "US-Dev1"
    }else if(val.indexOf("axon02")!== -1){
        env="EU-Dev"
    }else if(val.indexOf("axon03")!== -1){
        env="SA-Dev"
    }else if(val.indexOf("axon04")!== -1){
        env="US-Dev2"
    } else {
        env ="Dev"
    }
    return env;
}
app.use(express.static(path.join(__dirname,'/client/public')));

app.get('/', function(req, res){
    // res.writeHead(200)
    // res.write("Hello Suchitre")
    // res.end()
    
    res.sendFile(__dirname + '/index.html')
})

/*app.get('/certs', function(req,res){
        
        fs.readFile(path.join(__dirname,'/client/public/sampleData.json'), 'utf8', function(err, response){
          if (err) throw err;
           
            res.writeHead(200)
            res.write(response)
            res.end() 
        })
        
        // res.writeHead(200)
        // res.write(JSON.stringify(sampleData))
        // res.end()
    
})*/

app.listen(8080)



