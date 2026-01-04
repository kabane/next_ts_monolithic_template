import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { MySqlContainer } from "@testcontainers/mysql";
import type { StartedMySqlContainer } from "@testcontainers/mysql";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as userService from "@/app/services/user";

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

describe("User Service", () => {
  test("should register a new user", async () => {
    const user = await userService.registerUser({
      name: "Service Test User",
      email: "service@example.com",
    });

    expect(user?.name).toBe("Service Test User");
    expect(user?.email).toBe("service@example.com");
  });

  test("should throw error when registering duplicate email", async () => {
    await userService.registerUser({
      name: "Duplicate User",
      email: "duplicate@example.com",
    });

    await expect(
      userService.registerUser({
        name: "Another User",
        email: "duplicate@example.com",
      })
    ).rejects.toThrow("User with this email already exists");
  });

  test("should get user by id", async () => {
    const newUser = await userService.registerUser({
      name: "Get Test User",
      email: "gettest@example.com",
    });

    const user = await userService.getUserById(newUser!.id);
    expect(user.name).toBe("Get Test User");
  });

  test("should update user profile", async () => {
    const newUser = await userService.registerUser({
      name: "Update Test User",
      email: "updatetest@example.com",
    });

    const updatedUser = await userService.updateUserProfile(newUser!.id, {
      name: "Updated Name",
    });

    expect(updatedUser?.name).toBe("Updated Name");
  });

  test("should delete user", async () => {
    const newUser = await userService.registerUser({
      name: "Delete Test User",
      email: "deletetest@example.com",
    });

    await userService.deleteUser(newUser!.id);

    await expect(userService.getUserById(newUser!.id)).rejects.toThrow(
      "User not found"
    );
  });
});
