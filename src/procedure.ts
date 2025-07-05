import { z, ZodTypeAny } from "zod";
import { ProcedureDef } from "./router";

export function procedure() {
  return {
    input<TInputSchema extends ZodTypeAny>(schema: TInputSchema) {
      return {
        query<TOutput>(
          resolve: (opts: { input: z.infer<TInputSchema> }) => TOutput
        ): ProcedureDef<z.infer<TInputSchema>, TOutput> {
          return {
            input: schema,
            resolve,
            type: "query",
          };
        },
        mutation<TOutput>(
          resolve: (opts: { input: z.infer<TInputSchema> }) => TOutput
        ): ProcedureDef<z.infer<TInputSchema>, TOutput> {
          return {
            input: schema,
            resolve,
            type: "mutation",
          };
        },
      };
    },
  };
}
