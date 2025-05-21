import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ethers,
  zeroPadValue,
  encodeBytes32String,
  isBytesLike,
  toUtf8Bytes,
  parseEther,
  formatEther,
  LogDescription,
} from 'ethers';
import { abi, address } from '../../../abis/Calculator.json';

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey!, this.provider);
    this.contract = new ethers.Contract(address, abi, this.signer);
  }

  zeroPadValue32(data: string) {
    return zeroPadValue(data, 32);
  }

  encodeBytes32String(data: string) {
    return encodeBytes32String(data);
  }

  isBytesLike(data: string) {
    return isBytesLike(data);
  }

  toUtf8Bytes(data: string) {
    return toUtf8Bytes(data);
  }

  parseEther(data: string) {
    return parseEther(data);
  }

  formatEther(data: bigint) {
    return formatEther(data);
  }

  // 위 코드는 지우지 마세요.

  async calculate(a: number, b: number, operation: string) {
    // Todo: calculate 함수를 실행하여 Calculate 이벤트의 값을 받아 리턴합니다.
    // ⚠️ 리턴은 Number 단위로 리턴합니다.

    const tx = await this.contract.calculate(a, b, operation);
    const receipt = await tx.wait();

    // 이 트랜젝션에서 발생한 모든 이벤트 로그를 하나씩 검사한다. 
    for (const log of receipt.logs) {
      try {
        // interface.parseLog(log)는 스마트 컨트랙트의 인터페이스(ABI) 를 사용해서 이벤트 로그를 사람이 읽을 수 있는 구조로 변환하는 함수
        // this.contract.interface는 그 컨트랙트의 ABI를 기반으로 생성된 Interface 객체
        const parsedLog = this.contract.interface.parseLog(log) as LogDescription;
        if (parsedLog.name === 'Calculate') {
          const result = parsedLog.args.result;
          return Number(result);
        }
      } catch (error) {
        continue;
      }
    }
  }

  async getLastResult(address: string) {
    // Todo: getLastResult의 값을 리턴합니다.
    return await this.contract.getLastResult(address);
  }

  async getHistoryLength(address: string) {
    // Todo: getHistoryLength의 값을 리턴합니다.
    return await this.contract.getHistoryLength(address);
  }

  async getHistoryItem(address: string) {
    // Todo: getHistoryItem의 값을 리턴합니다.
    return await this.contract.getHistoryItem(address);
  }
}
