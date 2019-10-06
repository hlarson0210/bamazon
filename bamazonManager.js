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
                viewTable();
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

function viewTable() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            // console.log(res[0].stock_quantity);
            addInventory(res);
        }
    );
}

function addInventory() {
    inquirer.prompt([{
        type: "number",
        message: "What product would you like to add to inventory? (Choose using the item_id number)",
        name: "productId"
    }, {
        type: "number",
        message: "How many would you like to add?",
        name: "quantity"
    }]).then(answers => {
        getProductInfo(answers);
    })
}

function getProductInfo(dataObj) {
    connection.query("SELECT stock_quantity, product_name FROM products WHERE item_id = ?", dataObj.productId, (error, data) => {
        if (error) throw error;
        if (data.length === 0) {
            console.log("\nPlease select a valid item_id!\n")
            addInventory();
        } else {
            let newQty = data[0].stock_quantity + dataObj.quantity;
            updateProduct(dataObj.quantity, dataObj.productId, newQty, data[0].product_name);
        }
    })
}

function updateProduct(qty, prodId, newQty, item) {
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQty, prodId], (error, data) => {
        if (error) throw error;
        console.log("\nSuccessfully added " + qty + " to " + item + "'s inventory!\n");
        managerQues();
    })
}

function addNewProd(orderMore, prodId) {

}