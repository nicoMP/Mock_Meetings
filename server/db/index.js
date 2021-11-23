const mysql = require('mysql');

const pool = mysql.createPool({
    host: '35.193.37.210',
    user: 'root',
    database: 'timeOptions',
    password: 'mockDoodle'
});

let availability = {};
availability.all = () => {
    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM options',( err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}
availability.one = (slot) => {
    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM options WHERE slot = ?',[slot],( err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}
availability.updateGuest =(form) =>{
    var valid;
    var guestSQL = [form.gName,false,false,false,false,false,false,false,false,false,false];
    for(key in form){
        var x = key.split('slot').splice(1,1);
        if (form[key] == 'on')guestSQL[x] = true;
    }
    if(form.gName ===''){valid = false;}
    else valid = true;
    if(valid == true){
        i = 1;  
        try{  
            pool.query('INSERT INTO guest VALUES (' +"'"+form.gName +"'"+', ' + guestSQL[i++] + ', '+ guestSQL[i++] + ', '+ guestSQL[i++] + ', '+ guestSQL[i++] + ', '+ guestSQL[i++] + ', '+ guestSQL[i++] + ', '+ guestSQL[i++] + ', '+ guestSQL[i++] + ', '+ guestSQL[i++] + ', '+ guestSQL[i++] +');',(err,results)=>{
                if(err){
                    throw(err);
                }
            });
        
        }catch(e){
            console.log(e);
        }
    }
    

    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM guest',( err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
}
availability.updateAvailability = (form) => {
    var valid;
    var times = [];

    for(const key in form){ 
        x = form[key];
        var temp = x.split(':');
        
        if(temp.length == 2 && temp[0] < 24 && temp[0] >= 0 &&temp[1] < 60 && temp[1] >= 0 && valid != false){ valid = true; times.push([temp[0],temp[1]]);}
        else valid = false;
    }
    var sqlTime = [];
   if(valid == true){
    times.forEach((element)=>{
        if(element[0].length == 0){element[0] = "00"}
        if(element[1].length == 0){element[0] = "00"}
        if(element[0].length == 1){element[0] =   '0' + element[0]}
        if(element[1].length == 1){element[1] =   '0' + element[1]}
        sqlTime.push("'" + element[0] + ':' + element[1] + ":00'");
    });

    if(valid == true){  
        try{
            
            for(var i = 0 ; i<sqlTime.length ; i++){
                pool.query('UPDATE options SET startT = ' + sqlTime[i] + ', endT = ' + sqlTime[i+1] + ' WHERE slot =' + ++i + ';',(err,results)=>{
                    if(err){
                     throw(err);
                    }
                });
            }
        }catch(e){
            console.log(e);
        }
    }
    }
    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM options',( err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });

}
availability.getGuest = () => {
    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM guest',( err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    }); 
}
module.exports = availability;