import { User } from "@/app/utils/types";
import RegisterForm from "@/components/Auth/RegisterForm";
import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const { user }: { user: User | null } = await getUser();

  if (user) {
    redirect("/mypage");
  }
  return <RegisterForm />;
};

export default RegisterPage;
