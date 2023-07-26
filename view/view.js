const renderListPerson = (listPerson) => {
  const tableBody = $("#list-person-table");
  tableBody.empty(); // Clear existing table content

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
      personType = "student";
    } else if (person instanceof Employee) {
      personType = "employee";
    } else if (person instanceof Customer) {
      personType = "customer";
    }

    const translatedPersonType = personTypeTranslations[personType];

    const rowContent = `
      <tr class="edit-row data-row" data-person-code="${person.code}" data-person-type="${personType}">
        <td>${person.code}</td>
        <td>${person.name}</td>
        <td>${translatedPersonType}</td>
        <td>${person.email}</td>
        <td>${person.address}</td>
        <td>${avgScore}</td>
        <td>${salary}</td>
        <td>${company}</td>
        <td>${invoice}</td>
      </tr>
    `;
    tableBody.append(rowContent);
  });
};


const personTypeTranslations = {
  student: "Học sinh",
  employee: "Nhân viên",
  customer: "Khách hàng"
};
