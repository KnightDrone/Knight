export function secureRandom() {
  const buffer = new Uint32Array(1); // Create a typed array of 32-bit integers of length 1
  window.crypto.getRandomValues(buffer); // Populate the array with cryptographically secure random numbers
  return buffer[0] / (0xffffffff + 1); // Normalize to [0, 1] by dividing by 2^32 - 1
}
