function validateInput(data, personType, code, usedCode, name, address, email, usedEmail, typeData) {
  let isValid = true;
  //reset các đoạn text thông báo
  $("#check-code").text("");
  $("#check-email").text("");
  $("#check-math").text("");
  $("#check-physics").text("");
  $("#check-chemistry").text("");
  $("#check-day").text("");
  $("#check-wage").text("");
  $("#check-company").text("");
  $("#check-invoice").text("");
  $("#check-rating").text("");
  $("#check-name").text("");
  $("#check-address").text("");
  // code
  if (!code) {
    $("#check-code").text("Không được để trống mã");
    isValid = false;
  } else {
    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      $("#check-code").text("Mã phải gồm sáu chữ số");
      isValid = false;
    } else if (usedCode) {
      const codeInUse = data.list.some(person => person.code === code);
      if (codeInUse) {
        $("#check-code").text("Mã này đã có trên hệ thống");
        isValid = false;
      }
    }
  }
  // email
  if (!email) {
    $("#check-email").text("Không được để trống email");
    isValid = false;
  } else {
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      $("#check-email").text("Email phải nhập đúng định dạng");
      isValid = false;
    } else if (usedEmail) {
      const emailInUse = data.list.some(person => person.email === email);
      if (emailInUse) {
        $("#check-email").text("Email đang được sử dụng");
        isValid = false;
      }
    }
  }
  // tên
  if (!name) {
    $("#check-name").text("Không được để trống tên");
    isValid = false;
  }
  // địa chỉ
  if (!address) {
    $("#check-address").text("Không được để trống địa chỉ");
    isValid = false;
  }
  // input của lớp student
  if (personType === 'student') {
    const math = parseFloat(typeData.math);
    if (isNaN(math) || math < 0 || math > 10) {
      $("#check-math").text("Điểm phải nằm trong khoảng từ 0 đến 10");
      isValid = false;
    }
    const physics = parseFloat(typeData.physics);
    if (isNaN(physics) || physics < 0 || physics > 10) {
      $("#check-physics").text("Điểm phải nằm trong khoảng từ 0 đến 10");
      isValid = false;
    }
    const chemistry = parseFloat(typeData.chemistry);
    if (isNaN(chemistry) || chemistry < 0 || chemistry > 10) {
      $("#check-chemistry").text("Điểm phải nằm trong khoảng từ 0 đến 10");
      isValid = false;
    }
  }
  // input của lớp employee
  else if (personType === 'employee') {
    const day = parseInt(typeData.day);
    if (isNaN(day) || day < 0 || day > 25) {
      $("#check-day").text("số ngày làm phải nằm trong khoảng từ 0 đến 25");
      isValid = false;
    }
    const wage = parseInt(typeData.wage);
    if (isNaN(wage) || wage < 100000 || wage > 2000000) {
      $("#check-wage").text("lương một ngày phải nằm trong khoảng từ 100.000 đến 2.000.000");
      isValid = false;
    }
  }
  // input của lớp customer
  else if (personType === 'customer') {
    if (!typeData.company) {
      $("#check-company").text("Không được để trống tên công ty");
      isValid = false;
    }
    const invoice = parseInt(typeData.invoice);
    if (isNaN(invoice) || invoice < 10000) {
      $("#check-invoice").text("Hóa đơn phải có giá trị ít nhất là 10.000");
      isValid = false;
    }
    const rating = parseFloat(typeData.rating);
    if (isNaN(rating) || rating < 0 || rating > 5 || ![0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].includes(rating)) {
      $("#check-rating").text("Điểm đánh giá phải là một trong các số: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5");
      isValid = false;
    }
  }
  console.log(isValid);
  return isValid;
}
