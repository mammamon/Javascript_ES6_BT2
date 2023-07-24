function validateInput(data, personType, code, usedCode, name, address, email, usedEmail, typeData) {
    let isValid = true;
  
    // Reset validation messages for each field
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
  
    // Code validation
    if (!code) {
      $("#check-code").text("Code is required.");
      isValid = false;
    } else {
      const codeRegex = /^\d{6}$/;
      if (!codeRegex.test(code)) {
        $("#check-code").text("Code must be a sequence of 6 digit numbers.");
        isValid = false;
      } else if (usedCode) {
        const codeInUse = data.list.some(person => person.code === code);
        if (codeInUse) {
          $("#check-code").text("This code is already in use.");
          isValid = false;
        }
      }
    }
  
    // Email validation
    if (!email) {
      $("#check-email").text("Email is required.");
      isValid = false;
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(email)) {
        $("#check-email").text("Email must be in the correct format.");
        isValid = false;
      } else if (usedEmail) {
        const emailInUse = data.list.some(person => person.email === email);
        if (emailInUse) {
          $("#check-email").text("This email is already in use.");
          isValid = false;
        }
      }
    }
  
    // General name and address validations
    if (!name) {
      $("#check-name").text("Name is required.");
      isValid = false;
    }
  
    if (!address) {
      $("#check-address").text("Address is required.");
      isValid = false;
    }
  
    // Type-specific validations
    if (personType === 'student') {
      // Math validation
      const math = parseFloat(typeData.math);
      if (isNaN(math) || math < 0 || math > 10) {
        $("#check-math").text("Math must be a number between 0 and 10.");
        isValid = false;
      }
  
      // Physics validation
      const physics = parseFloat(typeData.physics);
      if (isNaN(physics) || physics < 0 || physics > 10) {
        $("#check-physics").text("Physics must be a number between 0 and 10.");
        isValid = false;
      }
  
      // Chemistry validation
      const chemistry = parseFloat(typeData.chemistry);
      if (isNaN(chemistry) || chemistry < 0 || chemistry > 10) {
        $("#check-chemistry").text("Chemistry must be a number between 0 and 10.");
        isValid = false;
      }
    } else if (personType === 'employee') {
      // Day validation
      const day = parseInt(typeData.day);
      if (isNaN(day) || day < 0 || day > 25) {
        $("#check-day").text("Day must be a number between 0 and 25.");
        isValid = false;
      }
  
      // Wage validation
      const wage = parseInt(typeData.wage);
      if (isNaN(wage) || wage < 100000 || wage > 1000000) {
        $("#check-wage").text("Wage must be a number between 100,000 and 1,000,000 VNĐ.");
        isValid = false;
      }
    } else if (personType === 'customer') {
      // Company validation
      if (!typeData.company) {
        $("#check-company").text("Company is required.");
        isValid = false;
      }
  
      // Invoice validation
      const invoice = parseInt(typeData.invoice);
      if (isNaN(invoice) || invoice < 10000) {
        $("#check-invoice").text("Invoice must be a number greater than or equal to 10,000.");
        isValid = false;
      }
  
      // Rating validation
      const rating = parseFloat(typeData.rating);
      if (isNaN(rating) || rating < 0 || rating > 5 || ![0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].includes(rating)) {
        $("#check-rating").text("Rating must be a number between 0 and 5 and can only be a limited float number like 4.5, 2.5, 1.5…");
        isValid = false;
      }
    }
  
    console.log(isValid);
    return isValid;
  }
  