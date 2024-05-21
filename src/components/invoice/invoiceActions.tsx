"use server";

import Database from "better-sqlite3";

const maindbFileName = "app.db";

///////////////////////// INSERT DATA /////////////////////////
export const insertInvoice = async (data: any) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const stmt = db.prepare(
    // "INSERT INTO invoice, item (invoiceDate, cusName, cusAddress, cusNumber, itemName, itemPrice, itemQty, itemAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?) LEFT JOIN item ON item.id = invoice.itemId"
    // "INSERT INTO invoice (invoiceDate, cusName, cusAddress, cusNumber, itemName, itemPrice, itemQty, itemAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"

    "INSERT INTO invoice (invoiceDate, cusName, cusAddress, cusNumber) VALUES (?, ?, ?, ?)"
    // "INSERT INTO item (itemName, itemPrice, itemQty, itemAmount) VALUES (?, ?, ?, ?)"
  );

  const info = stmt.run(
    data.invoiceDate,
    data.cusName,
    data.cusAddress,
    data.cusNumber
    // data.itemName,
    // data.itemPrice,
    // data.itemQty,
    // data.itemAmount
  );

  // const stmtItem = db.prepare(
  //   "INSERT INTO item (itemName, itemPrice, itemQty, itemAmount) VALUES (?, ?, ?, ?)"
  // );

  // const infoItem = stmtItem.run(
  //   data.itemName,
  //   data.itemPrice,
  //   data.itemQty,
  //   data.itemAmount
  // );

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

  // if (infoItem.changes == 1) {
  //   return Promise.resolve({
  //     success: true,
  //     msg: "Data Saved",
  //     lastInsertRowid: infoItem.lastInsertRowid,
  //   });
  // } else {
  //   return Promise.reject({ success: false, msg: "Insert failed" });
  // }
};

///////////////////////// GET DATA /////////////////////////
export const getInvoiceList = async () => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db
    .prepare(
      "SELECT * from invoice"
      // "SELECT invoice. *, item. * FROM invoice LEFT JOIN item ON item.id = invoice.itemId"
    )
    .all();

  db.close();

  return Promise.resolve({
    success: true,
    msg: "All Data Displayed",
    data: res,
  });
};

///////////////////////// GET DATA BY ID /////////////////////////
export const getInvoices = async (id: number) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("SELECT * FROM invoice WHERE id = ?").get(id);

  db.close();

  return Promise.resolve({
    success: true,
    msg: "All Data Displayed",
    data: res,
  });
};

///////////////////////// UPDATE DATA BY ID /////////////////////////
export const updateInvoices = async (invoice: any) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  try {
    const res = db
      .prepare(
        "UPDATE invoice SET invoiceDate=?, cusName=?, cusAddress=?, cusNumber=?, itemName=?, itemPrice=?, itemQty=?, itemAmount=? WHERE id=?"
      )
      .run(
        invoice.invoiceDate,
        invoice.cusName,
        invoice.cusAddress,
        invoice.cusNumber,
        invoice.itemName,
        invoice.itemPrice,
        invoice.itemQty,
        invoice.itemAmount,
        invoice.id
      );

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
export const deleteInvoicesId = async (id: any) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("DELETE FROM invoice WHERE id = ?").run(id);

  db.close();

  return Promise.resolve({
    success: true,
    msg: "Data Deleted",
    data: res,
  });
};
