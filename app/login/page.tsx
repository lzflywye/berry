import Link from "next/link";
import { redirect } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Cancelled.",
  callback_failed: "Login process failed. Please try again.",
  missing_verifier: "Session is invalid. Please enable Cookie.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const LoginPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  if (!error) {
    redirect("/api/auth/login");
  }

  const errorKey = typeof error === "string" ? error : "";
  const errorMessage =
    ERROR_MESSAGES[errorKey] ?? "An unexpected error has occurred.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded shadow-md max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-red-600 mb-4">Login Error</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>

        <a
          href="/api/auth/login"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login again
        </a>

        <div className="mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            Return to top page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
