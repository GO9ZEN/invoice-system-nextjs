"use server";

import Database from "better-sqlite3";

const maindbFileName = "app.db";

///////////////////////// INSERT DATA /////////////////////////
export const insertExpenses = async (data: any) => {
  console.log("data", data);
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const stmt = db.prepare("INSERT INTO expenses (date) VALUES (?)");

  const info = stmt.run(data.date);

  const lastInsertRowid = info.lastInsertRowid;
  //save invoice details

  for (const row of data.expensesdetails) {
    const stmt = db.prepare(
      "INSERT INTO expensesdetails (expensesId, name, price, qty) VALUES (?, ?, ?, ?)"
    );

    const info2 = stmt.run(lastInsertRowid, row.name, row.price, row.qty);
  }

  db.close();

  if (info.changes == 1) {
    return Promise.resolve({
      success: true,
      msg: "Data Saved",
      lastInsertRowid: info.lastInsertRowid,
    });
  } else {
    return Promise.reject({ success: false, msg: "Insert failed" });
  }
};

///////////////////////// GET DATA /////////////////////////
export const getExpensesList = async () => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("SELECT * from expenses").all();

  db.close();

  return Promise.resolve({
    success: true,
    msg: "All Data Displayed",
    data: res,
  });
};

///////////////////////// GET DATA BY ID /////////////////////////
export const getExpense = async (id: number) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("SELECT * FROM expenses WHERE id = ?").get(id);

  const res1 = db
    .prepare("SELECT * FROM expensesdetails WHERE expensesId = ?")
    .all(id);

  res["expensesdetails"] = res1;

  console.log("PPP", res);

  db.close();

  return Promise.resolve({
    success: true,
    msg: "All Data Displayed",
    data: res,
  });
};

///////////////////////// UPDATE DATA BY ID /////////////////////////
export const updateExpense = async (expenses: any) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");
  console.log("expenses", expenses);
  try {
    const res = db
      .prepare("UPDATE expenses SET date=? WHERE id=?")
      .run(expenses.date, expenses.id);

    //delete al rows from invoicedetails table
    const res1 = db
      .prepare("DELETE FROM expensesdetails WHERE expensesId = ?")
      .run(expenses.id);

    //insert details in a loop
    // as insert command

    for (const row of expenses.expensesdetails) {
      const stmt = db.prepare(
        "INSERT INTO expensesdetails (expensesId, name, price, qty) VALUES (?, ?, ?, ?)"
      );

      const info2 = stmt.run(expenses.id, row.name, row.price, row.qty);
    }

    db.close();

    return Promise.resolve({
      success: true,
      msg: "All Data Updated",
      data: res,
    });
  } catch (error: any) {
    return Promise.resolve({
      success: false,
      msg: "Data Didn't Updated",
      data: error.message,
    });
  }
};

///////////////////////// DELETE DATA BY ID /////////////////////////
export const deleteExpenseId = async (id: any) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("DELETE FROM expenses WHERE id = ?").run(id);

  db.close();

  return Promise.resolve({
    success: true,
    msg: "Data Deleted",
    data: res,
  });
};

///////////////////////// DELETE DATA BY ID in INVOICEDETAILS /////////////////////////
export const deleteExpensesDetailsId = async (id: any) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("DELETE FROM expensesdetails WHERE id = ?").run(id);

  db.close();

  return Promise.resolve({
    success: true,
    msg: "Invoice Details Data Deleted",
    data: res,
  });
};
