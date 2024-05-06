import { User } from "../src/types/User";

describe("User", () => {
  it("should create a new User", () => {
    const user = new User(
      "1",
      "test@example.com",
      false,
      "Test User",
      new Date(),
      "../assets/images/defaultProfile.png"
    );
    expect(user.getId()).toBe("1");
    expect(user.getEmail()).toBe("test@example.com");
    expect(user.getDisplayName()).toBe("Test User");
  });

  it("should set and get email", () => {
    const user = new User(
      "1",
      "test@example.com",
      false,
      "Test User",
      new Date(),
      "../assets/images/defaultProfile.png"
    );
    user.setEmail("new@example.com");
    expect(user.getEmail()).toBe("new@example.com");
  });

  it("should set and get display name", () => {
    const user = new User(
      "1",
      "test@example.com",
      false,
      "Test User",
      new Date(),
      "../assets/images/defaultProfile.png"
    );
    user.setDisplayName("New User");
    expect(user.getDisplayName()).toBe("New User");
  });

  it("should get id", () => {
    const user = new User(
      "1",
      "test@example.com",
      false,
      "Test User",
      new Date(),
      "../assets/images/defaultProfile.png"
    );
    expect(user.getId()).toBe("1");
  });

  it("should get and set date of birth", () => {
    const user = new User(
      "1",
      "test@example.com",
      false,
      "Test User",
      new Date(),
      "../assets/images/defaultProfile.png"
    );
    const date = new Date();
    user.setBirthday(date);
    expect(user.getBirthday()).toBe(date);
  });

  it("should get operator status", () => {
    const user = new User(
      "1",
      "test@example.com",
      false,
      "Test User",
      new Date(),
      "../assets/images/defaultProfile.png"
    );
    expect(user.getIsOperator()).toBe(false);
  });

  it("should get profile photo URL", () => {
    const user = new User(
      "1",
      "test@example.com",
      false,
      "Test User",
      new Date(),
      "../assets/images/defaultProfile.png"
    );
    expect(user.getPhotoURL()).toBe("../assets/images/defaultProfile.png");
  });
});
