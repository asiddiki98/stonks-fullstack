import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/SubmitButton";

export default async function CompleteSignup({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   if (!user) {
  //     return redirect("/login");
  //   }
  const completeProfile = async (formData: FormData) => {
    "use server";

    const username = formData.get("username") as string;
    const emailNotification = formData.get("emailNotification") === "on";
    const pushNotification = formData.get("pushNotification") === "on";

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // update user profile
    const { error } = await supabase.from("profiles").upsert({
      id: user!.id,
      username,
      notification_preferences: {
        email: emailNotification,
        push: pushNotification,
      },
    });

    if (error) {
      if (error.code === "23505") {
        return redirect("/complete-signup?message=Username already exists");
      }
      console.error("Error updating profile:", error);
      return redirect("/complete-signup?message=Could not update profile");
    }

    return redirect("/");
  };

  return (
    <div className="flex justify-center pt-8">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground max-w-96">
        <label className="text-md" htmlFor="username">
          Username
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="username"
          placeholder="username"
          required
        />
        <div className="flex items-center py-2 gap-4">
          <input
            type="checkbox"
            name="emailNotification"
            id="emailNotification"
            defaultChecked
          />
          <label className="text-md" htmlFor="emailNotification">
            Email Notifications
          </label>
        </div>
        <div className="flex items-center py-2 gap-4">
          <input
            type="checkbox"
            name="pushNotification"
            id="pushNotification"
            defaultChecked
          />
          <label className="text-md" htmlFor="pushNotification">
            Push Notifications
          </label>
        </div>

        <SubmitButton
          formAction={completeProfile}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Completing profile..."
        >
          Complete Profile
        </SubmitButton>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
