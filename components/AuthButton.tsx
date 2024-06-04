import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Notifications from "@/components/Notifications";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // update profile.is_online to false
    const { error } = await supabase
      .from("profiles")
      .update({ is_online: false })
      .eq("id", user!.id);

    if (error) {
      console.error("Error updating profile:", error);
    }
    await supabase.auth.signOut();
    return redirect("/login");
  };

  const openProfile = async () => {
    "use server";

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return redirect(`/profile/${user!.id}`);
  };

  const profile = await supabase.from("profiles").select().single();

  return user ? (
    <div className="flex items-center gap-4 ">
      <Link href={`/profile/${user.id}`} className="">
        Profile
      </Link>
      <Notifications />
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-4 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover w-fit"
    >
      Login
    </Link>
  );
}
