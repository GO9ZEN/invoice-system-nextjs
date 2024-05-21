export default function InvoiceHeader() {
  return (
    // <div className="w-full space-y-8 md:ml-[50px] ml-[30px] md:mr-[50px] mr-[30px] mt-6 mb-6">
    // <div className="bg-slate-100 w-full p-5">
    <header className="flex w-full md:h-16 h-full items-center text-black flex-wrap">
      <div className="flex flex-col md:flex-row w-full gap-5 md:gap-0 md:justify-between md:ml-[50px] ml-[30px] md:mr-[50px] mr-[30px] mt-5 md:mt-0 mb-5 md:mb-0">
        <h1 className="text-lg md:text-xl font-semibold md:font-bold">
          COMPANY NAME
        </h1>
        <h1 className="text-lg md:text-xl font-semibold md:font-bold">
          INVOICE
        </h1>
      </div>
    </header>
    // </div>
    // </div>
  );
}
