create database Bamazon;

Use Bamazon;

CREATE TABLE products (
  item_id INT NOT NULL,
  PRIMARY KEY (item_id),
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  stock_quantity INT NULL
);

SELECT * FROM products;