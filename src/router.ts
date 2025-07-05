import { z, ZodTypeAny } from "zod";

export type ProcedureDef<TInput = any, TOutput = any> = {
  input: ZodTypeAny;
  resolve: (args: { input: TInput }) => TOutput;
  type: "query" | "mutation";
};

type ProcedureMap = Record<string, ProcedureDef>;

type Router<P extends ProcedureMap> = {
  procedure: <K extends string, D extends ProcedureDef>(
    name: K,
    def: D
  ) => Router<P & { [Key in K]: D }>;
  call: <K extends keyof P>(
    name: K,
    input: unknown
  ) => ReturnType<P[K]["resolve"]>;
};

function createRouterWith<P extends Record<string, ProcedureDef>>(
  procedures: P
): Router<P> {
  return {
    procedure<Name extends keyof P, Def extends ProcedureDef>(
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
      input: Parameters<P[K]["resolve"]>[0]["input"]
    ): ReturnType<P[K]["resolve"]> {
      const proc = procedures[name];
      if (!proc) throw new Error(`Procedure "${String(name)}" not found`);
      console.log(`Calling [${proc.type}] procedure: ${String(name)}`);

      const parsedInput = proc.input.parse(input);
      return proc.resolve({ input: parsedInput });
    },
  };
}

export function createRouter(): Router<{}> {
  return createRouterWith<{}>({});
}
