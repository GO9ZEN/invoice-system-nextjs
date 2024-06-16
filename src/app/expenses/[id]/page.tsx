"use client";

import { ExpensesForm } from "@/components/expenses/expensesForm";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: number } }) {
  useEffect(() => {
    console.log("id is ", params.id);
  }, []);

  return (
    <div className="flex bg-blue-100 w-full md:h-[100vh] h-full">
      <ExpensesForm expensesid={params.id} />
    </div>
  );
}
