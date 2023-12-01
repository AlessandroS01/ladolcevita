import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../shared/services/page-info/home/home.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(
    private homeService : HomeService
  ) {

  }

  ngOnInit(): void {
  }



}
