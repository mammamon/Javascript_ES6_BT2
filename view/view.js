const renderListPerson = (listPerson) => {
  const tableBody = document.querySelector("#list-person-table");
  tableBody.innerHTML = "";

  listPerson.list.forEach((person) => {
      let avgScore = "";
      if (person instanceof Student) {
          avgScore = person.avgScore().toFixed(2);
      }

      let salary = "";
      if (person instanceof Employee) {
          salary = person.salary();
      }

      let company = "";
      let invoice = "";
      let rating = "";
      if (person instanceof Customer) {
          company = person.company;
          invoice = person.invoice;
          rating = person.rating;
      }

      let personType = "";
      if (person instanceof Student) {
          personType = "học sinh";
      } else if (person instanceof Employee) {
          personType = "nhân viên";
      } else if (person instanceof Customer) {
          personType = "khách hàng";
      }

      const rowContent = `
          <tr>
              <td>${person.code}</td>
              <td>${person.name}</td>
              <td>${personType}</td>
              <td>${person.email}</td>
              <td>${avgScore}</td>
              <td>${salary}</td>
              <td>${company}</td>
              <td>${invoice}</td>
              <td>${rating}</td>
          </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", rowContent);
  });
};
