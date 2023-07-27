// global scope
let listPerson;
let listPersonInstance;

//lấy danh sách
async function getListPerson() {
  if (listPerson) {
    return listPerson;
  }
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

$('#btnAdd').on('click', addPerson);


// xóa người dùng
async function deletePerson() {
  const data = await getListPerson();
  const deleteCode = $('#delete-code').val();
  const persons = data.list;
  const personIndex = persons.findIndex((person) => person.code === deleteCode);
  if (personIndex !== -1) {
    data.deletePerson(deleteCode);
    alert('Xóa thành công');
    $('#delete-modal').modal('hide');
    renderListPerson(data);
  } else {
    $('#delete-info').text('Không tìm thấy người dùng nào mang mã này');
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
  $('#day').prop('disabled', true);
  $('#wage').prop('disabled', true);
  $('#company').prop('disabled', true);
  $('#invoice').prop('disabled', true);
  $('#rating').prop('disabled', true);

});


// reset các đoạn text thông báo và input mỗi khi đóng modal
const modal = $("#input-modal, #delete-modal");
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.attributeName === "style" && $(mutation.target).css("display") === "none") {
      $(".check", mutation.target).html("");
      $("input[type='text'], input[type='number'], textarea", mutation.target).val("");
    }
  });
});
modal.each(function () {
  observer.observe(this, { attributes: true });
});


// reset tất cả input trong modal khi chọn loại đối tượng khác
const resetTypeInput = () => {
  $('[id$="-input"] input, [id$="-input"] select, [id$="-input"] textarea').val('');
  $('.check').text('');
};


// kích hoạt / vô hiệu các input dựa theo đối tượng đang chọn
const personTypeInput = personType => {
  $('#product-form .form-group:not(#student-input, #employee-input, #customer-input)').find('input, select, textarea').prop('disabled', !(personType === 'student' || personType === 'employee' || personType === 'customer'));
  $('[id$="-input"]').find('input, select, textarea').each(function () {
    $(this).prop('disabled', !($(this).closest('[id$="-input"]').attr('id') === `${personType}-input`));
  });
  resetTypeInput();
};

$(document).ready(() => {
  $('.person-type').on('change', event => personTypeInput(event.target.value));
});


// mở modal cập nhật thông tin
$("#list-person-table").on("click", ".edit-row", function () {
  const personCode = $(this).data("person-code");
  const personType = $(this).data("person-type");
  $('#btnAdd').css('display', 'none');
  $('#btnEdit').css('display', 'inline-block');
  const person = listPerson.list.find((p) => p.code === personCode.toString());
  $('#code').val(person.code);
  $('#name').val(person.name);
  $('#address').val(person.address);
  $('#email').val(person.email);
  if (personType === 'student') {
    $('#studentRadio').prop('checked', true);
    personTypeInput('student');
    $('#math').val(person.math);
    $('#physics').val(person.physics);
    $('#chemistry').val(person.chemistry);
  } else if (personType === 'employee') {
    $('#employeeRadio').prop('checked', true);
    personTypeInput('employee');
    $('#day').val(person.day);
    $('#wage').val(person.wage);
  } else if (personType === 'customer') {
    $('#customerRadio').prop('checked', true);
    personTypeInput('customer');
    $('#company').val(person.company);
    $('#invoice').val(person.invoice);
    $('#rating').val(person.rating);
  }
  // chặn thay đổi đối tượng và mã khi cập nhật
  $('.person-type').prop('disabled', true);
  $('#code').prop('disabled', true);
  $('#input-modal').modal('show');
  // cập nhật thông tin người dùng
  $('#btnEdit').off('click').on('click', async function () {
    const data = await getListPerson();
    const { code, name, address, email, typeData } = getInput();
    // check valid không kiểm tra trùng tên và email
    const isValid = await validateInput(data, personType, code, false, name, address, email, false, typeData);
    if (isValid) {
      const personIndex = data.list.findIndex((p) => p.code === code);
      if (personIndex !== -1) {
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
        data.saveToLocalStorage();
        renderListPerson(data);
        $('#input-modal').modal('hide');
        $('.person-type').prop('disabled', false);
        alert('Cập nhật thông tin thành công');
      }
    } else {
      alert('Vui lòng kiểm tra lại thông tin nhập');
    }
  });
});


// lọc danh sách theo lớp đối tượng
async function filterListPerson() {
  const data = await getListPerson();
  const selectedType = $('.filter-person-type').val();
  const filteredList = data.filter(selectedType);
  renderListPerson(filteredList);
}

$('.filter-person-type').on('change', filterListPerson);

