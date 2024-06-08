"use server";

import Database from "better-sqlite3";

const maindbFileName = "app.db";

///////////////////////// INSERT DATA /////////////////////////
export const insertInvoice = async (data: any) => {
  console.log("data", data);
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const stmt = db.prepare(
    "INSERT INTO invoice (invoiceDate, cusName, cusAddress, cusNumber) VALUES (?, ?, ?, ?)"
  );

  const info = stmt.run(
    data.invoiceDate,
    data.cusName,
    data.cusAddress,
    data.cusNumber
  );

  const lastInsertRowid = info.lastInsertRowid;
  //save invoice details

  for (const row of data.invoicedetails) {
    const stmt = db.prepare(
      "INSERT INTO invoicedetails (invoiceId, itemName, itemPrice, itemQty) VALUES (?, ?, ?, ?)"
    );

    const info2 = stmt.run(
      lastInsertRowid,
      row.itemName,
      row.itemPrice,
      row.itemQty
    );
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
export const getInvoiceList = async () => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("SELECT * from invoice").all();

  db.close();

  return Promise.resolve({
    success: true,
    msg: "All Data Displayed",
    data: res,
  });
};

///////////////////////// GET DATA BY ID /////////////////////////
export const getInvoice = async (id: number) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("SELECT * FROM invoice WHERE id = ?").get(id);

  const res1 = db
    .prepare("SELECT * FROM invoicedetails WHERE invoiceId = ?")
    .all(id);

  res["invoicedetails"] = res1;

  console.log("PPP", res);

  db.close();

  return Promise.resolve({
    success: true,
    msg: "All Data Displayed",
    data: res,
  });
};

///////////////////////// UPDATE DATA BY ID /////////////////////////
export const updateInvoice = async (invoice: any) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  try {
    const res = db
      .prepare(
        "UPDATE invoice SET invoiceDate=?, cusName=?, cusAddress=?, cusNumber=? WHERE id=?"
      )
      .run(
        invoice.invoiceDate,
        invoice.cusName,
        invoice.cusAddress,
        invoice.cusNumber,
        invoice.id
      );

    //delete al rows from invoicedetails table
    const res1 = db.prepare("DELETE FROM invoice WHERE id = ?").run(invoice.id);

    //insert details in a loop
    // as insert command

    for (const row of invoice.invoicedetails) {
      const stmt = db.prepare(
        "INSERT invoicedetails INTO (invoiceId, itemName, itemPrice, itemQty) VALUES (?, ?, ?, ?)"
      );

      const info2 = stmt.run(
        invoice.id,
        row.itemName,
        row.itemPrice,
        row.itemQty
      );
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

///////////////////////// DELETE DATA BY ID in INVOICEDETAILS /////////////////////////
export const deleteInvoicesDetailsId = async (id: any) => {
  const db = new Database(maindbFileName);
  db.pragma("journal_mode = WAL");

  const res = db.prepare("DELETE FROM invoicedetails WHERE id = ?").run(id);

  db.close();

  return Promise.resolve({
    success: true,
    msg: "Invoice Details Data Deleted",
    data: res,
  });
};
