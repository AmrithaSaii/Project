const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bank_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//signup

app.post("/UserPage", (req, res) => {
  const {
    username,
    firstName,
    lastName,
    dob,
    email,
    phoneNumber,
    address,
    accountType,
    password,
  } = req.body;
  const sql =
    "INSERT INTO user(`username`, `firstName`, `lastName`, `dob`, `email`, `phoneNumber`, `address`, `accountType`, `password`)VALUES (?,?,?,?,?,?,?,?,?)";

  db.query(
    sql,
    [
      username,
      firstName,
      lastName,
      dob,
      email,
      phoneNumber,
      address,
      accountType,
      password,
    ],
    (err, data) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Error registering user" });
      } else {
        return res.status(200).json({ success: true, message: "registered" });
      }
    }
  );
});

app.post("/usercheckusername", (req, res) => {
  const { username } = req.body;

  // Validate username format
  const usernameRegex = /^#user\d{5}$/;
  if (!usernameRegex.test(username)) {
    return res
      .status(400)
      .send({
        available: false,
        message:
          "Username must start with #user followed by a unique 5-digit number",
      });
  }

  const query = "SELECT COUNT(*) as count FROM user WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results[0].count > 0) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  });
});

// admin login
app.post("/admin", (req, res) => {
  const sql = "select * from admin where username = ? and password = ?";
  const values = [req.body.username, req.body.password];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
    if (data.length > 0) {
      console.log("Login successful:", data);
      return res.json({ success: true, message: "Login successful" });
    } else {
      console.log("Login failed: No record found");
      return res.json({ success: false, message: "No record found" });
    }
  });
});

const JWT_SECRET = "maybe";

//user login

app.post("/userlogin", (req, res) => {
  const { username, password } = req.body;

  // Check user credentials
  db.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (results.length === 0)
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });

      const user = results[0];

      // Generate JWT token
      const token = jwt.sign({ username: user.username }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ success: true, token });
    }
  );
});

app.get("/hello/userprofile", authenticateToken, (req, res) => {
  const username = req.user.username;

  db.query(
    "SELECT username, firstname, lastname, dob, email, phoneNumber, address, accountType,password FROM user WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error fetching user profile:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    }
  );
});

app.put("/hello/userprofile", authenticateToken, (req, res) => {
  const { firstname, lastname, dob, email, phoneNumber, address, accountType } =
    req.body;
  const username = req.user.username;

  db.query(
    "UPDATE user SET firstname = ?, lastname = ?, dob = ?, email = ?, phoneNumber = ?, address = ?, accountType = ? WHERE username = ?",
    [
      firstname,
      lastname,
      dob,
      email,
      phoneNumber,
      address,
      accountType,
      username,
    ],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });

      if (results.affectedRows > 0) {
        res.json({ success: true, message: "Profile updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    }
  );
});

//staff login
app.post("/stafflogin", (req, res) => {
  const { username } = req.body;

  db.query(
    "SELECT * FROM staff WHERE username = ?",
    [username],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      if (results.length === 0)
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });

      const staff = results[0];

      // Assuming you have password validation logic here

      // Generate JWT token
      const token = jwt.sign({ username: staff.username }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ success: true, token });
    }
  );
});

app.get("/hello/staffprofile", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    db.query(
      "SELECT username, designation, password,branch FROM staff WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }
        if (results.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Staff not found" });
        }

        res.json({ success: true, staff: results[0] });
      }
    );
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// Update staff profile
app.put("/hello/staffprofile", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;
    const { designation, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the new password

    db.query(
      "UPDATE staff SET designation = ?, password = ? WHERE username = ?",
      [designation, hashedPassword, username],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Staff not found" });
        }
        res.json({ success: true, message: "Profile updated successfully" });
      }
    );
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

//user listing

app.get("/userlisting", (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
    return res.json(data);
  });
});

// Staff listing endpoint
app.get("/stafflisting", (req, res) => {
  const sql = "SELECT * FROM staff";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
    return res.json(data);
  });
});

// User delete endpoint
app.post("/deleteuser", (req, res) => {
  const username = req.body.username;
  const sql = "DELETE FROM user WHERE username=?";
  const values = [username];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
    if (data.affectedRows === 1) {
      return res.json({ success: true, message: "User deleted successfully" });
    } else {
      return res.json({ success: false, message: "No user found" });
    }
  });
});

//staff delete endpoint
app.delete("/deletestaff", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const sql = "DELETE FROM staff WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Error deleting staff:", err);
      return res
        .status(500)
        .json({ message: "Failed to delete staff. Please try again." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  });
});

// Update user endpoint
app.put("/updateuser", (req, res) => {
  const {
    username,
    firstname,
    lastname,
    dob,
    email,
    phoneNumber,
    address,
    accountType,
    password,
  } = req.body;
  console.log(req.body);
  const sql = `
    UPDATE user
    SET firstname = ?, lastname = ?, dob = ?, email = ?, phoneNumber = ?, address = ?, accountType = ?, password = ?
    WHERE username = ?
  `;
  const values = [
    firstname,
    lastname,
    dob,
    email,
    phoneNumber,
    address,
    accountType,
    password,
    username,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
    if (result.affectedRows === 1) {
      return res.json({ success: true, message: "User updated successfully" });
    } else {
      return res.json({
        success: false,
        message: "User not found or no changes made",
      });
    }
  });
});

app.put("/updatestaff", (req, res) => {
  const { username, password, designation } = req.body;
  if (!username || !password || !designation) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql =
    "UPDATE staff SET password = ?, designation = ? WHERE username = ?";
  db.query(sql, [password, designation, username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update staff." });
    }
    res.status(200).json({ message: "Staff updated successfully." });
  });
});

app.post("/addstaff", (req, res) => {
  const { username, password, designation, branch } = req.body; // Include branch in the request body

  // Validate input
  if (!username || !password || !designation || !branch) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (username.length < 5) {
    return res
      .status(400)
      .json({ message: "Username must be at least 5 characters long." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }
  if (designation.length < 3) {
    return res
      .status(400)
      .json({ message: "Designation must be at least 3 characters long." });
  }
  if (branch.length < 3) {
    return res
      .status(400)
      .json({ message: "Branch must be at least 3 characters long." });
  }

  // Check if the username already exists
  db.query(
    "SELECT * FROM staff WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error." });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: "Username already exists." });
      }

      // Insert new staff, including branch
      const sql =
        "INSERT INTO staff (username, password, designation, branch) VALUES (?, ?, ?, ?)";
      db.query(
        sql,
        [username, password, designation, branch],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Failed to add staff. Please try again." });
          }
          res.status(201).json({ message: "Staff added successfully." });
        }
      );
    }
  );
});

// Get admin profile
app.get("/admin/profile", (req, res) => {
  const sql = "SELECT * FROM admin ";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
    res.json(result[0]);
  });
});

// Update admin profile
app.put("/admin/updateprofile", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "UPDATE admin SET username = ?, password = ? WHERE username = ?";
  db.query(sql, [username, password, username], (err, result) => {
    if (err) {
      console.error("Error updating admin profile:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (result.affectedRows === 1) {
      res.json({ message: "Profile updated successfully" });
    } else {
      res.json({ message: "Profile update failed" });
    }
  });
});

// Get staff profile
app.get("/staff/profile", (req, res) => {
  const sql = "SELECT * FROM staff ";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
    res.json(result[0]);
  });
});

// Update staff profile

app.put("/staff/updateprofile", (req, res) => {
  const { username, password } = req.body;
  const sql = "UPDATE staff SET username = ?,  password = ? WHERE username=? ";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error updating staff profile:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
    if (result.affectedRows === 1) {
      res.json({ success: true, message: "Profile updated successfully" });
    } else {
      res.json({ success: false, message: "Profile update failed" });
    }
  });
});

//update user profile
app.put("/user/updateprofile", (req, res) => {
  const {
    username,
    firstname,
    lastname,
    dob,
    email,
    phoneNumber,
    address,
    accountType,
    password,
  } = req.body;

  db.query(
    "UPDATE user SET firstname = ?, lastname = ?, dob = ?, email = ?, phoneNumber = ?, address = ?, accountType = ?, password = ? WHERE username = ?",
    [
      firstname,
      lastname,
      dob,
      email,
      phoneNumber,
      address,
      accountType,
      password,
      username,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating user profile:", err);
        return res
          .status(500)
          .json({ message: "Failed to update user profile" });
      }

      if (results.affectedRows > 0) {
        res.json({ message: "Profile updated successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
});

//add user
app.post("/adduser", (req, res) => {
  const {
    username,
    firstname,
    lastname,
    dob,
    email,
    phoneNumber,
    address,
    accountType,
    password,
  } = req.body;

  const query = "INSERT INTO user SET ?";

  const newUser = {
    username,
    firstname,
    lastname,
    dob,
    email,
    phoneNumber,
    address,
    accountType,
    password,
    created: new Date(), // Assuming you want to set the current date and time
  };

  db.query(query, newUser, (err, result) => {
    if (err) {
      console.error("Error adding user:", err);
      res.status(500).send("Failed to add user.");
      return;
    }
    res.status(201).send("User added successfully.");
  });
});

// Check if username is available
app.post("/checkusername", (req, res) => {
  const { username } = req.body;

  const query = "SELECT COUNT(*) AS count FROM user WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error checking username availability:", err);
      res.status(500).send("Failed to check username availability.");
      return;
    }
    const isAvailable = results[0].count === 0;
    res.status(200).send({ available: isAvailable });
  });
});

//addstaff
app.post("/addstaff", (req, res) => {
  const { username, password } = req.body;

  const query = "INSERT INTO staff (username, password) VALUES (?, ?)";

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Error adding staff:", err);
      res.status(500).send("Failed to add staff.");
      return;
    }
    res.status(201).send("Staff added successfully.");
  });
});

// Add receiverId field to the normalTransaction route
app.post("/normalTransaction", authenticateToken, (req, res) => {
  const { username, amount, receiver } = req.body;

  if (!username || !amount || !receiver) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log("Authenticated User:", req.user); // Log authenticated user details

  // Fetch the current balance
  db.query(
    "SELECT balance FROM account WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error fetching balance:", err);
        return res.status(500).json({ error: "Database error" });
      }
      const currentBalance = results[0].balance;

      // Check if the amount is valid
      if (parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      // Update the sender's balance
      db.query(
        "UPDATE account SET balance = balance - ? WHERE username = ?",
        [amount, username],
        (err) => {
          if (err) {
            console.error("Error updating sender balance:", err);
            return res.status(500).json({ error: "Database error" });
          }

          // Update the receiver's balance
          db.query(
            "UPDATE account SET balance = balance + ? WHERE username = ?",
            [amount, receiver],
            (err) => {
              if (err) {
                console.error("Error updating receiver balance:", err);
                return res.status(500).json({ error: "Database error" });
              }

              // Insert the transaction record
              const query =
                "INSERT INTO transaction (username, receiver, amount, balance, transaction_date) VALUES (?, ?, ?, ?, NOW())";
              db.query(
                query,
                [username, receiver, amount, currentBalance - amount],
                (err) => {
                  if (err) {
                    console.error("Error inserting transaction record:", err);
                    return res.status(500).json({ error: "Database error" });
                  }

                  // Respond with success
                  res
                    .status(200)
                    .json({
                      message: "Transaction successful",
                      balance: currentBalance - amount,
                    });
                }
              );
              // Log balance query result
              db.query(
                "SELECT balance FROM account WHERE username = ?",
                [username],
                (err, results) => {
                  if (err) {
                    console.error("Error fetching balance:", err);
                    return res.status(500).json({ error: "Database error" });
                  }
                  console.log("Current Balance:", results[0].balance);

                  // Continue with the rest of your logic...
                }
              );
            }
          );
        }
      );
    }
  );
});

// Route to fetch transaction history
app.get("/transactionHistory", authenticateToken, (req, res) => {
  const username = req.user.username;

  db.query(
    "SELECT * FROM transaction WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error fetching transactions:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ transactions: results });
    }
  );
});

// Submit a helpdesk ticket
app.post("/helpdesk", authenticateToken, (req, res) => {
  const { username, issue } = req.body;

  // Insert the issue into the database (or perform other actions)
  db.query(
    "INSERT INTO helpdesk (username, issue) VALUES (?, ?)",
    [username, issue],
    (err, results) => {
      if (err) {
        console.error("Error submitting helpdesk request:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      res.json({
        success: true,
        message: "Helpdesk request submitted successfully",
      });
    }
  );
});

// Get all helpdesk tickets for the authenticated user
app.get("/api/helpdesk", authenticateToken, (req, res) => {
  const username = req.user.username; // Get username from authenticated token

  db.query(
    "SELECT * FROM helpdesk WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error fetching helpdesk tickets:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      res.json({ success: true, tickets: results });
    }
  );
});

app.get("/api/admin/helpdesk", authenticateToken, (req, res) => {
  db.query("SELECT * FROM helpdesk", (err, results) => {
    if (err) {
      console.error("Error fetching helpdesk tickets:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    res.json({ success: true, tickets: results });
  });
});

// Route to submit a cheque transaction request
app.post("/chequeTransactionRequest", authenticateToken, (req, res) => {
  const { username, receiverUsername, amount, date } = req.body;

  db.query(
    "INSERT INTO cheque (username, receiver, amount, date, status) VALUES (?, ?, ?, ?, ?)",
    [username, receiverUsername, amount, date, "pending"],
    (err, results) => {
      if (err) {
        console.error("Error submitting transaction request:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res
        .status(200)
        .json({ message: "Transaction request submitted successfully" });
    }
  );
});

// Route to fetch pending cheque transaction requests
app.get("/pendingChequeTransactions", authenticateToken, (req, res) => {
  db.query(
    "SELECT * FROM cheque WHERE status = ?",
    ["pending"],
    (err, results) => {
      if (err) {
        console.error("Error fetching pending transactions:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ pendingTransactions: results });
    }
  );
});

// Approve a cheque transaction
app.post("/approveChequeTransaction", authenticateToken, (req, res) => {
  const { chequenumber } = req.body;

  if (!chequenumber) {
    return res.status(400).json({ error: "Cheque number is required" });
  }

  // Start a transaction to ensure data consistency
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Fetch the transaction details
    db.query(
      "SELECT * FROM cheque WHERE chequenumber = ?",
      [chequenumber],
      (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error fetching transaction details:", err);
            res.status(500).json({ error: "Database error" });
          });
        }

        if (results.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: "Transaction not found" });
          });
        }

        const transaction = results[0];

        // Check if transaction is still pending
        if (transaction.status !== "pending") {
          return db.rollback(() => {
            res.status(400).json({ error: "Transaction is not pending" });
          });
        }

        // Update the cheque status to 'approved'
        db.query(
          "UPDATE cheque SET status = ? WHERE chequenumber = ?",
          ["approved", chequenumber],
          (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error updating transaction status:", err);
                res.status(500).json({ error: "Database error" });
              });
            }

            // Update the balances for both sender and receiver
            const { username, receiver, amount } = transaction;

            // Decrement balance of the sender
            db.query(
              "UPDATE account SET balance = balance - ? WHERE username = ?",
              [amount, username],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Error updating sender balance:", err);
                    res.status(500).json({ error: "Database error" });
                  });
                }

                // Increment balance of the receiver
                db.query(
                  "UPDATE account SET balance = balance + ? WHERE username = ?",
                  [amount, receiver],
                  (err) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error("Error updating receiver balance:", err);
                        res.status(500).json({ error: "Database error" });
                      });
                    }

                    // Commit the transaction
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error("Error committing transaction:", err);
                          res.status(500).json({ error: "Database error" });
                        });
                      }

                      res
                        .status(200)
                        .json({
                          message:
                            "Transaction approved and balances updated successfully",
                        });
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// Decline a cheque transaction
app.post("/declineChequeTransaction", authenticateToken, (req, res) => {
  const { chequenumber } = req.body;

  if (!chequenumber) {
    return res.status(400).json({ error: "Cheque number is required" });
  }

  db.query(
    "UPDATE cheque SET status = ? WHERE chequenumber = ?",
    ["declined", chequenumber],
    (err) => {
      if (err) {
        console.error("Error updating transaction status:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Transaction declined successfully" });
    }
  );
});

// Route to fetch transaction history
app.get("/chequeStatus", authenticateToken, (req, res) => {
  const username = req.user.username;

  db.query(
    "SELECT * FROM cheque WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error fetching transactions:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ transactions: results });
    }
  );
});

// Route to fetch all cheque transactions excluding those with 'pending' status
app.get("/allChequeTransactions", authenticateToken, (req, res) => {
  db.query('SELECT * FROM cheque WHERE status <> "pending"', (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ transactions: results });
  });
});

// Validate receiver's username API endpoint
app.get("/validateReceiver", (req, res) => {
  const { receiverUsername } = req.query;

  if (!receiverUsername) {
    return res
      .status(400)
      .json({ exists: false, message: "Receiver username is required" });
  }

  const query = "SELECT username FROM user WHERE username = ?";

  db.query(query, [receiverUsername], (err, result) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ exists: false, message: "Database error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ exists: false, message: "Receiver not found" });
    }

    return res.json({ exists: true, message: "Receiver exists" });
  });
});

app.get("/validateUser", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await UserModel.findOne({ username }); // Replace with your actual user lookup logic
    if (user) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (error) {
    console.error("Error validating user:", error);
    res.status(500).json({ isValid: false });
  }
});

// Endpoint to get loan history for the logged-in user
app.get("/api/loan-history", authenticateToken, (req, res) => {
  const tokenUsername = req.user.username; // Extracted from token

  // Query to get loan history for the logged-in user
  const query = `SELECT * FROM loan WHERE username = ?`;

  db.query(query, [tokenUsername], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "There was an error retrieving loan history." });
    }

    // Return loan history as response
    res.status(200).json(results);
  });
});

// Endpoint to handle loan application submission
app.post("/api/loan-application", authenticateToken, async (req, res) => {
  const { loanType, amount, tenure, aadharId, panId, username } = req.body;
  const tokenUsername = req.user.username; // Extracted from token

  // Validate the incoming data
  if (!loanType || !amount || !tenure || !aadharId || !panId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the user has already taken a loan of the same type
  const checkQuery = `
    SELECT * FROM loan 
    WHERE username = ? 
    AND loanType = ?
  `;

  db.query(checkQuery, [tokenUsername, loanType], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "There was an error checking your loan history." });
    }

    if (results.length > 0) {
      // If a loan of the same type exists, return an error
      return res
        .status(400)
        .json({ error: `You already have a ${loanType} loan.` });
    }
  });

  // Insert loan application into the database
  const query = `
    INSERT INTO loan (username, loanType, amount, tenure, aadharid, panid, loanstatus) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    tokenUsername,
    loanType,
    amount,
    tenure,
    aadharId,
    panId,
    "pending",
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "There was an error processing your application." });
    }
    res
      .status(200)
      .json({ message: "Loan application submitted successfully!" });
  });
});

// Endpoint to get pending loans
app.get("/api/pending-loans", authenticateToken, async (req, res) => {
  const query = "SELECT * FROM loan WHERE loanstatus = ?";

  db.query(query, ["pending"], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Endpoint to update loan status
app.put("/api/update-loan-status", authenticateToken, async (req, res) => {
  const { loanNumber, newStatus } = req.body;

  if (!["approved", "rejected"].includes(newStatus)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const query = "UPDATE loan SET loanstatus = ? WHERE loanNumber = ?";
  db.query(query, [newStatus, loanNumber], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ error: "Loan not found" });
    res.json({ message: "Loan status updated successfully" });
  });
});

// Endpoint to get all loans
app.get("/api/all-loans", authenticateToken, async (req, res) => {
  const query = "SELECT * FROM loan";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching all loans:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

// Route to get loan status by the authenticated user
app.get("/api/loan-status", authenticateToken, async (req, res) => {
  const tokenUsername = req.user.username; // Extract the username from the token

  // Query to get loans by the username from the token
  db.query(
    "SELECT * FROM loan WHERE username = ?",
    [tokenUsername],
    (err, results) => {
      if (err) {
        console.error("Error fetching loan status:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No loans found for this user" });
      }
      res.json(results);
    }
  );
});

// Endpoint to get credit card history for the logged-in user
app.get("/api/credit-card-history", authenticateToken, (req, res) => {
  const tokenUsername = req.user.username; // Extracted from token

  // Query to get credit card history for the logged-in user
  const query = `SELECT * FROM card WHERE username = ?`;

  db.query(query, [tokenUsername], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "There was an error retrieving credit card history." });
    }

    // Return credit card history as response
    res.status(200).json(results);
  });
});

// Endpoint to handle credit card requests
app.post("/api/credit-card-request", authenticateToken, (req, res) => {
  const { cardType } = req.body;
  const username = req.user.username;

  // Validate request
  if (!cardType || !["regular", "travel", "shopping"].includes(cardType)) {
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  // Check if the user has already requested the same card type
  const checkQuery = `SELECT * FROM card WHERE username = ? AND cardtype = ?`;

  db.query(checkQuery, [username, cardType], (err, results) => {
    if (err) {
      console.error("Error checking for existing requests:", err);
      return res
        .status(500)
        .json({ message: "Error checking for existing requests." });
    }

    if (results.length > 0) {
      // If a card request already exists, return an error
      return res
        .status(400)
        .json({ message: `You have already requested a ${cardType} card.` });
    }
  });

  // Insert request into the database
  const query =
    "INSERT INTO card (username, cardtype, status) VALUES (?, ?, ?)";
  const values = [username, cardType, "pending"];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error inserting data into the database:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({ message: "Request submitted successfully" });
  });
});

// Endpoint to get credit card requests by status
app.get("/api/credit-card-requests", authenticateToken, (req, res) => {
  const status = req.query.status || "pending"; // Default to 'pending' if no status provided
  const query =
    status === "all"
      ? "SELECT * FROM card"
      : "SELECT * FROM card WHERE status = ?";

  const queryParams = status === "all" ? [] : [status];

  db.query(query, queryParams, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Endpoint to approve a credit card request
app.post("/api/approve-credit-card-request", authenticateToken, (req, res) => {
  const { cardId } = req.body;

  const query = "UPDATE card SET status = ? WHERE cardid = ?";
  db.query(query, ["approved", cardId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ error: "Request not found" });
    res.json({ message: "Credit card request approved successfully" });
  });
});

// Endpoint to decline a credit card request
app.post("/api/decline-credit-card-request", authenticateToken, (req, res) => {
  const { cardId } = req.body;

  const query = "UPDATE card SET status = ? WHERE cardid = ?";
  db.query(query, ["declined", cardId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ error: "Request not found" });
    res.json({ message: "Credit card request declined successfully" });
  });
});

// Endpoint to get all transaction history
app.get("/allTransactionHistory", (req, res) => {
  const query = "SELECT * FROM transaction";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return res.status(500).json({ message: "Error fetching transactions" });
    }
    res.json({ transactions: results });
  });
});

// Route to get loan status by the authenticated user
app.get("/api/card-status", authenticateToken, async (req, res) => {
  const tokenUsername = req.user.username; // Extract the username from the token

  // Query to get loans by the username from the token
  db.query(
    "SELECT * FROM card WHERE username = ?",
    [tokenUsername],
    (err, results) => {
      if (err) {
        console.error("Error fetching card status:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No cards found for this user" });
      }
      res.json(results);
    }
  );
});

// API to fetch total transactions, loans, and feedbacks
app.get("/api/dashboard", (req, res) => {
  const transactionQuery = "SELECT COUNT(*) AS total FROM transaction";
  const loanQuery = "SELECT COUNT(*) AS total FROM loan";
  const feedbackQuery = "SELECT COUNT(*) AS total FROM helpdesk";
  const usersQuery = "SELECT COUNT(*) AS total FROM user";
  const staffQuery = "SELECT COUNT(*) AS total FROM staff";

  db.query(transactionQuery, (err, transactionResult) => {
    if (err) return res.status(500).json({ error: err });

    db.query(loanQuery, (err, loanResult) => {
      if (err) return res.status(500).json({ error: err });

      db.query(feedbackQuery, (err, feedbackResult) => {
        if (err) return res.status(500).json({ error: err });

        db.query(usersQuery, (err, usersResult) => {
          if (err) return res.status(500).json({ error: err });

          db.query(staffQuery, (err, staffResult) => {
            if (err) return res.status(500).json({ error: err });

            res.json({
              transaction: transactionResult[0].total,
              loan: loanResult[0].total,
              helpdesk: feedbackResult[0].total,
              users: usersResult[0].total,
              staff: staffResult[0].total,
            });
          });
        });
      });
    });
  });
});

// API to fetch daily transaction data
app.get("/api/dashboard/daily-transactions", (req, res) => {
  const query = `
   SELECT DATE(transaction_date) AS day, COUNT(*) AS transactions
FROM transaction
GROUP BY DATE(transaction_date)
ORDER BY DATE(transaction_date);
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

app.listen(8081, () => {
  console.log("listening.. go to port 8081");
});
