let listPerson;
let listPersonInstance;
let data;
// Function to get the list of persons from the server
// Function to get the list of persons from the server
async function getListPerson() {
  // Check if the listPerson instance has been set and return it if available
  if (listPerson) {
    return listPerson;
  }

  try {
    const response = await fetch('/data.json?_=' + new Date().getTime());
    const jsonData = await response.json();

    // Create a new ListPerson object and populate it with data
    listPerson = new ListPerson();

    jsonData.students.forEach((student) => {
      listPerson.addPerson(new Student(student));
    });

    jsonData.employees.forEach((employee) => {
      listPerson.addPerson(new Employee(employee));
    });

    jsonData.customers.forEach((customer) => {
      listPerson.addPerson(new Customer(customer));
    });

    return listPerson;
  } catch (error) {
    console.error(error);
    alert('Error occurred while retrieving data or no data found.');
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


// Edit an existing person
// Function to populate the input-modal with the person's data
function populateInputModalWithPersonData(person) {
  // Set the person type radio button based on the person's type
  $(`#${person.constructor.name.toLowerCase()}Radio`).prop('checked', true);

  // Set the general inputs
  $('#code').val(person.code);
  $('#name').val(person.name);
  $('#address').val(person.address);
  $('#email').val(person.email);

  // Set the specific inputs based on the person type
  if (person instanceof Student) {
    $('#math').val(person.math);
    $('#physics').val(person.physics);
    $('#chemistry').val(person.chemistry);
  } else if (person instanceof Employee) {
    $('#day').val(person.day);
    $('#wage').val(person.wage);
  } else if (person instanceof Customer) {
    $('#company').val(person.company);
    $('#invoice').val(person.invoice);
    $('#rating').val(person.rating);
  }
}

// Edit an existing person
async function editPerson() {
  try {
    const data = await getListPerson();

    // Get the person code from the data attribute of the clicked row
    const personCode = $(this).data('person-code');

    // Find the person to be edited
    const personToEdit = data.list.find((person) => person.code === personCode);

    if (personToEdit) {
      // Populate the input-modal with the person's data
      populateInputModalWithPersonData(personToEdit);

      // Set the data attribute for the btnEdit button
      $('#btnEdit').data('person-code', personCode);

      // Show the edit button and hide the add button in the modal
      $('#btnAdd').hide();
      $('#btnEdit').show();

      // Open the input-modal
      $('#input-modal').modal('show');

      // Event listener for the Edit button in the modal
      $('#btnEdit').on('click', async function () {
        try {
          const { personType, code, name, address, email, typeData } = getInput();

          // Create the updated person object based on the person type
          let updatedPerson;
          if (personType === 'student') {
            updatedPerson = new Student({
              _code: code,
              _name: name,
              _address: address,
              _email: email,
              _math: parseFloat(typeData.math),
              _physics: parseFloat(typeData.physics),
              _chemistry: parseFloat(typeData.chemistry),
            });
          } else if (personType === 'employee') {
            updatedPerson = new Employee({
              _code: code,
              _name: name,
              _address: address,
              _email: email,
              _day: parseInt(typeData.day),
              _wage: parseInt(typeData.wage),
            });
          } else if (personType === 'customer') {
            updatedPerson = new Customer({
              _code: code,
              _name: name,
              _address: address,
              _email: email,
              _company: typeData.company,
              _invoice: parseInt(typeData.invoice),
              _rating: parseFloat(typeData.rating),
            });
          }

          // Perform the update operation
          data.update(code, updatedPerson);

          // Close the modal
          $('#input-modal').modal('hide');

          // Re-render the updated list
          renderListPerson(data);

          // Show a success message
          alert('Person updated successfully!');
        } catch (error) {
          console.error(error);
          alert('Error occurred while updating the person.');
        }
      });
    } else {
      alert('Person with the provided code not found.');
    }
  } catch (error) {
    console.error(error);
    alert('Error occurred while retrieving data or no data found.');
  }
}







// Function to open the input modal and populate it with the person's data
const openInputModalWithPersonData = (personCode, personType) => {
  // Populate the input-modal with the person's data based on personCode and personType
  const listPerson = listPersonInstance;

  if (!listPerson) {
    console.error("ListPerson instance not available.");
    return;
  }

  const person = listPerson.list.find((p) => p.code === personCode);
  if (!person) {
    console.error("Person not found.");
    return;
  }

  // Set the person type radio button based on the personType
  $(`.person-type[value="${personType}"]`).prop("checked", true);

  // Enable inputs based on the person type
  enableInputsByPersonType(personType);

  // Set general inputs
  $("#code").val(person.code);
  $("#name").val(person.name);
  $("#address").val(person.address);
  $("#email").val(person.email);

  // Set specific inputs based on the person type
  if (personType === "student") {
    $("#math").val(person.math);
    $("#physics").val(person.physics);
    $("#chemistry").val(person.chemistry);
  } else if (personType === "employee") {
    $("#day").val(person.day);
    $("#wage").val(person.wage);
  } else if (personType === "customer") {
    $("#company").val(person.company);
    $("#invoice").val(person.invoice);
    $("#rating").val(person.rating);
  }

  // Show the input-modal
  $("#input-modal").modal("show");
  // Event listener for the Edit button in the modal
  $('#btnEdit').off('click').on('click', async () => {
    const editedPerson = getInput(personType);

    // Perform any additional validation if required
    // ...

    // Update the person in the ListPerson
    data.update(personCode, editedPerson);

    // Render the updated list
    renderListPerson(data);

    // Close the modal
    $('#input-modal').modal('hide');
  });
};


$(document).ready(function() {
  // Create a new ListPerson object
  listPerson = new ListPerson();

  // Get the list of persons from the server
  getListPerson().then((data) => {
    listPerson.list = data.list;
    renderListPerson(listPerson);
  });

  // Event listener for filter dropdown changes
  $(".filter-person-type").on("change", function() {
    const selectedType = $(this).val();
    const filteredPersons = listPerson.filter(selectedType);
    renderListPerson({ list: filteredPersons });
  });
});




