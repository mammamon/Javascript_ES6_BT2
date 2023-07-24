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
      if (typeof ListPerson.instance === 'object') {
        return ListPerson.instance;
      }
  
      this.list = [];
      ListPerson.instance = this;
      return this;
    }
  
    addPerson(person) {
      this.list.push(person);
    }
  
    read(index) {
      return this.list[index];
    }
  
    update(code, person) {
      const index = this.list.findIndex((p) => p._code === code);
      if (index !== -1) {
        this.list[index] = person;
      }
    }
  
    delete(code) {
      const index = this.list.findIndex((p) => p._code === code);
      if (index !== -1) {
        this.list.splice(index, 1);
      }
    }
  
    getList() {
      return this.list;
    }
  }
