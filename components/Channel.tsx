import Link from "next/link";
import FollowBtn from "./FollowBtn";

export default function Channel({
  profile,
  currentUserId,
}: {
  profile: any;
  currentUserId: string | null;
}) {
  return (
    <li className="flex items-center justify-between w-full py-4">
      <Link href={`/profile/${profile.id}`}>
        <h2>{profile.username}</h2>
      </Link>
      <FollowBtn profile={profile} currentUserId={currentUserId} />
    </li>
  );
}
