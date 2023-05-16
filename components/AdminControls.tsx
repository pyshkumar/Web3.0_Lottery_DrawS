import React from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowUturnDownIcon,
} from "@heroicons/react/24/solid";
import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { on } from "stream";

function AdminControls() {
  const { contract } = useContract(
    "0x118D8dd080b215c7443aF016Be63496ebb3E37f1"
  );

  const { data: totalCommisison } = useContractRead(
    contract,
    "operatorTotalCommisison"
  );

  const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");
  const { mutateAsync: restartDraw } = useContractWrite(
    contract,
    "restartDraw"
  );
  const { mutateAsync: WithdrawCommission } = useContractWrite(
    contract,
    "WithdrawCommission"
  );
  const { mutateAsync: DrawWinnerTicket } = useContractWrite(
    contract,
    "DrawWinnerTicket"
  );

  const drawWinner = async () => {
    const notification = toast.loading("Picking a Lucky Winner....");

    try {
      const data = await DrawWinnerTicket([{}]);

      toast.success("A Winner has been selected!", {
        id: notification,
      });
      console.info("contract call success", data);
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });

      console.error("contarct call failure", err);
    }
  };

  const onWithdrawnCommission = async () => {
    const notification = toast.loading("Withdrawing commission....");

    try {
      const data = await WithdrawCommission([{}]);

      toast.success("Your Commission has been withdrawn successfully!", {
        id: notification,
      });
      console.info("contract call success", data);
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });

      console.error("contarct call failure", err);
    }
  };

  const onRestartDraw = async () => {
    const notification = toast.loading("Restarting draw....");

    try {
      const data = await restartDraw([{}]);

      toast.success("Draw restarted successfully!", {
        id: notification,
      });
      console.info("contract call success", data);
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });

      console.error("contarct call failure", err);
    }
  };

  const onRefundAll = async () => {
    const notification = toast.loading("Refunding all....");

    try {
      const data = await RefundAll([{}]);

      toast.success("All refunded successfully!", {
        id: notification,
      });
      console.info("contract call success", data);
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });

      console.error("contarct call failure", err);
    }
  };

  return (
    <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border">
      <h2 className="font-bold py-2">Admin Controls</h2>
      {/* <p className="mb-5">
        Total Commission to be withdrawn:{" "}
        {totalCommisison &&
          ethers.utils.formatEther(totalCommisison?.toString())}{" "}
        MATIC
      </p> */}

      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <button onClick={drawWinner} className="admin-button">
          <StarIcon className="h-6 mx-auto mb-2" />
          Draw Winner
        </button>
        <button onClick={onWithdrawnCommission} className="admin-button">
          <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
          Withdraw Commission
        </button>
        <button onClick={onRestartDraw} className="admin-button">
          <ArrowPathIcon className="h-6 mx-auto mb-2" />
          Reset Draw
        </button>
        <button onClick={onRefundAll} className="admin-button">
          <ArrowUturnDownIcon className="h-6 mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  );
}

export default AdminControls;
