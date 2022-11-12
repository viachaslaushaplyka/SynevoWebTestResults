
function setCovidVaccinationCertificateDataOnTemplate() {
  
    function setInnerHTML(id, value){
      document.getElementById(id).innerHTML = value;
    }
  
    function getValidStatus(vaccinePassportData){
      if(!vaccinePassportData) return null;
      let status = [];
      const {validStatus_az, validStatus_en} = vaccinePassportData;
      validStatus_az && status.push(validStatus_az);
      validStatus_en && status.push(validStatus_en);
  
      return status.join(' / ');
    }


    setInnerHTML("surname", store.certData.surname + ' / ' + store.certData.surname_en);    
    setInnerHTML("name", store.certData.name + ' / ' + store.certData.name_en);  
    setInnerHTML("patronymic", store.certData.patronymic);  
    setInnerHTML("gender", store.certData.gender_az + ' / ' + store.certData.gender_en);
    setInnerHTML("birthdate", store.certData.birthdate);
    setInnerHTML("citizenship", store.certData.citizenship);
    setInnerHTML("passportNumber", store.certData.passportNumber);
    setInnerHTML("pin", store.certData.pin);
    
    if(store.certData.vaccinePassportData){
      const vaccinePassportData = store.certData.vaccinePassportData;
  
      const vaccineName = vaccinePassportData.vaccineName;
      const manufacturerName = vaccinePassportData.manufacturerName;
  
      setInnerHTML("vaccineName", vaccineName);
      setInnerHTML("manufacturer", manufacturerName);
      setInnerHTML("disease", vaccinePassportData.disease_en);
      setInnerHTML("country", vaccinePassportData.country_az + ' / ' + vaccinePassportData.country_en)
      setInnerHTML("status", vaccinePassportData.status_az + ' / ' + vaccinePassportData.status_en);
      setInnerHTML("validStatus", getValidStatus(vaccinePassportData));
      setInnerHTML("certificateNumber", vaccinePassportData.certificateNumber);
    }
    
    let vaccineInfoHtml = '';
    store.certData.vaccinePassportList.forEach((dose)=>{
      vaccineInfoHtml += '<tr>' +
                            '<td>' + dose.doseLabel + '</td>' +
                            '<td>' + dose.vaccineDate + '</td>' +
                            '<td>' + dose.vaccineSerialNumber + '</td>' +
                        '</tr>';
    });


    vaccineInfoHtml = '<table border="1">' +
                            '<tr>' +
                                '<th>' +
                                    'Dozaların sıra sayı <br>' +
                                    'Number of doses' +
                                '</th>' +
                                '<th>' +
                                    'Vurulduğu tarixlər <br>' +
                                    'Injection dates' +
                                '</th>' +
                                '<th>' +
                                    'Seriya nömrələri <br>' +
                                    'Batch numbers' +
                                '</th>' +
                            '</tr>' +
                            vaccineInfoHtml +
                        '</table>';
  
    setInnerHTML("vaccineInfoSection", vaccineInfoHtml)
  
}
  
  
function exportCovidVaccinationCertificate(){
  store.captchaData.callback = function(){
    certDomItems.exportBtn.style.display = 'flex';
    exportReference('vaccinePassportInfo/' + store.id);
  };

  certDomItems.exportBtn.style.display = 'none';
  initCaptcha();
}


store.captchaData.callback = function(){
  getReferenceData('vaccinePassportInfo/' + store.id, function () {
    certDomItems.containerRc.style.display = 'block';
    certDomItems.exportBtn.style.display = 'flex';

    setCovidVaccinationCertificateDataOnTemplate();
  });
};
  
  
  /*setTimeout(()=>{
    window.certDomItems = {
      exportBtn: document.getElementsByClassName('export-btn')[0],
      containerRc: document.getElementsByClassName('container-rc')[0]
    };
  
    initCaptcha();
  }, 0);*/
