import { z, ZodTypeAny, ZodVoid, ZodType } from "zod";

export type ResolveArgs<T extends ZodTypeAny> = [T] extends [ZodVoid]
  ? void
  : z.infer<T>;

export type ResolveFn<T extends ZodType, TOut> = [T] extends [ZodVoid]
  ? () => TOut
  : (args: z.infer<T>) => TOut;

export type ProcedureDef<TInputSchema extends ZodType, TOutput = any> = {
  input: TInputSchema;
  resolve: ResolveFn<TInputSchema, TOutput>;
  type: "query" | "mutation";
};

type ProcedureMap = Record<string, ProcedureDef<ZodType, any>>;

export type Router<P extends ProcedureMap> = {
  procedure: <K extends string, D extends ProcedureDef<any, any>>(
    name: K,
    def: D
  ) => Router<P & { [Key in K]: D }>;

  call: <K extends keyof P>(
    name: K,
    ...args: Parameters<P[K]["resolve"]>
  ) => ReturnType<P[K]["resolve"]>;
};

function createRouterWith<P extends ProcedureMap>(procedures: P): Router<P> {
  return {
    procedure<Name extends keyof P, Def extends ProcedureDef<ZodType, any>>(
      name: Name,
      def: Def
    ): Router<P & { [K in Name]: Def }> {
      const next_procedures = {
        ...procedures,
        [name]: def,
      } as P & { [K in Name]: Def };
      return createRouterWith(next_procedures);
    },

    call<K extends keyof P>(
      name: K,
      ...args: Parameters<P[K]["resolve"]>
    ): ReturnType<P[K]["resolve"]> {
      const proc = procedures[name];
      if (!proc) throw new Error(`Procedure "${String(name)}" not found`);
      console.log(`Calling [${proc.type}] procedure: ${String(name)}`);

      const resolve = proc.resolve as (
        args: Parameters<P[K]["resolve"]>
      ) => ReturnType<P[K]["resolve"]>;

      return resolve(args);
    },
  };
}

export function createRouter(): Router<{}> {
  return createRouterWith<{}>({});
}
