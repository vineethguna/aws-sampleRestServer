/**
 * Created with JetBrains WebStorm.
 * User: vineeth
 * Date: 9/23/13
 * Time: 12:18 AM
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

exports.createComplaint = function(req, res){
    if(req.method == 'POST' && req.session.username!=null){
        if(req.session.ismanager){
            pool.getConnection(function(err, connection){
               if(!err){
                   var customerName = connection.escape(req.body.customername);
                   var modelNumber = connection.escape(req.body.modelnumber);
                   var mobileNo = connection.escape(req.body.mobileno);
                   var address = connection.escape(req.body.address);
                   var compCat  = connection.escape(req.body.complaintcategory);
                   var compDesc = connection.escape(req.body.complaintdescription);
                   var time = connection.escape(req.body.time);
                   var fieldStaffID = connection.escape(req.body.fieldstaff);
                   var randomstring = require('randomstring');
                   var complaintID = connection.escape("PIT" + randomstring.generate(8));
                   var presentDate =  connection.escape(new Date());
                   var query = "INSERT INTO testdb.complaints(complaintid, customername, modelnumber, mobileno, address, complaintcategory," +
                               "complaintdescription, time, creationdate, fieldstaff)VALUES(" + complaintID + ',' + customerName +
                               "," + modelNumber + "," + mobileNo + "," + address + "," + compCat + "," + compDesc +
                               "," + time + ',' + presentDate + "," + fieldStaffID + ");";
                   connection.query(query, function(err, result){
                        if(!err){
                            res.json({"Success": "Complaint Created Successfully"});
                        }
                       else{
                            res.json({"Error": "Error executing query"});
                        }
                   })
               }
               else{
                   res.json({"Error": "Error Connecting to Database"});
               }
            });
        }
        else{
            res.json({"Error": "You have no privileages to create complaint"})
        }
    }
    else{
        res.json({"Error": "Not authorized"});
    }
}

exports.getAllComplaints = function(req, res){
    console.log(req.session);
    if(req.session.username!=null){
        pool.getConnection(function(err, connection){
           if(!err){
                var query = 'SELECT * FROM testdb.complaints;';
                connection.query(query, function(err, result){
                   if(!err){
                        var output = {"tuples": []}
                        for(var i=0; i < result.length; i++){
                            output['tuples'][i] = result[i];
                        }
                        res.json(output);
                   }
                   else{
                        res.json({"Error": "Error in executing query"});
                   }
                   connection.release();
                })
           }
           else{
                res.json({"Error": "Error Connecting to Database"});
           }
        });
    }
    else{
        res.json({"Error": "Not Authorized to access"});
    }
}

exports.getComplaintByComplaintId = function(req, res){
    if(req.method == 'POST' && req.session.username!=null){
        if(req.body.complaintID != null){
            pool.getConnection(function(err, connection){
               if(!err){
                   var complaintID = req.body.complaintID;
                   var query = 'SELECT * FROM testdb.complaints WHERE complaintid=' + connection.escape(complaintID) + ';';
                   connection.query(query, function(err, result){
                       if(!err){
                           console.log(result);
                           if(result.length > 0){
                               res.json({"tuple": result[0]});
                           }
                           else{
                               res.json({"tuple": "There are no rows with given id"});
                           }
                       }
                       else{
                           res.json({"Error": "Error in executing query"});
                       }
                       connection.release();
                   })
               }
               else{
                   res.json({"Error": "Error Connecting to Database"});
               }
            });
        }
        else{
            res.json({"Error": "Invalid Parameters"});
        }
    }
    else{
        res.json({"Error": "Not authorized"});
    }

}

exports.getComplaintsByFieldStaffID = function(req, res){
    if(req.method == 'POST' && req.session.username!=null){
        if(req.session.ismanager || req.body.fieldstaffID == req.session.userid){
            pool.getConnection(function(err, connection){
                if(!err){
                    var fieldstaffID = req.body.fieldstaffID;
                    var query = 'SELECT * FROM testdb.complaints WHERE fieldstaff=' + connection.escape(fieldstaffID) + ';';
                    connection.query(query, function(err, result){
                        if(!err){
                            var output = {"tuples": []}
                            for(var i=0; i < result.length; i++){
                                output['tuples'][i] = result[i];
                            }
                            res.json(output);
                        }
                        else{
                            res.json({"Error": "Error in executing query"});
                        }
                        connection.release();
                    })
                }
                else{
                    res.json({"Error": "Error Connecting to Database"});
                }
            });
        }
        else{
            res.json({"Error": "Invalid Parameters or authentication failed"});
        }
    }
    else{
        res.json({"Error": "Not authorized"});
    }
}

exports.deleteComplaint = function(req, res){
    if(req.method == 'POST' && req.session.username!=null){
        var username = req.session.username;
        if(req.session.ismanager){
            pool.getConnection(function(err, connection){
                if(!err){
                    var complaintID = req.body.complaintID;
                    var query = 'DELETE FROM testdb.complaints WHERE complaintid=' + connection.escape(complaintID) + ';';
                    connection.query(query, function(err, result){
                        if(!err){
                            res.json({"Success": "Complaint Deleted Successfully"});
                        }
                        else{
                            res.json({"Error": "Error in executing query"});
                        }
                        connection.release();
                    })
                }
                else{
                    res.json({"Error": "Error Connecting to Database"});
                }
            });
        }
        else{
            res.json({"Error": "You have no privileages to delete the complaint"})
        }
    }
    else{
        res.json({"Error": "Not authorized"});
    }
}

exports.updateComplaintDetails = function(req, res){
    if(req.method == 'POST' && req.session.username!=null){
        if(req.session.ismanager){
            pool.getConnection(function(err, connection){
                if(!err){
                    var complaintID = req.body.complaintID;
                    delete req.body['complaintID'];
                    var query = 'UPDATE testdb.complaints SET ? WHERE complaintid=' + connection.escape(complaintID) + ';';
                    var parameters = req.body;
                    var a = connection.query(query, parameters,function(err, result){
                        if(!err){
                            res.json({"Success": "Complaint Updated Successfully"});
                        }
                        else{
                            res.json({"Error": "Error in executing query"});
                        }
                        connection.release();
                    });
                }
                else{
                    res.json({"Error": "Error Connecting to Database"});
                }
            });
        }
        else{
            res.json({"Error": "You have no privileages to update the complaint"})
        }
    }
    else{
        res.json({"Error": "Not authorized"});
    }
}
