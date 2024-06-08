"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getInvoiceList } from "./invoiceActions";
import { useRouter } from "next/navigation";

export default function InvoiceList() {
  const [invoiceData, setInvoiceData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSt = async () => {
      const res = await getInvoiceList();
      console.log(res);
      setInvoiceData(res.data);
    };

    fetchSt();
  }, []);

  const handleGetId = (id: number) => {
    console.log("id is", id);

    router.push("/invoices/" + id);
  };

  return (
    <div>
      <Table>
        <TableCaption>Invoices SAVED DATA</TableCaption>
        <TableHeader className="bg-slate-100">
          <TableRow>
            <TableHead className="w-[100px]">Invoice Id</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Customer Address</TableHead>
            <TableHead>Customer Number</TableHead>
            <TableHead>Details Id</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-slate-100">
          {invoiceData.map((row: any) => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              onClick={() => handleGetId(row.id)}
            >
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell className="font-medium">{row.invoiceDate}</TableCell>
              <TableCell>{row.cusName}</TableCell>
              <TableCell>{row.cusAddress}</TableCell>
              <TableCell className="text-right">{row.cusNumber}</TableCell>
              <TableCell className="text-right">{row.itemPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
