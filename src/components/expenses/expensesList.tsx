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
import { getExpensesList } from "./expensesActions";
import { useRouter } from "next/navigation";

export default function ExpensesList() {
  const [expenseseData, setExpenseseData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSt = async () => {
      const res = await getExpensesList();
      console.log(res);
      setExpenseseData(res.data);
    };

    fetchSt();
  }, []);

  const handleGetId = (id: number) => {
    console.log("id is", id);

    router.push("/expenses/" + id);
  };

  return (
    <div>
      <Table>
        <TableCaption>Expenses SAVED DATA</TableCaption>
        <TableHeader className="bg-slate-100">
          <TableRow>
            <TableHead className="w-[100px]">Expense Id</TableHead>
            <TableHead>Expense Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-slate-100">
          {expenseseData.map((row: any) => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              onClick={() => handleGetId(row.id)}
            >
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell className="font-medium">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
