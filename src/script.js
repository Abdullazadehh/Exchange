const form = document.querySelector(".form");
const inputBase = document.querySelector(".mynumber");
const inputTo = document.querySelector(".input2");

const baseCurrencyDiv = document.querySelector(".baseText");
const toCurrencyDiv = document.querySelector(".symbolsText");

const alert = document.querySelector('.alert');

const currencyMask = {
  mask: Number,
  thousandsSeparator: " ",
  radix: ".",
  scale: 4,
  max: Number.MAX_VALUE,
  padFractionalZeros: false,
  normalizeZeros: true
};

const maskBase = IMask(inputBase, currencyMask);
const maskTo = IMask(inputTo, currencyMask);

async function getData(flag = true) {
  const myForm = new FormData(form);
  
  if(!navigator.onLine) {
    showAlert('The network connection has been lost.');
    maskBase.value = '1';
    return;
  }

  const base = myForm.get("baseoptions");
  const symbol = myForm.get("symbolsoptions");
  let currencyRate ;

  if(base !== symbol) {
    const url = new URL("/lates", "https://api.exchangerate.host");
  
    url.searchParams.set("base", base);
    url.searchParams.set("symbols", symbol);
    url.searchParams.set("places", 4);
  
    const data = await fetch(url).then((r) => r.json()).catch(e => showAlert('Sorry! We have a problem with API.'));
    currencyRate = await data.rates[symbol];
  }
  else {
    currencyRate = 1;
  }

  baseCurrencyDiv.textContent = `1 ${base} = ${currencyRate.toFixed(4)} ${symbol}`;
  toCurrencyDiv.textContent = `1 ${symbol} = ${(1 / currencyRate).toFixed(4)} ${base}`;
  
  if (flag) 
    maskTo.value = (Math.round(maskBase.unmaskedValue * currencyRate * 10000) / 10000).toString();
  else 
    maskBase.value = (Math.round(maskTo.unmaskedValue * (1 / currencyRate) * 10000) / 10000).toString();
}

window.addEventListener('load', e => getData());

window.addEventListener("online", () => alert.style.display = 'none');

form.addEventListener("input", e => {
  e.target.name === "input2" ? getData(false) : getData();
});

const showAlert = (message) => {
  alert.textContent = message;
  alert.style.display = 'block';
}
