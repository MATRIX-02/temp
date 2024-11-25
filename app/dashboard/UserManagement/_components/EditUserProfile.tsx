import { LuPen, LuUser } from 'react-icons/lu';
import React from 'react';

function EditUserProfile({
  profilePicture,
  clickInputField,
  active
}: {
  profilePicture: string | undefined;
  clickInputField: () => void;
  active: boolean;
}) {
  return (
    <>
      {profilePicture ? (
        <div className="group relative">
          <div
            onClick={clickInputField}
            className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200"
          >
            <img
              src={profilePicture}
              alt="Profile"
              className="h-16 w-16 object-cover"
            />
            {/* Overlay with edit icon */}
            <div className="absolute inset-0 flex h-16 w-16 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <LuPen className="h-5 w-5 text-white" />
            </div>
          </div>
          <span
            className={`absolute right-0 top-0 block h-4 w-4 rounded-full  border-2 border-white ${
              active === true ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></span>
        </div>
      ) : (
        <div className="group relative">
          <div
            onClick={clickInputField}
            className=" flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-200 "
          >
            <LuUser className="h-12 w-12 text-gray-600" />
            <div className="absolute inset-0 flex h-16 w-16 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <LuPen className="h-5 w-5 text-white" />
            </div>
          </div>
          <span
            className={`absolute right-0 top-0 block h-4 w-4 rounded-full  border-2 border-white ${
              active === true ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></span>
        </div>
      )}
    </>
  );
}

export default EditUserProfile;
