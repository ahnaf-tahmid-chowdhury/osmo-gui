// TODO: Tables
var SubscribersList = [];
var SubscribersDataTable = $("#device-datatable").DataTable({
  data: SubscribersList,
  columns: [
    { title: "ID" },
    { title: "MSISDN" },
    { title: "IMSI" },
    { title: "IMEI" },
    { title: "NAM" },
  ],
  paging: true,
  pageLength: 15,
  lengthMenu: [10, 15, 20, 25, 30, 35, 40, 50, 75, 100],
  scrollCollapse: true,
  info: true,
  deferRender: true,
  colReorder: true,
  autofill: true,
  searching: true,
  responsive: true,
  scrollX: true,
  bPaginate: false,
  bFilter: false,
  bAutoWidth: false,
  rowGroup: {
    dataSrc: 4,
  },
  columnDefs: [
    {
      targets: [0, 1, 2, 3, 4],
      className: "dt-center",
    },
    {
      visible: false,
      targets: [4],
    },
  ],
});

// TODO: Get subscribers data
getSubscribersList("/hlr/ajax/subscribers/");

async function getSubscribersList(file) {
  let myObject = await fetch(file);
  let myText = await myObject.text();
  SubscribersList = JSON.parse(myText);
  for (let i = 0; i < SubscribersList.length; i++) {
    SubscribersList[i][0] =
      "<form class='subscriber-info' method='POST'><input type='hidden' name='imsi' value=" +
      SubscribersList[i][2] +
      "><button type='submit' class='button-table-data'>" +
      SubscribersList[i][0] +
      "</button></form>";
  }

  SubscribersDataTable.clear();
  SubscribersDataTable.rows.add(SubscribersList);
  SubscribersDataTable.draw();
  SubscribersDataTable.responsive.recalc();
  SubscribersDataTable.columns.adjust();
  //SubscribersDataTable.destroy();
  //$("#device-datatable").empty();
}
// TODO: Add subscriber
$(document).on("submit", "#add-device-form", function (e) {
  e.preventDefault();
  $.ajax({
    url: "/hlr/ajax/subscribers/add/",
    type: "POST",
    data: new FormData(this),
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          $("#add-device-form .button").html("<div class='loader'></div> ");
        }
      });
      return xhr;
    },
    success: function (data) {
      if (data.status == "success") {
        notifier.success(data.message);
        getSubscribersList("/hlr/ajax/subscribers/");
      }
      if (data.status == "error") {
        notifier.alert(data.message);
      }
      $("#add-device-form .button").html("Register");
    },
    processData: false,
    contentType: false,
    cache: false,
  });
});
// TODO: Delete subscriber
$(document).on("submit", "#remove-device-form", function (e) {
  e.preventDefault();
  $.ajax({
    url: "/hlr/ajax/subscribers/remove/",
    type: "POST",
    data: new FormData(this),
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          $("#remove-device-form .button").html("<div class='loader'></div> ");
        }
      });
      return xhr;
    },
    success: function (data) {
      console.log(data);
      if (data.status == "success") {
        notifier.info(data.message);
        getSubscribersList("/hlr/ajax/subscribers/");
      }
      if (data.status == "error") {
        notifier.alert(data.message);
      }
      $("#remove-device-form .button").html(
        "Yes, I want to remove this subscriber"
      );
    },
    processData: false,
    contentType: false,
    cache: false,
  });
});
// TODO: Get subscriber info
$(document).on("submit", ".subscriber-info", function (e) {
  e.preventDefault();
  $.ajax({
    url: "/hlr/ajax/subscribers/info/",
    type: "POST",
    data: new FormData(this),
    success: function (data) {
      $("#subscriber-info-hider").hide();
      $("#subscriber-info").show();
      $("#subscriber-imei").val("");
      $("#subscriber-nam").html("");
      $("#subscriber-vlr").html("");
      $("#subscriber-luoncs").html("");
      $("#subscriber-2g option[value='none']")
        .attr("selected", true)
        .siblings()
        .attr("selected", false)
        .change();
      $("#subscriber-2g").val("none").change();
      $("#subscriber-2g")
        .parents(".custom-select-wrapper")
        .find(".custom-select-trigger")
        .text("none");
      $("#subscriber-2g")
        .parents(".custom-select-wrapper")
        .find(".custom-options span[data-value='none']")
        .addClass("selection")
        .siblings()
        .removeClass("selection");
      $("#subscriber-2g-ki").val("");

      $("#subscriber-3g option[value='none']")
        .attr("selected", true)
        .siblings()
        .attr("selected", false)
        .change();
      $("#subscriber-3g").val("none").change();
      $("#subscriber-3g")
        .parents(".custom-select-wrapper")
        .find(".custom-select-trigger")
        .text("none");
      $("#subscriber-3g")
        .parents(".custom-select-wrapper")
        .find(".custom-options span[data-value='none']")
        .addClass("selection")
        .siblings()
        .removeClass("selection");
      $("#subscriber-3g-k").val("");
      $("#subscriber-3g-op").val("");
      $("#subscriber-3g-opc").val("");
      $("#subscriber-3g-ind").html("");

      for (let i = 0; i < data.length; i++) {
        if (data[i][0] == "ID") {
          $("#subscriber-id").html(data[i][1]);
        }
        if (data[i][0] == "MSISDN") {
          $("#subscriber-msisdn").val(data[i][1]);
        }
        if (data[i][0] == "IMSI") {
          $("#subscriber-imsi").html(data[i][1]);
          $("#subscriber-imsi-val").val(data[i][1]);
        }
        if (data[i][0] == "IMEI") {
          $("#subscriber-imei").val(data[i][1]);
        }
        if (data[i][0] == "NAM") {
          $("#subscriber-nam").html(data[i][1]);
        }
        if (data[i][0] == "VLRnumber") {
          $("#subscriber-vlr").html(data[i][1]);
        }
        if (data[i][0] == "lastLUseenonCS") {
          $("#subscriber-luoncs").html(
            moment(data[i][1]).format("YYYY-MM-DD HH:mm:ss") +
              "<br>" +
              data[i][2]
          );
        }
        if (data[i][0] == "2Gauth") {
          $("#subscriber-2g option[value=" + data[i][1].toLowerCase() + "]")
            .attr("selected", true)
            .siblings()
            .attr("selected", false)
            .change();
          $("#subscriber-2g").val(data[i][1].toLowerCase()).change();
          $("#subscriber-2g")
            .parents(".custom-select-wrapper")
            .find(".custom-select-trigger")
            .text(data[i][1].toLowerCase());
          $("#subscriber-2g")
            .parents(".custom-select-wrapper")
            .find(
              ".custom-options span[data-value=" +
                data[i][1].toLowerCase() +
                "]"
            )
            .addClass("selection")
            .siblings()
            .removeClass("selection");
        }
        if (data[i][0] == "KI") {
          $("#subscriber-2g-ki").val(data[i][1]);
        }
        if (data[i][0] == "3Gauth") {
          $("#subscriber-3g option[value=" + data[i][1].toLowerCase() + "]")
            .attr("selected", true)
            .siblings()
            .attr("selected", false)
            .change();
          $("#subscriber-3g").val(data[i][1].toLowerCase()).change();
          $("#subscriber-3g")
            .parents(".custom-select-wrapper")
            .find(".custom-select-trigger")
            .text(data[i][1].toLowerCase());
          $("#subscriber-3g")
            .parents(".custom-select-wrapper")
            .find(
              ".custom-options span[data-value=" +
                data[i][1].toLowerCase() +
                "]"
            )
            .addClass("selection")
            .siblings()
            .removeClass("selection");
        }
        if (data[i][0] == "K") {
          $("#subscriber-3g-k").val(data[i][1]);
        }
        if (data[i][0] == "OP") {
          $("#subscriber-3g-op").val(data[i][1]);
          $("#subscriber-3g-opc-box").hide();
        }
        if (data[i][0] == "OPC") {
          $("#subscriber-3g-opc").val(data[i][1]);
          $("#subscriber-3g-op-box").hide();
        }
        if (data[i][0] == "IND-bitlen") {
          $("#subscriber-3g-ind").html(data[i][1]);
        }
      }
    },
    processData: false,
    contentType: false,
    cache: false,
  });
});
$("#subscriber-2g")
  .parents(".custom-select-wrapper")
  .find(".custom-option")
  .click(function () {
    if ($(this).text() == "none") {
      $("#subscriber-2g-ki-box").hide();
    } else {
      $("#subscriber-2g-ki-box").show();
    }
  });
$("#subscriber-2g").change(function () {
  if ($(this).val() == "none") {
    $("#subscriber-2g-ki-box").hide();
  } else {
    $("#subscriber-2g-ki-box").show();
  }
});
$("#subscriber-3g")
  .parents(".custom-select-wrapper")
  .find(".custom-option")
  .click(function () {
    if ($(this).text() == "none") {
      $("#subscriber-3g-k-box").hide();
      $("#subscriber-3g-op-box").hide();
      $("#subscriber-3g-opc-box").hide();
      $("#subscriber-3g-ind-box").hide();
    } else if ($(this).text() == "xor") {
      $("#subscriber-3g-k-box").show();
      $("#subscriber-3g-op-box").hide();
      $("#subscriber-3g-opc-box").hide();
      $("#subscriber-3g-ind-box").show();
    } else {
      $("#subscriber-3g-k-box").show();
      $("#subscriber-3g-op-box").show();
      $("#subscriber-3g-opc-box").show();
      $("#subscriber-3g-ind-box").show();
    }
  });
$("#subscriber-3g").change(function () {
  if ($(this).val() == "none") {
    $("#subscriber-3g-k-box").hide();
    $("#subscriber-3g-opc-box").hide();
    $("#subscriber-3g-op-box").hide();
    $("#subscriber-3g-ind-box").hide();
  } else if ($(this).val() == "xor") {
    $("#subscriber-3g-k-box").show();
    $("#subscriber-3g-op-box").hide();
    $("#subscriber-3g-opc-box").hide();
    $("#subscriber-3g-ind-box").show();
  } else {
    $("#subscriber-3g-k-box").show();
    $("#subscriber-3g-op-box").show();
    $("#subscriber-3g-opc-box").show();
    $("#subscriber-3g-ind-box").show();
  }
});
// # TODO OP OPC hide

$("#subscriber-3g-op").keyup(function () {
  if ($(this).val() == "") {
    $("#subscriber-3g-opc-box").show();
  } else {
    $("#subscriber-3g-opc-box").hide();
    $("#subscriber-3g-opc").val(" ");
  }
});
$("#subscriber-3g-opc").keyup(function () {
  if ($(this).val() == "") {
    $("#subscriber-3g-op-box").show();
  } else {
    $("#subscriber-3g-op-box").hide();
    $("#subscriber-3g-op").val(" ");
  }
});
// TODO: Update subscriber form
$(document).on("submit", "#subscriber-info-update-form", function (e) {
  e.preventDefault();
  $.ajax({
    url: "/hlr/ajax/subscribers/update/",
    type: "POST",
    data: new FormData(this),
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          $("#subscriber-info-update-form .button").html(
            "<div class='loader'></div> "
          );
        }
      });
      return xhr;
    },
    success: function (data) {
      if (data.status == "success") {
        notifier.success(data.message);
        getSubscribersList("/hlr/ajax/subscribers/");
      }
      if (data.status == "error") {
        notifier.alert(data.message);
      }
      $("#subscriber-info-update-form .button").html("Update");
    },
    processData: false,
    contentType: false,
    cache: false,
  });
});
