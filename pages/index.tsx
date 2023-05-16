import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Login from "../components/Login";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CountdownTimer from "@/components/CountdownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "@/components/AdminControls";

const Home: NextPage = () => {
  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const { contract, isLoading } = useContract(
    ""
  );

  const { data: remainingTickets } = useContractRead(
    contract,
    "RemainingTickets"
  );

  const { data: currentWinningReward } = useContractRead(
    contract,
    "CurrentWinningReward"
  );

  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");

  const { data: expiration } = useContractRead(contract, "expiration");

  const { data: tickets } = useContractRead(contract, "getTickets");

  const { data: ticketCommision } = useContractRead(
    contract,
    "ticketCommission"
  );

  const { data: winnings } = useContractRead(
    contract,
    "getWinningsForAddress",
    address
  );

  const { data: lastWinner } = useContractRead(contract, "lastWinner");

  const { data: lastWinnerAmount } = useContractRead(
    contract,
    "lastWinnerAmount"
  );

  const { data: isLotteryOperator } = useContractRead(
    contract,
    "lotteryOperator"
  );

  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");

  const { mutateAsync: WithdrawWinnings } = useContractWrite(
    contract,
    "WithdrawWinnings"
  );

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );

    setUserTickets(noOfUserTickets);
  }, [tickets, address]);

  const handleClick = async () => {
    if (!ticketPrice) {
      toast.error("System Down. Try again later", {
        duration: 2000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      return;
    }

    const notification = toast.loading("Buying your tickets....");

    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);

      toast.success("Tickets purchased successfully", {
        id: notification,
      });

      console.info("contract call success", data);
    } catch (err) {
      toast.error("Whoops something went wrong", {
        id: notification,
      });

      console.error("Contract call failure", err);
    }
  };

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Wihdrawing winnings... ");

    try {
      const data = await WithdrawWinnings([{}]);

      toast.success("Winnings withdraw successfully", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops somehting went wron!", {
        id: notification,
      });

      console.error("contract call failure");
    }
  };

  if (isLoading) return <Loading />;
  if (!address) return <Login />;

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Zeloth Draw</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-1">
        <Header />
        <Marquee className="bg-[#0A1F1C] p-5 mb-5" gradient={false} speed={100}>
          <div className="flex space-x-2 mx-10 ">
            <h4 className="text-white font-bold ">
              Last Winner: ... {lastWinner?.toString()}
            </h4>
            <h4 className="text-white font-bold ">
              Previous Winnings: ...
              {lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}
              MATIC
            </h4>
          </div>
        </Marquee>

        {winnings > 0 && (
          <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
            <button
              onClick={onWithdrawWinnings}
              className="p-5 bg-gradient-to-b from from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full"
            >
              <p className="font-bold">Winner Winner Chicken Dinner!</p>
              <p>
                Total Winnings ={" "}
                {ethers.utils.formatEther(winnings?.toString())} MATIC
              </p>
              <br />
              <p className="font-semibold"> Click here to withdraw </p>
            </button>
          </div>
        )}

        {isLotteryOperator === address && (
          <div className="flex justify-center">
            <AdminControls />
          </div>
        )}

        <div className="spcae-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5 ">
          <div className="stats-container">
            <h1 className="text-5xl text-white font-semibold text-center">
              The Next Draw
            </h1>
            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className="text-sm ">Total Pool</h2>
                <p className="text-xl ">
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward.toString()
                    )}{" "}
                  MATIC
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Tickets Remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            {/* CountDown Timer */}
            <div className="mt-5 mb-3">
              {" "}
              <CountdownTimer />{" "}
            </div>
          </div>
          <div className="stats-container space-y-2 ">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white pb-2 space-x-2">
                <h2>Price per ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice.toString())}{" "}
                  MATIC
                </p>
              //</div>
              <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] p-4 ">
                <p>TICKETS</p>
                <input
                  className="flex w-full bg-transparent text-right outline-none "
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                  <p>Total cost of tickets</p>
                  <p>0.999</p>
                </div>
                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>Service fees</p>
                  <p>
                    {ticketCommision &&
                      ethers.utils.formatEther(ticketCommision.toString())}{" "}
                    MATIC
                  </p>
                </div>
                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>
              <button
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainingTickets?.toNumber() == 0
                }
                onClick={handleClick}
                className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md font-semibold text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-600 disabled:cursor-not-allowed"
              >
                Buy {quantity} for{" "}
                {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) *
                    quantity}{" "}
                MATIC
              </button>
            </div>
            {userTickets > 0 && (
              <div className="stats">
                <p className="text-lg mb-2">
                  You have {userTickets} Tickets in this draw
                </p>
                <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                  {Array(userTickets)
                    .fill("")
                    .map((_, index) => (
                      <p
                        key={index}
                        className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                      >
                        {index + 1}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div></div>
      </div>
      <footer className="border-t border-emerald-500/20 flex items-center text-white justify-between p-5">
        <img
          src="data:image/png;base64,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"
          className="h-10 w-10 filter hue-rotate-90 opacity-20 rounded-full"
          alt="Warning"
        />

        <p className="text-xs text-emerald-900 pl-5 ">ZELOTH @2023 @Piyush</p>
      </footer>
    </div>
  );
};

export default Home;
