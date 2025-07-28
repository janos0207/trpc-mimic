import { z, ZodVoid } from "zod";
import { expectTypeOf } from "vitest";

import { ProcedureDef } from "../../src/router";
import { procedure } from "../../src/procedure";

function test_infer_type_of_resolve() {
  const helloInput = z.object({ name: z.string() });

  const hello: ProcedureDef<typeof helloInput, string> = procedure()
    .input(helloInput)
    .query((input) => `Hello, ${input.name}`);

  expectTypeOf(hello.resolve).parameter(0).toEqualTypeOf<{ name: string }>();
  expectTypeOf(hello.resolve).returns.toEqualTypeOf<string>();
}

function test_infer_type_of_resolve_without_input() {
  const hello: ProcedureDef<ZodVoid, string> = procedure().query(() => "pong");
  expectTypeOf(hello.resolve).parameters.toEqualTypeOf<[]>();
}

function test_infer_type_of_input() {
  const helloInput = z.object({ name: z.string() });

  const hello: ProcedureDef<typeof helloInput, string> = procedure()
    .input(helloInput)
    .query((input) => `Hello, ${input.name}`);
  type InputType = z.infer<(typeof hello)["input"]>;

  expectTypeOf(hello.resolve).parameter(0).toEqualTypeOf<InputType>();
}

test_infer_type_of_resolve();
test_infer_type_of_resolve_without_input();
test_infer_type_of_input();
