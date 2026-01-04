import * as userRepo from "@/repositories/user";

export async function registerUser(input: { name: string; email: string }) {
  // ビジネスルール検証
  const existingUser = await userRepo.findUserByEmail(input.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // リポジトリ呼び出し
  const userId = await userRepo.createUser(input);
  return userRepo.findUserById(userId);
}

export async function getUserById(id: number) {
  const user = await userRepo.findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function updateUserProfile(
  id: number,
  data: Partial<{ name: string; email: string }>
) {
  // 存在確認
  const user = await userRepo.findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  // メールアドレス変更の場合、重複チェック
  if (data.email && data.email !== user.email) {
    const existingUser = await userRepo.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }
  }

  await userRepo.updateUser(id, data);
  return userRepo.findUserById(id);
}

export async function deleteUser(id: number) {
  const user = await userRepo.findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  await userRepo.deleteUser(id);
}
