import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { CalculatorService } from '../service/calculator.service';
import { CalculateDto } from '../dto/calculate.dto';

@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  /*
    Todo: 다음의 기능에 따른 Restful API를 재량것 만들어주시기 바랍니다.

    - calculate 실행 API(CalculateDto를 사용해야 합니다.)
    - 마지막 계산 결과 가져오기(getLastResult)
    - 계산한 횟수 가져오기(getHistoryLength)
    - 계산한 히스토리 가져오기(getHistoryItem)
  */

  @Post()
  async calculate(@Body() calculateDto: CalculateDto) {
    return await this.calculatorService.calculate(
      calculateDto.a,
      calculateDto.b,
      calculateDto.operation
    );
  }

  @Get('/:address/history/last')
  async getLastResult(@Param('address') address: string) {
    return await this.calculatorService.getLastResult(address);
  }

  @Get('/:address/history/length')
  async getHistoryLength(@Param('address') address: string) {
    return await this.calculatorService.getHistoryLength(address);
  }

  @Get('/:address/history')
  async getHistoryItem(@Param('address') address: string) {
    return await this.calculatorService.getHistoryItem(address);
  }
}
