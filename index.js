var fs = require("fs")
var express = require("express")
var path = require("path")
var app = express();

var sys = require('sys');
var exec = require('child_process').exec;


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
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
    exec(__dirname +"/download.sh" +req.query.name, function(error, stdout, stderr){
            sys.print(stdout);
            sys.print(stderr)
            if(error != null){
                console.log(error);
            }
        })
    var file = fs.readFileSync('/home/dc-user/Develop/Cert-Management-old/cert-files/'+req.query.name, 'binary');
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
        }
        else {
            name ="Axon-Broker"
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
    }else {
        env ="US-Dev1"
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

app.post('/certs/create', function(req, res){
    
    var temp = JSON.parse(Object.keys(req.body)[0]);
    
    var cn = temp.cn
    var ou = temp.ou
    var state = temp.state
    var org = temp.org
    var city = temp.city
    var country = temp.country
    exec(__dirname +"/create.sh "+ cn + " " + ou + " " + org + " " + state + " " + org + " " + city + " " + country, function(error, stdout, stderr){
        sys.print(stdout);
        sys.print(stderr)
        if(error != null){
            console.log(error)
        }
        res.writeHead(200)
        res.write(stdout)
        res.end()
    })
})


app.listen(process.env.PORT || 8080)



