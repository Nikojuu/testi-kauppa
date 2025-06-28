import EditCustomerForm from "@/components/CustomerDashboard/EditCustomerForm";
import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const MyinfoPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl">
      <EditCustomerForm user={user} />
    </div>
  );
};

export default MyinfoPage;
