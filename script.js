function segregateTransactions(data) {
  console.log(data);
  const nList = data.transactions.reduce((groups, transaction) => {
    const date = transaction.startDate.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(transaction);
    return groups;
  }, {});

  const groupedArray = Object.keys(nList).map((date) => {
    return {
      date,
      transactions: nList[date],
    };
  });

  return groupedArray;
}

function generateMarkup(data) {
  const listContainer = document.querySelector("#listContainer");
  listContainer.innerHTML = data.map(({ date, transactions }) => {
    return (
      `<div class="listContainer"> 
                <div class="showDate">
                    ${date}
                </div>` +
      transactions.map((item) => {
        if (item.direction === 1) {
          return sentTransaction(item);
        }
        return receivedTransaction(item);
      }) +
      `</div>`
    );
  });
}

function sentTransaction({ amount, id, description, status }) {
  return `<div class="cardContainer sentContainer">
            <div class="amount">
                <h3>Rs. ${amount}</h3>
                ${description && `<p>${description}</p>`}
            </div>
            <div class="status">
                <p>
                    ${status === 1 ? "Pending" : ""}
                    ${status === 2 ? "Successful" : ""}
                    ${status === 3 ? "Expired" : ""}
                    ${status === 4 ? "Rejected" : ""}
                    ${status === 5 ? "Cancelled" : ""}
                </p>
                ${status === 1 ? "<button> Cancel </button>" : ""}
            </div>
            <div class="transId">
                <p>
                    Transaction Id
                </p>
                <p>${id}</p>
            </div>              
        </div>`;
}

function receivedTransaction({ amount, id, description, status }) {
  return `<div class="cardContainer receivedContainer">
            <div class="amount">
                <h3>Rs. ${amount}</h3>
                ${description && `<p>${description}</p>`}
            </div>
            <div class="status">
                <p>
                    ${status === 1 ? "Pending" : ""}
                    ${status === 2 ? "Successful" : ""}
                    ${status === 3 ? "Expired" : ""}
                    ${status === 4 ? "Rejected" : ""}
                    ${status === 5 ? "Cancelled" : ""}
                </p>
                ${status === 1 ? "<button> Cancel </button>" : ""}
            </div>
            <div class="transId">
            <p>Transaction Id</p>
            <p>${id}</p>
        </div>   
        </div>`;
}

(async function getTransactionData() {
  const resp = await fetch(
    "https://dev.onebanc.ai/assignment.asmx/GetTransactionHistory?userId=1&recipientId=2",
    {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      return [];
    });
  const groupedTrans = segregateTransactions(resp);
  generateMarkup(groupedTrans);
})();
