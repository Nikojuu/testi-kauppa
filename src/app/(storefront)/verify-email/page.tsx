import { redirect } from "next/navigation";
import Link from "next/link";

interface VerificationResult {
  success?: boolean;
  message?: string;
  error?: string;
}

interface VerifyEmailPageProps {
  searchParams: { token?: string };
}

async function verifyEmail(token: string): Promise<VerificationResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/verify-email?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );

    const data: VerificationResult = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || "Sähköposti vahvistettu onnistuneesti!",
      };
    } else {
      return {
        success: false,
        error: data.error || "Sähköpostin vahvistus epäonnistui.",
      };
    }
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      error: "Tapahtui odottamaton virhe. Yritä uudelleen.",
    };
  }
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  const { token } = searchParams;

  // Redirect to home if no token provided
  if (!token) {
    redirect("/");
  }

  // Perform verification
  const result = await verifyEmail(token);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sähköpostin vahvistus
          </h2>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {result.success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Vahvistus onnistui!
              </h3>
              <p className="text-gray-600 mb-4">{result.message}</p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Voit nyt kirjautua sisään tilillesi.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Siirry kirjautumaan
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Vahvistus epäonnistui
              </h3>
              <p className="text-gray-600 mb-4">{result.error}</p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Mahdolliset syyt:</p>
                <ul className="text-sm text-gray-500 text-left list-disc list-inside space-y-1">
                  <li>Linkki on vanhentunut (24 tunnin kuluttua)</li>
                  <li>Linkki on jo käytetty</li>
                  <li>Virheellinen tai vaurioitunut linkki</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Takaisin kirjautumaan jossa lähetämme uuden vahvistuslinkin
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm">
            ← Takaisin etusivulle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
