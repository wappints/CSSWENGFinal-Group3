
// import module `database` from `../models/db.js`
const { request } = require('express');
const db = require('../models/db.js');

// import module `System` from `../models/SystemModel.js`
const Sale = require('../models/SalesModel.js');
const Price = require('../models/PriceModel.js');
const { validationResult } = require('express-validator');
const { insertOne } = require('../models/db.js');
/*
    defines an object which contains functions executed as callback
    when a client requests for `signup` paths in the server
*/

const saleController = {

    getEntries : function (req, res) {
        //console.log("I AM HERE")
        var purpose = req.query.purpose
        var DDate = req.body.DDate
        if (DDate == null)
            DDate = req.query.DDate
        if (purpose == null)
        {
            var currentDate = new Date()
            currentDate.setHours(currentDate.getHours() + 8);
            console.log("current")
        }
        else if (purpose == "next")
        {
            var currentDate = new Date(DDate)
            currentDate.setDate(currentDate.getDate() + 1) 
            console.log(currentDate)
            console.log("next")
        }
        else if (purpose == "previous")
        {
            var currentDate = new Date(DDate)
            currentDate.setDate(currentDate.getDate() - 1) 
            console.log(currentDate)
            console.log("previous")
        }
        var typeOfAcc = req.params.ACCType
        if (typeOfAcc == null)
            typeOfAcc = req.body.ACCType
        
        
        //console.log(typeOfAcc)

        
        var formattedDate = currentDate.toISOString().split('T')[0];
        console.log(formattedDate)
        var start = formattedDate + "T00:00:00.000Z"
        var end = formattedDate + "T23:59:59.999Z"
        start = new Date(start).toISOString()
        end = new Date(end).toISOString()
        // $gte: ISODate("2021-12-19T00:00:00.000Z"),
        // $lt: ISODate("2021-12-19T23:59:59.000Z"),    
        // var test = formattedDate + "T16:00:00.000Z"
        // test = new Date(test).toISOString()
        // console.log(start)
        // console.log(end)

        //$lte:end
        db.findMany(Sale, {DDate : {$gte : start, $lte : end}}, {}, function(result){
            var obj = {}
            //console.log("part 1")
            details = []
            for (var i of result)
            {
                obj = {}
                obj["SalesID"] = i._id,
                obj["Name"] =    i.Name,
                obj["PhoneNumber"] =      i.PhoneNum,
                obj["DDate"] =      i.DDate,
                obj["ThinWash"] =      i.ThinWash,
                obj["ThinDry"] =      i.ThinDry,
                obj["ThickWash"] =      i.ThickWash,
                obj["ThickDry"] =      i.ThickDry,
                obj["Fold"] =      i.Fold,
                obj["Soap"] =      i.Soap,
                obj["Downy"] =      i.Downy,
                obj["AmountPaid"] =      i.AmountPaid,
                obj["totalPrice"] =      i.TotalPrice,
                obj["Balance"] =      i.Balance,
                obj["Token"] =     i.TokenError
                
                //console.log("part 2")
                //console.log(obj)
                details.push(obj)
                //console.log(details)
            }

            db.findOne(Price, {}, {}, function(result)
            {
                var  obj2 = {
                    TNWPrice : result.TNWPrice,
                    TNDPrice : result.TNDPrice,
                    TKWPrice : result.TKWPrice,
                    TKDPrice : result.TKDPrice,
                    FOLDPrice : result.FOLDPrice,
                    SOAPPrice : result.SOAPPrice,
                    DOWNPrice : result.DOWNPrice
                }
                // console.log(obj2)
                var renderobjects = {ACCType : typeOfAcc, DDate : formattedDate, entry : details, layout : 'mainLayout', object : obj2}
                console.log(renderobjects)
                if (purpose == null)
                    res.render('home', renderobjects)
                else
                    res.render('home', renderobjects)
            })

        })
        

        
    },
    addEntry : function (req, res) {
        var Name = req.body.ADDName;
        var Phone = req.body.ADDPhone;
        var TNW = req.body.ADDThinW;
        var TND = req.body.ADDThinD;
        var TKW = req.body.ADDThickW;
        var TKD = req.body.ADDThickD;
        var Fold =req.body.ADDFold;
        var Soap = req.body.ADDSoap;
        var Downy = req.body.ADDDowny;
        var TotalPrice = req.body.ADDTotalPriceR;
        var AmountPaid = req.body.ADDAmountPaid;
        var Balance = req.body.ADDBalanceR;
        var tokenDefault = 0;
        var currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 8);
        currentDate = new Date(currentDate.toISOString());
        var ObjectID = require('bson').ObjectID;
        var id  = new ObjectID();
        console.log(currentDate)
        var docs = {
            _id : id,
            Name : Name,
            PhoneNum : Phone,
            DDate : currentDate,
            ThinWash : TNW,
            ThinDry : TND,
            ThickWash : TKW,
            ThickDry : TKD,
            Fold : Fold,
            Soap : Soap,
            Downy : Downy,
            AmountPaid : AmountPaid,
            TotalPrice : TotalPrice,
            Balance : Balance,
            TokenError : tokenDefault
        }
        console.log(docs)
        db.insertOne(Sale, docs, function(result)
        {
            if(result)
                console.log("INSERTED!")
            else
                console.log("FAILED INSERTION!") // <-------------- Jihro fix this pls
            db.findMany(Sale, {}, {}, function(result){
                console.log(result)
                res.redirect('back')
            })

        })

    },

    deleteEntry : function (req, res)
    {
        var id = req.query._id
        console.log(id)
        db.deleteOne(Sale, {_id : id}, function(result){
            if (result)
                console.log("Entry deletion SUCCESSFUL")
            else
                console.log("Entry deletion FAILURE")
        })
    },

   
    
}
module.exports = saleController;
