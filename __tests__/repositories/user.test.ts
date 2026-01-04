import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { MySqlContainer } from "@testcontainers/mysql";
import type { StartedMySqlContainer } from "@testcontainers/mysql";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as userRepo from "@/app/repositories/user";

let container: StartedMySqlContainer;
let connection: mysql.Pool;
let testDb: ReturnType<typeof drizzle>;

beforeAll(async () => {
  container = await new MySqlContainer().start();
  connection = mysql.createPool({
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getUserPassword(),
    database: container.getDatabase(),
  });

  testDb = drizzle(connection);

  // Override db module with test db
  const dbModule = await import("@/app/lib/db");
  (dbModule as any).db = testDb;

  // Create schema
  await connection.execute(`
    CREATE TABLE users (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}, 120000);

afterAll(async () => {
  await connection.end();
  await container.stop();
});

describe("User Repository", () => {
  test("should create and find a user", async () => {
    const userId = await userRepo.createUser({
      name: "Test User",
      email: "test@example.com",
    });

    const user = await userRepo.findUserById(userId);
    expect(user?.name).toBe("Test User");
    expect(user?.email).toBe("test@example.com");
  });

  test("should find user by email", async () => {
    await userRepo.createUser({
      name: "John Doe",
      email: "john@example.com",
    });

    const user = await userRepo.findUserByEmail("john@example.com");
    expect(user?.name).toBe("John Doe");
  });

  test("should update user", async () => {
    const userId = await userRepo.createUser({
      name: "Jane Doe",
      email: "jane@example.com",
    });

    await userRepo.updateUser(userId, { name: "Jane Smith" });

    const updatedUser = await userRepo.findUserById(userId);
    expect(updatedUser?.name).toBe("Jane Smith");
  });

  test("should delete user", async () => {
    const userId = await userRepo.createUser({
      name: "Delete User",
      email: "delete@example.com",
    });

    await userRepo.deleteUser(userId);

    const user = await userRepo.findUserById(userId);
    expect(user).toBeNull();
  });
});
