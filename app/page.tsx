import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Channel from "@/components/Channel";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log();

  // get all profiles
  let profiles, errors;
  if (!user) {
    const result = await supabase.from("profiles").select("*");

    profiles = result.data;
    errors = result.error;
  } else {
    const result = await supabase
      .from("profiles")
      .select("*")
      .neq("id", user.id);

    profiles = result.data;
    errors = result.error;
  }

  return (
    <main className="flex-1 w-full flex flex-col gap-20 items-center">
      <section className="w-full px-[20rem] py-4">
        {profiles ? (
          <ul>
            {profiles.map((profile: any) => (
              <Channel key={profile.id} profile={profile} />
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </section>
    </main>
  );
}
