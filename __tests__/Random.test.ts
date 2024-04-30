import { secureRandom } from "../src/utils/random";

describe("Random", () => {
  it("should return a random number between 0 and 1", () => {
    const random = secureRandom();
    expect(random).toBeGreaterThanOrEqual(0);
    expect(random).toBeLessThan(1);
  });
});
