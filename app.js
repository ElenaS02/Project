const iconMap = {
  Болница: "🏥",
  Училище: "🏫",
  Пожарна: "🚒",
  Полиция: "🚓"
};

const map = L.map("map").setView([42.7339, 25.4858], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let features = [
  { name: "УМБАЛ Александровска", type: "Болница", address: "София, бул. Пенчо Славейков 1", coords: [42.6934, 23.3080] },
  { name: "УМБАЛ Св. Георги", type: "Болница", address: "Пловдив, бул. Васил Априлов 15А", coords: [42.1526, 24.7453] },
  { name: "СУ Иван Вазов", type: "Училище", address: "Стара Загора, ул. Ген. Столетов 2", coords: [42.4258, 25.6345] },
  { name: "ПМГ Акад. Никола Обрешков", type: "Училище", address: "Бургас, ул. Георги Кирков 1", coords: [42.4975, 27.4700] },
  { name: "РСПБЗН Варна", type: "Пожарна", address: "Варна, ул. Преслав 26", coords: [43.2070, 27.9190] },
  { name: "РСПБЗН Русе", type: "Пожарна", address: "Русе, ул. Борисова 85", coords: [43.8466, 25.9535] },
  { name: "ОДМВР Благоевград", type: "Полиция", address: "Благоевград, ул. Славянска 99", coords: [42.0196, 23.0975] },
  { name: "ОДМВР Велико Търново", type: "Полиция", address: "Велико Търново, ул. Никола Габровски 49", coords: [43.0757, 25.6172] },
  { name: "УМБАЛ Света Анна", type: "Болница", address: "София, бул. Цариградско шосе 100", coords: [42.6666, 23.3775] },
  { name: "МБАЛ Д-р Тота Венкова", type: "Болница", address: "Габрово, ул. Братя Жекови 1", coords: [42.8733, 25.3184] },
  { name: "МБАЛ Шумен", type: "Болница", address: "Шумен, бул. Славянски 30", coords: [43.2712, 26.9361] },
  { name: "ПГЕЕ Апостол Арнаудов", type: "Училище", address: "Русе, бул. Христо Ботев 24", coords: [43.8457, 25.9559] },
  { name: "ОУ Св. Климент Охридски", type: "Училище", address: "Смолян, ул. България 32", coords: [41.5778, 24.7012] },
  { name: "Профилирана гимназия Христо Ботев", type: "Училище", address: "Кърджали, бул. България 56", coords: [41.6505, 25.3684] },
  { name: "РСПБЗН Сливен", type: "Пожарна", address: "Сливен, бул. Пейо Яворов 10", coords: [42.6859, 26.3292] },
  { name: "РСПБЗН Плевен", type: "Пожарна", address: "Плевен, ул. Д. Константинов 1", coords: [43.4125, 24.6197] },
  { name: "РСПБЗН Смолян", type: "Пожарна", address: "Смолян, бул. България 5", coords: [41.5773, 24.7015] },
  { name: "ОДМВР Хасково", type: "Полиция", address: "Хасково, ул. Дунав 1", coords: [41.9349, 25.5550] },
  { name: "ОДМВР Силистра", type: "Полиция", address: "Силистра, бул. Македония 103", coords: [44.1172, 27.2606] },
  { name: "ОДМВР Ловеч", type: "Полиция", address: "Ловеч, ул. Търговска 5", coords: [43.1350, 24.7131] },
  { name: "СУ Никола Вапцаров", type: "Училище", address: "Петрич, ул. Христо Чернопеев", coords: [41.400191, 23.209744]},
  { name: "МБАЛ Рокфелер", type: "Болница", address: "Петрич, ул. Рокфелер 54", coords: [41.397670, 23.205496] },
  { name: "УМБАЛ Бургас", type: "Болница", address: "Бургас, бул. Стефан Стамболов 73", coords: [42.5065, 27.4656]},
  { name: "МБАЛ Хасково", type: "Болница", address: "Хасково, ул. Славянска 52", coords: [41.9381, 25.5630]},
  { name: "СУ Васил Левски", type: "Училище", address: "Плевен, ул. Васил Левски 60", coords: [43.4108, 24.6194]},
  { name: "ПГ по Електротехника", type: "Училище", address: "Силистра, ул. Добруджа 14", coords: [44.1133, 27.2674]},
  { name: "РСПБЗН Смядово", type: "Пожарна", address: "Смядово, ул. Христо Ботев 12", coords: [43.0004, 27.0191]},
  { name: "РСПБЗН Перник", type: "Пожарна", address: "Перник, ул. Юрий Гагарин 4", coords: [42.6087, 23.0293]},
  { name: "ОДМВР Перник", type: "Полиция", address: "Перник, ул. Раковска 1", coords: [42.6092, 23.0300]},
  { name: "ОДМВР Видин", type: "Полиция", address: "Видин, ул. Цар Симеон Велики 67", coords: [43.9924, 22.8723]}




];

let markers = [];

const tbody = document.querySelector("#attributeTable tbody");

function renderTable(filterType = "all") {
  tbody.innerHTML = "";
  features.forEach((feature, index) => {
    if (filterType === "all" || feature.type === filterType) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${feature.name}</td>
        <td>${feature.type}</td>
        <td>${feature.address}</td>
        <td>
          <button onclick="zoomTo(${index})">🔍Приближи</button>
          <button onclick="deleteFeature(${index})">🗑️Изтрий</button>
          <button onclick="editFeature(${index})">✏️Редактирай</button>
        </td>
      `;
      tbody.appendChild(row);
    }
  });
}

function zoomTo(index) {
  const feature = features[index];
  map.setView(feature.coords, 15);
}

function deleteFeature(index) {
  features.splice(index, 1);
  renderTable();
  renderMarkers();
}

function editFeature(index) {
  const f = features[index];
  const newName = prompt("Ново име:", f.name);
  const newType = prompt("Нов тип (Болница, Училище, Пожарна, Полиция):", f.type);
  const newAddress = prompt("Нов адрес:", f.address);
  const newLat = parseFloat(prompt("Нова ширина:", f.coords[0]));
  const newLng = parseFloat(prompt("Нова дължина:", f.coords[1]));

  if (newName && newType && newAddress && !isNaN(newLat) && !isNaN(newLng)) {
    features[index] = {
      name: newName,
      type: newType,
      address: newAddress,
      coords: [newLat, newLng]
    };
    renderTable();
    renderMarkers();
  }
}

function renderMarkers(filterType = "all") {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  features.forEach((feature) => {
    if (filterType === "all" || feature.type === filterType) {
      const marker = L.marker(feature.coords, {
        icon: L.divIcon({
          className: 'emoji-icon',
          html: `<span style="font-size: 24px;">${iconMap[feature.type] || "⚪"}</span>`
        })
      }).addTo(map).bindPopup(`<strong>${feature.name}</strong><br>${feature.address}`);
      markers.push(marker);
    }
  });
}

function setupFilter() {
  const container = document.createElement("div");
  container.style.margin = "10px";

  const label = document.createElement("label");
  label.textContent = "Тип обект: ";
  container.appendChild(label);

  const select = document.createElement("select");
  select.innerHTML = `
    <option value="all">Всички</option>
    <option value="Болница">Болница</option>
    <option value="Училище">Училище</option>
    <option value="Пожарна">Пожарна</option>
    <option value="Полиция">Полиция</option>
  `;
  select.onchange = () => {
    renderTable(select.value);
    renderMarkers(select.value);
  };
  container.appendChild(select);

  document.body.insertBefore(container, document.getElementById("map"));
}

function setupAddForm() {
  const form = document.createElement("form");
  form.style.margin = "10px";
  form.innerHTML = `
    <h3>Добавяне на нов обект</h3>
    <input placeholder="Име" id="nameInput" required />
    <input placeholder="Адрес" id="addressInput" required />
    <input placeholder="Ширина (lat)" id="latInput" type="number" step="any" required />
    <input placeholder="Дължина (lng)" id="lngInput" type="number" step="any" required />
    <select id="typeInput">
      <option value="Болница">Болница</option>
      <option value="Училище">Училище</option>
      <option value="Пожарна">Пожарна</option>
      <option value="Полиция">Полиция</option>
    </select>
    <button type="submit">➕ Добави</button>
  `;

form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("nameInput").value;
    const address = document.getElementById("addressInput").value;
    const lat = parseFloat(document.getElementById("latInput").value);
    const lng = parseFloat(document.getElementById("lngInput").value);
    const type = document.getElementById("typeInput").value;

     features.push({ name, address, coords: [lat, lng], type });
     map.setView([lat, lng], 15);
    renderTable();
    renderMarkers();
    form.reset();
  };

  document.body.insertBefore(form, document.getElementById("map"));
  function haversineDistance(coord1, coord2) {
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371; 
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);
  const lat1 = toRad(coord1[0]);
  const lat2 = toRad(coord2[0]);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

let analysisLines = [];
document.getElementById("analyzeBtn").addEventListener("click", runGeoAnalysis);

function runGeoAnalysis() {
  analysisLines.forEach(line => map.removeLayer(line));
  analysisLines = [];

  const Училище = features.filter(f => f.type === "Училище");
  const Болница = features.filter(f => f.type === "Болница");

  Училище.forEach(Училище => {
    let nearest = null;
    let minDist = Infinity;

    Болница.forEach(Болница => {
      const dist = haversineDistance(Училище.coords, Болница.coords);
      if (dist < minDist) {
        minDist = dist;
        nearest = Болница;
      }
    });

    if (nearest) {
      const line = L.polyline([Училище.coords, nearest.coords], {
        color: "blue",
        weight: 2,
        dashArray: "4",
      }).addTo(map);

      line.bindPopup(
        `<strong>${Училище.name}</strong> → <strong>${nearest.name}</strong><br>Разстояние: ${minDist.toFixed(2)} km`
      );
      analysisLines.push(line);
    }
  });
}
}

document.getElementById("downloadBtn").addEventListener("click", function() {
  const data = JSON.stringify(features, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "public_services_data.json";
  a.click();
  URL.revokeObjectURL(url);
});


setupFilter();
setupAddForm();
renderTable();
renderMarkers();
