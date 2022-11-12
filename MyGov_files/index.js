let store = {
  id:null,
  certData: null,
  exportData: null,
  captchaData:{
    key: null,
    value: null,
    callback: null,
    token: null
  }
};

function getConfigs(callback = null){
  loader(true);
  const Http = new XMLHttpRequest();
  Http.open("GET", '../js/config/config.json');
  Http.send();

  Http.onreadystatechange = function () {
    loader(false);
    if(this.readyState === 4 && this.status === 200){
      const jsonData = JSON.parse(Http.responseText);
      window.config = jsonData || {};
      callback && callback();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  setIdFromQueryParam();

  getConfigs(() => {
    window.certDomItems = {
      exportBtn: document.getElementsByClassName('export-btn')[0],
      containerRc: document.getElementsByClassName('container-rc')[0],
      notFoundText: document.getElementsByClassName('not-found-text')[0]
    };

    initCaptcha();
  });
}

function setIdFromQueryParam(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  store.id = urlParams.get('id');
}

function getReferenceData(uri, callback = null) {
  //todo: remove it
  //var data = '{"timestamp":"2021-12-06 10:26:16","status":200,"description":"OK","transaction":"163b5f40-0813-453c-893b-0cd72bbf7067","appName":"mygov_personalService","exception":null,"data":{"name":"NURLAN","surname":"NURİYEV","birthdate":"20.05.1994","passportNumber":"C01576718","pin":"5RNXRR6","vaccinePassportData":{"certificateNumber":"S2021989227","vaccineName":"1st, 2nd dose - Sinovac Life Sciences Co.","manufacturerName":"1st, 2nd dose - Sinovac","vaccineBoosterName":"Booster- Sinovac Life Sciences Co.","manufacturerBoosterName":"Booster- Sinovac","country_az":"Azərbaycan Respublikası","country_en":"The Republic of Azerbaijan","disease_az":"COVID-19","disease_en":"COVID-19","status_az":"TAM PEYVƏND OLUNUB","validStatus_az":"MÜDDƏTSİZ","status_en":"FULLY VACCINATED","validStatus_en":"NON EXPIRING"},"vaccinePassportList":[{"doseLabel":"Birinci doza - First dose","vaccineType":"1","vaccineName":"Sinovac","vaccineDate":"01.04.2021","vaccineSerialNumber":"B04200010A"},{"doseLabel":"İkinci doza - Second dose","vaccineType":"2","vaccineName":"Sinovac","vaccineDate":"30.04.2021","vaccineSerialNumber":"J202103007"}],"url":"https://dev.my.gov.az/intro/external-reference/references/covid-vaccination-certificate.html?id=","name_en":"NURLAN","surname_en":"NURIYEV"}}';
  //var data = '{"timestamp":"2021-12-06 10:26:16","status":200,"description":"OK","transaction":"163b5f40-0813-453c-893b-0cd72bbf7067","appName":"mygov_personalService","exception":null,"data":{"name":"CAVİD","surname":"KƏRİMBƏYLİ","birthdate":"14.02.1993","passportNumber":"C02713255","pin":"5HYQ5C9","patronymic":"NİZAMİ OĞLU","immunePassport":{"testResultDate":"01.05.2021","validFrom":"15.05.2021","validityDate":"28.10.2021","valid":false,"testName":"COVID-19-RT-PCR","hasBooster":true,"boosterVaccine":{"vaccineType":"1","vaccineName":"Pfizer","vaccineDate":"30.09.2021","vaccineSerialNumber":"FD0927"},"certificateNumber":"I2020241323","country_az":"Azərbaycan Respublikası","country_en":"The Republic of Azerbaijan","disease_az":"COVID-19","disease_en":"COVID-19"},"url":null,"citizenship":"Azərbaycan Respublikası","name_en":"JAVID","surname_en":"KARIMBAYLI","gender_en":"MALE","gender_az":"KIŞI"}}';
  //var data = '{"timestamp":"2021-12-06 10:26:16","status":200,"description":"OK","transaction":"163b5f40-0813-453c-893b-0cd72bbf7067","appName":"mygov_personalService","exception":null,"data":{"name":"CAVİD","surname":"KƏRİMBƏYLİ","birthdate":"14.02.1993","passportNumber":"C02713255","pin":"5HYQ5C9","patronymic":"NİZAMİ OĞLU","url":null,"contraindicationPassport":{"validityDate":"29.11.2024","valid":true,"country_az":"Azərbaycan Respublikası","country_en":"The Republic of Azerbaijan","disease_az":"COVID-19","disease_en":"COVID-19","certificateNumber":"C235519"},"citizenship":"Azərbaycan Respublikası","name_en":"JAVID","surname_en":"KARIMBAYLI","gender_en":"MALE","gender_az":"KIŞI"}}';
  /*const jsonData = JSON.parse(data);
  //console.log(jsonData)
  store.certData = jsonData.data || null;
  callback && callback();
  return;
*/

  loader(true);
  const Http = new XMLHttpRequest();
  Http.open("GET", config.REFERENCE_URL + uri);
  Http.setRequestHeader("Captcha-Token", store.captchaData.token);
  Http.send();

  Http.onreadystatechange = function () {
    loader(false);
    if(this.readyState === 4 && this.status === 200){
      const jsonData = JSON.parse(Http.responseText);
      store.certData = jsonData.data || null;
      callback && callback();
    }

    if(this.readyState === 4 && this.status === 404){
      certDomItems.notFoundText.style.display = 'block';
    }
  }
}

function exportReference(uri, callback = null) {
  loader(true);
  const Http = new XMLHttpRequest();
  Http.open("GET", config.REFERENCE_EXPORT_URL + uri);
  Http.setRequestHeader("Captcha-Token", store.captchaData.token);
  Http.send();

  Http.onreadystatechange = function () {
    loader(false);

    if(this.readyState === 4 && this.status === 200){
      const jsonData = JSON.parse(Http.responseText);

      const linkSource = `data:application/pdf;base64,${jsonData.data.content}`;
      const downloadLink = document.createElement("a");
      const fileName = jsonData.data.documentId + ".pdf";

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      callback && callback();
    }
  }
}

function setCaptchaDomItems() {
  window.captchaDomItems = {
    captcha: document.getElementById('captcha'),
    captchaInput: document.getElementById('captcha-input'),
    errorSection: document.getElementsByClassName('error-section')[0],
    captchaImage: document.getElementById('captcha-image-element'),
  };
}


function initCaptcha() {
  setCaptchaDomItems();
  captchaDomItems.captcha.style.display='block';
  refreshCaptcha();
}

function refreshCaptcha() {
  captchaDomItems.captchaInput.value = "";
  captchaDomItems.errorSection.style.display = 'none';
  getNewCaptcha();
}

function getNewCaptcha(callback = null){
  /*store.captchaData.key = null;
  store.captchaData.value = null;

  captchaDomItems.captchaImage.src = null;
  callback && callback();
  return;*/
  //------------------

  loader(true);
  const Http = new XMLHttpRequest();
  Http.open("POST", config.CAPTCHA_URL + 'captchas');
  Http.send();

  Http.onreadystatechange = function () {
    loader(false);
    if(this.readyState === 4 && this.status === 200){
      const jsonData = JSON.parse(Http.responseText);
      store.captchaData.key = jsonData.key;
      store.captchaData.value = null;

      captchaDomItems.captchaImage.src = jsonData.image;
      callback && callback();
    }
  }
}

function submitCaptcha() {
  /*store.captchaData.token = 'sdfsdfsdf';
  captchaDomItems.captcha.style.display='none';

  const cb = store.captchaData.callback;
  cb && cb();
  return;*/
  //--------------

  store.captchaData.value = captchaDomItems.captchaInput.value;
  const postData = {key: store.captchaData.key, answer: store.captchaData.value};

  loader(true);
  const Http = new XMLHttpRequest();
  Http.open("POST", config.CAPTCHA_URL + 'response-tokens');
  Http.setRequestHeader("Content-type", "application/json");
  Http.send(JSON.stringify(postData));

  Http.onreadystatechange = function () {
    loader(false);
    if(this.readyState === 4 && this.status === 200){
      const jsonData = JSON.parse(Http.responseText);

      store.captchaData.token = jsonData.token;
      captchaDomItems.captcha.style.display='none';

      const cb = store.captchaData.callback;
      cb && cb();
    }

    if(this.readyState === 4 && this.status === 400){
      refreshCaptcha();
      captchaDomItems.errorSection.style.display = 'flex'
    }

  }
}

function loader(state = true) {
  document.getElementsByClassName('loader')[0].style.display = state ? 'block' : 'none';
}

