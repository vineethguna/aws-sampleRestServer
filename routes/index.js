
/*
 * GET home page.
 */


exports.index = function(req, res){
    var apiCalls = {'/' : {"type": 'GET', "parameters": null, "function": "Shows the list of all REST CALLS"},
                    '/api/authenticate':{"type": 'POST', "parameters": ['username', 'password', 'ismanager'], "function": "Authenticates Whether Manager or fieldstaff"},
                    '/api/createManager':{"type": 'POST', "parameters": ['username', 'password'], "function": "Creates Manager Account"},
                    '/api/createFieldStaff':{"type": 'POST', "parameters": ['username', 'password'], "function": "Creates FieldStaff Account"},
                    '/api/logout':{"type": 'GET', "parameters": null, "function": "Logs Out of your account"},
                    '/api/createComplaint':{"type": 'POST', "parameters": ['customername, modelnumber, mobileno, address, complaintcategory, complaintdescription, time, fieldstaff'], "function": "Creates a MManager"},
                    '/api/allComplaints': {"type": 'GET', "parameters": null, "function": "Retrieves All Complaints"},
                    '/api/getComplaintbyid':{"type": 'POST', "parameters": ['complaintID'], "function": "Retrieves Complaints based on complaintID"},
                    '/api/getComplaintbyfieldstaff': {"type": 'POST', "parameters": ['fieldstaffID'], "function": "Retrieves Complaints based on fieldsstaffID"},
                    '/api/deleteComplaint': {"type": 'POST', "parameters": ['complaintID'], "function": "Deletes Complaint Based on Complaint ID"},
                    '/api/updateComplaint': {"type": 'POST', "parameters": ['UPDATE fields', 'complaintID'], "function": "Update fields gicen based on complaint ID"}};
    res.json(apiCalls);
};