class Person {
  static usedCodes = new Set();
  static usedEmails = new Set();
  constructor({ _code, _name, _address, _email }) {
    this.code = _code;
    this.name = _name;
    this.address = _address;
    this.email = _email;
  }
}

class Student extends Person {
  constructor({ _code, _name, _address, _email, _math, _physics, _chemistry }) {
    super({ _code, _name, _address, _email });
    this.math = _math;
    this.physics = _physics;
    this.chemistry = _chemistry;
  }
  // method tính điểm trung bình
  avgScore() {
    return (this.math + this.physics + this.chemistry) / 3;
  }
}

class Employee extends Person {
  constructor({ _code, _name, _address, _email, _day, _wage }) {
    super({ _code, _name, _address, _email });
    this.day = _day;
    this.wage = _wage;
  }
  // method tính lương
  salary() {
    return this.day * this.wage;
  }
}

class Customer extends Person {
  constructor({ _code, _name, _address, _email, _company, _invoice, _rating }) {
    super({ _code, _name, _address, _email });
    this.company = _company;
    this.invoice = _invoice;
    this.rating = _rating;
  }
}

class ListPerson {
  constructor() {
    // chặn không cho lặp lại instant
    if (listPersonInstance) {
      return listPersonInstance;
    }
    this.list = this.loadFromLocalStorage();
    listPersonInstance = this;
  }
  // thêm người dùng
  addPerson(newPerson) {
    this.list.push(newPerson);
    this.saveToLocalStorage();
  }
  // cập nhật người dùng
  update(code, person) {
    const index = this.list.findIndex((p) => p._code === code);
    if (index !== -1) {
      this.list[index] = person;
      this.saveToLocalStorage();
    }
  }
  // xóa người dùng
  deletePerson(code) {
    const personIndex = this.list.findIndex((person) => person.code === code);
    if (personIndex !== -1) {
      this.list.splice(personIndex, 1);
      this.saveToLocalStorage();
    }
  }
  // lấy danh sách
  getList() {
    return this.list;
  }
  // lọc người dùng theo đối tượng
  filter(selectedType) {
    let filteredList = [];
    if (selectedType === "all") {
      filteredList = [...this.list];
    } else {
      filteredList = this.list.filter((person) => {
        if (
          (selectedType === "student" && person instanceof Student) ||
          (selectedType === "employee" && person instanceof Employee) ||
          (selectedType === "customer" && person instanceof Customer)
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    return { list: filteredList };
  }
  // lưu danh sách vào local
  saveToLocalStorage() {
    localStorage.setItem('people', JSON.stringify(this.list));
  }
  // load danh sách từ local
  loadFromLocalStorage() {
    const people = JSON.parse(localStorage.getItem('people')) || [];
    return people.map((person) => {
      if (person.math !== undefined) {
        return new Student({
          _code: person.code,
          _name: person.name,
          _address: person.address,
          _email: person.email,
          _math: person.math,
          _physics: person.physics,
          _chemistry: person.chemistry
        });
      } else if (person.day !== undefined) {
        return new Employee({
          _code: person.code,
          _name: person.name,
          _address: person.address,
          _email: person.email,
          _day: person.day,
          _wage: person.wage
        });
      } else if (person.company !== undefined) {
        return new Customer({
          _code: person.code,
          _name: person.name,
          _address: person.address,
          _email: person.email,
          _company: person.company,
          _invoice: person.invoice,
          _rating: person.rating
        });
      } else {
        return new Person({
          _code: person.code,
          _name: person.name,
          _address: person.address,
          _email: person.email
        });
      }
    });
  }
}




