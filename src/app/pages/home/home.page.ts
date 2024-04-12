import { Component, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { BatteryInfo, Device, DeviceInfo } from '@capacitor/device'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('taskSlidingList') taskSlidingList?: IonList;
  public info?: DeviceInfo;
  public batteryInfo?: BatteryInfo;

  ngOnInit() {
    this.logDeviceInfo();
    this.logBatteryInfo();
  }

  logDeviceInfo = async () => {
    this.info = await Device.getInfo();

    console.log(this.info);
  };

  logBatteryInfo = async () => {
    this.batteryInfo = await Device.getBatteryInfo();

    console.log(this.batteryInfo);
  };



  addTaskButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Add',
      role: 'confirm',
      handler: (form: any) => {
        this.addTask(form);
      },
    },
  ];

  addTaskInputs = [
    {
      name: 'task',
      placeholder: 'Task description',
    }
  ];

  taskList: any[] = [];


  constructor(private taskService: TaskService) { }

  ionViewDidEnter() {
    this.listTasks();
  }

  addTask(form: any) {
    this.taskService.save(form.task, () => {
      this.listTasks();
    });
  }

  listTasks() {
    if (this.taskSlidingList) {
      this.taskSlidingList.closeSlidingItems();
    }
    this.taskList = this.taskService.list();
  }

  deleteTask(task: any) {
    this.taskService.delete(task.description);
    this.listTasks();
  }

  checkTask(task: any) {
    this.taskService.setStatus(task.description, 'Done');
    this.listTasks();
  }

  uncheckTask(task: any) {
    this.taskService.setStatus(task.description, 'Pending');
    this.listTasks();
  }



}
