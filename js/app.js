// js/app.js
$(document).ready(function() {
  let data = JSON.parse(localStorage.getItem('electricityData')) || [
    { month: '24-Jan', consumption: 322, cost: 114.99, provider: 'elpedison' },
    { month: '24-Feb', consumption: 341, cost: 108.21, provider: 'elpedison' },
    { month: '24-Mar', consumption: 256, cost: 74.64, provider: 'elpedison' },
    { month: '24-Apr', consumption: 204, cost: 82.09, provider: 'elpedison' },
    { month: '24-May', consumption: 209, cost: 81.11, provider: 'elpedison' },
    { month: '24-Jun', consumption: 293, cost: 95.41, provider: 'elpedison' },
    { month: '24-Jul', consumption: 559, cost: 179.54, provider: 'elpedison' },
    { month: '24-Aug', consumption: 560, cost: 180.01, provider: 'elpedison' },
    { month: '24-Sep', consumption: 442, cost: 143.61, provider: 'elpedison' },
    { month: '24-Oct', consumption: 292, cost: 95.15, provider: 'elpedison' },
    { month: '24-Nov', consumption: 208, cost: 79, provider: 'elpedison' },
    { month: '24-Dec', consumption: 381, cost: 113.24, provider: 'elpedison' },
    { month: '25-Jan', consumption: 180, cost: 45.1, provider: 'zenith' },
    { month: '25-Feb', consumption: 505, cost: 99.14, provider: 'zenith' },
    { month: '25-Mar', consumption: 426, cost: 99.14, provider: 'zenith' },
    { month: '25-Apr', consumption: 245, cost: 61.03, provider: 'zenith' },
    { month: '25-May', consumption: 236, cost: 71, provider: 'zenith' },
    { month: '25-Jun', consumption: 353, cost: 91.73, provider: 'zenith' },
    { month: '25-Jul', consumption: 404, cost: 103.22, provider: 'zenith' },
    { month: '25-Aug', consumption: 287, cost: 101.35, provider: 'protergia' },
    { month: '25-Sep', consumption: 535, cost: 129.14, provider: 'protergia' }
  ];

  function saveData() { localStorage.setItem('electricityData', JSON.stringify(data)); }

  function updateTable() {
    const tbody = $('#data-table tbody');
    tbody.empty();
    data.forEach(d => {
      tbody.append(`<tr><td>${d.month}</td><td>${d.consumption}</td><td>${d.cost}</td><td>${d.provider}</td></tr>`);
    });
  }

  function populateFilters() {
    const years = [...new Set(data.map(d => d.month.split('-')[0]))];
    const months = [...new Set(data.map(d => d.month.split('-')[1]))];
    const providers = [...new Set(data.map(d => d.provider))];

    $('#filter-year').empty().append('<option>Όλα</option>');
    years.forEach(y => $('#filter-year').append(`<option>${y}</option>`));

    $('#filter-month').empty().append('<option>Όλοι</option>');
    months.forEach(m => $('#filter-month').append(`<option>${m}</option>`));

    $('#filter-provider').empty().append('<option>Όλοι</option>');
    providers.forEach(p => $('#filter-provider').append(`<option>${p}</option>`));
  }

  function filteredData() {
    const year = $('#filter-year').val();
    const month = $('#filter-month').val();
    const provider = $('#filter-provider').val();
    return data.filter(d =>
      (year === 'Όλα' || d.month.split('-')[0] === year) &&
      (month === 'Όλοι' || d.month.split('-')[1] === month) &&
      (provider === 'Όλοι' || d.provider === provider)
    );
  }

  let consumptionChart, costChart;

  function updateCharts() {
    const fd = filteredData();
    const labels = fd.map(d => d.month);
    const consumptionData = fd.map(d => d.consumption);
    const costData = fd.map(d => d.cost);

    if(consumptionChart) { consumptionChart.destroy(); costChart.destroy(); }

    const ctx1 = $('#consumptionChart');
    consumptionChart = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{ label: 'Κατανάλωση (kWh)', data: consumptionData, backgroundColor: '#3b82f6' }]
      },
      options: { responsive: true, plugins: { tooltip: { mode: 'index', intersect: false } } }
    });

    const ctx2 = $('#costChart');
    costChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{ label: 'Κόστος (€)', data: costData, backgroundColor: '#10b981' }]
      },
      options: { responsive: true, plugins: { tooltip: { mode: 'index', intersect: false } } }
    });
  }

  $('#add-entry').click(function() {
    const month = $('#month').val();
    const consumption = parseFloat($('#consumption').val());
    const cost = parseFloat($('#cost').val());
    const provider = $('#provider').val();
    if(month && !isNaN(consumption) && !isNaN(cost) && provider) {
      data.push({ month, consumption, cost, provider });
      saveData(); updateTable(); populateFilters(); updateCharts();
      $('#month,#consumption,#cost,#provider').val('');
    }
  });

  $('.tab-button').click(function() {
    $('.tab-button').removeClass('active'); $(this).addClass('active');
    $('.tab-content').removeClass('active');
    $('#' + $(this).data('tab')).addClass('active');
    updateCharts();
  });

  $('#filter-year,#filter-month,#filter-provider').change(updateCharts);

  updateTable(); populateFilters(); updateCharts();
});
