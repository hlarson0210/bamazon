require("dotenv").config();
var mysql = require("mysql");
var credentials = require("./keys.js");
var inquirer = require("inquirer");
const cTable = require('console.table');
var connection = mysql.createConnection(credentials.mySQL);


connection.connect(function (err, res) {
    if (err) throw err;
    console.log("Connected! ", connection.threadId);
    managerQues();
});

function managerQues() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
        name: "choice"
    },
    ]).then(function (answer) {
        console.log(answer.choice);
        var mngrDec = answer.choice
        switch (mngrDec) {
            case "View Products for Sale":
                runIt();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProd();
                break;
            case "Exit":
                connection.end();
        }
    });
}

function runIt() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            managerQues();
        },
    );
}

function lowInventory() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            managerQues();
        },
    );
}

function addInventory() {
    connection.query(
        "SELECT product_name FROM products",
        function (err, res) {
            if (err) throw err;
            var choicesArr = [];
            for (var i = 0; i < res.length; i++){
                
            }
            console.log(res);
        }
    );
    inquirer.prompt([{
        type: "list",
        message: "What item would you like to add?",
        // choices: "SELECT product_name FROM products",
        name: "choice"
    }, {
        type: "number",
        message: "How many would you like to add?",
        name: "addedQty"
    },
    ]).then(function (answer) {
        console.log(answer);
        connection.query(
            "UPDATE products SET stock_quantity = ? WHERE item_id = ?", [orderMore, prodId],
            function (err, res) {
                if (err) throw err;
                console.log("\nQuanitiy added: " + orderMore + " added.\n")
                console.table(res);
                managerQues();
            },
        );
    });
}

function addNewProd(orderMore, prodId) {

}

