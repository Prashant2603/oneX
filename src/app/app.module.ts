import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DataFilterPipe } from './data-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    DataFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    TabsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
