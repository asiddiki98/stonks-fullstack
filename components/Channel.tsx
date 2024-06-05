import Link from "next/link";
import FollowBtn from "./FollowBtn";

export default function Channel({
  profile,
  currentUserId,
}: {
  profile: any;
  currentUserId: string | null;
}) {
  const handleChannelClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/profile/${profile.id}`;
  };
  return (
    <li
      className="flex items-center justify-between w-full py-4 border rounded-md px-4 hover:opacity-30 cursor-pointer"
      onClick={handleChannelClick}
    >
      <h2>{profile.username}</h2>
      <FollowBtn profile={profile} currentUserId={currentUserId} />
    </li>
  );
}
