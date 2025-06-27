import { User } from "@/app/utils/types";
import LoginForm from "@/components/Auth/Loginform";
import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: { returnUrl?: string };
}) => {
  const { user }: { user: User | null } = await getUser();

  if (user) {
    // If user is already logged in, redirect to return URL or mypage
    const redirectTo = searchParams.returnUrl
      ? decodeURIComponent(searchParams.returnUrl)
      : "/mypage";
    redirect(redirectTo);
  }

  return <LoginForm />;
};

export default LoginPage;
