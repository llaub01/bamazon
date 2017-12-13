// requires
var inquirer = require("inquirer");
var mysql = require("mysql");

// global vars
var stockOfItem;
var youBought;
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
	// start the connection
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
	   
	    // ask what they'd like to do
	    whatchaWant();
	});
}

// ask what cust wants to buy function
function whatchaWant() {
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
  		pickedItem = answer.choice;
  		pickedQuantity = answer.quantity;
	    
	    // do the purchase
	    purchase(pickedItem, pickedQuantity);
	});
}

// calculate response function
function purchase(itemID, quantity) {
	// get quantity of item selected
	connection.query("SELECT * FROM products WHERE item_id = ?", [itemID], function(error, results) {
		if (error) throw error;
		
		// math for new inventory level
		stockOfItem = results[0].stock_quantity - quantity;
		youBought = results[0].product_name;
	});
	updateInv(itemID);
}

// ******* NEED TO FIGURE OUT PROMISE / TIMING FOR THIS *****
function updateInv(itemID) {	
	setTimeout(function() {
		//update db
		connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [stockOfItem, itemID], function(error) {
			if (error) throw error;
			console.log(youBought + " order submitted successfully!");
		});
		// go sell some more
		forSale();
	},200);

}
