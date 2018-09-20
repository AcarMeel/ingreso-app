import { Routes } from "@angular/router";
import { StadisticComponent } from "../ingreso/stadistic/stadistic.component";
import { IngresoComponent } from "../ingreso/ingreso.component";
import { DetailComponent } from "../ingreso/detail/detail.component";

export const dashboardRoutes: Routes = [
    { path: '', component: StadisticComponent },
    { path: 'ingreso', component: IngresoComponent },
    { path: 'detail', component: DetailComponent }
];