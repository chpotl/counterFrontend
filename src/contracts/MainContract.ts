import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export type MainContractConfig = {
  number: bigint;
  address: Address;
  owner: Address;
};

export function mainContractConfigToCell(config: MainContractConfig): Cell {
  return beginCell().storeUint(config.number, 32).storeAddress(config.address).storeAddress(config.owner).endCell();
}

export class MainContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {
      code: Cell;
      data: Cell;
    }
  ) {}

  static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0): MainContract {
    const data = mainContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new MainContract(address, init);
  }

  async sendInternalMessage(provider: ContractProvider, sender: Sender, value: bigint, number: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(number, 32).endCell(),
    });
  }

  async sendIncrement(provider: ContractProvider, sender: Sender, value: bigint, increment: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(1, 32).storeUint(increment, 32).endCell(),
    });
  }

  async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(2, 32).endCell(),
    });
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(2, 32).endCell(),
    });
  }

  async sendNoCodeDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendWithdraw(provider: ContractProvider, sender: Sender, value: bigint, amount: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(3, 32).storeCoins(amount).endCell(),
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_storage_data", []);
    console.log(stack);
    return { number: stack.readNumber(), address: stack.readAddress(), owner: stack.readAddress() };
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return stack.readNumber();
  }
}
