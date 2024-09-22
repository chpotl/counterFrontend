import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const [contractData, setContractData] = useState<null | {
    counter: number;
    address: Address;
    owner: Address;
  }>();

  const [balance, setBalance] = useState<number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(Address.parse("EQBkdPw9lFR_iIUrYtOznJPobORBB9up5V4QlBFkhM0bo8CL"));
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      setContractData({
        counter: val.number,
        address: val.address,
        owner: val.owner,
      });
      const balance = await mainContract.getBalance();
      setBalance(balance);
      await sleep(5000);
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    ...contractData,
    balance,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano("0.05"), 5n);
    },
    sendDeposit: () => {
      return mainContract?.sendDeposit(sender, toNano("0.1"));
    },
    sendWithdraw: () => {
      return mainContract?.sendWithdraw(sender, toNano("0.05"), toNano("0.1"));
    },
  };
}
