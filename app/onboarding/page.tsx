import { updateProfile } from "@/actions/onboarding";
import { requireUser } from "@/lib/authGuard";

const OnboardingPage = async () => {
  await requireUser(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-gray-900/5">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please tell us your name to use our service.
          </p>
        </div>

        <form action={updateProfile} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Display name
            </label>
            <div className="mt-2">
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                maxLength={50}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Start
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default OnboardingPage;
