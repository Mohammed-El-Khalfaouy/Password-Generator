// Random generators
function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

// Generate button handler
const generate = document.getElementById("generateBtn");
generate.addEventListener("click", () => {
  const length = +document.getElementById("Passwordlength").value; // cast to number
  const hasUpper = document.getElementById("uppercase").checked;
  const hasLower = document.getElementById("lowercase").checked;
  const hasNumber = document.getElementById("numbers").checked;
  const hasSymbol = document.getElementById("symbols").checked;
  const result = document.getElementById("PasswordResult");

  const password = generatePassword(
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    length
  );

  // put password into textarea value (not innerText)
  result.value = password || ""; 
});

// password generator function
function generatePassword(lower, upper, number, symbol, length) {
  let generatedPassword = "";
  const typesCount = lower + upper + number + symbol;
  if (typesCount === 0) return ""; // nothing checked

  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  for (let i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }

  return generatedPassword.slice(0, length);
}

// Copy to clipboard (modern + fallback)
const clipboardBtn = document.getElementById("clipboardBtn");
clipboardBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const textarea = document.getElementById("PasswordResult");
  const text = textarea.value || "";

  if (!text) {
    // optionally give feedback: nothing to copy
    return;
  }

  // try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      // optional: show a tiny visual feedback (e.g., change button text briefly)
      return;
    } catch (err) {
      // fallback below if that fails
    }
  }

  // fallback: select & execCommand
  textarea.select();
  textarea.setSelectionRange(0, 99999); // mobile support
  try {
    document.execCommand("copy");
  } catch (err) {
    // copy failed
  }
});