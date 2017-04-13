var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "Bamazon"
});

// var queryDb = function(connection, query, func, cb) {
// 	connection.query(query, function(err, res) {
// 		func(err, res);
// 		if (cb) {
// 			cb();
// 		}
// 	});
// };

var userShop = function() {
  inquirer.prompt({
    name: "id",
    type: "input",
    message: "Wanna buy anything? Just type the ID and hit ENTER.",
  }).then(function(answer) {
  	attemptSale(answer.id);
  });
};

var attemptSale = function(id) {
	var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?"
	connection.query(query, { item_id: id }, function(err, res) {
		if (res.length != 1) {
			console.log("Sorry but there was an error pulling up the item with that ID. Please try again in 5 seconds.")
			setTimeout(function() {startShop()}, 5000);
			return
		}
		else
		{
			inquirer.prompt({
			    name: "amount",
			    type: "input",
			    message: "How many " + res[0].product_name + " would you like to buy?",
			}).then(function(answer) {
			  	if (res[0].stock_quantity > answer.amount) {
			  		var query = "UPDATE products SET ? where ?"
			  		connection.query(query, [{stock_quantity:res[0].stock_quantity-answer.amount}, {item_id:id}], function(err) {
			  			console.log("Congrats on purchasing " + answer.amount + " " + res[0].product_name + " for " + res[0].price*answer.amount);
			  			console.log("Keep Shopping!");
			  			setTimeout(function() {startShop()}, 5000);
			  		});
			  	}
			  	else
			  	{
			  		console.log("Sorry but there isn't sufficient stock to fulfill your request. Please try again later.");
			  		setTimeout(function() {startShop()}, 5000);
			  	};
			});
		};
	});
};

var startShop = function() {
	var query = "SELECT item_id, product_name, price FROM products"
	connection.query(query, function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log("ID: " + res[i].item_id + " || Name: " + res[i].product_name + " || Price: " + res[i].price);
		};
		userShop();
	});
};

connection.connect(function(err) {
	if (err) throw err;
	startShop();
});