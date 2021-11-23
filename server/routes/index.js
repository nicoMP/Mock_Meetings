const express = require('express');
const path = require('path')
const db = require('../db');
const router = express.Router();
router.use(express.urlencoded({
    extended: true
}));
router.get('/',(req, res, next)=>{
   res.sendFile(path.join(__dirname, '../../public/loginpage.html'), function (err) {
    if (err) {
        next(err);
    } else {
        console.log('Sent: ./static/loginpage.html');
    }
});
});
router.post('/admin-log-in', async function(req,res, next){
    if(req.body.uname == 'admin'&& req.body.pswrd == 'password'){
        try {
            let results = await db.updateAvailability(req.body);
            res.send(adminPage(results)+ previousSubs(await db.getGuest()));
        } catch(e){
            console.log(e)
            res.sendStatus(500);
        }
    }
    else{
        res.sendFile(path.join(__dirname, '../../public/loginpagewronglogin.html'), function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent: ./static/loginpagewronglogin.html');
            }
        });
    }
});
router.post('/updateAvailability', async function(req,res, next){
    try {
        let results = await db.updateAvailability(req.body);
        res.send(adminPage(results)+ previousSubs(await db.getGuest()));
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});
router.get('/getTimeSlots',async function(req,res,next){
    console.log(await db.getGuest());
    try {
        let results = await db.updateAvailability();
        res.send(guestPage(results)+ previousSubs(await db.getGuest()));
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});
router.post('/selectTime',async function(req,res,next){
    try {
        let results = await db.updateAvailability(req.body);
        await db.updateGuest(req.body);
        console.log(await db.getGuest());
        res.send(guestPage(results) + previousSubs(await db.getGuest()));
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
})
 function adminPage (options){
    x = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compstible" content="IE=edge"><meta name="viewport" content="width = device-width, initialscale = 1.1"><link rel="stylesheet" href="./css/styles.css"><link rel="shortcut icon" type="image/png" href="./images/icon.png"></head><title>Admin Home Page</title><header class = "mainTitle">Set Schedule</header><form action = "/updateAvailability" method="post"><table><tbody><tr><th>Time</th>';
    options.forEach(element => {
        x += '<th>'+ element.slot+'</th>';
    });
    x += '</tr><tr><td>Start Time</td>'
    options.forEach(element =>{
        x += '<td><input type = "text" class = "time" name = "startTime'+element.slot +'" placeholder ="hh:mm"></td>';
    });
    x += '</tr>';
    x += '</tr><tr><td>End Time</td>'
    options.forEach(element =>{
        x += '<td><input type = "text" class = "time" name = "endTime'+element.slot +'" placeholder ="hh:mm"></td>';
    });
    x += '</tr>';
    return x += '</tbody></table><input type = "submit" id = "timeUpdate" value = "Submit Availability"></form>';
}
function guestPage (options){
    x = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compstible" content="IE=edge"><meta name="viewport" content="width = device-width, initialscale = 1.1"><link rel="stylesheet" href="./css/styles.css"><link rel="shortcut icon" type="image/png" href="./images/icon.png"></head><title>Guest Home Page</title><header class = "mainTitle">Choose A time</header><form action = "/selectTime" method="post"><table><tbody><tr><th><input type = "text" placeholder = "Input Name" name ="gName" class = "time"></th>';
    options.forEach(element => {
        x += '<th><input type = "checkbox" name = "slot'+ element.slot +'">' + element.startT.slice(0,-3) + ' - '+element.endT.slice(0,-3)+'</div></th>';
    });
    return x+= '</tbody></table><input type = "submit" id = "timeUpdate" value = "Submit Availability"></form>';
}
function previousSubs(options){
    var x
    if(Array.length != 0)
    {   x = '<header class = "mainTitle">Choosen Times</header><table><tbody><tr><th>Name</th><th>Slot 1</th><th>Slot 2</th><th>Slot 3</th><th>Slot 4</th><th>Slot 5</th><th>Slot 6</th><th>Slot 7</th><th>Slot 8</th><th>Slot 9</th><th>Slot 10</th></tr>'; 
        options.forEach(element=>{
            x += '<tr>';
            var name = true;
            for(keys in element){
                if(name == true){x += '<td>'+ element[keys] +'</td>'; name =false;}
                else x += '<td>'+ (element[keys]== 1 ? 'Available': 'Unavailable') +'</td>';
            }
            x += '</tr>';
        });
        x += '</tbody></table>';
    }
    return x += '</html>';
}
module.exports = router;