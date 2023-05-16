import React from "react";
import Image from "next/image";
import { useCoinbaseWallet, useMetamask } from "@thirdweb-dev/react";

function Login() {
  const connectWithMetamask = useMetamask();
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <Image
          src=""
          alt="Login Pic"
          width={224}
          height={224}
          className="rounded-full mb-10 "
        />
        <h1 className="text-white text-bold text-6xl">THE ZELOTH DRAW</h1>
        <h2 className="text-white mt-4">
          Get Started By Logging in with your Wallet
        </h2>
        <button
          onClick={connectWithMetamask}
          className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold"
        >
          Login with MetaMask
        </button>
        <button
          onClick={useCoinbaseWallet()}
          className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold text-[#0454fc]"
        >
          Login with Coinbase
        </button>
      </div>
    </div>
  );
}

export default Login;
