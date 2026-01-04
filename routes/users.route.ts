import { Hono } from "hono";
import { registerUser, getUserById, updateUserProfile, deleteUser } from "@/services/user";

export const usersRoute = new Hono()
  .post("/", async (c) => {
    try {
      const input = await c.req.json();
      const user = await registerUser(input);
      return c.json(user, 201);
    } catch (error) {
      return c.json({ error: (error as Error).message }, 400);
    }
  })
  .get("/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const user = await getUserById(id);
      return c.json(user);
    } catch (error) {
      return c.json({ error: (error as Error).message }, 404);
    }
  })
  .patch("/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const input = await c.req.json();
      const user = await updateUserProfile(id, input);
      return c.json(user);
    } catch (error) {
      return c.json({ error: (error as Error).message }, 400);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      await deleteUser(id);
      return c.json({ message: "User deleted successfully" });
    } catch (error) {
      return c.json({ error: (error as Error).message }, 400);
    }
  });
