import React from 'react';
import { UserProfile } from '../../components/profile';

const ProfilePage: React.FC = () => {
  const handleProfileSave = (data: any) => {
    console.log('Profile saved:', data);
    // Handle profile save logic
  };

  return (
    <div className="min-h-screen bg-neutral-gray">
      <UserProfile onSave={handleProfileSave} />
    </div>
  );
};

export default ProfilePage;






