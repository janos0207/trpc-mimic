import { z, ZodTypeAny } from "zod";
import { ProcedureDef, ResolveFn } from "./router";

export function procedure<TInputSchema extends ZodTypeAny>(
  schema?: TInputSchema
) {
  const inputSchema = (schema ?? z.void()) as TInputSchema;

  return {
    input<TNewInputSchema extends ZodTypeAny>(new_schema: TNewInputSchema) {
      return procedure<TNewInputSchema>(new_schema);
    },
    query: makeProcedure<TInputSchema>("query", inputSchema),
    mutation: makeProcedure<TInputSchema>("mutation", inputSchema),
  };
}

function makeProcedure<TInputSchema extends ZodTypeAny>(
  type: "query" | "mutation",
  schema: TInputSchema
) {
  return function <TOutput>(
    fn: ResolveFn<TInputSchema, TOutput>
  ): ProcedureDef<TInputSchema, TOutput> {
    return {
      input: schema,
      resolve: fn,
      type: type,
    };
  };
}
