
    let form = document.getElementById('regForm');
    let copyAddress = document.getElementById('copyAddress');
    let errorMsg = document.getElementById('errorMsg');

    // Shipping address fields
    let shippingStreet = document.getElementById('shippingStreet');
    let shippingBuilding = document.getElementById('shippingBuilding');
    let shippingProvince = document.getElementById('shippingProvince');
    let shippingTown = document.getElementById('shippingTown');
    let shippingZip1 = document.getElementById('shippingZip1');
    let shippingZip2 = document.getElementById('shippingZip2');
    let shippingZip3 = document.getElementById('shippingZip3');
    let shippingZip4 = document.getElementById('shippingZip4');

    // Billing address fields
    let billingStreet = document.getElementById('billingStreet');
    let billingBuilding = document.getElementById('billingBuilding');
    let billingProvince = document.getElementById('billingProvince');
    let billingTown = document.getElementById('billingTown');
    let billingPostalCode = document.getElementById('billingPostalCode');

    // Misc / payment fields
    let hearAboutUs = document.getElementById('hearAboutUs');
    let cardName = document.getElementById('cardName');
    let cardType = document.getElementById('cardType');
    let cardNumber = document.getElementById('cardNumber');
    let expirationDate = document.getElementById('expirationDate');
    let cvc = document.getElementById('cvc');

    // Personal fields
    let preferredName = document.getElementById('preferredName');
    let fullName = document.getElementById('fullName');
    let surname = document.getElementById('surname');

    function copyShippingToBilling() {
      billingStreet.value = shippingStreet.value;
      billingBuilding.value = shippingBuilding.value;
      billingProvince.value = shippingProvince.value;
      billingTown.value = shippingTown.value;
      billingPostalCode.value = shippingZip1.value + shippingZip2.value + shippingZip3.value + shippingZip4.value;
    }

    copyAddress.addEventListener('change', () => {
      if (copyAddress.checked) {
        copyShippingToBilling();
      }
    });

    [shippingStreet, shippingBuilding, shippingProvince, shippingTown, shippingZip1, shippingZip2, shippingZip3, shippingZip4].forEach(field => {
      field.addEventListener('input', () => {
        if (copyAddress.checked) {
          copyShippingToBilling();
        }
      });
    });

    // Validation helpers for card and account fields
    function detectCardType(number) {
      if (/^4/.test(number)) return 'Visa';
      if (/^(5[1-5]|2[2-7])/.test(number)) return 'Mastercard';
      if (/^3[47]/.test(number)) return 'American Express';
      if (/^(6011|65|64[4-9]|622)/.test(number)) return 'Discover';
      return 'Unknown';
    }

    // Validate preferred name is entered
    function validatePreferredName() {
      if (!preferredName) return true; // nothing to validate
      const val = preferredName.value.trim();
      if (val === '') {
        preferredName.setCustomValidity('Preferred name is required.');
        return false;
      }
      preferredName.setCustomValidity('');
      return true;
    }

    // Validate that the name on the credit card matches the owner (first + last)
    function validateCardNameMatchesOwner() {
      if (!cardName) return true;
      const cardVal = cardName.value.trim().toLowerCase();
      const ownerParts = [];
      if (fullName && fullName.value) ownerParts.push(fullName.value.trim());
      if (surname && surname.value) ownerParts.push(surname.value.trim());
      const ownerFull = ownerParts.join(' ').toLowerCase();
      // If no owner name to compare against, consider it valid
      if (!ownerFull) return true;
      if (cardVal === ownerFull) {
        cardName.setCustomValidity('');
        return true;
      }
      cardName.setCustomValidity('Name on card must match the account owner name.');
      return false;
    }

    // Validate shipping zipcode split fields (ensure each part is entered and numeric)
    function validateShippingZipcode() {
      const parts = [shippingZip1, shippingZip2, shippingZip3, shippingZip4];
      let allPresent = true;
      for (const p of parts) {
        if (!p) continue; // if field not present, skip
        const v = p.value.trim();
        if (v === '' || !/^[0-9]+$/.test(v)) {
          p.setCustomValidity('Please enter numeric zip code part.');
          allPresent = false;
        } else {
          p.setCustomValidity('');
        }
      }
      return allPresent;
    }

    function getShippingPostalCode() {
      return `${shippingZip1.value}${shippingZip2.value}${shippingZip3.value}${shippingZip4.value}`;
    }

    function isProvinceZipMatch() {
      const province = shippingProvince.value;
      const zip = getShippingPostalCode();
      const provinceZipRegex = {
        'Eastern Cape': /^(5[2-9]|6[0-4])[0-9]{2}$/,
        'Free State': /^(9[3-8])[0-9]{2}$/,
        'Gauteng': /^(0[0-9]|1[0-9]|2[0-1])[0-9]{2}$/,
        'KwaZulu-Natal': /^(3[0-9]|4[0-3])[0-9]{2}$/,
        'Limpopo': /^(0[5-9])[0-9]{2}$/,
        'Mpumalanga': /^(1[2-3])[0-9]{2}$/,
        'North West': /^(2[6-9])[0-9]{2}$/,
        'Northern Cape': /^(8[8-9])[0-9]{2}$/,
        'Western Cape': /^(7[0-9])[0-9]{2}$/
      };

      if (!province || !/^[0-9]{4}$/.test(zip)) {
        return true;
      }

      const regex = provinceZipRegex[province];
      if (!regex) {
        return true;
      }

      const matches = regex.test(zip);
      const parts = [shippingZip1, shippingZip2, shippingZip3, shippingZip4];
      for (const p of parts) {
        if (!p) continue;
        p.setCustomValidity(matches ? '' : 'Zip code does not match the selected province.');
      }
      return matches;
    }

    // Combined form validator to be called on submit
    function validateForm() {
      const okPreferred = validatePreferredName();
      const okCardName = validateCardNameMatchesOwner();
      const okZip = validateShippingZipcode();
      const okProvince = isProvinceZipMatch();
      return okPreferred && okCardName && okZip && okProvince;
    }

    function cardLengthForType(type) {
      if (type === 'American Express') return 15;
      return 16;
    }

    function validatePassword(password) {
      if (password.length < 8) {
        return 'Password must be at least eight characters long.';
      }
      if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter.';
      }
      if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one digit.';
      }
      if (!/[!@#$]/.test(password)) {
        return 'Password must contain at least one of these symbols: !, @, #, or $. ';
      }
      return '';
    }

    function updatePasswordValidation() {
      let passwordInput = document.getElementById('password');
      let confirmPasswordInput = document.getElementById('confirmPassword');
      if (!passwordInput || !confirmPasswordInput) return;

      let password = passwordInput.value;
      let confirmPassword = confirmPasswordInput.value;
      let passwordError = validatePassword(password);

      if (passwordError) {
        passwordInput.setCustomValidity(passwordError);
        errorMsg.textContent = passwordError;
        return false;
      }

      passwordInput.setCustomValidity('');
      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.setCustomValidity('Passwords do not match.');
        errorMsg.textContent = 'Passwords do not match.';
        return false;
      }

      confirmPasswordInput.setCustomValidity('');
      if (errorMsg.textContent === 'Passwords do not match.' || errorMsg.textContent === passwordError) {
        errorMsg.textContent = '';
      }
      return true;
    }

    function luhnCheck(value) {
      let sum = 0;
      let shouldDouble = false;
      for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i), 10);
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    }

    function isValidIDNumber(idNumber) {
      const digits = idNumber.replace(/\D/g, '');
      return /^\d{13}$/.test(digits) && luhnCheck(digits);
    }

    function validateCardDetails() {
      const number = cardNumber.value.replace(/\D/g, '');
      const type = detectCardType(number);
      const expectedLength = cardLengthForType(type);
      cardType.value = type;

      if (type === 'Unknown') {
        return 'Card type not recognized. Use Visa, Mastercard, American Express, or Discover.';
      }

      if (number.length !== expectedLength) {
        return `Card number must be ${expectedLength} digits for ${type}.`;
      }

      if (!luhnCheck(number)) {
        return 'Card number is invalid. Please check the digits.';
      }

      if (!expirationDate.value) {
        return 'Expiration date is required.';
      }
      const expirationMatch = expirationDate.value.match(/^(\d{2})\/(\d{4})$/);
      if (!expirationMatch) {
        return 'Expiration date must be in MM/YYYY format.';
      }
      const month = Number(expirationMatch[1]);
      const year = Number(expirationMatch[2]);
      if (month < 1 || month > 12) {
        return 'Expiration month must be between 01 and 12.';
      }
      const expiry = new Date(year, month - 1, 1);
      const today = new Date();
      if (expiry < new Date(today.getFullYear(), today.getMonth(), 1)) {
        return 'Expiration date must be in the future.';
      }

      const cvcValue = cvc.value.replace(/\D/g, '');
      const cvcLength = type === 'American Express' ? 4 : 3;
      if (cvcValue.length !== cvcLength) {
        return `CVC must be ${cvcLength} digits for ${type}.`;
      }

      return '';
    }

    cardNumber.addEventListener('input', () => {
      const numeric = cardNumber.value.replace(/\D/g, '');
      cardNumber.value = numeric;
      const type = detectCardType(numeric);
      cardType.value = type;
      cardNumber.maxLength = cardLengthForType(type);
    });

    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (passwordInput) {
      passwordInput.addEventListener('input', updatePasswordValidation);
    }
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener('input', updatePasswordValidation);
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const idNumberValue = document.getElementById('idNumber').value;

      if (!validateForm()) {
        errorMsg.textContent = 'Please fix form validation errors before submitting.';
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        errorMsg.textContent = passwordError;
        return;
      }

      if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match.';
        return;
      }

      const cardError = validateCardDetails();
      if (cardError) {
        errorMsg.textContent = cardError;
        return;
      }

      if (!isValidIDNumber(idNumberValue)) {
        errorMsg.textContent = 'ID Number must be a valid 13-digit number and pass the Luhn check.';
        return;
      }

      localStorage.setItem('preferredName', document.getElementById('preferredName').value);
      localStorage.setItem('nickname', document.getElementById('nickname').value);
      localStorage.setItem('fullName', document.getElementById('fullName').value);
      localStorage.setItem('surname', document.getElementById('surname').value);
      localStorage.setItem('username', document.getElementById('username').value);
      localStorage.setItem('idNumber', idNumberValue);
      localStorage.setItem('phone', document.getElementById('phone').value);
      localStorage.setItem('email', document.getElementById('email').value);
      localStorage.setItem('hearAboutUs', hearAboutUs.value);
      localStorage.setItem('shippingStreet', shippingStreet.value);
      localStorage.setItem('shippingBuilding', shippingBuilding.value);
      localStorage.setItem('shippingProvince', shippingProvince.value);
      localStorage.setItem('shippingTown', shippingTown.value);
      localStorage.setItem('shippingZip', shippingZip1.value + shippingZip2.value + shippingZip3.value + shippingZip4.value);
      localStorage.setItem('billingStreet', billingStreet.value);
      localStorage.setItem('billingBuilding', billingBuilding.value);
      localStorage.setItem('billingProvince', billingProvince.value);
      localStorage.setItem('billingTown', billingTown.value);
      localStorage.setItem('billingPostalCode', billingPostalCode.value);
      localStorage.setItem('cardName', cardName.value);
      localStorage.setItem('cardType', cardType.value);
      // Do not store sensitive payment data (card number / CVC) in localStorage.
      localStorage.setItem('expirationDate', expirationDate.value);
      window.location.href = 'orderConfirmation.html';
    });