import * as Crypto from "expo-crypto";

/**
 * Generates a random number in the range [0, 1] using a secure random number generator.
 * @returns A random number in the range [0, 1].
 */
export function secureRandom() {
  const randomBytesBuffer = Crypto.getRandomBytes(4);
  const dataView = new DataView(randomBytesBuffer.buffer);
  const num = dataView.getUint32(0);

  // Normalize to [0, 1] by dividing by the maximum possible value (2^32 - 1)
  return num / (0xffffffff + 1);
}
