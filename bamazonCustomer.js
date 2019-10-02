require("dotenv").config();
var mysql = require("mysql");
var credentials = require("./keys.js");
var inquirer = require("inquirer");
const cTable = require('console.table');
var connection = mysql.createConnection(credentials.mySQL);


connection.connect(function (err, res) {
    if (err) throw err;
    console.log("Connected! ", connection.threadId);
    runIt();
});


function runIt() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            customerBamazon();
        },
    );
}

function customerBamazon() {
    inquirer.prompt([{
        type: "input",
        message: "Welcom to my store! What item would you like to buy? (select by item id)",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                return "\n\nPlease select by item id\n";
            }
        },
        name: "choice"
    }, {
        type: "input",
        message: "How many would you like to buy?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                return "\n\nPlease enter numeric quantity\n";
            }
        },
        name: "quantity"
    }]).then(function (answers) {
        quantityCheck(answers);
    });
}


function quantityCheck(obj) {
    connection.query(
        "SELECT stock_quantity, price FROM products WHERE ?",
        {
            item_id: obj.choice
        },
        function (err, res) {
            if (err) throw err;
            var inStock = res[0].stock_quantity;
            var amtPurchased = obj.quantity;
            var id = obj.choice;
            if (amtPurchased > inStock) {
                console.log("\nInsufficient Quantity!!!\nWe only have " + inStock + " in stock\n");
                runIt();
            } else {
                var newStock = inStock - amtPurchased;
                var total = amtPurchased * res[0].price;
                updateTable(newStock, obj.choice, total);
            }
        },
    );
}

function updateTable(newStock, prodId, total) {
    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newStock, prodId],
        function (err, res) {
            if (err) throw err;
            console.log("\n\nYour total is $" + total + "\n\nWill that be cash or credit?\n\n");
        },
    );
    runIt();
}
