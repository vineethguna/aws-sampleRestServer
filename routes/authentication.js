/**
 * Created with JetBrains WebStorm.
 * User: vineeth
 * Date: 9/23/13
 * Time: 12:05 AM
 * To change this template use File | Settings | File Templates.
 */

var mysql = require('mysql');
var constants = require('./constants');

var pool = mysql.createPool({
    host : constants.DBHOST,
    password : constants.DBPASSWORD,
    user : constants.DBUSERNAME,
    port : constants.DBPORT
});

exports.authenticate = function(req, res){
    if(req.method == 'POST'){
        var username = req.body.username;
        var password = req.body.password;
        console.log(req.body['ismanager']);
        if(req.body['ismanager'] == 'true'){
            login(req, res, username, password,"manager");
        }
        else{
            login(req, res, username, password, "fieldstaff");
        }
    }
    else{
        res.json({"Error": "Error in Authentication"});
    }
}

exports.logout = function(req, res){
    if(req.method == 'GET'){
        req.session = null;
        res.json({"Success": "Logged out Successfully!!!"});
    }
    else{
        res.json({"Error": "Only POST method Supported. Given " + req.method + " method."});
    }
}

function login(req, res, username, password, type){
    if(req.session.username==null && req.session.password==null){
        if(username!=null && password!=null){
            pool.getConnection(function(err, connection){
                if(!err){
                    var tablename;
                    if(type == 'manager'){
                         tablename = 'testdb.managerdetails';
                         req.session['ismanager'] = true;
                    }
                    else if(type == 'fieldstaff'){
                        tablename = 'testdb.fieldstaffdetails';
                        req.session['ismanager'] = false;
                    }
                    var query = "SELECT * FROM " + tablename + " WHERE username=" + connection.escape(username) + " AND " +
                        "password=" + connection.escape(password);
                    connection.query(query, function(err, rows){
                        if(!err && rows.length > 0){
                            req.session['username'] = username;
                            req.session['userid'] = rows[0].id;
                            console.log(rows);
                            res.json({"Success": "Login Successful"});
                        }
                        else{
                            console.log(err);
                            req.session = null;
                            res.json({"Error": "Authentication Failed"});
                        }
                        connection.release();
                    });
                }
                else{
                    console.log(err);
                    res.json({"Error": "Error Connecting to Database"});
                }

            });
        }
        else{
            res.json({"Error": "Entered Invalid Details"});
        }
    }
    else{
        res.json({"Error": "Already Logged In"});
    }

}

exports.createManager = function(req, res){
     if(req.method == 'POST' && req.body.username!=null && req.body.password!=null){
         var username = req.body.username;
         var password = req.body.password;
         pool.getConnection(function(err, connection){
             if(!err){
                 var query = 'INSERT INTO testdb.managerdetails (username, password, isManager) VALUES (' + connection.escape(username) +
                     ',' + connection.escape(password) + ',true);';
                 connection.query(query,[username, password], function(err, result){
                     if(!err){
                         console.log(result);
                         res.json({"Success": "Manager Created."});
                     }
                     else{
                         if(err.code == 'ER_DUP_ENTRY'){
                             res.json({"Error": "Username already Exists"});
                         }
                         else{
                             res.json({"Error": "Error Creating Manager"});
                         }
                     }
                     connection.release();
                 });
             }
             else{
                 res.json({"Error": "Error Connecting to database"});
             }
         });

     }
     else{
         res.json({"Error": "Parameters Unknown"});
     }
}

exports.createFieldStaffUser = function(req, res){
    if(req.method == 'POST' && req.body.username!=null && req.body.password!=null){
        var username = req.body.username;
        var password = req.body.password;
        pool.getConnection(function(err, connection){
            if(!err){
                var query = 'INSERT INTO testdb.fieldstaffdetails (username, password, isManager) VALUES (' + connection.escape(username) +
                    ',' + connection.escape(password) + ',false);';
                connection.query(query,[username, password],function(err, result){
                    if(!err){
                        res.json({"Success": "Field Staff User Created"});
                    }
                    else{
                        console.log(err);
                        if(err.code == 'ER_DUP_ENTRY'){
                            res.json({"Error": "Username already Exists"});
                        }
                        else{
                            res.json({"Error": "Error Creating field staff user"});
                        }
                    }
                    connection.release();
                })
            }
            else{
                res.json({"Error": "Error Connecting to database"});
            }

        });
    }
    else{
        res.json({"Error": "Parameters unknown"});
    }
}
