const map = L.map('map').setView([42.7339, 25.4858], 7); // Център на България;
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let features = [];
let markers = [];
let bufferLayers = [];
let selectedCoords = null;

// Зареждане от localStorage
if (localStorage.getItem('services')) {
  features = JSON.parse(localStorage.getItem('services'));
} else {
  features = [
    {
      name: 'Първа градска болница',
      type: 'hospital',
      address: 'ул. Здраве 12',
      coords: [42.698, 23.322]
    },
    {
      name: 'Пожарна Слатина',
      type: 'fire',
      address: 'ул. Искър 9',
      coords: [42.700, 23.335]
    }
  ];
  saveToStorage();
}

// Емоджи икони
function getEmojiIcon(type) {
  const emojis = {
    hospital: '🏥',
    school: '🏫',
    fire: '🚒',
    police: '🚓',
    unknown: '❓'
  };

  return L.divIcon({
    className: 'emoji-icon',
    html: `<span style="font-size: 24px;">${emojis[type] || emojis.unknown}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

function renderMap() {
  markers.forEach(m => map.removeLayer(m));
  bufferLayers.forEach(l => map.removeLayer(l));
  markers = [];
  bufferLayers = [];

  const filter = document.getElementById('filterType').value;
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = "";

  features.forEach((f, index) => {
    if (filter !== 'all' && f.type !== filter) return;

    const marker = L.marker(f.coords, { icon: getEmojiIcon(f.type) })
      .addTo(map)
      .bindPopup(`<b>${f.name}</b><br>${f.address}`);
    markers.push(marker);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${f.name}</td>
      <td>${f.type}</td>
      <td>${f.address}</td>
      <td>
        <button onclick="zoomTo(${index})">Zoom</button>
        <button onclick="deleteFeature(${index})">Изтрий</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function zoomTo(index) {
  map.setView(features[index].coords, 16);
}

function deleteFeature(index) {
  features.splice(index, 1);
  saveToStorage();
  renderMap();
}

function toggleForm() {
  const form = document.getElementById('form');
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
}

function startAddMode() {
  alert("Кликни на картата, за да избереш местоположение.");
  map.once('click', e => {
    selectedCoords = [e.latlng.lat, e.latlng.lng];
    alert("Местоположението е избрано.");
  });
}

function saveFeature() {
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const type = document.getElementById('type').value;

  if (!name || !address || !type || !selectedCoords) {
    alert("Моля попълни всички полета и избери място.");
    return;
  }

  features.push({ name, address, type, coords: selectedCoords });
  selectedCoords = null;
  saveToStorage();
  renderMap();
  toggleForm();
  document.getElementById('name').value = '';
  document.getElementById('address').value = '';
}

function saveToStorage() {
  localStorage.setItem('services', JSON.stringify(features));
}

document.getElementById('filterType').addEventListener('change', renderMap);

function drawBuffers() {
  bufferLayers.forEach(l => map.removeLayer(l));
  bufferLayers = [];

  features.forEach(f => {
    if (f.type === 'hospital') {
      const circle = L.circle(f.coords, {
        radius: 500,
        color: 'red',
        fillOpacity: 0.2
      }).addTo(map);
      bufferLayers.push(circle);
    }
  });
}

function exportGeoJSON() {
  const geojson = {
    type: "FeatureCollection",
    features: features.map(f => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [f.coords[1], f.coords[0]]
      },
      properties: {
        name: f.name,
        type: f.type,
        address: f.address
      }
    }))
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "public_services.geojson";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importGeoJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const geojson = JSON.parse(e.target.result);
      if (geojson.type !== "FeatureCollection") {
        alert("Невалиден GeoJSON формат.");
        return;
      }

      geojson.features.forEach(feature => {
        if (
          feature.geometry?.type === "Point" &&
          Array.isArray(feature.geometry.coordinates)
        ) {
          const [lng, lat] = feature.geometry.coordinates;
          const props = feature.properties || {};
          features.push({
            name: props.name || "Без име",
            type: props.type || "unknown",
            address: props.address || "",
            coords: [lat, lng]
          });
        }
      });

      saveToStorage();
      renderMap();
      alert("Успешен импорт!");
    } catch (err) {
      alert("Грешка при четене на GeoJSON.");
    }
  };

  reader.readAsText(file);
}

renderMap();
