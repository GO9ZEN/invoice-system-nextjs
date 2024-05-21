"use client";

import { InvoiceForm } from "@/components/invoice/invoiceForm";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: number } }) {
  useEffect(() => {
    console.log("id is ", params.id);
  }, []);

  return (
    <div className="flex bg-blue-100 w-full md:h-[100vh] h-full">
      <InvoiceForm invoiceid={params.id} />
    </div>
  );
}
