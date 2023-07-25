let listPersonInstance;
async function getListPerson() {
  if (listPersonInstance) {
    return listPersonInstance;
  }

  try {
    const response = await fetch('/data.json?_=' + new Date().getTime());
    const data = await response.json();
    const listPerson = new ListPerson();

    data.students.forEach((student) => {
      listPerson.addPerson(new Student(student));
    });

    data.employees.forEach((employee) => {
      listPerson.addPerson(new Employee(employee));
    });

    data.customers.forEach((customer) => {
      listPerson.addPerson(new Customer(customer));
    });

    listPersonInstance = listPerson;
    return listPerson;
  } catch (error) {
    console.log(error);
  }
}

getListPerson().then((listPerson) => {
  renderListPerson(listPerson);
});


//lấy thông tin từ người dùng
const getInput = () => {
  const personType = $('.person-type:checked').val();
  const code = $('#code').val();
  const name = $('#name').val();
  const address = $('#address').val();
  const email = $('#email').val();
  const typeData = {};

  if (personType === 'student') {
    typeData.math = $('#math').val();
    typeData.physics = $('#physics').val();
    typeData.chemistry = $('#chemistry').val();
  } else if (personType === 'employee') {
    typeData.day = $('#day').val();
    typeData.wage = $('#wage').val();
  } else if (personType === 'customer') {
    typeData.company = $('#company').val();
    typeData.invoice = $('#invoice').val();
    typeData.rating = $('#rating').val();
  }

  return {
    personType,
    code,
    name,
    address,
    email,
    typeData,
  };
};


// thêm người dùng mới
async function addPerson() {
  const data = await getListPerson();
  const { personType, code, name, address, email, typeData } = getInput();
  // check valid có kiểm tra trùng code và email
  const isValid = await validateInput(data, personType, code, true, name, address, email, true, typeData);
  if (isValid) {
    let newPerson;
    if (personType === 'student') {
      newPerson = new Student({
        _code: code,
        _name: name,
        _address: address,
        _email: email,
        _math: parseFloat(typeData.math),
        _physics: parseFloat(typeData.physics),
        _chemistry: parseFloat(typeData.chemistry),
      });
    } else if (personType === 'employee') {
      newPerson = new Employee({
        _code: code,
        _name: name,
        _address: address,
        _email: email,
        _day: parseInt(typeData.day),
        _wage: parseInt(typeData.wage),
      });
    } else if (personType === 'customer') {
      newPerson = new Customer({
        _code: code,
        _name: name,
        _address: address,
        _email: email,
        _company: typeData.company,
        _invoice: parseInt(typeData.invoice),
        _rating: parseFloat(typeData.rating),
      });
    }
    if (newPerson) {
      data.addPerson(newPerson);
      renderListPerson(data);
      alert('Thêm người dùng mới thành công!');
      $('#btnClose').trigger('click');
    }
  } else {
    alert('Vui lòng kiểm tra lại thông tin nhập');
  }
}

document.getElementById('btnAdd').addEventListener('click', addPerson);


// xóa người dùng
async function deletePerson() {
  try {
    const data = await getListPerson();
    const deleteCode = $('#delete-code').val();
    const persons = data.list;
    const personIndex = persons.findIndex((person) => person.code === deleteCode);
    if (personIndex !== -1) {
      data.deletePerson(deleteCode);
      alert('Person deleted successfully!');
      $('#delete-modal').modal('hide');
      renderListPerson(data);
    } else {
      $('#delete-info').text('Person with the provided code not found.');
    }
  } catch (error) {
    console.error(error);
    $('#delete-info').text('Error occurred while retrieving data or no data found.');
  }
}
$('#btnDelete').on('click', deletePerson);



// ẩn nút cập nhật hiện nút thêm
$('#btn-modal').on('click', function () {
  $('#btnAdd').css('display', 'inline-block');
  $('#btnEdit').css('display', 'none');
});


// reset các đoạn text thông báo và input mỗi khi đóng modal
const modal = $("#input-modal")[0];
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.attributeName === "style" && $(modal).css("display") === "none") {
      $(".check", modal).html("");
      $("input[type='text'], input[type='number'], textarea", modal).val("");
    }
  });
});
observer.observe(modal, { attributes: true });


const resettypeInputs = () => {
  $('[id$="-input"] input, [id$="-input"] select, [id$="-input"] textarea').val('');
  $('.check').text('');
};

const setDefaultPersonType = () => {
  const defaultPersonType = 'student';
  $(`#${defaultPersonType}Radio`).prop('checked', true);
};

const enableInputsByPersonType = personType => {
  // Enable/Disable General Inputs
  $('#product-form .form-group:not(#student-input, #employee-input, #customer-input)').find('input, select, textarea').prop('disabled', !(personType === 'student' || personType === 'employee' || personType === 'customer'));

  // Enable/Disable type Inputs
  $('[id$="-input"]').find('input, select, textarea').each(function () {
    $(this).prop('disabled', !($(this).closest('[id$="-input"]').attr('id') === `${personType}-input`));
    $(this).css('opacity', $(this).prop('disabled') ? 0.5 : 1);
  });

  // Reset all type inputs (Student, Employee, and Customer)
  resettypeInputs();
};

// Example usage
$(document).ready(() => {
  $('.person-type').on('change', event => enableInputsByPersonType(event.target.value));

  // Set default person type to 'student' on page load
  setDefaultPersonType();

  // Enable inputs for the default person type (Student in this case)
  enableInputsByPersonType('student');
});







