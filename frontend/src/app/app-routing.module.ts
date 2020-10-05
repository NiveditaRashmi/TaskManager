import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewListComponent } from './pages/new-list/new-list.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';

const routes: Routes = [
  {path: '', redirectTo: 'lists', pathMatch: 'full'},
  { path: 'newList', component: NewListComponent},
  { path: 'lists', component: TaskViewComponent},
  { path: 'lists/:listId', component: TaskViewComponent},
  { path: 'lists/:listId/newTask', component: NewTaskComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
