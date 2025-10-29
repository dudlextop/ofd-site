// ДАННЫЕ и логика подсчёта НДС (12% включено в цену)
const VAT_RATE = 0.12;
const ITEMS = [
  {
    no: 1,
    title: "Apple MacBook Pro 16.2",
    details: "(3456×2234) Apple M4 Max System on Chip (SoC) RAM 36GB SSD 1000GB Apple macOS Sequoia Space Black 2.15kg",
    dept: "1",
    price: 2604990,
    qty: 2,
    unit: "шт"
  },
  {
    no: 2,
    title: "Magic Mouse - Black Multi-Touch Surface",
    details: "Model A2304",
    dept: "83",
    price: 83990,
    qty: 2,
    unit: "шт"
  },
  {
    no: 3,
    title: "Доставка товара",
    details: "",
    dept: "1 500",
    price: 1500,
    qty: 1,
    unit: "шт"
  }
];

const fmt = (n) =>
  new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const vatInclusive = (total) => total * VAT_RATE / (1 + VAT_RATE);

function render(){
  const rows = document.getElementById('rows');
  const totals = document.getElementById('totals');
  let grand = 0, taxes = 0;

  ITEMS.forEach(item => {
    const line = item.price * item.qty;
    const vat = vatInclusive(line);
    grand += line;
    taxes += vat;

    const spacer = document.createElement('tr');
    spacer.className = 'spacer';
    spacer.innerHTML = '<td></td>';
    rows.appendChild(spacer);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="№">${item.no}.</td>
      <td class="name" data-label="Название">
        <div><strong>${item.title}</strong></div>
        ${item.details ? `<div class="muted">${item.details}</div>` : ""}
        <div class="vat">НДС 12,00 % <span>${fmt(vat)} ₸</span></div>
      </td>
      <td data-label="Отдел">${item.dept}</td>
      <td data-label="Цена">${fmt(item.price)}</td>
      <td data-label="Кол-во">${item.qty}</td>
      <td data-label="Ед.изм.">${item.unit}</td>
      <td class="sum" data-label="Сумма ₸">${fmt(line)}</td>
    `;
    rows.appendChild(tr);
  });

  totals.innerHTML = `
    <div class="row total">
      <div class="label"><strong>ИТОГО:</strong></div>
      <div class="value"><strong>${fmt(grand)} ₸</strong></div>
    </div>
    <div class="row">
      <div class="label">Карта</div>
      <div class="value">${fmt(grand)} ₸</div>
    </div>
    <div class="row tax">
      <div class="label">В том числе налоги<br/><span>12,00 %</span></div>
      <div class="value">${fmt(taxes)} ₸</div>
    </div>
  `;
}

render();
