export default defineEventHandler(async (event) => {
  try {
    // Your API logic or event handling
  } catch (error) {
    console.error("🔴 Server Error:", error);
    return createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
