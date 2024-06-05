"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Channel from "@/components/Channel";

export default function Index() {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        setUser("public");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      let profilesData: any = [];
      let error = null;

      if (user === "public") {
        const result = await supabase.from("profiles").select("*");
        profilesData = result.data;
        error = result.error;
      } else {
        const result = await supabase
          .from("profiles")
          .select("*")
          .neq("id", user.id);
        profilesData = result.data;
        error = result.error;

        const { data: following, error: followError } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", user.id);

        if (profilesData) {
          if (followError) {
            console.error("Error fetching follows:", followError);
          } else {
            profilesData = profilesData.map((profile: any) => {
              const isFollowing = following?.some(
                (follow) => follow.follows_id === profile.id
              );
              return { ...profile, isFollowing: isFollowing || false };
            });
          }
        }
      }

      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        setProfiles(profilesData);
      }

      setLoading(false);
    };

    if (user) {
      fetchProfiles();
    }
  }, [user]);

  if (loading) {
    return <p className="flex w-full justify-center">Loading...</p>;
  }

  return (
    <main className="flex-1 w-full flex flex-col gap-20 items-center">
      <section className="w-full px-[20rem] py-4">
        <ul className="flex flex-col gap-4">
          {profiles.map((profile: any) => (
            <Channel
              currentUserId={user?.id || null}
              key={profile.id}
              profile={profile}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
