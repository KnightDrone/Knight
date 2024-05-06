import { User } from "../src/types/User";

describe("User", () => {
  it("should create a new User", () => {
    const user = new User("1", "test@example.com", "Test User");
    expect(user.getId()).toBe("1");
    expect(user.getEmail()).toBe("test@example.com");
    expect(user.getDisplayName()).toBe("Test User");
  });

  it("should set and get email", () => {
    const user = new User("1", "test@example.com");
    user.setEmail("new@example.com");
    expect(user.getEmail()).toBe("new@example.com");
  });

  it("should set and get display name", () => {
    const user = new User("1", "test@example.com");
    user.setDisplayName("New User");
    expect(user.getDisplayName()).toBe("New User");
  });

  it("should get id", () => {
    const user = new User("1", "test@example.com");
    expect(user.getId()).toBe("1");
  });
});
