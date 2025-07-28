import { z } from "zod";
import { createRouter, Router, ResolveArgs } from "./router";
import { procedure } from "./procedure";

const hello = procedure()
  .input(z.object({ name: z.string() }))
  .query((input) => `Hello, ${input.name}`);

// 型がちゃんと出る？
type InputType = z.infer<(typeof hello)["input"]>; // ← ここが `{ name: string }` になっている？

// Router に渡した時点で消えてない？
const router = createRouter().procedure("hello", hello);

// router.call("hello", { x: 1 }); // ← TypeScript は通してしまっていないか？

const hello2 = procedure()
  .input(z.object({ name: z.string() }))
  .query((input) => `Hello, ${input.name}`);
const hello3 = procedure().query(() => "Bye bye");

const router2 = createRouter()
  .procedure("hello", hello2)
  .procedure("bye", hello3);

router2.call("hello", { name: "Alice" });
router2.call("bye");
