const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
  List = 'list',
  Add = 'add',
  Remove = 'remove',
  Quit = 'quit',
  Edit = 'edit',
}

type InquirerAnswers = {
  action: Action;
};

enum MessageVariant {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

type User = {
  name: string;
  age: number;
};

class Message {
  constructor(private content: string) {}
  public show() {
    console.log(this.content);
  }
  public capitalize() {
    this.content =
      this.content.charAt(0).toUpperCase() +
      this.content.slice(1).toLowerCase();
    return this.content;
  }
  public toUpperCase() {
    this.content = this.content.toUpperCase();
    return this.content;
  }
  public toLowerCase() {
    this.content = this.content.toLowerCase();
    return this.content.toLowerCase();
  }
  public static showColorized(variant: MessageVariant, message: string) {
    switch (variant) {
      case MessageVariant.Success:
        consola.success(message);
        break;
      case MessageVariant.Error:
        consola.error(message);
        break;
      case MessageVariant.Info:
        consola.info(message);
        break;
    }
  }
}

class UsersData {
  private data: User[] = [];

  public showAll() {
    if (this.data.length > 0) {
      Message.showColorized(MessageVariant.Info, 'Users data ');
      console.table(this.data);
    } else {
      Message.showColorized(MessageVariant.Info, 'No data...');
    }
  }
  public add(user: User): void {
    if (
      typeof user.name === 'string' &&
      typeof user.age === 'number' &&
      user.age > 0 &&
      user.name.trim().length > 0
    ) {
      this.data.push(user);
      Message.showColorized(
        MessageVariant.Success,
        'User has been successfully added!'
      );
    } else {
      Message.showColorized(MessageVariant.Error, 'Wrong data!');
    }
  }
  public remove(name: string): void {
    const index = this.data.findIndex((user) => user.name === name);
    if (index !== -1) {
      this.data.splice(index, 1);
      Message.showColorized(MessageVariant.Success, 'User deleted!');
    } else {
      Message.showColorized(MessageVariant.Error, 'User not found...');
    }
  }
  public edit(name: string, newData: User): void {
    const index = this.data.findIndex((user) => user.name === name);
    if (index !== -1) {
      this.data[index] = newData;
      Message.showColorized(MessageVariant.Success, 'User updated!');
    } else {
      Message.showColorized(MessageVariant.Error, 'User not found...');
    }
  }
}

const users = new UsersData();
console.log('\n');
console.info('???? Welcome to the UsersApp!');
console.log('====================================');
Message.showColorized(MessageVariant.Info, 'Available actions');
console.log('\n');
console.log('list – show all users');
console.log('add – add new user to the list');
console.log('remove – remove user from the list');
console.log('quit – quit the app');
console.log('\n');

const startApp = () => {
  inquirer
    .prompt([
      {
        name: 'action',
        type: 'input',
        message: 'How can I help you?',
      },
    ])
    .then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name',
            },
            {
              name: 'age',
              type: 'number',
              message: 'Enter age',
            },
          ]);
          users.add(user);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name',
            },
          ]);
          users.remove(name.name);
          break;
        case Action.Edit:
          const userToEdit = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name',
            },
            {
              name: 'newName',
              type: 'input',
              message: 'Enter new name',
            },
            {
              name: 'newAge',
              type: 'number',
              message: 'Enter new age',
            },
          ]);
          users.edit(userToEdit.name, {
            name: userToEdit.newName,
            age: userToEdit.newAge,
          });
          break;
        case Action.Quit:
          Message.showColorized(MessageVariant.Info, 'Bye bye!');
          return;
        default:
          Message.showColorized(MessageVariant.Error, 'Command not found');
      }

      startApp();
    });
};
startApp();
