// const binId = "67e5f6488a456b79667e11b5"; //dev 
const binId = "67e5fc2c8960c979a579dcf6"; //prod
const apiKey = "$2a$10$Ffq5aoPmc7xeKTN2B9Y6RuL.fpVuxP9m/KLrStY05A9k25VKCvogG"; 
const url = `https://api.jsonbin.io/v3/b/${binId}`;

// GET Data
async function getMessages() {
  let response = await fetch(url, {
    headers: { "X-Master-Key": apiKey }
  });
  let data = await response.json();
  return data.record.messages || [];
}

// POST Data
async function saveMessage({messages, newMessage}) {
  // let messages = await getMessages();
  messages.push(newMessage);
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey
    },
    body: JSON.stringify({ messages })
  });
}


// method
function insert() {
  const form = $("#formMessage").serializeArray();
  let dataMessage = JSON.parse(localStorage.getItem("dataMessage")) || [];

  let newData = {};
  form.forEach(function (item, index) {
    let name = item["name"];
    let value = name === "id" || name === "" ? Number(item["value"]) : item["value"];
    newData[name] = value;
  });

  localStorage.setItem("dataMessage", JSON.stringify([...dataMessage, newData]));
  return newData;
}

function showData(dataMessage) {
  let row = "";

  if (dataMessage.length == 0) {
    return (row = `<h1 class="title" style="text-align : center">Belum Ada Pesan Masuk</h1>`);
  }

  dataMessage.forEach(function (item, index) {
    row += `<h1 class="title">${item["nama"]}</h1>`;
    row += `<h4>- ${item["hubungan"]}</h4>`;
    row += `<p>${item["pesan"]}</p>`;
  });
  return row;
}

let dataMessage;
$(async function () {
  // initialize
  dataMessage = await getMessages() || [];

  $(".card-message").html(showData(dataMessage));
  // events
  $("#formMessage").on("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target)
    const body = {
      nama: formData.get('nama'),
      hubungan: formData.get('hubungan'),
      pesan: formData.get('pesan')
    }

    await saveMessage({messages: dataMessage, newMessage: body})
    e.target.reset();
    
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Terima Kasih Atas Ucapan & Doanya ",
      showConfirmButton: false,
      timer: 2000,
    });
    $(".card-message").html(showData(dataMessage));
  });
});
