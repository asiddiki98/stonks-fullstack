"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import FollowBtn from "@/components/FollowBtn";
import ChatBox from "@/components/ChatBox";
import sendNotification from "@/lib/sendNotification";

type Profile = {
  id: string;
  username: string;
  email: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  isFollowing?: boolean;
  is_streaming: boolean;
};

export default function Profile() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { profileId } = params;

  const router = useRouter();

  const isUser = profile?.id === user?.id;

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // get users profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      setUser(profile || { id: "public" });
      setIsStreaming(profile?.is_streaming || false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        router.push("/404");
        return;
      }

      if (user?.id !== "public") {
        const { data: following, error: followError } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", user.id)
          .eq("follows_id", profileId);

        if (followError) {
          console.error("Error fetching follow status:", followError);
        } else if (following && following.length > 0) {
          profile.isFollowing = true;
        }
      }

      setProfile(profile);
      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [profileId, user, supabase, router]);

  const startStream = async (event: React.FormEvent) => {
    event.preventDefault();

    const { error } = await supabase
      .from("profiles")
      .update({ is_streaming: true })
      .eq("id", user.id);

    if (error) {
      console.error("Error starting stream:", error);
    } else {
      setIsStreaming(true);
    }

    sendNotification(user.id, user.username);
  };

  const endStream = async (event: React.FormEvent) => {
    event.preventDefault();

    const { error } = await supabase
      .from("profiles")
      .update({ is_streaming: false })
      .eq("id", user.id);

    if (error) {
      console.error("Error ending stream:", error);
    } else {
      setIsStreaming(false);
    }
  };

  if (loading) {
    return <p className="flex w-full justify-center">Loading...</p>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <h1 className="text-2xl font-bold">{profile?.username}</h1>
      {!isUser && <FollowBtn currentUserId={user?.id} profile={profile} />}
      {isUser && (
        <form onSubmit={isStreaming ? endStream : startStream}>
          <button
            type="submit"
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          >
            {isStreaming ? "End Stream" : "Start Stream"}
          </button>
        </form>
      )}
      <div className="flex gap-4 max-h-[315px]">
        {isUser && isStreaming && (
          <div>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {!isUser && profile?.is_streaming && (
          <div>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {((isUser && isStreaming) || (!isUser && profile?.is_streaming)) && (
          <ChatBox streamerProfile={isUser ? user : profile} />
        )}
      </div>{" "}
    </div>
  );
}
