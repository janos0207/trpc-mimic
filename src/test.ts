import { z } from "zod";
import { createRouter, Router, ResolveArgs } from "./router";
import { procedure } from "./procedure";

// const hello = procedure()
//   .input(z.object({ name: z.string() }))
//   .query(({ input }) => `Hello, ${input.name}`);

// // 型がちゃんと出る？
// type InputType = z.infer<(typeof hello)["input"]>; // ← ここが `{ name: string }` になっている？

// // Router に渡した時点で消えてない？
// const router = createRouter().procedure("hello", hello);

// router.call("hello", { input: { x: 1 } }); // ← TypeScript は通してしまっていないか？

const hello = procedure()
  .input(z.object({ name: z.string() }))
  .query(({ input }) => `Hello, ${input.name}`);

const router = createRouter().procedure("hello", hello);

type ProcType = typeof router extends Router<infer P> ? P : never;
type HelloInputType = ProcType["hello"]["input"];
type ResolvedArgs = ResolveArgs<HelloInputType>;

// router.call("hello", { input: 1 });
