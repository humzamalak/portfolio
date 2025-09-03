import ProfilePicture from "@/components/ProfilePicture";

export default function TestProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-8">Profile Picture Test</h1>
        <ProfilePicture />
        <p className="mt-4 text-gray-600">This should show the modern rounded rectangle style</p>
      </div>
    </div>
  );
}
