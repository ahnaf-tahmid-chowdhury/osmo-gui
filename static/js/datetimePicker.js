/*TODO  Date Time Range Picker */
function today() {
  const d = new Date();
  return d;
}

window.addEventListener("load", function (event) {
  let drp = new DateRangePicker(
    "datetimerange-input",
    {
      startDate: StartDateValue,
      endDate: EndDateValue,
      //minDate: '2021-07-15 15:00',
      maxDate: () => new Date(),
      //maxSpan: { "days": 9 },
      //showDropdowns: true,
      //minYear: 2020,
      //maxYear: 2022,
      showWeekNumbers: true,
      showISOWeekNumbers: true,
      timePicker: true,
      //timePickerIncrement: 10,
      //timePicker24Hour: true,
      //timePickerSeconds: true,
      showCustomRangeLabel: true,
      alwaysShowCalendars: true,
      opens: "center",
      //drops: "up",
      //singleDatePicker: true,
      autoApply: true,

      ranges: {
        Today: [moment().startOf("day"), moment().endOf("day")],
        Yesterday: [
          moment().subtract(1, "days").startOf("day"),
          moment().subtract(1, "days").endOf("day"),
        ],
        "Last 7 Days": [
          moment().subtract(6, "days").startOf("day"),
          moment().endOf("day"),
        ],
        "This Month": [
          moment().startOf("month").startOf("day"),
          moment().endOf("month").endOf("day"),
        ],
      },
      locale: {
        format: "YYYY-MM-DD",
      },
    },
    function (start, end) {
      document.getElementById("start_datetime").value = start.format();
      document.getElementById("end_datetime").value = end.format();
      $("#datetime-form").submit();
    }
  );
});
$(document).ready(function () {
  $("#datetime-form").change(function () {
    $(this).closest("form").submit();
  });
  $(document).on("submit", "#datetime-form", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/ajax/datetime/",
      type: "POST",
      data: $(this).serialize(),
      error: function (data) {
        for (var key in data.message) {
          notifier.alert(data.message[key]);
        }
      },
    });
  });
});
//TODO: Add a function to automatically open the date picker when the user clicks on button
/* document.getElementsByName("timerange").forEach((element) => {
  element.addEventListener("click", function (event) {
    setTimeout(() => {
      document.getElementById("datetimerange-input").click();
    }, 100);
  });
}); */
