import { z, ZodType, ZodTypeAny } from "zod";

export function procedure() {
  let inputSchema: ZodTypeAny | null = null;
  let handler: ((input: any) => any) | null = null;

  return {
    input<T extends ZodTypeAny>(schema: T) {
      inputSchema = schema;
      return this;
    },
    query(fn: (args: { input: any }) => any) {
      handler = fn;
      return {
        call(input: unknown) {
          const parsed = inputSchema?.parse(input);
          return handler!({ input: parsed });
        },
      };
    },
  };
}
