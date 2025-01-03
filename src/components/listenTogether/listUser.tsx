import React, { useEffect, useState } from "react";
import Image from "next/image";
import songimg from "@/assets/img/songs.png";
import { Divide } from "lucide-react";
import { UserRoom } from "@/types/interfaces";


function ListUser({ listUser, permit }: { listUser: User[], permit: boolean }) {
  const [users, setUsers] = useState<UserRoom[]>(listUser);
  useEffect(() => {
    setUsers(listUser);
    console.log("listUser", listUser);
    // console.log("thay đổi list users");
    console.log("permit", permit);
  }, [listUser]);
  return (
    <div className="w-1/4 h-screen flex flex-col gap-6 relative bg-secondColorBg rounded-lg">
      {users.length > 0 ? (
        <div className="w-full flex flex-col gap-4 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-darkBlue scrollbar-track-black">
          {users.map((item, index) => (
            
            <div key={index} className="flex gap-2 items-center" 
            // style={{ backgroundColor: item.host ? 'red' : 'transparent' }} // Kiểm tra item.host
            >
              <Image
                src={songimg}
                alt="song"
                width={36}
                height={36}
                className="rounded-full"
              />
              <h4 className="font-bold mb-1 hover:underline line-clamp-1 text-white/80 truncate">
                {item.username}
                {item.host && <span className="ml-2 p-1 text-white bg-primaryColorBlueHover text-sm font-normal rounded-xl">host</span>}
              </h4>

            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No user</p>
        </div>
      )}
    </div>
  );
}

export default ListUser;
