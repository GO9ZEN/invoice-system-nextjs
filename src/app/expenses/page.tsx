import ExpensesList from "@/components/expenses/expensesList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex bg-blue-100 w-full md:h-[100vh] h-full">
      <div className="space-y-8 md:ml-[50px] ml-[30px] md:mr-[50px] mr-[30px] mt-6 mb-6">
        <ExpensesList />
        <Link href="/expenses/add-new-expense">
          <Button className="bg-green-600">Add New Expense</Button>
        </Link>
      </div>
    </div>
  );
}
