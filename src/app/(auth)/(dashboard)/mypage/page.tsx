import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const MyPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login"); // Redirect to login if not authenticated
  }

  return (
    <div className="w-full mt-24 md:mt-48">
      <h1>My Page</h1>
      {user && (
        <div>
          <p>Welcome, {user.firstName}!</p>
        </div>
      )}
    </div>
  );
};

export default MyPage;
