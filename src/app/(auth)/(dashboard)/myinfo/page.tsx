import EditCustomerForm from "@/components/CustomerDashboard/EditCustomerForm";
import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const MyinfoPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <EditCustomerForm user={user} />;
};

export default MyinfoPage;
