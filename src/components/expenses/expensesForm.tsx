"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import {
  deleteExpensesDetailsId,
  deleteExpenseId,
  getExpense,
  getExpensesList,
  updateExpense,
  insertExpenses,
} from "./expensesActions";

import { useRouter } from "next/navigation";
import ExpensesHeader from "./expensesHeader";
import ExpensesFooter from "./expensesFooter";

const expensesFormSchema = z.object({
  id: z.coerce.number().optional(),
  date: z.coerce.string(),
  expensesdetails: z
    .array(
      z.object({
        name: z.string(),
        price: z.coerce.number(),
        qty: z.coerce.number(),
        subtotal: z.coerce.number().optional(),
      })
    )
    .optional(),
});

type Expensesprops = {
  expensesid?: number;
};

export function ExpensesForm({ expensesid = 0 }: Expensesprops) {
  const [id, setid] = useState<number>(0);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof expensesFormSchema>>({
    resolver: zodResolver(expensesFormSchema),
  });

  const { setValue } = form;

  const { fields, append, remove } = useFieldArray({
    name: "expensesdetails",
    control: form.control,
  });

  //////////////////////////////////////////////////
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setNumber1(0);
    setNumber2(0);
  }, []);

  useEffect(() => {
    setTotal(number1 * number2);
  }, [number1, number2]);
  //////////////////////////////////////////////////

  ///////////////////////////////////// INVOICE ACTIONS - START /////////////////////////////////////
  useEffect(() => {
    setid(expensesid);
    if (expensesid != 0) {
      const fetchSt = async () => {
        const res = await getExpense(expensesid);
        console.log(res);
        if (res.data) {
          form.reset(res.data);
        }
      };

      fetchSt();
    }
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof expensesFormSchema>) {
    console.log("values", values);
    if (id == 0) {
      insertExpenses(values)
        .then((res) => {
          console.log(res);
          setid(res.lastInsertRowid);
          setValue("id", res.lastInsertRowid);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      updateExpense(values)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async function handleDelete() {
    deleteExpenseId(id)
      .then((res) => {
        console.log(res);
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async function handleDeleteDetails() {
    deleteExpensesDetailsId(id)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  ///////////////////////////////////// INVOICE ACTIONS - END /////////////////////////////////////

  return (
    <Form {...form}>
      <div className="w-full space-y-8 md:ml-[50px] ml-[30px] md:mr-[50px] mr-[30px] mt-6 mb-6">
        <div className="bg-slate-100 w-full p-5">
          <ExpensesHeader />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 md:ml-[50px] ml-[30px] md:mr-[50px] mr-[30px] mt-6 mb-6"
          >
            <div className="space-y-8">
              <div className="flex-col md:flex md:flex-row md:justify-between space-y-8 md:space-y-0">
                <div className="md:flex-row flex-row md:space-y-8 space-y-8">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Id</FormLabel>
                        <FormControl>
                          <Input
                            className="md:w-[300px] w-[200px]"
                            placeholder="Id"
                            type="number"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expenses Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "md:w-[300px] w-[200px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date: any) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <Table>
                  <TableCaption>Add Expenses Details</TableCaption>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead>Expenses Details</TableHead>
                      <TableHead>Price Per Unit (Rs.)</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {/* {fields.map((field, index) => {return (<div key={index}>{"sss"}</div>)})} */}
                    {fields.map((field, index) => {
                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              // name="itemName"
                              name={`expensesdetails.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className=""
                                      placeholder="Expense Name"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`expensesdetails.${index}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className=""
                                      placeholder="Expense Price Per Unit"
                                      type="number"
                                      defaultValue={number1}
                                      onChangeCapture={(e) =>
                                        setNumber1(+e.currentTarget.value)
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`expensesdetails.${index}.qty`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className=""
                                      placeholder="Quantity"
                                      type="number"
                                      defaultValue={number2}
                                      onChangeCapture={(e) =>
                                        setNumber2(+e.currentTarget.value)
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`expensesdetails.${index}.subtotal`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className=""
                                      placeholder="Subtotal"
                                      type="number"
                                      defaultValue={total}
                                      // value={total}
                                      // disabled
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                remove(index);
                                handleDeleteDetails;
                              }}
                            >
                              Remove Number
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <Button
                      type="button"
                      // variant="default"
                      size="sm"
                      className="mt-2 bg-green-600"
                      onClick={() =>
                        append({
                          name: "",
                          price: 0,
                          qty: 0,
                          subtotal: 0,
                        })
                      }
                    >
                      Add Number
                    </Button>
                  </TableBody>
                </Table>
              </div>
            </div>

            <ExpensesFooter />

            <div className="flex gap-8">
              <Button type="submit">{id == 0 ? "Add" : "Update"}</Button>

              {id == 0 ? null : (
                <Button
                  type="button"
                  className="bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Form>
  );
}
