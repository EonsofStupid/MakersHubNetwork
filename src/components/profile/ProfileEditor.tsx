import { ProfileForm } from "./ProfileForm";
import { ProfilePicture } from "./ProfilePicture";
import { ProfileDetails } from "./ProfileDetails";

export function ProfileEditor() {
  return (
    <div className="space-y-6">
      <ProfilePicture />
      <ProfileForm />
      <ProfileDetails />
    </div>
  );
}