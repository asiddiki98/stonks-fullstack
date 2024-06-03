import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Channel({ profile }: { profile: any }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const follow = async () => {
    "use server";

    if (!user) {
      return redirect("/login");
    }
  };
  return (
    <li className="flex items-center justify-between w-full py-4">
      <h2>{profile.email}</h2>
      <form action={follow}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Follow
        </button>
      </form>
    </li>
  );
}
