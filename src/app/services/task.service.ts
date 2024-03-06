import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskList: any[] = [];
  readonly storageKey: string = 'taskList';

  constructor() { }

  save(taskDescription: string, callback?: () => void) {
    let task = { description: taskDescription, status: 'Pending' }
    this.list();

    this.taskList.push(task);
    localStorage.setItem(this.storageKey, JSON.stringify(this.taskList));

    if (callback) {
      callback();
    }
  }

  list() {
    let value = localStorage.getItem(this.storageKey);
    if (value) {
      this.taskList = JSON.parse(value);
    } else {
      this.taskList = [];
    }

    return this.taskList;

  }

  delete(taskDescription: string) {
    this.taskList = this.taskList.filter(task => task.description != taskDescription);
    localStorage.setItem(this.storageKey, JSON.stringify(this.taskList));
  }

  setStatus(taskDescription: string, status: string) {
    console.log(taskDescription);
    let idx = this.taskList.findIndex(task => task.description == taskDescription);
    console.log(idx);

    if (idx >= 0) {
      this.taskList[idx].status = status;
      localStorage.setItem(this.storageKey, JSON.stringify(this.taskList));
    }
  }
}
