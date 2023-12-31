const dbConn = require('../dbConnection');
const Item = require('../model/item-model');


var name = Item.name;
var type = Item.type;
var price = Item.price;
var quantity = Item.quantity;
var enteredBy = Item.enteredBy;

const addItem = (req, res) => {
    name = req.body.name;
    type = req.body.type;
    price = req.body.price;
    quantity = req.body.quantity;
    enteredBy = req.body.enteredBy;

    if (name && type && price && quantity && enteredBy) {
        dbConn.getConnection((connection) => {
            connection.query('INSERT INTO item (name,type,price,quantity,enteredBy) VALUES (?,?,?,?,?)', [name, type, price, quantity, enteredBy], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
            connection.release();
        });
        res.send({ status: 200, message: "Item added successfully" });
    }
    else {
        res.send({ status: 400, message: "Invalid data" });
    }

}


const getAllItems = (req, res) => {
    dbConn.getConnection((connection) => {
        connection.query('SELECT * FROM item', (err, result) => {
            if (err) {
                console.log(err);
            }else{
                res.send({ status: 200, data: result });
            } 
        });
        connection.release();
    });
}

const getItem = (req, res) => {
    id = req.params.id;
    dbConn.getConnection((connection) => {
        connection.query('SELECT * FROM item WHERE iditem = ?', [id], (err, result) => {
            if (err) {
                console.log(err);
            }else{
                res.send({ status: 200, data: result });
            }
        });
        connection.release();
    });
}
const getUnitPrice = (req, res) => {
    id = req.params.product_id;
    dbConn.getConnection((connection) => {
        connection.query('SELECT price FROM item WHERE iditem = ?', [id], (err, result) => {
            if (err) {
                console.log(err);
            }else{
                res.send({ status: 200, data: result });
            }
        });
        connection.release();
    });
}


const updateItem = (req, res) => {
    id = req.params.id;
    name = req.body.name;
    type = req.body.type;
    price = req.body.price;
    quantity = req.body.quantity;
    enteredBy = req.body.enteredBy;
    if (id && name && type && price && quantity && enteredBy) {
    dbConn.getConnection((connection) => {
        connection.query('UPDATE item SET name = ?,type = ?,price = ?,quantity = ?,enteredBy = ? WHERE iditem = ?', [name, type, price, quantity, enteredBy, id], (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send({ status: 200, data: result, message:"Item updated successfully"});
        });
        connection.release();
    });}
    else {
        res.send({ status: 400, message: "Invalid data" });
    }
}

const updateItemQuantity = (req, res) => {
    const id = req.params.id;

    if (id) {
        dbConn.getConnection((connection) => {
            // Get the current quantity of the item in the inventory
            connection.query('SELECT quantity FROM item WHERE iditem = ?', [id], (err, result) => {
                if (err) {
                    console.error(err);
                    connection.release();
                    return res.status(500).json({ error: 'Error getting item quantity' });
                }

                if (result.length === 0) {
                   
                    connection.release();
                    return res.status(404).json({ error: 'Product not found' });
                }

                const currentQuantity = result[0].quantity;
                let requestedQuantity = req.body.quantity; // Update the quantity based on the operation (e.g., reduce)

                // Ensure that the requested quantity doesn't exceed the available quantity
                if (requestedQuantity > currentQuantity) {
                    
                    connection.release();
                    return res.status(400).json({ error: 'Not enough quantity available to purchase' });
                }

                const newQuantity = currentQuantity - requestedQuantity;

                connection.query('UPDATE item SET quantity = ? WHERE iditem = ?', [newQuantity, id], (err, updateResult) => {
                    if (err) {
                        console.error(err);
                        connection.release();
                        return res.status(500).json({ error: 'Error updating item quantity' });
                    } else {
                        res.status(200).send({ status: 200, data: updateResult, message: "Item quantity updated successfully" });
                    }
                });

                connection.release();
            });
        });
    } else {
        console.log("Invalid data"); // Call the errorCallback with the error message
    }
}

const deleteItem = (req,res) => {
    id = req.params.id;
    dbConn.getConnection((connection) => {
        connection.query('DELETE FROM item  WHERE iditem = ?', [id], (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send({ status: 200, data: result, message:"Item deleted successfully"});
        });
        connection.release();
    });
}

exports.addItem = addItem;
exports.getAllItems = getAllItems;
exports.getItem = getItem;
exports.getUnitPrice= getUnitPrice;
exports.updateItem = updateItem;
exports.updateItemQuantity = updateItemQuantity;
exports.deleteItem = deleteItem;