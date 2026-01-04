import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/db/schema";

export async function findUserById(id: number) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function findUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] ?? null;
}

export async function createUser(data: { name: string; email: string }) {
  const result = await db.insert(users).values(data);
  return Number(result[0].insertId);
}

export async function updateUser(
  id: number,
  data: Partial<{ name: string; email: string }>
) {
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id));
}
