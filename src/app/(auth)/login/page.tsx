import { User } from "@/app/utils/types";
import LoginForm from "@/components/Auth/Loginform";
import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { user }: { user: User | null } = await getUser();

  if (user) {
    redirect("/mypage");
  }

  return <LoginForm />;
};

export default LoginPage;
