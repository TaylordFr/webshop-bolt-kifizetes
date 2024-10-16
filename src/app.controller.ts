import { Controller, Get, Render, Body, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Orderdto } from './orderData.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private orders: Orderdto[] = [
    {
      nev: "Gipsz Jakab",
      bankszamlaszam: "12345678-90123456-78901234",
      aszf_fogadva: true,
    },
    {
      nev: "Bekre Pál",
      bankszamlaszam: "33345575-11222133-77700012",
      aszf_fogadva: true,
    }
  ]

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('order')
  @Render('orderForm')
  getOrder() {
    return {
      data: {},
      errors: []
    }
  }

  @Post('order')
  postOrder(@Body() orderDto: Orderdto, @Res() response: Response) {
    const errors: string[] = [];

    if (!orderDto.nev || !orderDto.bankszamlaszam || !orderDto.aszf_fogadva) {
      errors.push("Minden mezőt meg kell adni!");
    }
    if (orderDto.nev && !(/^[A-Za-z]$/.test(orderDto.nev))) {
      errors.push("A név nem megfelelő formátumú!");
    }

    if (orderDto.bankszamlaszam) {
      if (!(/^\d{8}-\d{8}$/.test(orderDto.bankszamlaszam) || /^\d{8}-\d{8}-\d{8}$/.test(orderDto.bankszamlaszam))) {
        errors.push("A bankszámlaszám nem megfelelő formátumú!");
      }
    }

    const newOrder = {
      nev: orderDto.nev,
      bankszamlaszam: orderDto.bankszamlaszam,
      orderDto: orderDto.aszf_fogadva
    }

    if (errors.length > 0) {
      return response.render('orderForm', {
        errors,
        data: orderDto
      });
    }


    this.orders.push(newOrder);
    response.redirect(303, 'Ordersuccess');
  }

  @Get('OrderSuccess')
  @Render('success')
  orderSuccess() {
    return {
      count: this.orders.length
    }
  }
}
