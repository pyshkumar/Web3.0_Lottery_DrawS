import React from "react";
import Image from "next/image";
import PropagateLoader from "react-spinners/PropagateLoader";

function Loading() {
  return (
    <div className="bg-[#091B18] h-screen flex flex-col items-center justify-center">
      <div className="flex items-center space-x-2 mb-10">
        <Image
          src=""
          alt="Loading Pic"
          width={80}
          height={80}
          className="rounded-full"
        />
        <h1 className="text-lg text-white font-bold ">
          Loading the ZELOTH DRAW
        </h1>
        <br />
      </div>
      <PropagateLoader color="white" size={30} />
    </div>
  );
}

export default Loading;
