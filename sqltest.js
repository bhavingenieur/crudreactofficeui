const { Connection, Request } = require("tedious");
const moment = require('moment')


// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "adminx", // update me
      password: "Rhapsody1@", // update me
      rowCollectionOnRequestCompletion:true
    },
    type: "default"
  },
  server: "granturis.database.windows.net", // update me
  options: {
    database: "granturismo", //update me
    encrypt: true
  }
};

const connection = new Connection(config);
// Attempt to connect and execute queries if connection goes through
const connect = (() => {
connection.on("connect", err => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Successfully connected to Azure SQL');      
    }
  });

})

connection.on('end', ()=>{
  console.log('Connection closed');
  process.exit(0);
});

function queryrows(req) {
  console.log("Readg rows from the Table...");
  const q = req.datum;

  var myReturnObject = [];
  // Read all rows from table
  return new Promise((resolve,reject) => {
    const r3 = new Request(
      `select dt,tm from schedules where u_name='${q}'
      `,
      (err, rowCount,rows) => {
        if (err) {console.log(err.message)
        
        } else {
          //console.log(myReturnObject);
          resolve(myReturnObject);
          console.log(`${rowCount}`,'rows returned')
        }
        })

  r3.on('row', function(columns) {
    let val = {}
    columns.forEach(function(column) {
      val[column.metadata.colName] = column.value;
    });
    myReturnObject.push(val); 
  });

    connection.execSql(r3);
})}




function removeitem(req) {
  console.log("Reading rows from the Table...");
  const rer = 'schedules';
  let arg2 = moment.utc(req.payload.dt,"dddd, MMMM Do YYYY")
  arg2 = arg2.toISOString()
  console.log(arg2)
  const arg1 = req.payload.email;
  // Read all rows from table
  return new Promise((resolve,reject)=>{
    const r4 = new Request(
      `delete from schedules where u_name = '${arg1}' and dt = '${arg2}'
      `,
      (err, rowCount) => {
        if (err) {
          resolve(err.message)
        }
         else {
          resolve(`${rowCount} row(s) deleted`);
        }
      }
    );
  
    
  
    connection.execSql(r4);
    });
  
}



function postdata(req) {
    console.log("Reading rows from the Table...");
    console.log(req)
    const rer = 'schedules';
    let arg2 = moment.utc(req.payload.dt,"dddd, MMMM Do YYYY")
    arg2 = arg2.toISOString()
    let arg3 = req.payload.tm;
    
    const arg1 = req.payload.email;
    // Read all rows from table
    return new Promise((resolve,reject)=>{
      const request = new Request(
        `insert into ${rer}( u_name,dt,tm)
            values ('${arg1}','${arg2}','${arg3}')
        `,
        (err, rowCount) => {
          if (err) {
            console.log(err.message)
          }
           else {
            resolve(`${rowCount} row(s) returned`);
          }
        }
      );
    
      request.on('requestCompleted', function () { 
          
      });
    
      connection.execSql(request);
      });
    
  }

  function editdata(req) {
    console.log("Reading rows from the Table...");
    console.log(req)
    const rer = 'schedules';
    let arg2 = req.payload.dt;
    let arg3 = req.payload.tm;
    
    const arg1 = req.payload.email;
    // Read all rows from table
    return new Promise((resolve,reject)=>{
      const r5 = new Request(
        `update ${rer}
            set tm='${arg3}'
            where u_name = '${arg1}' and dt = '${arg2}'
        `,
        (err, rowCount) => {
          if (err) {
            console.log(err.message)
          }
           else {
            resolve(`${rowCount} row(s) returned`);
          }
        }
      );
    
      r5.on('requestCompleted', function () { 
          
      });
    
      connection.execSql(r5);
      });
    
  }


module.exports = {connect, postdata, editdata,removeitem, queryrows}
