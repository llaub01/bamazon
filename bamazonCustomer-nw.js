// requires
var inquirer = require("inquirer");
var mysql = require("mysql");

// global vars
var stockOfItem;
var pickedItem;
var pickedQuantity;

// setup mysql connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

connection.connect(function(error) {
	if (error) throw error;
	// start the store
	forSale();
});

// display whats for sale function
function forSale() {
	connection.query("SELECT * FROM products", function(error, results) {
	    if (error) throw error;
		// display items
	   	console.log("****************************************\n**** ID * ITEM * PRICE * # IN STOCK ****\n****************************************")
	   	for (var i = 0; i < results.length; i++) {
		  	console.log(results[i].item_id + " * " + results[i].product_name + " * " + results[i].price + " * " + results[i].stock_quantity);
		}
		console.log("****************************************");
	});
	// ask what they'd like to do
	inquirer.prompt([{
		name: "choice",
		type: "input",
		message: "Enter the ID of the item you'd like to buy."
    },
    {
		name: "quantity",
		type: "input",
		message: "How many of that item woud you like?"
    }
  	]).then(function(answer) {
  		pickedQuantity = answer.quantity;
  		pickedItem = answer.choice;
		// do the purchase
		purchase(pickedItem, pickedQuantity);
	});
}


// // ask what cust wants to buy function
// function whatchaWant() {
//     inquirer.prompt([{
// 		name: "choice",
// 		type: "input",
// 		message: "Enter the ID of the item you'd like to buy."
//     },
//     {
// 		name: "quantity",
// 		type: "input",
// 		message: "How many of that item woud you like?"
//     }
//   	]).then(function(answer) {
// 	    // do the purchase

// 	    purchase(answer.choice, answer.quantity);
// 	});
// }

// calculate response function
function purchase(itemID, quantity) {
	// get the quantity to do some math
	connection.query("SELECT stock_quantity FROM products WHERE item_id = itemID", function(error, results) {
		if (error) throw error;
		console.log(results);
		stockOfItem = results - answer.quantity
		console.log(stockOfItem);
	});

	// update the db
	connection.query("UPDATE products SET ? WHERE ?", [
	{
	    stock_quantity: quantity
	},
	{
	    id: itemID
	}],function(error) {
		if (error) throw error;
		console.log("Order submitted successfully!");
	});
	// go sell some more
	forSale()
}
