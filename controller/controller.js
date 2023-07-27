let listPerson;
let listPersonInstance;
async function getListPerson() {
  // Check if the listPerson instance has been set and return it if available
  if (listPerson) {
    return listPerson;
  }

  // Create a new ListPerson object
  listPerson = new ListPerson();

  return listPerson;
}

getListPerson().then((listPerson) => {
  renderListPerson(listPerson);
});


console.log("listPerson: ", listPerson);

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



// input mặc định cho modal thêm người mới
$('#btn-modal').on('click', function () {
  $('#btnAdd').css('display', 'inline-block');
  $('#btnEdit').css('display', 'none');
  $(`#studentRadio`).prop('checked', true);
  $('.person-type').prop('disabled', false);
  $('#code').prop('disabled', false);
  $('#code').prop('disabled', false);
  
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

const enableInputsByPersonType = personType => {
  // Enable/Disable General Inputs
  $('#product-form .form-group:not(#student-input, #employee-input, #customer-input)').find('input, select, textarea').prop('disabled', !(personType === 'student' || personType === 'employee' || personType === 'customer'));

  // Enable/Disable type Inputs
  $('[id$="-input"]').find('input, select, textarea').each(function () {
    $(this).prop('disabled', !($(this).closest('[id$="-input"]').attr('id') === `${personType}-input`));
  });

  // Reset all type inputs (Student, Employee, and Customer)
  resettypeInputs();
};


// Add click event listener to each row with the class "edit-row"
$("#list-person-table").on("click", ".edit-row", function () {
  const personCode = $(this).data("person-code");
  const personType = $(this).data("person-type");
  $('#btnAdd').css('display', 'none');
  $('#btnEdit').css('display', 'inline-block');
  // Find the person with the specified code
  const person = listPerson.list.find((p) => p.code === personCode);

  // Populate the input fields with the data of the person
  $('#code').val(person.code);
  $('#name').val(person.name);
  $('#address').val(person.address);
  $('#email').val(person.email);

  if (personType === 'student') {
    $('#studentRadio').prop('checked', true);
    enableInputsByPersonType('student');
    $('#math').val(person.math);
    $('#physics').val(person.physics);
    $('#chemistry').val(person.chemistry);
  } else if (personType === 'employee') {
    $('#employeeRadio').prop('checked', true);
    enableInputsByPersonType('employee');
    $('#day').val(person.day);
    $('#wage').val(person.wage);
  } else if (personType === 'customer') {
    $('#customerRadio').prop('checked', true);
    enableInputsByPersonType('customer');
    $('#company').val(person.company);
    $('#invoice').val(person.invoice);
    $('#rating').val(person.rating);
  }

  // Disable the radio buttons
  $('.person-type').prop('disabled', true);
  $('#code').prop('disabled', true);

  // Show the #input-modal
  $('#input-modal').modal('show');

  // Add a click event listener to the #btnEdit button
  $('#btnEdit').off('click').on('click', async function () {
    const data = await getListPerson();
    const { code, name, address, email, typeData } = getInput();

    // Check if the input is valid
    const isValid = await validateInput(data, personType, code, false, name, address, email, false, typeData);

    if (isValid) {
      // Find the index of the person with the specified code
      const personIndex = data.list.findIndex((p) => p.code === code);

      if (personIndex !== -1) {
        // Update the data of the selected person
        if (personType === 'student') {
          data.list[personIndex] = new Student({
            _code: code,
            _name: name,
            _address: address,
            _email: email,
            _math: parseFloat(typeData.math),
            _physics: parseFloat(typeData.physics),
            _chemistry: parseFloat(typeData.chemistry),
          });
        } else if (personType === 'employee') {
          data.list[personIndex] = new Employee({
            _code: code,
            _name: name,
            _address: address,
            _email: email,
            _day: parseInt(typeData.day),
            _wage: parseInt(typeData.wage),
          });
        } else if (personType === 'customer') {
          data.list[personIndex] = new Customer({
            _code: code,
            _name: name,
            _address: address,
            _email: email,
            _company: typeData.company,
            _invoice: parseInt(typeData.invoice),
            _rating: parseFloat(typeData.rating),
          });
        }

        // Save the updated list to local storage
        data.saveToLocalStorage();

        // Update the table with the new list of people
        renderListPerson(data);

        // Hide the #input-modal
        $('#input-modal').modal('hide');

        // Enable the radio buttons
        $('.person-type').prop('disabled', false);

        alert('Person updated successfully!');
      }
    } else {
      alert('Please check your input and try again.');
    }
  });
});

async function filterListPerson() {
  const data = await getListPerson();
  const selectedType = $('.filter-person-type').val();
  const filteredList = data.filter(selectedType);
  renderListPerson(filteredList);
}



$('.filter-person-type').on('change', filterListPerson);



// testing
// localStorage.clear();

$(document).ready(() => {
  $('.person-type').on('change', event => enableInputsByPersonType(event.target.value));

  // Set default person type to 'student' on page load

  // Enable inputs for the default person type (Student in this case)
});
