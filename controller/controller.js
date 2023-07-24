//lấy data từ data.json
async function getListPerson() {
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

    return listPerson; // Return the listPerson object
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





//tạo 
async function addPersonToList() {
  const data = await getListPerson(); // Retrieve the existing data
  const { personType, code, name, address, email, typeData } = getInput();

  // Validate the input data
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
      data.addPerson(newPerson); // Add the new person to the list
      renderListPerson(data); // Render the updated list

      // Show success alert to the user
      alert('New person added successfully!');
      $('#btnClose').trigger('click');
    }
  } else {
    // Show error alert to the user
    alert('Validation failed! Please check your inputs.');
  }
}

document.getElementById('btnAdd').addEventListener('click', addPersonToList);


function handleAddButtonClick(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const personTypeRadios = document.querySelectorAll('.person-type');
  let personType = '';
  personTypeRadios.forEach(radio => {
    if (radio.checked) {
      personType = radio.value;
    }
  });
  const code = document.getElementById('code').value;
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const email = document.getElementById('email').value;
  let typeData = {};
  if (personType === 'student') {
    typeData.math = document.getElementById('math').value;
    typeData.physics = document.getElementById('physics').value;
    typeData.chemistry = document.getElementById('chemistry').value;
  } else if (personType === 'employee') {
    typeData.day = document.getElementById('day').value;
    typeData.wage = document.getElementById('wage').value;
  } else if (personType === 'customer') {
    typeData.company = document.getElementById('customerName').value;
    typeData.invoice = document.getElementById('invoice').value;
    typeData.rating = document.getElementById('rating').value;
  }

  // Validate the input data
  const isValid = validateInput(data, personType, code, false, name, address, email, false, typeData);

  // Log the value of isValid
  console.log('isValid:', isValid);

  // If the input data is valid, proceed with adding the person
  if (isValid) {
    const person = createPersonObject(personType, code, name, address, email, typeData);
    data.list.push(person);
    renderListPerson(data);
  } else {
    console.log('Form data is invalid. Please fill in all required fields and check the input format.');
  }
}






const listPerson = new ListPerson();

async function deletePerson() {
  try {
    const data = await getListPerson();
    const deleteCode = $('#delete-code').val();
    const persons = data.list;

    const personIndex = persons.findIndex((person) => person.code === deleteCode);

    if (personIndex !== -1) {
      // Perform the delete operation
      persons.splice(personIndex, 1);

      // Update the data in localStorage or wherever you are storing it
      // Since you don't have an updateListPerson() function, I assume you update the data directly.
      // If it's stored in localStorage, you can do:
      // localStorage.setItem('listPersonData', JSON.stringify(data));

      // Perform any additional actions you want after successful delete
      alert('Person deleted successfully!');

      // Close the modal
      $('#delete-modal').modal('hide');

      // Re-render the updated list
      renderListPerson(data);
    } else {
      $('#delete-info').text('Person with the provided code not found.');
    }
  } catch (error) {
    console.error(error);
    $('#delete-info').text('Error occurred while retrieving data or no data found.');
  }
}

// Event listener for the Delete button in the modal
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







