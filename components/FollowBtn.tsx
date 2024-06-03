"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function FollowBtn({
  profile,
  currentUserId,
}: {
  profile: any;
  currentUserId: string | null;
}) {
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing);

  const supabase = createClient();
  const follow = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentUserId) {
      window.location.href = "/login"; // Redirect to login if not authenticated
      return;
    }

    const { error } = await supabase.from("follows").insert({
      follower_id: currentUserId,
      follows_id: profile.id,
    });

    if (error) {
      console.error("Error following user:", error);
    } else {
      setIsFollowing(true);
    }
  };

  const unfollow = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentUserId) {
      window.location.href = "/login"; // Redirect to login if not authenticated
      return;
    }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", currentUserId)
      .eq("follows_id", profile.id);

    if (error) {
      console.error("Error unfollowing user:", error);
    } else {
      setIsFollowing(false);
    }
  };

  return (
    <form onSubmit={isFollowing ? unfollow : follow}>
      <button
        type="submit"
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </form>
  );
}
