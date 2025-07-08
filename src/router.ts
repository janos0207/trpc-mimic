import { z, ZodAny, ZodTypeAny, ZodUndefined, ZodVoid } from "zod";

export type ResolveArgs<T extends ZodTypeAny> = [T] extends [ZodVoid]
  ? {}
  : { input: z.infer<T> };

export type ProcedureDef<
  TInputSchema extends ZodTypeAny | ZodVoid,
  TOutput = any
> = {
  input: TInputSchema;
  resolve: (args: ResolveArgs<TInputSchema>) => TOutput;
  type: "query" | "mutation";
};

type ProcedureMap = Record<string, ProcedureDef<any, any>>;

export type Router<P extends Record<string, ProcedureDef<any, any>>> = {
  procedure: <K extends string, D extends ProcedureDef<any, any>>(
    name: K,
    def: D
  ) => Router<P & { [Key in K]: D }>;
  call: <K extends keyof P, InputSchema extends z.infer<P[K]["input"]>>(
    name: K,
    args: [P[K]["input"]] extends [ZodVoid] ? {} : { input: InputSchema }
  ) => ReturnType<P[K]["resolve"]>;
};

function createRouterWith<P extends Record<string, ProcedureDef<any, any>>>(
  procedures: P
): Router<P> {
  return {
    procedure<Name extends keyof P, Def extends ProcedureDef<any, any>>(
      name: Name,
      def: Def
    ): Router<P & { [K in Name]: Def }> {
      const next_procedures = {
        ...procedures,
        [name]: def,
      } as P & { [K in Name]: Def };
      return createRouterWith(next_procedures);
    },
    call<K extends keyof P, InputSchema extends z.infer<P[K]["input"]>>(
      name: K,
      args: [P[K]["input"]] extends [ZodVoid] ? {} : { input: InputSchema }
    ): ReturnType<P[K]["resolve"]> {
      const proc = procedures[name];
      if (!proc) throw new Error(`Procedure "${String(name)}" not found`);
      console.log(`Calling [${proc.type}] procedure: ${String(name)}`);

      if (proc.input instanceof ZodVoid) {
        return proc.resolve({});
      }
      return proc.resolve(args);
    },
  };
}

export function createRouter(): Router<{}> {
  return createRouterWith<{}>({});
}
