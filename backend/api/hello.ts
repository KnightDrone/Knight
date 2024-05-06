export function GET(request) {
  return new Response(
    `Backend API is running! Hello from region ${process.env.VERCEL_REGION}`
  );
}
