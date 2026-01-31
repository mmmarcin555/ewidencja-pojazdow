var EwidencjaWeb = (function () {
  var lista = [];
  var indeksUsuwany = null;
  var rejPattern = /^[A-Za-z0-9\s\-]{2,10}$/;

  var elem = {
    komunikaty: document.getElementById('komunikaty'),
    listaPojazdow: document.getElementById('listaPojazdow'),
    formularz: document.getElementById('formularzPojazd'),
    modalForm: document.getElementById('modalFormularz'),
    modalUsun: document.getElementById('modalUsunPotwierdzenie'),
    indeksEdycji: document.getElementById('indeksEdycji'),
    tytulForm: document.getElementById('tytulFormularza'),
    przyciskZapisz: document.getElementById('przyciskZapisz'),
    tekstUsuwanyRej: document.getElementById('tekstUsuwanyRej'),
    przyciskPotwierdzUsun: document.getElementById('przyciskPotwierdzUsun'),
    poleRej: document.getElementById('poleRej'),
    poleMarka: document.getElementById('poleMarka'),
    poleModel: document.getElementById('poleModel'),
    poleRok: document.getElementById('poleRok'),
    poleDataPrzeglad: document.getElementById('poleDataPrzeglad'),
    poleWlasciciel: document.getElementById('poleWlasciciel')
  };

  function pokazKomunikat(tekst, czySukces) {
    var id = 'kom-' + Date.now();
    var klasa = czySukces ? 'alert-success komunikat-sukces' : 'alert-danger komunikat-blad';
    var html = '<div id="' + id + '" class="alert ' + klasa + ' alert-dismissible fade show" role="alert">' + tekst + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    elem.komunikaty.insertAdjacentHTML('beforeend', html);
    setTimeout(function () {
      var el = document.getElementById(id);
      if (el && bootstrap.Alert) {
        var a = bootstrap.Alert.getOrCreateInstance(el);
        a.close();
      }
    }, 5000);
  }

  function czyPoprawnyRej(v) {
    return typeof v === 'string' && rejPattern.test(v.trim());
  }

  function czyPoprawnyRok(v) {
    var n = parseInt(v, 10);
    return !isNaN(n) && n >= 1900 && n <= 2030;
  }

  function czyPoprawnaData(v) {
    if (!v) return false;
    var d = new Date(v);
    return !isNaN(d.getTime());
  }

  function escapeTekst(s) {
    if (s == null) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function formatujDate(s) {
    if (!s) return '';
    var d = new Date(s);
    if (isNaN(d.getTime())) return s;
    var r = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dz = String(d.getDate()).padStart(2, '0');
    return dz + '.' + m + '.' + r;
  }

  function rysujTabele() {
    elem.listaPojazdow.innerHTML = '';
    for (var i = 0; i < lista.length; i++) {
      var p = lista[i];
      var wiersz = document.createElement('tr');
      wiersz.innerHTML = '<td>' + escapeTekst(p.rej) + '</td><td>' + escapeTekst(p.marka) + '</td><td>' + escapeTekst(p.model) + '</td><td>' + p.rok + '</td><td>' + formatujDate(p.dataPrzeglad) + '</td><td>' + escapeTekst(p.wlasciciel) + '</td><td class="text-end"><button type="button" class="btn btn-sm btn-outline-primary me-1 btn-edytuj" data-idx="' + i + '">Edytuj</button><button type="button" class="btn btn-sm btn-outline-danger btn-usun" data-idx="' + i + '">Usuń</button></td>';
      elem.listaPojazdow.appendChild(wiersz);
    }
    elem.listaPojazdow.querySelectorAll('.btn-edytuj').forEach(function (b) {
      b.addEventListener('click', otworzEdycje);
    });
    elem.listaPojazdow.querySelectorAll('.btn-usun').forEach(function (b) {
      b.addEventListener('click', otworzPotwierdzenieUsun);
    });
  }

  function wyczyscFormularz() {
    elem.indeksEdycji.value = '';
    elem.formularz.reset();
    [elem.poleRej, elem.poleMarka, elem.poleRok, elem.poleDataPrzeglad, elem.poleWlasciciel].forEach(function (f) {
      if (f) f.classList.remove('is-invalid');
    });
  }

  function otworzDodawanie() {
    elem.tytulForm.textContent = 'Dodaj pojazd';
    elem.przyciskZapisz.textContent = 'Zapisz';
    wyczyscFormularz();
  }

  function otworzEdycje(ev) {
    var idx = parseInt(ev.currentTarget.getAttribute('data-idx'), 10);
    var p = lista[idx];
    elem.tytulForm.textContent = 'Edytuj pojazd';
    elem.przyciskZapisz.textContent = 'Zapisz';
    elem.indeksEdycji.value = String(idx);
    elem.poleRej.value = p.rej;
    elem.poleMarka.value = p.marka;
    elem.poleModel.value = p.model || '';
    elem.poleRok.value = String(p.rok);
    elem.poleDataPrzeglad.value = p.dataPrzeglad ? p.dataPrzeglad.substring(0, 10) : '';
    elem.poleWlasciciel.value = p.wlasciciel;
    var modal = new bootstrap.Modal(elem.modalForm);
    modal.show();
  }

  function otworzPotwierdzenieUsun(ev) {
    var idx = parseInt(ev.currentTarget.getAttribute('data-idx'), 10);
    indeksUsuwany = idx;
    elem.tekstUsuwanyRej.textContent = lista[idx].rej;
    var modal = new bootstrap.Modal(elem.modalUsun);
    modal.show();
  }

  function zapiszPojazd(ev) {
    ev.preventDefault();
    var rej = elem.poleRej.value.trim();
    var marka = elem.poleMarka.value.trim();
    var model = elem.poleModel.value.trim();
    var rokVal = elem.poleRok.value;
    var dataVal = elem.poleDataPrzeglad.value;
    var wlasciciel = elem.poleWlasciciel.value.trim();

    var ok = true;
    if (!czyPoprawnyRej(rej)) {
      elem.poleRej.classList.add('is-invalid');
      ok = false;
    } else elem.poleRej.classList.remove('is-invalid');
    if (!marka) {
      elem.poleMarka.classList.add('is-invalid');
      ok = false;
    } else elem.poleMarka.classList.remove('is-invalid');
    if (!czyPoprawnyRok(rokVal)) {
      elem.poleRok.classList.add('is-invalid');
      ok = false;
    } else elem.poleRok.classList.remove('is-invalid');
    if (!czyPoprawnaData(dataVal)) {
      elem.poleDataPrzeglad.classList.add('is-invalid');
      ok = false;
    } else elem.poleDataPrzeglad.classList.remove('is-invalid');
    if (!wlasciciel) {
      elem.poleWlasciciel.classList.add('is-invalid');
      ok = false;
    } else elem.poleWlasciciel.classList.remove('is-invalid');
    if (!ok) {
      pokazKomunikat('Sprawdź pola formularza.', false);
      return;
    }

    var rekord = {
      rej: rej,
      marka: marka,
      model: model,
      rok: parseInt(rokVal, 10),
      dataPrzeglad: dataVal,
      wlasciciel: wlasciciel
    };
    var idxStr = elem.indeksEdycji.value;
    if (idxStr !== '') {
      var i = parseInt(idxStr, 10);
      if (i >= 0 && i < lista.length) {
        lista[i] = rekord;
        pokazKomunikat('Pojazd zaktualizowany.', true);
      }
    } else {
      lista.push(rekord);
      pokazKomunikat('Pojazd dodany do rejestru.', true);
    }
    rysujTabele();
    bootstrap.Modal.getInstance(elem.modalForm).hide();
  }

  function wykonajUsuniecie() {
    if (indeksUsuwany !== null) {
      lista.splice(indeksUsuwany, 1);
      indeksUsuwany = null;
      rysujTabele();
      bootstrap.Modal.getInstance(elem.modalUsun).hide();
      pokazKomunikat('Pojazd usunięty z rejestru.', true);
    }
  }

  function init() {
    document.getElementById('przyciskDodaj').addEventListener('click', otworzDodawanie);
    elem.modalForm.addEventListener('show.bs.modal', function (e) {
      if (e.relatedTarget && e.relatedTarget.id === 'przyciskDodaj') otworzDodawanie();
    });
    elem.modalForm.addEventListener('hidden.bs.modal', wyczyscFormularz);
    elem.formularz.addEventListener('submit', zapiszPojazd);
    elem.przyciskPotwierdzUsun.addEventListener('click', wykonajUsuniecie);
    rysujTabele();
  }

  return { init: init };
})();
document.addEventListener('DOMContentLoaded', EwidencjaWeb.init);
