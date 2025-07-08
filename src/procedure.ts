import { z, ZodTypeAny, ZodType } from "zod";
import { ProcedureDef, ResolveArgs } from "./router";

export function procedure<TInputSchema extends ZodType>(schema?: TInputSchema) {
  const inputSchema = (schema ?? z.void()) as TInputSchema;

  return {
    input<TNewInputSchema extends ZodType>(new_schema: TNewInputSchema) {
      return procedure<TNewInputSchema>(new_schema);
    },
    query: makeProcedure<TInputSchema>("query", inputSchema),
    mutation: makeProcedure<TInputSchema>("mutation", inputSchema),
  };
}

function makeProcedure<TInputSchema extends ZodType>(
  type: "query" | "mutation",
  schema: TInputSchema
) {
  return function <TOutput>(
    fn: (args: ResolveArgs<TInputSchema>) => TOutput
  ): ProcedureDef<TInputSchema, TOutput> {
    return {
      input: schema,
      resolve: fn,
      type: type,
    };
  };
}
