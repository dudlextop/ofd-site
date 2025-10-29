// === ДАННЫЕ (по умолчанию, если параметры не переданы) ===
const VAT_RATE = 0.12;
const ITEMS = [
  { no: 1, title: "Apple MacBook Pro 16.2",
    details: "(3456×2234) Apple M4 Max System on Chip (SoC) RAM 36GB SSD 1000GB Apple macOS Sequoia Space Black 2.15kg",
    dept: "1", price: 2604990, qty: 2, unit: "шт" },
  { no: 2, title: "Magic Mouse - Black Multi-Touch Surface",
    details: "Model A3204", dept: "1", price: 83990, qty: 2, unit: "шт" },
  { no: 3, title: "Доставка товара", details: "", dept: "1", price: 1500, qty: 1, unit: "шт" }
];

// === ЧТЕНИЕ ПАРАМЕТРОВ ИЗ URL ===
const params = new URLSearchParams(window.location.search);
const fp = params.get("i");   // фискальный признак
const reg = params.get("f");  // регистрационный номер
const sum = params.get("s");  // сумма (не используем в заголовке)
const time = params.get("t"); // дата и время, формат YYYYMMDDTHHMMSS|YYYYMMDDTHHMM

// Формат числа: "2 690 480,00"
const fmt = (n) => new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// Если цена включает НДС 12%, то сумма НДС = total * 12 / 112
const vatInclusive = (total) => total * VAT_RATE / (1 + VAT_RATE);

function render() {
  const rows = document.getElementById("rows");
  const totals = document.getElementById("totals");
  let grand = 0, taxes = 0;

  ITEMS.forEach(item => {
    const lineTotal = item.price * item.qty;
    const vat = vatInclusive(lineTotal);
    grand += lineTotal; taxes += vat;

    const trSpacer = document.createElement("tr");
    trSpacer.className = "spacer";
    trSpacer.innerHTML = '<td colspan="7"></td>';
    rows.appendChild(trSpacer);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.no}.</td>
      <td class="name">
        <div><strong>${item.title}</strong></div>
        ${item.details ? `<div class="muted">${item.details}</div>` : ""}
        <div class="vat">НДС 12,00 % <span>${fmt(vat)} ₸</span></div>
      </td>
      <td>${item.dept}</td>
      <td>${fmt(item.price)}</td>
      <td>${item.qty}</td>
      <td>${item.unit}</td>
      <td class="sum">${fmt(lineTotal)}</td>
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

  // === ВСТАВКА ПАРАМЕТРОВ В ВЕРСТКУ ===
  const headline = document.querySelector(".headline");
  if (headline) headline.textContent = "ЧЕК НАЙДЕН!"; // без суммы

  const closeBtn = document.querySelector(".close");
  if (closeBtn) closeBtn.remove(); // убираем крестик

  if (fp) document.querySelector(".fp").textContent = `ФП: ${fp}`;
  if (reg) {
    const regLine = document.querySelector(".org p:nth-child(4)");
    if (regLine) regLine.textContent = `Регистрационный номер: ${reg}`;
  }

  if (time) {
    // поддерживаем YYYYMMDDTHHMMSS и YYYYMMDDTHHMM
    const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/.exec(time);
    const formatted = m ? `${m[3]}.${m[2]}.${m[1]} / ${m[4]}:${m[5]}` : time;
    const dateLine = document.querySelector(".meta p:last-child");
    if (dateLine) dateLine.textContent = formatted;
  }
}

render();
