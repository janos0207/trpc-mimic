import { z, ZodTypeAny } from "zod";

type ProcedureDef = {
  input: ZodTypeAny;
  resolve: (args: { input: any }) => any;
};

type Router = {
  procedure: (name: string, def: ProcedureDef) => Router;
  call: (name: string, input: any) => any;
};

export function createRouter(): Router {
  const procedures: Record<string, ProcedureDef> = {};

  return {
    procedure(name, def) {
      procedures[name] = def;
      return this;
    },
    call(name, input) {
      const proc = procedures[name];
      if (!proc) throw new Error(`Procedure "${name}" not found`);
      const parsedInput = proc.input.parse(input);
      return proc.resolve({ input: parsedInput });
    },
  };
}
