export function ProfilePicture() {
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle picture upload logic
      console.log("Picture selected:", file.name);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <img
        src="/path/to/default/profile/picture.jpg"
        alt="Profile"
        className="w-16 h-16 rounded-full"
      />
      <input type="file" onChange={handlePictureChange} className="text-sm" />
    </div>
  );
} 