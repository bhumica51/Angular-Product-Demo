import { AfterViewInit, Component, ViewChild, ChangeDetectorRef, ViewChildren, ElementRef, QueryList, HostListener } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { httpservices } from "../../shared/httpservices.service";
import { RouterModule, Router } from '@angular/router';
import { product } from 'src/shared/product';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from 'underscore';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  productList: product[] = [];
  diffDays: number;
  noMoreProduct = false;
  page = {
    _page: 1,
    _limit: 15,
    _sort: ''
  }

  constructor(public http: httpservices, private cdRef: ChangeDetectorRef, public datepipe: DatePipe, private spinner: NgxSpinnerService) {
    this.getProductList();
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached()) {
      this.spinner.show();
      this.page._page = this.page._page + 1;
      this.getProductList();
    }
  }
  sortBy(event) {
    this.spinner.show();
    this.page._sort = event.target.value
    this.productList = [];
    this.getProductList();
  }

  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  }

  getProductList() {

    this.http.getProductList(this.page).subscribe((data) => {
      this.spinner.hide();
      if(data.length > 0) {
        this.noMoreProduct = false;
      if (this.productList === [] ) {
        this.productList = data;
      } else {
        for (var i = 0; i < data.length; i++)
          this.productList.push(data[i]);
      }
    } else {
       this.noMoreProduct = true;
    }
    })
  }


  calculateDays(sentDate) {
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    return this.diffDays;
  }
}

